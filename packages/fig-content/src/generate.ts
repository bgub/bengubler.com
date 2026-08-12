import path from "node:path";

type ModuleEntry = {
  artifact: string;
  collection: string;
  id: string;
  summaryCode: string;
};

export function createGeneratedModules(options: {
  collections: readonly string[];
  configPath: string;
  entries: readonly ModuleEntry[];
  outputDirectory: string;
}): Record<string, string> {
  assertValidCollectionNames(options.collections);
  return {
    "index.d.ts": createTypeModule(options),
    "index.js": createDataModule(options.entries, options.collections),
  };
}

function createDataModule(
  entries: readonly ModuleEntry[],
  collections: readonly string[],
): string {
  const declarations = collections.map((collection, index) => {
    const collectionEntries = entries.filter(
      (entry) => entry.collection === collection,
    );
    const summaries = collectionEntries
      .map((entry) => entry.summaryCode)
      .join(",\n    ");
    const cases = collectionEntries
      .map(
        (entry) =>
          `      case ${JSON.stringify(entry.id)}: return (await import(${JSON.stringify(`./documents/${entry.artifact}`)})).content;`,
      )
      .join("\n");
    return `const collection${index} = {
  summaries: [
    ${summaries}
  ],
  async load(id) {
    switch (id) {
${cases}
    }
  },
};`;
  });
  return `${declarations.join("\n")}

export { ${createExports(collections)} };
`;
}

function createExports(collections: readonly string[]): string {
  return collections
    .map((collection, index) => `collection${index} as ${collection}`)
    .join(", ");
}

function createTypeModule({
  collections,
  configPath,
  outputDirectory,
}: {
  collections: readonly string[];
  configPath: string;
  outputDirectory: string;
}): string {
  const relativeConfigPath = toImportPath(
    path.relative(outputDirectory, configPath),
  );
  const declarations = collections.map(
    (collection, index) =>
      `declare const collection${index}: ContentCollectionData<Collections[${JSON.stringify(collection)}]>;`,
  );
  return `import type { ContentCollectionData } from "@bgub/fig-content";
import type { content } from ${JSON.stringify(relativeConfigPath)};

type Collections = typeof content.collections;

${declarations.join("\n")}
export { ${createExports(collections)} };
`;
}

function assertValidCollectionNames(collections: readonly string[]): void {
  for (const name of collections) {
    if (name === "default" || !/^[$A-Z_a-z][$\w]*$/.test(name)) {
      throw new Error(
        `Collection name ${JSON.stringify(name)} cannot be a JavaScript export`,
      );
    }
  }
}

function toImportPath(relativePath: string): string {
  const normalized = relativePath.split(path.sep).join(path.posix.sep);
  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}
