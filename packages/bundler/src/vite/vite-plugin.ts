import { resolvePath } from "@typespec/compiler";
import { resolve } from "path";
import type { IndexHtmlTransformContext, Plugin, ResolvedConfig } from "vite";
import {
  CreateTypeSpecBundleOptions,
  MultiTypeSpecBundleResult,
  TypeSpecBundle,
  TypeSpecBundleDefinition,
  TypeSpecBundleFile,
  createMultiTypeSpecBundle,
  createTypeSpecBundle,
  watchMultiTypeSpecBundle,
  watchTypeSpecBundle,
} from "../bundler.js";

export interface TypeSpecBundlePluginOptions {
  readonly folderName: string;

  /**
   * Name of libraries to bundle.
   */
  readonly libraries: readonly string[];
}

export function typespecBundlePlugin(options: TypeSpecBundlePluginOptions): Plugin {
  let config: ResolvedConfig;
  const definitions: Record<string, TypeSpecBundleDefinition> = {};
  const bundles: Record<string, TypeSpecBundle> = {};
  let sharedFiles: TypeSpecBundleFile[] = [];

  function applyMultiBundleResult(result: MultiTypeSpecBundleResult) {
    for (const [name, bundle] of Object.entries(result.libraries)) {
      bundles[name] = bundle;
      definitions[name] = bundle.definition;
    }
    sharedFiles = result.sharedFiles;
  }

  return {
    name: "typespec-bundle",
    enforce: "pre",
    async configResolved(c) {
      config = c;
    },
    async buildStart() {
      // Minify only in production mode
      const minify = config.command === "build";
      const libraryPaths: Record<string, string> = {};
      for (const name of options.libraries) {
        libraryPaths[name] = resolve(config.root, "node_modules", name);
      }
      const result = await createMultiTypeSpecBundle(libraryPaths, { minify });
      applyMultiBundleResult(result);
    },
    async configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const id = req.url;
        if (id === undefined) {
          next();
          return;
        }
        const start = `/${options.folderName}/`;

        const resolveFilename = (path: string) => {
          if (path === "") {
            return "index.js";
          } else {
            return `${path}.js`;
          }
        };
        const findPkgName = (id: string): [string, string] | undefined => {
          const segments = id.slice(start.length, -".js".length).split("/");
          if (bundles[segments[0]]) {
            return [segments[0], resolveFilename(segments.slice(1).join("/"))];
          }
          const inFolder = segments[0] + "/" + segments[1];
          if (bundles[inFolder]) {
            return [inFolder, resolveFilename(segments.slice(2).join("/"))];
          }
          return undefined;
        };
        if (id.startsWith(start) && id.endsWith(".js")) {
          // Try library-specific files
          const found = findPkgName(id);
          if (found) {
            const [pkgId, path] = found;
            const file = bundles[pkgId].files.find((x) => x.filename === path);
            if (file) {
              res.writeHead(200, "Ok", { "Content-Type": "application/javascript" });
              res.write(file.content);
              res.end();
              return;
            }
          }
          // Try shared chunks (created by esbuild splitting for deduplicated deps)
          const sharedPath = id.slice(start.length);
          const shared = sharedFiles.find((f) => f.filename === sharedPath);
          if (shared) {
            res.writeHead(200, "Ok", { "Content-Type": "application/javascript" });
            res.write(shared.content);
            res.end();
            return;
          }
        }
        next();
      });

      const libraryPaths: Record<string, string> = {};
      for (const name of options.libraries) {
        libraryPaths[name] = resolve(config.root, "node_modules", name);
      }
      // Watch all libraries in a single esbuild context for shared chunk deduplication
      void watchMultiTypeSpecBundle(
        libraryPaths,
        (result) => {
          applyMultiBundleResult(result);
          server.ws.send({ type: "full-reload" });
        },
        { minify: false },
      );
    },

    async generateBundle() {
      for (const name of options.libraries) {
        for (const file of bundles[name].files) {
          this.emitFile({
            type: "asset",
            fileName: `${options.folderName}/${name}/${file.filename}`,
            source: file.content,
          });
        }
      }
      // Emit shared chunks
      for (const file of sharedFiles) {
        this.emitFile({
          type: "asset",
          fileName: `${options.folderName}/${file.filename}`,
          source: file.content,
        });
      }
    },

    transformIndexHtml: {
      order: "post",
      handler: (html: string, ctx: IndexHtmlTransformContext) => {
        // Inject the importmap before the html script. Cannot just use injectTo:head-prepend as vite will inject its own script before that and cause a failure.
        const importMapTag = `<script type="importmap">\n${JSON.stringify(
          createImportMap(options.folderName, definitions),
          null,
          2,
        )}\n</script>`;
        return html.replace("<html", importMapTag + "\n<html");
      },
    },
  };
}

function createImportMap(
  folderName: string,
  definitions: Record<string, TypeSpecBundleDefinition>,
) {
  const imports: Record<string, string> = {};
  for (const [library, definition] of Object.entries(definitions)) {
    imports[library] = `./${folderName}/${library}/index.js`;
    for (const name of Object.keys(definition.exports)) {
      imports[resolvePath(library, name)] =
        "./" + resolvePath(`./${folderName}/${library}`, name) + ".js";
    }
  }
  const importMap = {
    imports: imports,
  };

  return importMap;
}
