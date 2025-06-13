import { visit } from "unist-util-visit";

export const rehypePreprocessPrettyCode = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;

      if (codeEl.tagName !== "code") return;

      node.properties["__raw_string__"] = codeEl.children?.[0].value;
    }
  });
};

export const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
};

export const rehypePostprocessPrettyCode = () => (tree: any) => {
  visit(tree, (node) => {
    if (
      node?.type === "element" &&
      node?.tagName === "figure" &&
      node.properties["data-rehype-pretty-code-figure"] === ""
    ) {
      for (const child of node.children) {
        if (child.tagName === "pre") {
          child.properties["__raw_string__"] =
            node.properties["__raw_string__"];

          node.properties["__raw_string__"] = undefined;
          break;
        }
      }
    }
  });
};
