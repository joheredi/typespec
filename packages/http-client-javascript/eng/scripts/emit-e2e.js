#!/usr/bin/env node
import chalk from "chalk";
import { execa } from "execa";
import pkg from "fs-extra";
import { copyFile, mkdir, rm } from "fs/promises";
import { globby } from "globby";
import { Listr } from "listr2";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const { pathExists, stat, readFile, writeFile } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "../..");
const tspConfig = join(__dirname, "tspconfig.yaml");

const basePath = join(projectRoot, "node_modules", "@typespec", "http-specs", "specs");
const ignoreFilePath = join(projectRoot, ".testignore");
const reportFilePath = join(projectRoot, ".test-gen-report.txt");
const failedProcessesFilePath = join(projectRoot, ".failed-processes.txt");

// Parse command-line arguments.
const argv = yargs(hideBin(process.argv))
  .option("main-only", {
    type: "boolean",
    describe: "Use only main.tsp, even if client.tsp is found",
    default: false,
  })
  .option("interactive", {
    type: "boolean",
    describe: "Enable interactive mode (sequential processing)",
    default: false,
  })
  .option("report", {
    type: "boolean",
    describe: "Generate a report after processing",
    default: false,
  })
  .positional("paths", {
    describe: "Optional list of specific file or directory paths to process (relative to basePath)",
    type: "string",
    array: true,
    default: [],
  })
  .option("build", {
    type: "boolean",
    describe: "Build the generated projects",
    default: false,
  })
  .help().argv;

// Reads the ignore file.
async function getIgnoreList() {
  try {
    const content = await readFile(ignoreFilePath, "utf8");
    return content
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim());
  } catch {
    console.warn(chalk.yellow("No ignore file found."));
    return [];
  }
}

// Recursively process paths (files or directories relative to basePath).
async function processPaths(paths, ignoreList, mainOnly) {
  const results = [];
  for (const relativePath of paths) {
    const fullPath = resolve(basePath, relativePath);

    if (!(await pathExists(fullPath))) {
      console.warn(chalk.yellow(`Path not found: ${relativePath}`));
      continue;
    }

    const stats = await stat(fullPath);
    if (stats.isFile() && (fullPath.endsWith("client.tsp") || fullPath.endsWith("main.tsp"))) {
      if (ignoreList.some((ignore) => relativePath.startsWith(ignore))) continue;
      results.push({ fullPath, relativePath });
    } else if (stats.isDirectory()) {
      const patterns = mainOnly ? ["**/main.tsp"] : ["**/client.tsp", "**/main.tsp"];
      const discoveredPaths = await globby(patterns, { cwd: fullPath });
      const validFiles = discoveredPaths
        .map((p) => ({
          fullPath: join(fullPath, p),
          relativePath: join(relativePath, p),
        }))
        .filter((file) => !ignoreList.some((ignore) => file.relativePath.startsWith(ignore)));
      results.push(...validFiles);
    } else {
      console.warn(chalk.yellow(`Skipping unsupported path: ${relativePath}`));
    }
  }

  // Deduplicate and prioritize client.tsp over main.tsp.
  const filesByDir = new Map();
  for (const file of results) {
    const dir = dirname(file.relativePath);
    const existing = filesByDir.get(dir);
    if (!existing || (!mainOnly && file.relativePath.endsWith("client.tsp"))) {
      filesByDir.set(dir, file);
    }
  }
  return Array.from(filesByDir.values());
}

// Run a shell command silently.
async function runCommand(command, args, options = {}) {
  return await execa(command, args, { stdio: "pipe", ...options });
}

// Process a single file.
async function processFile(file, options) {
  const { fullPath, relativePath } = file;
  const { build } = options;
  const outputDir = join("test", "e2e", "generated", dirname(relativePath));
  const specCopyPath = join(outputDir, "spec.tsp");

  try {
    if (await pathExists(outputDir)) {
      await rm(outputDir, { recursive: true, force: true });
    }
    await mkdir(outputDir, { recursive: true });
    await copyFile(fullPath, specCopyPath);

    await runCommand("npx", [
      "tsp",
      "compile",
      fullPath,
      "--emit",
      "@typespec/http-client-javascript",
      "--config",
      tspConfig,
      "--output-dir",
      outputDir,
    ]);

    await runCommand("npx", [
      "babel",
      outputDir,
      "-d",
      `dist/${outputDir}`,
      "--extensions",
      ".ts,.tsx",
    ]);

    await runCommand("npx", ["prettier", outputDir, "--write"]);

    if (build) {
      await runCommand("npm", ["run", "build"], { cwd: outputDir });
    }
    return { status: "succeeded", relativePath };
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    return { status: "failed", relativePath, errorOutput };
  }
}

// Create a Listr2 task list that organizes processing tasks.
// We use a parent task that sets up the shared context.
async function processFilesListr(files, options) {
  const tasks = new Listr(
    [
      {
        title: "Processing Files",
        task: (ctx, task) => {
          // Initialize shared context for results.
          ctx.succeeded = [];
          ctx.failed = [];
          ctx.failedOutputs = [];

          // Return a nested task list for each file.
          return new Listr(
            files.map((file) => ({
              title: file.relativePath,
              task: async (ctx, task) => {
                const result = await processFile(file, options);
                if (result.status === "failed") {
                  ctx.failed.push(result.relativePath);
                  ctx.failedOutputs.push(
                    `File: ${result.relativePath}\nError: ${result.errorOutput}\n`,
                  );
                  throw new Error(`Failed processing ${result.relativePath}`);
                } else {
                  ctx.succeeded.push(result.relativePath);
                }
              },
            })),
            {
              // Limit concurrency to 4 at a time.
              concurrent: 4,
              exitOnError: false,
              rendererOptions: {
                collapse: false,
                showTimer: true,
                // Customize symbols: pending (queued) vs. active (processing)
                symbols: {
                  pending: "⏳",
                  active: "⠋",
                  completed: "✔",
                  failed: "✖",
                },
              },
            },
          );
        },
      },
    ],
    {
      rendererOptions: {
        showTimer: true,
      },
    },
  );

  try {
    const ctx = await tasks.run();
    return ctx;
  } catch (err) {
    // Even if some tasks fail, context is still available.
    return err.context;
  }
}

// Main logic.
(async () => {
  const ignoreList = await getIgnoreList();
  const files =
    argv._.length > 0
      ? await processPaths(argv._, ignoreList, argv["main-only"])
      : await processPaths(["."], ignoreList, argv["main-only"]);

  if (files.length === 0) {
    console.log(chalk.yellow("No files to process."));
    return;
  }

  // Use Listr2-based concurrent processing.
  const ctx = await processFilesListr(files, {
    build: argv.build,
    generateReport: argv.report,
  });

  // Access the results from the shared context.
  const succeeded = ctx.succeeded || [];
  const failed = ctx.failed || [];
  const failedOutputs = ctx.failedOutputs || [];

  console.log(chalk.bold.green("\nProcessing Complete:"));
  console.log(chalk.green(`Succeeded: ${succeeded.length}`));
  console.log(chalk.red(`Failed: ${failed.length}`));

  // Write an overall report file if requested.
  if (argv.report) {
    const report = [
      "Succeeded Files:",
      ...succeeded.map((f) => `  - ${f}`),
      "",
      "Failed Files:",
      ...failed.map((f) => `  - ${f}`),
    ].join("\n");
    await writeFile(reportFilePath, report, "utf8");
    console.log(chalk.blue(`Report written to: ${reportFilePath}`));
  }

  // Write detailed failed outputs to a file.
  if (failedOutputs.length > 0) {
    const errorReport = ["Failed Processes Error Output:", ...failedOutputs].join("\n");
    await writeFile(failedProcessesFilePath, errorReport, "utf8");
    console.log(chalk.blue(`Error details written to: ${failedProcessesFilePath}`));
  }
})();
