import type { Emitter, LanguageFn } from "highlight.js";
import highlightJs from "highlight.js/lib/core";

export type HighlightedToken = {
  content: string;
  dark: string;
  fontStyle?: number;
  light: string;
};

export type HighlightedLine = {
  tokens: HighlightedToken[];
};

export type HighlightCode = (
  source: string,
  language: unknown,
) => HighlightedLine[];

export type HighlightTokenStyle = Omit<HighlightedToken, "content">;

export type HighlightTheme = {
  default: HighlightTokenStyle;
  scopes: Readonly<Record<string, HighlightTokenStyle>>;
};

export type HighlighterOptions<
  Languages extends Readonly<Record<string, LanguageFn>>,
> = {
  aliases?: Readonly<Record<string, Extract<keyof Languages, string>>>;
  languages: Languages;
  theme?: HighlightTheme;
  unknownLanguage?: "error" | "plain";
};

const githubColors = {
  blue: { light: "#0550ae", dark: "#6cb6ff" },
  default: { light: "#24292e", dark: "#adbac7" },
  foreground: { light: "#24292f", dark: "#adbac7" },
  gray: { light: "#6e7781", dark: "#768390" },
  green: { light: "#116329", dark: "#8ddb8c" },
  navy: { light: "#0a3069", dark: "#96d0ff" },
  orange: { light: "#953800", dark: "#f69d50" },
  purple: { light: "#8250df", dark: "#dcbdfb" },
  red: { light: "#cf222e", dark: "#f47067" },
};

export const githubTheme: HighlightTheme = {
  default: githubColors.default,
  scopes: {
    attr: githubColors.blue,
    attribute: githubColors.blue,
    built_in: githubColors.orange,
    bullet: githubColors.blue,
    comment: githubColors.gray,
    doctag: githubColors.red,
    emphasis: { ...githubColors.default, fontStyle: 1 },
    keyword: githubColors.red,
    literal: githubColors.blue,
    meta: githubColors.orange,
    name: githubColors.green,
    number: githubColors.blue,
    operator: githubColors.red,
    params: githubColors.foreground,
    property: githubColors.blue,
    regexp: githubColors.navy,
    selector_attr: githubColors.blue,
    selector_class: githubColors.purple,
    selector_id: githubColors.purple,
    selector_pseudo: githubColors.purple,
    string: githubColors.navy,
    strong: { ...githubColors.default, fontStyle: 2 },
    subst: githubColors.foreground,
    symbol: githubColors.blue,
    tag: githubColors.green,
    template_tag: githubColors.red,
    title: githubColors.purple,
    type: githubColors.orange,
    variable: githubColors.orange,
  },
};

export function createHighlighter<
  const Languages extends Readonly<Record<string, LanguageFn>>,
>({
  aliases = {},
  languages,
  theme = githubTheme,
  unknownLanguage = "plain",
}: HighlighterOptions<Languages>): HighlightCode {
  const syntaxHighlighter = highlightJs.newInstance();
  const HighlightEmitter = createHighlightEmitter(theme);
  const cache = new Map<string, HighlightedLine[]>();

  syntaxHighlighter.configure({ __emitter: HighlightEmitter });

  for (const [name, definition] of Object.entries(languages)) {
    syntaxHighlighter.registerLanguage(name, definition);
  }

  return (source, language) => {
    const requestedLanguage = String(language ?? "text").toLowerCase();
    let normalizedLanguage: string =
      aliases[requestedLanguage] ?? requestedLanguage;

    if (
      normalizedLanguage !== "text" &&
      normalizedLanguage !== "plaintext" &&
      !Object.hasOwn(languages, normalizedLanguage)
    ) {
      if (unknownLanguage === "error") {
        throw new Error(
          `Unknown syntax highlighting language: ${requestedLanguage}`,
        );
      }
      normalizedLanguage = "text";
    }

    const isPlain =
      normalizedLanguage === "text" || normalizedLanguage === "plaintext";
    const key = `${normalizedLanguage}\0${source}`;
    let highlighted = cache.get(key);

    if (!highlighted) {
      highlighted = isPlain
        ? plain(source, theme.default)
        : getHighlightedLines(
            syntaxHighlighter.highlight(source, {
              language: normalizedLanguage,
            })._emitter,
          );
      cache.set(key, highlighted);
    }

    return highlighted;
  };
}

function createHighlightEmitter(theme: HighlightTheme) {
  return class HighlightEmitter implements Emitter {
    private readonly lines: HighlightedLine[] = [{ tokens: [] }];
    private readonly scopes: string[] = [];

    addText(text: string): void {
      const parts = text.split("\n");

      for (let index = 0; index < parts.length; index++) {
        const content = parts[index];
        if (content) this.addToken({ content, ...this.currentStyle() });
        if (index < parts.length - 1) this.lines.push({ tokens: [] });
      }
    }

    startScope(name: string): void {
      this.scopes.push(name);
    }

    // Highlight.js calls these even though its public Emitter type omits them.
    openNode(name: string): void {
      this.startScope(name);
    }

    endScope(): void {
      this.scopes.pop();
    }

    closeNode(): void {
      this.endScope();
    }

    __addSublanguage(emitter: Emitter): void {
      const nested = getHighlightedLines(emitter);

      for (const [lineIndex, line] of nested.entries()) {
        for (const token of line.tokens) this.addToken(token);
        if (lineIndex < nested.length - 1) this.lines.push({ tokens: [] });
      }
    }

    finalize(): void {}

    toHTML(): string {
      return "";
    }

    toLines(): HighlightedLine[] {
      for (const line of this.lines) {
        if (line.tokens.length === 0) {
          line.tokens.push({ content: "", ...theme.default });
        }
      }
      return this.lines;
    }

    private addToken(token: HighlightedToken): void {
      const tokens = this.lines[this.lines.length - 1].tokens;
      const previous = tokens.at(-1);
      if (
        previous?.light === token.light &&
        previous.dark === token.dark &&
        previous.fontStyle === token.fontStyle
      ) {
        previous.content += token.content;
      } else {
        tokens.push({ ...token });
      }
    }

    private currentStyle(): HighlightTokenStyle {
      for (let index = this.scopes.length - 1; index >= 0; index--) {
        const scope = this.scopes[index].replaceAll(".", "_");
        const style = theme.scopes[scope] ?? theme.scopes[scope.split("_")[0]];
        if (style) return style;
      }

      return theme.default;
    }
  };
}

function getHighlightedLines(emitter: Emitter): HighlightedLine[] {
  return (emitter as Emitter & { toLines(): HighlightedLine[] }).toLines();
}

function plain(source: string, style: HighlightTokenStyle): HighlightedLine[] {
  return source.split("\n").map((content) => ({
    tokens: [{ content, ...style }],
  }));
}
