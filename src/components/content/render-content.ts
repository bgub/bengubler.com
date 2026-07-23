import { type ComponentType, createElement, type FigNode } from "@bgub/fig";
import type {
  ContentComponentName,
  ContentNode,
  ContentTree,
} from "content-pipeline";

export type ContentComponents = Readonly<
  Record<ContentComponentName, ComponentType<any> | string> &
    Partial<Record<string, ComponentType<any> | string>>
>;

export function ContentRenderer({
  body,
  components,
}: {
  body: string;
  components: ContentComponents;
}): FigNode {
  const tree = JSON.parse(body) as ContentTree;
  return tree.map((node, index) =>
    renderNode(node, `content.${index}`, components),
  );
}

function renderNode(
  node: ContentNode,
  key: string,
  components: ContentComponents,
): FigNode {
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
): ComponentType<any> | string {
  const Component = components[name];
  if (Component) return Component;

  if (name === name.toLowerCase()) return name;

  throw new Error(`Missing content component adapter for "${name}"`);
}
