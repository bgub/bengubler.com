import type { Node } from "@markdoc/markdoc";
import title from "title";

export type TitleCapitalizationIssue = {
  actual: string;
  expected: string;
  kind: "frontmatter-title" | "heading";
};

export type TitleCapitalizationOptions = {
  specialCases?: readonly string[];
};

type DocumentContent = {
  ast: Node;
  title: string;
};

type TextRange = {
  end: number;
  start: number;
};

export function lintDocumentCapitalization(
  content: DocumentContent,
  options: TitleCapitalizationOptions = {},
): TitleCapitalizationIssue[] {
  const specialCases = [...(options.specialCases ?? [])];
  const issues: TitleCapitalizationIssue[] = [];
  const expectedTitle = title(content.title, { special: specialCases });

  if (content.title !== expectedTitle) {
    issues.push({
      actual: content.title,
      expected: expectedTitle,
      kind: "frontmatter-title",
    });
  }

  for (const node of content.ast.walk()) {
    if (node.type !== "heading") continue;

    const { text: actual, preservedRanges } = extractHeadingText(node);
    const expected = capitalizeHeading(actual, preservedRanges, specialCases);

    if (actual !== expected) {
      issues.push({ actual, expected, kind: "heading" });
    }
  }

  return issues;
}

function capitalizeHeading(
  actual: string,
  preservedRanges: TextRange[],
  configuredSpecialCases: string[],
): string {
  let expected = title(actual, { special: configuredSpecialCases });
  if (actual === expected) return actual;

  if (actual.length !== expected.length) return expected;

  for (let index = preservedRanges.length - 1; index >= 0; index--) {
    const range = preservedRanges[index];
    expected =
      expected.slice(0, range.start) +
      actual.slice(range.start, range.end) +
      expected.slice(range.end);
  }

  return expected;
}

function extractHeadingText(heading: Node): {
  preservedRanges: TextRange[];
  text: string;
} {
  const state = { preservedRanges: [] as TextRange[], text: "" };

  for (const child of heading.children) {
    appendNodeText(child, false, state);
  }

  return state;
}

function appendNodeText(
  node: Node,
  preserve: boolean,
  state: { preservedRanges: TextRange[]; text: string },
): void {
  const shouldPreserve =
    preserve || node.type === "code" || node.type === "link";

  if (node.type === "text" || node.type === "code") {
    const content = String(node.attributes.content ?? "");
    const start = state.text.length;
    state.text += content;

    if (shouldPreserve && content.length > 0) {
      state.preservedRanges.push({ start, end: state.text.length });
    }
    return;
  }

  if (node.type === "softbreak") {
    state.text += " ";
    return;
  }

  for (const child of node.children) {
    appendNodeText(child, shouldPreserve, state);
  }
}
