import path from "node:path";
import {
  runnerImport,
  type Plugin,
  type ResolvedConfig,
  type ViteDevServer,
} from "vite";
import { createContentBuilder, findDependencyStateFiles } from "./builder.ts";
import { contentUpdateEvent } from "./hmr.ts";
import type {
  ContentCollections,
  ContentDefinition,
  ContentUpdate,
} from "./index.ts";

const dataModuleId = "fig-content:data";
const defaultConfigPath = "content.config.ts";
const outputDirectory = ".fig-content/generated";

export type FigContentPluginOptions = {
  config?: string;
};

type PluginRuntime = {
  builder: ReturnType<typeof createContentBuilder>;
  config: ResolvedConfig;
  configDependencies: string[];
  contentDirectories: string[];
  generatedDirectory: string;
};

export function figContent(options: FigContentPluginOptions = {}): Plugin {
  let runtime: PluginRuntime;

  return {
    name: "fig-content",

    config(userConfig) {
      const root = path.resolve(userConfig.root ?? process.cwd());
      return {
        optimizeDeps: { exclude: [dataModuleId] },
        resolve: {
          alias: {
            [dataModuleId]: path.resolve(root, outputDirectory),
          },
        },
      };
    },

    async configResolved(config) {
      const configPath = path.resolve(
        config.root,
        options.config ?? defaultConfigPath,
      );
      const loaded = await loadContentDefinition(configPath, config.root);
      const configDependencies = [
        ...new Set([
          ...loaded.dependencies,
          ...(await findDependencyStateFiles(config.root)),
        ]),
      ];
      const contentDirectories = Object.values(
        loaded.definition.collections,
      ).map((collection) => path.resolve(config.root, collection.directory));
      runtime = {
        builder: createContentBuilder({
          configDependencies,
          configPath,
          definition: loaded.definition,
          outputDirectory,
          root: config.root,
        }),
        config,
        configDependencies,
        contentDirectories,
        generatedDirectory: path.resolve(config.root, outputDirectory),
      };
    },

    async buildStart() {
      const result = await runtime.builder.build();
      if (result.compiled > 0 || result.removed > 0) {
        runtime.config.logger.info(
          `fig-content: ${result.compiled} compiled, ${result.reused} cached in ${result.durationMs.toFixed(1)}ms`,
        );
      }
    },

    configureServer(server) {
      server.watcher.add([
        ...runtime.contentDirectories,
        ...runtime.configDependencies,
      ]);
      installWatcher(server, runtime);
    },

    hotUpdate({ file }) {
      if (isInsideDirectory(file, runtime.generatedDirectory)) return [];
    },
  };
}

async function loadContentDefinition(
  configPath: string,
  root: string,
): Promise<{
  definition: ContentDefinition<ContentCollections>;
  dependencies: string[];
}> {
  const loaded = await runnerImport<{ content?: unknown }>(configPath, {
    configFile: false,
    logLevel: "silent",
    root,
  });
  const definition = loaded.module.content;
  if (!isContentDefinition(definition)) {
    throw new Error(
      `${configPath} must export content created by defineContent()`,
    );
  }

  return {
    definition,
    dependencies: [...new Set([configPath, ...loaded.dependencies])],
  };
}

function isContentDefinition(
  value: unknown,
): value is ContentDefinition<ContentCollections> {
  return Boolean(
    value &&
    typeof value === "object" &&
    "collections" in value &&
    value.collections &&
    typeof value.collections === "object" &&
    !Array.isArray(value.collections),
  );
}

function installWatcher(server: ViteDevServer, runtime: PluginRuntime): void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const dependencies = new Set(runtime.configDependencies);

  const onFileEvent = (_event: string, filePath: string) => {
    if (dependencies.has(path.resolve(filePath))) {
      void server.restart();
      return;
    }
    if (
      !runtime.contentDirectories.some((directory) =>
        isInsideDirectory(filePath, directory),
      )
    ) {
      return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      void runtime.builder
        .build()
        .then((result) => {
          if (result.changedCollections.length === 0) return;
          invalidateGeneratedModules(server, runtime.generatedDirectory);
          server.hot.send(contentUpdateEvent, {
            collections: result.changedCollections,
          } satisfies ContentUpdate);
        })
        .catch((error: unknown) => reportError(server, error));
    }, 10);
  };

  server.watcher.on("all", onFileEvent);
  server.httpServer?.once("close", () => {
    if (timer) clearTimeout(timer);
    server.watcher.off("all", onFileEvent);
  });
}

function reportError(server: ViteDevServer, error: unknown): void {
  const normalized = error instanceof Error ? error : new Error(String(error));
  server.config.logger.error(normalized.stack ?? normalized.message);
  server.ws.send({
    type: "error",
    err: {
      message: normalized.message,
      stack: normalized.stack ?? normalized.message,
    },
  });
}

function invalidateGeneratedModules(
  server: ViteDevServer,
  generatedDirectory: string,
): void {
  for (const environment of Object.values(server.environments)) {
    for (const filePath of environment.moduleGraph.fileToModulesMap.keys()) {
      if (isInsideDirectory(filePath, generatedDirectory)) {
        environment.moduleGraph.onFileChange(filePath);
      }
    }
  }
}

function isInsideDirectory(filePath: string, directory: string): boolean {
  const relativePath = path.relative(directory, path.resolve(filePath));
  return (
    relativePath !== "" &&
    !relativePath.startsWith(`..${path.sep}`) &&
    relativePath !== ".." &&
    !path.isAbsolute(relativePath)
  );
}
