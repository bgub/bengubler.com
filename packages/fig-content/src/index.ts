import type { StandardSchemaV1 } from "@standard-schema/spec";
import { contentUpdateEvent } from "./hmr.ts";

export type ContentUpdate = {
  collections: readonly string[];
};

export function onContentUpdate(
  listener: (update: ContentUpdate) => void,
): () => void {
  const hot = import.meta.hot;
  if (!hot) return () => {};

  hot.on(contentUpdateEvent, listener);
  return () => hot.off(contentUpdateEvent, listener);
}

export type ContentFile<Frontmatter = Readonly<Record<string, unknown>>> = {
  frontmatter: Frontmatter;
  path: string;
  source: string;
};

export type ContentCollection<Document, Summary, Frontmatter> = {
  compile: (file: ContentFile<Frontmatter>) => Document | Promise<Document>;
  directory: string;
  id: (document: Document) => string;
  include?: (path: string) => boolean;
  schema?: StandardSchemaV1<unknown, Frontmatter>;
  summary: (document: Document) => Summary;
  version?: number | string;
};

export type ContentCollections = Record<
  string,
  ContentCollection<any, any, any>
>;

export type ContentDefinition<Collections extends ContentCollections> = {
  collections: Collections;
};

export type ContentDocumentOf<Collection> =
  Collection extends ContentCollection<infer Document, any, any>
    ? Document
    : never;

export type ContentSummaryOf<Collection> =
  Collection extends ContentCollection<any, infer Summary, any>
    ? Summary
    : never;

export type ContentCollectionData<Collection> = {
  load(id: string): Promise<ContentDocumentOf<Collection> | undefined>;
  summaries: readonly ContentSummaryOf<Collection>[];
};

export function defineCollection<
  const Schema extends StandardSchemaV1,
  Document,
  Summary,
>(
  collection: Omit<
    ContentCollection<Document, Summary, StandardSchemaV1.InferOutput<Schema>>,
    "schema"
  > & { schema: Schema },
): ContentCollection<Document, Summary, StandardSchemaV1.InferOutput<Schema>>;

export function defineCollection<Document, Summary>(
  collection: ContentCollection<
    Document,
    Summary,
    Readonly<Record<string, unknown>>
  > & { schema?: undefined },
): ContentCollection<Document, Summary, Readonly<Record<string, unknown>>>;

export function defineCollection(collection: object): object {
  return collection;
}

export function defineContent<const Collections extends ContentCollections>(
  definition: ContentDefinition<Collections>,
): ContentDefinition<Collections> {
  return definition;
}
