import type {
  ContentComponentName,
  ContentNode,
  ContentTree,
} from "content-pipeline";
import { createElement, type ElementType, type ReactNode } from "react";

export type ContentComponents = Readonly<
  Record<ContentComponentName, ElementType> &
    Partial<Record<string, ElementType>>
>;

export function ContentRenderer({
  body,
  components,
}: {
  body: string;
  components: ContentComponents;
}) {
  const tree = JSON.parse(body) as ContentTree;
  return tree.map((node, index) =>
    renderNode(node, `content.${index}`, components),
  );
}

function renderNode(
  node: ContentNode,
  key: string,
  components: ContentComponents,
): ReactNode {
  if (typeof node === "string" || typeof node === "number") return node;

  const Component = resolveComponent(node.name, components);
  const children = node.children.map((child, index) =>
    renderNode(child, `${key}.${index}`, components),
  );

  return createElement(Component, { ...node.attributes, key }, ...children);
}

function resolveComponent(
  name: string,
  components: ContentComponents,
): ElementType | string {
  const Component = components[name];
  if (Component) return Component;

  if (name === name.toLowerCase()) return name;

  throw new Error(`Missing content component adapter for "${name}"`);
}
