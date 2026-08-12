import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import matter from "gray-matter";
import { createGeneratedModules } from "./generate.ts";
import type {
  ContentCollection,
  ContentCollections,
  ContentDefinition,
  ContentFile,
} from "./index.ts";
import { serializeJavaScript } from "./serialize.ts";

const stateVersion = 4;
const lockfileNames = [
  "bun.lock",
  "bun.lockb",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
] as const;

type GeneratedEntry = {
  artifact: string;
  collection: string;
  id: string;
  modifiedAt: number;
  size: number;
  sourcePath: string;
  summaryCode: string;
};

type BuiltEntry = {
  artifactContent?: string;
  entry: GeneratedEntry;
};

type BuildState = {
  entries: GeneratedEntry[];
  fingerprint: string;
};

export type ContentBuildResult = {
  changedCollections: string[];
  compiled: number;
  durationMs: number;
  removed: number;
  reused: number;
};

export type ContentBuilderOptions<Collections extends ContentCollections> = {
  configDependencies?: readonly string[];
  configPath: string;
  definition: ContentDefinition<Collections>;
  outputDirectory: string;
  root: string;
};

type SourceFile = {
  absolutePath: string;
  modifiedAt: number;
  path: string;
  size: number;
};

export function createContentBuilder<Collections extends ContentCollections>(
  options: ContentBuilderOptions<Collections>,
) {
  let state: BuildState | undefined;
  let queue = Promise.resolve();
  const fingerprint = createFingerprint(options);

  function build(): Promise<ContentBuildResult> {
    const result = queue.then(async () =>
      buildContent(options, state, await fingerprint),
    );
    queue = result.then(
      (next) => {
        state = next.state;
      },
      () => {},
    );
    return result.then((next) => next.stats);
  }

  return { build };
}

async function buildContent<Collections extends ContentCollections>(
  options: ContentBuilderOptions<Collections>,
  cachedState: BuildState | undefined,
  fingerprint: string,
): Promise<{ state: BuildState; stats: ContentBuildResult }> {
  const startedAt = performance.now();
  const outputDirectory = path.resolve(options.root, options.outputDirectory);
  const documentDirectory = path.join(outputDirectory, "documents");
  const statePath = path.join(outputDirectory, "state.json");
  const collections = Object.entries(options.definition.collections).sort(
    ([left], [right]) => left.localeCompare(right),
  );

  await mkdir(documentDirectory, { recursive: true });

  const previousState =
    cachedState ?? (await readBuildState(statePath, fingerprint));
  const previousBySource = new Map(
    previousState.entries.map((entry) => [entrySourceKey(entry), entry]),
  );
  const [collectionFiles, existingArtifacts] = await Promise.all([
    Promise.all(
      collections.map(async ([name, collection]) => ({
        collection,
        files: await collectSourceFiles(
          path.resolve(options.root, collection.directory),
          collection.include ?? ((filePath) => filePath.endsWith(".md")),
        ),
        name,
      })),
    ),
    readdir(documentDirectory).then((artifacts) => new Set(artifacts)),
  ]);

  let compiled = 0;
  let reused = 0;
  const changedCollections = new Set<string>();
  const builtEntries = await Promise.all(
    collectionFiles.flatMap(({ collection, files, name }) =>
      files.map(async (file): Promise<BuiltEntry> => {
        const previous = previousBySource.get(`${name}\0${file.path}`);
        if (
          previous &&
          previous.modifiedAt === file.modifiedAt &&
          previous.size === file.size &&
          existingArtifacts.has(previous.artifact)
        ) {
          reused++;
          return { entry: previous };
        }

        compiled++;
        changedCollections.add(name);
        return compileFile(name, collection, file);
      }),
    ),
  );
  const entries = builtEntries
    .map(({ entry }) => entry)
    .sort(
      (left, right) =>
        left.collection.localeCompare(right.collection) ||
        left.sourcePath.localeCompare(right.sourcePath),
    );

  assertUniqueIds(entries);
  await Promise.all(
    builtEntries.flatMap(({ artifactContent, entry }) =>
      artifactContent === undefined
        ? []
        : [
            writeIfChanged(
              path.join(documentDirectory, entry.artifact),
              artifactContent,
            ),
          ],
    ),
  );
  const activeSources = new Set(entries.map(entrySourceKey));
  for (const previous of previousState.entries) {
    if (!activeSources.has(entrySourceKey(previous))) {
      changedCollections.add(previous.collection);
    }
  }

  const activeArtifacts = new Set(entries.map((entry) => entry.artifact));
  const removed = await removeStaleArtifacts(
    documentDirectory,
    activeArtifacts,
    existingArtifacts,
  );
  const nextState: BuildState = {
    entries,
    fingerprint,
  };
  const collectionNames = collections.map(([name]) => name);

  const generatedFiles = {
    ...createGeneratedModules({
      collections: collectionNames,
      configPath: options.configPath,
      entries,
      outputDirectory,
    }),
    "state.json": `${JSON.stringify(nextState)}\n`,
  };
  await Promise.all(
    Object.entries(generatedFiles).map(([fileName, content]) =>
      writeIfChanged(path.join(outputDirectory, fileName), content),
    ),
  );

  return {
    state: nextState,
    stats: {
      changedCollections: [...changedCollections].sort(),
      compiled,
      durationMs: performance.now() - startedAt,
      removed,
      reused,
    },
  };
}

async function compileFile<Document, Summary, Frontmatter>(
  collectionName: string,
  collection: ContentCollection<Document, Summary, Frontmatter>,
  file: SourceFile,
): Promise<BuiltEntry> {
  const raw = await readFile(file.absolutePath, "utf8");
  const parsed = matter(raw);

  try {
    const frontmatter = collection.schema
      ? await parseFrontmatter(collection.schema, parsed.data)
      : (parsed.data as Frontmatter);
    const input: ContentFile<Frontmatter> = {
      frontmatter,
      path: file.path,
      source: parsed.content.trim(),
    };
    const document = await collection.compile(input);
    const id = collection.id(document);
    if (!id) throw new Error("Content ID must not be empty");

    const artifact = `${createStableId(`${collectionName}\0${id}`)}.js`;
    return {
      artifactContent: `export const content = ${serializeJavaScript(document)};\n`,
      entry: {
        artifact,
        collection: collectionName,
        id,
        modifiedAt: file.modifiedAt,
        size: file.size,
        sourcePath: file.path,
        summaryCode: serializeJavaScript(collection.summary(document)),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to compile ${collectionName}/${file.path}: ${message}`,
      { cause: error },
    );
  }
}

async function parseFrontmatter<Frontmatter>(
  schema: StandardSchemaV1<unknown, Frontmatter>,
  input: unknown,
): Promise<Frontmatter> {
  const result = await schema["~standard"].validate(input);
  if (!result.issues) return result.value;
  throw new Error(
    `Invalid frontmatter: ${result.issues.map((issue) => issue.message).join("; ")}`,
  );
}

async function collectSourceFiles(
  directory: string,
  include: (path: string) => boolean,
): Promise<SourceFile[]> {
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const absolutePath = path.join(entry.parentPath, entry.name);
        const relativePath = toPosixPath(
          path.relative(directory, absolutePath),
        );
        if (!include(relativePath)) return undefined;
        const metadata = await stat(absolutePath);
        return {
          absolutePath,
          modifiedAt: metadata.mtimeMs,
          path: relativePath,
          size: metadata.size,
        };
      }),
  );

  return files
    .filter((file): file is SourceFile => file !== undefined)
    .sort((left, right) => left.path.localeCompare(right.path));
}

async function createFingerprint<Collections extends ContentCollections>(
  options: ContentBuilderOptions<Collections>,
): Promise<string> {
  const hash = createHash("sha256").update(`fig-content:${stateVersion}\0`);
  for (const [name, collection] of Object.entries(
    options.definition.collections,
  ).sort(([left], [right]) => left.localeCompare(right))) {
    hash.update(`${name}\0${String(collection.version ?? "")}\0`);
  }

  const dependencies = [
    ...new Set([
      options.configPath,
      ...(options.configDependencies ?? []),
      ...(await findDependencyStateFiles(options.root)),
    ]),
  ].sort();
  for (const dependency of dependencies) {
    hash.update(`${dependency}\0`);
    try {
      hash.update(await readFile(dependency));
    } catch {
      hash.update("missing");
    }
  }
  return hash.digest("hex");
}

export async function findDependencyStateFiles(
  root: string,
): Promise<string[]> {
  const resolvedRoot = path.resolve(root);
  const files: string[] = [];
  const packagePath = path.join(resolvedRoot, "package.json");
  if (await isFile(packagePath)) files.push(packagePath);

  let directory = resolvedRoot;
  while (true) {
    const lockfiles = (
      await Promise.all(
        lockfileNames.map(async (name) => {
          const filePath = path.join(directory, name);
          return (await isFile(filePath)) ? filePath : undefined;
        }),
      )
    ).filter((filePath): filePath is string => filePath !== undefined);
    if (lockfiles.length > 0) return [...files, ...lockfiles];

    const parent = path.dirname(directory);
    if (parent === directory) return files;
    directory = parent;
  }
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function readBuildState(
  statePath: string,
  fingerprint: string,
): Promise<BuildState> {
  try {
    const state: Partial<BuildState> = JSON.parse(
      await readFile(statePath, "utf8"),
    );
    if (state.fingerprint === fingerprint && Array.isArray(state.entries)) {
      return { entries: state.entries, fingerprint };
    }
  } catch {
    // Missing or invalid state is equivalent to a cold build.
  }

  return { entries: [], fingerprint };
}

function assertUniqueIds(entries: readonly GeneratedEntry[]): void {
  const sourcesById = new Map<string, string>();
  for (const entry of entries) {
    const key = `${entry.collection}\0${entry.id}`;
    const existing = sourcesById.get(key);
    if (existing) {
      throw new Error(
        `Duplicate content ID ${JSON.stringify(entry.id)} in ${entry.collection}: ${existing} and ${entry.sourcePath}`,
      );
    }
    sourcesById.set(key, entry.sourcePath);
  }
}

function entrySourceKey(entry: GeneratedEntry): string {
  return `${entry.collection}\0${entry.sourcePath}`;
}

async function removeStaleArtifacts(
  directory: string,
  activeArtifacts: ReadonlySet<string>,
  existingArtifacts: ReadonlySet<string>,
): Promise<number> {
  const stale = [...existingArtifacts].filter(
    (artifact) => artifact.endsWith(".js") && !activeArtifacts.has(artifact),
  );
  await Promise.all(
    stale.map((artifact) => unlink(path.join(directory, artifact))),
  );
  return stale.length;
}

async function writeIfChanged(
  filePath: string,
  content: string,
): Promise<void> {
  try {
    if ((await readFile(filePath, "utf8")) === content) return;
  } catch {
    // The file does not exist yet.
  }

  const temporaryPath = `${filePath}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, filePath);
}

function createStableId(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 20);
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join(path.posix.sep);
}
