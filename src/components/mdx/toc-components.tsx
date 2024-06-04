import type { MDXComponents } from "mdx/types";

import "./mdx-styles.css";

export const tocComponents: MDXComponents = {
  ul: ({ children }) => {
    console.log(children);

    return <ul className="list-disc list-inside">{children}</ul>;
  },
};
