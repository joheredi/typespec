#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import { copyFile, mkdir, rm } from "fs/promises";
import { globby } from "globby";
import inquirer from "inquirer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

import pkg from "fs-extra";
import { resolve } from "path";

const { pathExists, stat, readFile, writeFile } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = join(__dirname, "node_modules", "@azure-tools", "cadl-ranch-specs");
const ignoreFilePath = join(__dirname, ".testignore");
const reportFilePath = join(__dirname, ".test-gen-report.txt");

// Parse command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
  .option("main-only", {
    type: "boolean",
    describe: "Use only main.tsp, even if client.tsp is found",
    default: false,
  })
  .option("interactive", {
    type: "boolean",
    describe: "Enable interactive mode",
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

// Read and parse the ignore file
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

// Recursively process paths (files or directories relative to basePath)
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
      // Add valid files directly
      results.push({ fullPath, relativePath });
    } else if (stats.isDirectory()) {
      // Discover files in the directory
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

  // Deduplicate and prioritize client.tsp over main.tsp
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

// Run a shell command using execa
async function runCommand(command, args, options = {}) {
  console.log(chalk.cyan(`Executing: ${command} ${args.join(" ")}`));
  await execa(command, args, { stdio: "inherit", ...options });
}

// Process files with interactive mode
async function processFiles(files, options) {
  const { interactive, generateReport, build } = options;
  const succeeded = [];
  const failed = [];

  for (let i = 0; i < files.length; i++) {
    const { fullPath, relativePath } = files[i];
    console.log(chalk.blue(`Processing: ${relativePath}`));
    const outputDir = join("test", "e2e", "generated", dirname(relativePath));

    try {
      // Clear the target directory if it exists
      if (await pathExists(outputDir)) {
        console.log(chalk.yellow(`Clearing directory: ${outputDir}`));
        await rm(outputDir, { recursive: true, force: true });
      }

      const specCopyPath = join(outputDir, "spec.tsp");
      await mkdir(outputDir, { recursive: true });
      await copyFile(fullPath, specCopyPath);

      await runCommand("npx", [
        "tsp",
        "compile",
        fullPath,
        "--emit",
        "http-client-javascript",
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
        const generatedProject = join(outputDir, "http-client-javascript");
        await runCommand("npm", ["run", "build"], { cwd: generatedProject });
      }

      console.log(chalk.green(`Finished processing: ${relativePath}`));
      succeeded.push(relativePath);
    } catch {
      console.error(chalk.red(`Failed to process: ${relativePath}`));
      console.error(chalk.yellow(`Spec: ${specCopyPath}`));
      failed.push(relativePath);

      if (interactive) {
        // Prompt user for action
        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: `Processing failed for ${relativePath}. What would you like to do?`,
            choices: [
              { name: "Retry", value: "retry" },
              { name: "Skip to next file", value: "next" },
              { name: "Abort processing", value: "abort" },
            ],
          },
        ]);

        if (action === "retry") {
          console.log(chalk.blue("Retrying..."));
          i--; // Decrement index to retry the same file
          continue;
        } else if (action === "next") {
          console.log(chalk.yellow("Skipping to next file..."));
          continue;
        } else if (action === "abort") {
          console.log(chalk.red("Aborting processing."));
          break;
        }
      } else {
        console.error(chalk.red("Non-interactive mode: continuing."));
        continue;
      }
    }
  }

  // Summary
  console.log(chalk.bold.green("\nProcessing Complete:"));
  console.log(chalk.green(`Succeeded: ${succeeded.length}`));
  console.log(chalk.red(`Failed: ${failed.length}`));

  if (generateReport) {
    const report = [
      "Succeeded Files:",
      ...succeeded.map((f) => `  - ${f}`),
      "Failed Files:",
      ...failed.map((f) => `  - ${f}`),
    ].join("\n");
    await writeFile(reportFilePath, report, "utf8");
    console.log(chalk.blue(`Report written to: ${reportFilePath}`));
  }
}

// Main logic
(async () => {
  const ignoreList = await getIgnoreList();
  const paths = argv._;

  const files =
    paths.length > 0
      ? await processPaths(paths, ignoreList, argv["main-only"])
      : await processPaths(["."], ignoreList, argv["main-only"]); // Default to basePath if no paths provided

  if (files.length === 0) {
    console.log(chalk.yellow("No files to process."));
    return;
  }

  await processFiles(files, {
    interactive: argv.interactive,
    generateReport: argv.report,
    build: argv.build,
  });
})();
