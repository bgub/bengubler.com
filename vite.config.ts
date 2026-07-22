import { readdirSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";
import {
  defaultLocale,
  getLocalizedPath,
  getUnlocalizedPath,
  isLocale,
  type Locale,
  locales,
} from "./src/lib/locales";
import { sitePaths } from "./src/lib/site-paths";

function walkFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

function rawMarkdownDevRewrite(): Plugin {
  return {
    name: "raw-markdown-dev-rewrite",
    apply: "serve",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url || request.method !== "GET") return next();
        const url = new URL(request.url, "http://localhost");
        const match = url.pathname.match(
          /^\/(?:([^/]+)\/)?posts\/([^/]+)\.md$/,
        );
        if (!match) return next();

        const [, routeLocale, slug] = match;
        if (routeLocale && !isLocale(routeLocale)) return next();
        if (routeLocale === defaultLocale) {
          response.statusCode = 308;
          response.setHeader(
            "Location",
            `${getUnlocalizedPath(url.pathname)}${url.search}`,
          );
          response.end();
          return;
        }

        const locale = (routeLocale as Locale | undefined) ?? defaultLocale;
        const apiPath = getLocalizedPath(`/api/posts/${slug}/raw`, locale);
        url.pathname = apiPath;
        url.searchParams.set("__raw", "1");
        request.url = `${url.pathname}${url.search}`;
        request.originalUrl = request.url;
        next();
      });
    },
  };
}

const contentDirectory = resolve("content");
const postPaths = walkFiles(contentDirectory)
  .filter((path) => extname(path) === ".md")
  .flatMap((path) => {
    const [locale] = relative(contentDirectory, path).split("/");
    return locale && isLocale(locale)
      ? [getLocalizedPath(`/posts/${basename(path, ".md")}`, locale)]
      : [];
  });
const pagePaths = locales.flatMap((locale) =>
  sitePaths.map((path) => getLocalizedPath(path || "/", locale)),
);
const prerenderPages = [...new Set([...pagePaths, ...postPaths])].map(
  (path) => ({ path }),
);

const config = defineConfig({
  ssr: { noExternal: ["react-tweet"] },
  resolve: {
    alias: [
      {
        find: /^tslib$/,
        replacement: fileURLToPath(
          new URL("./node_modules/tslib/tslib.es6.mjs", import.meta.url),
        ),
      },
    ],
    tsconfigPaths: true,
  },
  plugins: [
    rawMarkdownDevRewrite(),
    tanstackStart({
      pages: prerenderPages,
      prerender: {
        autoStaticPathsDiscovery: false,
        enabled: true,
        crawlLinks: false,
        failOnError: true,
      },
    }),
    nitro({
      noExternals: [
        /^gt-i18n$/,
        /^generaltranslation(\/.*)?$/,
        /^@generaltranslation\//,
        /^@formatjs\//,
        "tslib",
      ],
    }),
    react(),
    tailwindcss(),
    contentCollections(),
  ],
});

export default config;
