import { compile, joinPaths, NodeHost, normalizePath, resolvePath } from "@typespec/compiler";
import { BuildOptions, BuildResult, context, Plugin } from "esbuild";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import { mkdir, readFile, realpath, writeFile } from "fs/promises";
import { basename, join, resolve } from "path";
import { promisify } from "util";
import { gzip } from "zlib";
import { relativeTo } from "./utils.js";

const gzipAsync = promisify(gzip);

export interface BundleManifest {
  name: string;
  version: string;
  imports: Record<string, string>;
}

export interface TypeSpecBundleDefinition {
  path: string;
  main: string;
  packageJson: PackageJson;
  exports: Record<string, string | ExportData>;
}

export interface ExportData {
  default?: string;
  import?: string;
  types?: string;
}

export interface TypeSpecBundle {
  /**
   * Definition
   */
  definition: TypeSpecBundleDefinition;

  /**
   * Bundle content
   */
  files: TypeSpecBundleFile[];

  /**
   * Resolved manifest.
   */
  manifest: BundleManifest;
}

export interface TypeSpecBundleFile {
  export?: string;
  filename: string;
  content: string;
  /** Gzipped content, only present if gzip option is enabled */
  gzipContent?: Buffer;
}

interface PackageJson {
  name: string;
  version: string;
  main: string;
  tspMain?: string;
  peerDependencies: string[];
  dependencies: string[];
  exports?: Record<string, string>;
}

export interface CreateTypeSpecBundleOptions {
  /**
   * Whether to minify the output bundle.
   * @default true
   */
  minify?: boolean;

  /**
   * Whether to also generate gzipped versions of the output files.
   * When enabled, each file will include a gzipContent buffer.
   * @default false
   */
  gzip?: boolean;
}

export interface MultiTypeSpecBundleResult {
  /** Per-library bundles, keyed by library name. */
  libraries: Record<string, TypeSpecBundle>;
  /** Shared chunks created by esbuild splitting (e.g., deduplicated alloy-js code). */
  sharedFiles: TypeSpecBundleFile[];
}

export async function createTypeSpecBundle(
  libraryPath: string,
  options?: CreateTypeSpecBundleOptions,
): Promise<TypeSpecBundle> {
  const definition = await resolveTypeSpecBundleDefinition(libraryPath);
  const context = await createEsBuildContext(definition, [], options);
  try {
    const result = await context.rebuild();
    return resolveTypeSpecBundle(definition, result, options);
  } finally {
    await context.dispose();
  }
}

export async function watchTypeSpecBundle(
  libraryPath: string,
  onBundle: (bundle: TypeSpecBundle) => void,
  options?: CreateTypeSpecBundleOptions,
) {
  const definition = await resolveTypeSpecBundleDefinition(libraryPath);
  const context = await createEsBuildContext(
    definition,
    [
      {
        name: "example",
        setup(build) {
          build.onEnd(async (result) => {
            const bundle = await resolveTypeSpecBundle(definition, result, options);
            onBundle(bundle);
          });
        },
      },
    ],
    options,
  );
  await context.watch();
}

export async function bundleTypeSpecLibrary(
  libraryPath: string,
  outputDir: string,
  options?: CreateTypeSpecBundleOptions,
) {
  const bundle = await createTypeSpecBundle(libraryPath, options);
  await mkdir(outputDir, { recursive: true });
  for (const file of bundle.files) {
    await writeFile(joinPaths(outputDir, file.filename), file.content);
    if (file.gzipContent) {
      await writeFile(joinPaths(outputDir, file.filename + ".gz"), file.gzipContent);
    }
  }
  const manifest = createManifest(bundle.definition);
  await writeFile(joinPaths(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  if (options?.gzip) {
    const manifestGzip = await gzipAsync(Buffer.from(JSON.stringify(manifest), "utf-8"));
    await writeFile(joinPaths(outputDir, "manifest.json.gz"), manifestGzip);
  }
}

async function resolveTypeSpecBundleDefinition(
  libraryPath: string,
): Promise<TypeSpecBundleDefinition> {
  libraryPath = normalizePath(await realpath(libraryPath));
  const pkg = await readLibraryPackageJson(libraryPath);

  const exports = pkg.exports
    ? Object.fromEntries(
        Object.entries(pkg.exports).filter(
          ([k, v]) => k !== "." && k !== "./testing" && k !== "./internals",
        ),
      )
    : {};

  return {
    path: libraryPath,
    main: pkg.main,
    exports,
    packageJson: pkg,
  };
}

async function createEsBuildContext(
  definition: TypeSpecBundleDefinition,
  plugins: Plugin[] = [],
  options?: CreateTypeSpecBundleOptions,
) {
  const minify = options?.minify ?? true;
  const libraryPath = definition.path;
  const program = await compile(NodeHost, libraryPath, {
    noEmit: true,
  });
  const jsFiles = new Set([resolvePath(libraryPath, definition.packageJson.main)]);
  for (const file of program.jsSourceFiles.keys()) {
    if (file.startsWith(libraryPath)) {
      jsFiles.add(file);
    }
  }
  const typespecFiles: Record<string, string> = {
    [normalizePath(join(libraryPath, "package.json"))]: JSON.stringify(definition.packageJson),
  };

  for (const [filename, sourceFile] of program.sourceFiles) {
    typespecFiles[filename] = sourceFile.file.text;
  }

  const content = createBundleEntrypoint({
    libraryPath,
    mainFile: definition.main,
    jsSourceFileNames: [...jsFiles],
    typespecSourceFiles: typespecFiles,
  });

  const extraEntry = Object.fromEntries(
    Object.entries(definition.exports).map(([key, value]) => {
      return [
        key.replace("./", ""),
        normalizePath(resolve(libraryPath, getExportEntryPoint(value))),
      ];
    }),
  );

  const virtualPlugin: Plugin = {
    name: "virtual",
    setup(build) {
      build.onResolve({ filter: /^virtual:/ }, (args) => {
        return {
          path: args.path,
          namespace: "virtual",
        };
      });
      build.onResolve({ filter: /.*/ }, (args) => {
        if (
          definition.packageJson.peerDependencies &&
          Object.keys(definition.packageJson.peerDependencies).some((x) => args.path.startsWith(x))
        ) {
          return { path: args.path, external: true };
        }
        return null;
      });

      build.onLoad({ filter: /^virtual:/, namespace: "virtual" }, async (args) => {
        return {
          contents: content,
          resolveDir: libraryPath,
        };
      });
    },
  };
  return await context({
    write: false,
    entryPoints: {
      index: "virtual:entry.js",
      ...extraEntry,
    },
    bundle: true,
    splitting: true,
    outdir: "out",
    platform: "browser",
    format: "esm",
    target: "es2024",
    minify,
    plugins: [
      virtualPlugin,
      nodeModulesPolyfillPlugin({ globals: { process: true } }),
      ...plugins,
    ],
  });
}

async function resolveTypeSpecBundle(
  definition: TypeSpecBundleDefinition,
  result: BuildResult<BuildOptions>,
  options?: CreateTypeSpecBundleOptions,
): Promise<TypeSpecBundle> {
  const shouldGzip = options?.gzip ?? false;

  const files: TypeSpecBundleFile[] = await Promise.all(
    result.outputFiles!.map(async (file) => {
      const entry = definition.exports[basename(file.path)];
      const content = file.text;
      const bundleFile: TypeSpecBundleFile = {
        filename: file.path.replaceAll("\\", "/").split("/out/")[1],
        content,
        export: entry ? getExportEntryPoint(entry) : undefined,
      };

      if (shouldGzip) {
        bundleFile.gzipContent = await gzipAsync(Buffer.from(content, "utf-8"));
      }

      return bundleFile;
    }),
  );

  return {
    definition,
    manifest: createManifest(definition),
    files,
  };
}

function getExportEntryPoint(value: string | ExportData) {
  const resolved = typeof value === "string" ? value : (value.import ?? value.default);

  if (!resolved) {
    throw new Error(
      `Exports ${JSON.stringify(value, null, 2)} is missing import or default entrypoint`,
    );
  }

  return resolved;
}
async function readLibraryPackageJson(path: string): Promise<PackageJson> {
  const file = await readFile(join(path, "package.json"));
  return JSON.parse(file.toString());
}

/**
 * Create a virtual JS file being the entrypoint of the bundle.
 */
function createBundleEntrypoint({
  libraryPath,
  mainFile,
  jsSourceFileNames,
  typespecSourceFiles,
}: {
  mainFile: string;
  libraryPath: string;
  jsSourceFileNames: string[];
  typespecSourceFiles: Record<string, string>;
}): string {
  const absoluteMain = normalizePath(resolve(libraryPath, mainFile));

  const relativeTypeSpecFiles: Record<string, string> = {};
  for (const [name, content] of Object.entries(typespecSourceFiles)) {
    relativeTypeSpecFiles[relativeTo(libraryPath, name)] = content;
  }
  return [
    `export * from "${absoluteMain}";`,
    ...jsSourceFileNames.map((x, i) => `import * as f${i} from "${x}";`),
    "",
    `const TypeSpecJSSources = {`,
    ...jsSourceFileNames.map((x, i) => `"${relativeTo(libraryPath, x)}": f${i},`),
    "};",

    `const TypeSpecSources = ${JSON.stringify(relativeTypeSpecFiles, null, 2)};`,

    "export const _TypeSpecLibrary_ = {",
    "  jsSourceFiles: TypeSpecJSSources,",
    "  typespecSourceFiles: TypeSpecSources,",
    "};",
  ].join("\n");
}

function createManifest(definition: TypeSpecBundleDefinition): BundleManifest {
  return {
    name: definition.packageJson.name,
    version: definition.packageJson.version,
    imports: createImportMap(definition),
  };
}

function createImportMap(definition: TypeSpecBundleDefinition): Record<string, string> {
  const imports: Record<string, string> = {};
  imports["."] = `./index.js`;
  for (const name of Object.keys(definition.exports)) {
    imports[name] = "./" + resolvePath(name) + ".js";
  }

  return imports;
}

// --- Multi-library bundling ---

interface MultiLibraryData {
  definitions: Record<string, TypeSpecBundleDefinition>;
  entryContents: Record<string, { content: string; resolveDir: string }>;
  entryPoints: Record<string, string>;
}

async function resolveMultiLibraryData(
  libraryPaths: Record<string, string>,
): Promise<MultiLibraryData> {
  const definitions: Record<string, TypeSpecBundleDefinition> = {};
  const entryContents: Record<string, { content: string; resolveDir: string }> = {};
  const entryPoints: Record<string, string> = {};

  for (const [name, path] of Object.entries(libraryPaths)) {
    const definition = await resolveTypeSpecBundleDefinition(path);
    definitions[name] = definition;

    const libraryPath = definition.path;
    const program = await compile(NodeHost, libraryPath, { noEmit: true });
    const jsFiles = new Set([resolvePath(libraryPath, definition.packageJson.main)]);
    for (const file of program.jsSourceFiles.keys()) {
      if (file.startsWith(libraryPath)) {
        jsFiles.add(file);
      }
    }
    const typespecFiles: Record<string, string> = {
      [normalizePath(join(libraryPath, "package.json"))]: JSON.stringify(definition.packageJson),
    };
    for (const [filename, sourceFile] of program.sourceFiles) {
      typespecFiles[filename] = sourceFile.file.text;
    }

    const content = createBundleEntrypoint({
      libraryPath,
      mainFile: definition.main,
      jsSourceFileNames: [...jsFiles],
      typespecSourceFiles: typespecFiles,
    });

    const virtualPath = `virtual:${name}/entry.js`;
    entryContents[virtualPath] = { content, resolveDir: libraryPath };
    entryPoints[`${name}/index`] = virtualPath;

    for (const [key, value] of Object.entries(definition.exports)) {
      entryPoints[`${name}/${key.replace("./", "")}`] = normalizePath(
        resolve(libraryPath, getExportEntryPoint(value)),
      );
    }
  }

  return { definitions, entryContents, entryPoints };
}

async function createMultiEsBuildContext(
  data: MultiLibraryData,
  plugins: Plugin[] = [],
  options?: CreateTypeSpecBundleOptions,
) {
  const minify = options?.minify ?? true;

  const allPeerDeps = new Set<string>();
  for (const def of Object.values(data.definitions)) {
    if (def.packageJson.peerDependencies) {
      for (const dep of Object.keys(def.packageJson.peerDependencies)) {
        allPeerDeps.add(dep);
      }
    }
  }

  const virtualPlugin: Plugin = {
    name: "virtual-multi",
    setup(build) {
      build.onResolve({ filter: /^virtual:/ }, (args) => ({
        path: args.path,
        namespace: "virtual",
      }));

      build.onResolve({ filter: /.*/ }, (args) => {
        if ([...allPeerDeps].some((x) => args.path.startsWith(x))) {
          return { path: args.path, external: true };
        }
        return null;
      });

      build.onLoad({ filter: /^virtual:/, namespace: "virtual" }, async (args) => {
        const entry = data.entryContents[args.path];
        if (entry) {
          return { contents: entry.content, resolveDir: entry.resolveDir };
        }
        return null;
      });
    },
  };

  return await context({
    write: false,
    entryPoints: data.entryPoints,
    bundle: true,
    splitting: true,
    outdir: "out",
    platform: "browser",
    format: "esm",
    target: "es2024",
    minify,
    plugins: [
      virtualPlugin,
      nodeModulesPolyfillPlugin({ globals: { process: true } }),
      ...plugins,
    ],
  });
}

function resolveMultiTypeSpecBundleResult(
  data: MultiLibraryData,
  result: BuildResult<BuildOptions>,
): MultiTypeSpecBundleResult {
  const libraries: Record<string, TypeSpecBundle> = {};
  const sharedFiles: TypeSpecBundleFile[] = [];

  for (const [name, definition] of Object.entries(data.definitions)) {
    libraries[name] = {
      definition,
      manifest: createManifest(definition),
      files: [],
    };
  }

  // Sort library names by length descending so longer names (e.g. scoped packages) match first
  const sortedNames = Object.keys(data.definitions).sort((a, b) => b.length - a.length);

  for (const file of result.outputFiles!) {
    const relativePath = file.path.replaceAll("\\", "/").split("/out/")[1];

    let assigned = false;
    for (const name of sortedNames) {
      if (relativePath.startsWith(name + "/")) {
        libraries[name].files.push({
          filename: relativePath.slice(name.length + 1),
          content: file.text,
        });
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      sharedFiles.push({
        filename: relativePath,
        content: file.text,
      });
    }
  }

  return { libraries, sharedFiles };
}

/**
 * Bundle multiple TypeSpec libraries in a single esbuild context.
 * This enables esbuild's code splitting to deduplicate shared dependencies
 * (e.g., @alloy-js/core) across library bundles.
 */
export async function createMultiTypeSpecBundle(
  libraryPaths: Record<string, string>,
  options?: CreateTypeSpecBundleOptions,
): Promise<MultiTypeSpecBundleResult> {
  const data = await resolveMultiLibraryData(libraryPaths);
  const ctx = await createMultiEsBuildContext(data, [], options);
  try {
    const result = await ctx.rebuild();
    return resolveMultiTypeSpecBundleResult(data, result);
  } finally {
    await ctx.dispose();
  }
}

/**
 * Watch multiple TypeSpec libraries in a single esbuild context.
 * Triggers the callback whenever any library's source files change.
 */
export async function watchMultiTypeSpecBundle(
  libraryPaths: Record<string, string>,
  onBundle: (result: MultiTypeSpecBundleResult) => void,
  options?: CreateTypeSpecBundleOptions,
) {
  const data = await resolveMultiLibraryData(libraryPaths);
  const ctx = await createMultiEsBuildContext(
    data,
    [
      {
        name: "multi-watch-callback",
        setup(build) {
          build.onEnd(async (result) => {
            const bundle = resolveMultiTypeSpecBundleResult(data, result);
            onBundle(bundle);
          });
        },
      },
    ],
    options,
  );
  await ctx.watch();
}
