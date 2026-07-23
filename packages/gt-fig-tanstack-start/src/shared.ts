import {
  createContext,
  createElement,
  type FigNode,
  readContext,
} from "@bgub/fig";
import { decodeOptions, msg } from "gt-i18n";
import { hashMessage, interpolateMessage } from "gt-i18n/internal";
import type { GTTranslationOptions } from "gt-i18n/types";
import { translateJsx, type JsxTranslationOptions } from "./jsx-translation.ts";
import {
  getClientState,
  getGTConfig,
  type GTProviderProps,
  type GTState,
  resolveSupportedLocale,
  setClientState,
} from "./state.ts";

type GTFunction = (message: string, options?: GTTranslationOptions) => string;

type MessageFunction = <T extends string | null | undefined>(
  message: T,
  options?: GTTranslationOptions,
) => T extends string ? string : T;

const GTContext = createContext<GTState>(getClientState());

export function GTProvider(props: GTProviderProps): FigNode {
  const config = getGTConfig();
  const state: GTState = {
    catalog: props.translations[props.locale] ?? {},
    defaultLocale: config.defaultLocale,
    locale: props.locale,
    locales: config.locales,
  };
  setClientState(state);
  return createElement(GTContext, { value: state }, props.children);
}

export function createGTFunction(state: GTState): GTFunction {
  return (message, options = {}) => {
    const lookupOptions = {
      ...options,
      $format: options.$format ?? "ICU",
      $locale: state.locale,
    };
    const target = state.catalog[hashMessage(message, lookupOptions)];
    return interpolateMessage({
      source: message,
      target: typeof target === "string" ? target : undefined,
      options: lookupOptions,
      sourceLocale: state.defaultLocale,
    });
  };
}

export function useGT(): GTFunction {
  return createGTFunction(readContext(GTContext));
}

export function useMessages(): MessageFunction {
  const gt = useGT();
  return ((message, options = {}) => {
    if (message == null) return message;
    const decoded = decodeOptions(message);
    return decoded && typeof decoded.$_source === "string"
      ? gt(decoded.$_source, decoded)
      : gt(message, options);
  }) as MessageFunction;
}

export function useLocaleSelector(locales?: string[]) {
  const state = readContext(GTContext);
  return {
    locale: state.locale,
    locales: locales ?? [...state.locales],
    setLocale(locale: string) {
      if (typeof window === "undefined") return;
      const config = getGTConfig();
      const nextLocale = resolveSupportedLocale(locale);
      document.cookie = `${config.localeCookieName}=${encodeURIComponent(nextLocale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      const segments = window.location.pathname.split("/");
      const pathLocale = config.locales.includes(segments[1] ?? "")
        ? segments[1]
        : undefined;
      if (pathLocale) segments.splice(1, 1);
      const unlocalizedPath = segments.join("/") || "/";
      window.location.assign(
        nextLocale === config.defaultLocale
          ? unlocalizedPath
          : `/${nextLocale}${unlocalizedPath === "/" ? "" : unlocalizedPath}`,
      );
    },
  };
}

export interface TProps extends JsxTranslationOptions {
  children?: FigNode;
}

function TComponent({ children, ...options }: TProps): FigNode {
  const state = readContext(GTContext);
  return translateJsx(children, state.catalog, state.locale, options);
}

export const T = Object.assign(TComponent, { _gtt: "translate-client" });

export const Var = Object.assign(
  ({ children }: { children?: FigNode; name?: string }) => children,
  { _gtt: "variable-variable" },
);

export const Num = Object.assign(
  ({
    children,
    options,
  }: {
    children?: number | string | null;
    name?: string;
    options?: Intl.NumberFormatOptions;
  }) => {
    if (children == null) return null;
    const value =
      typeof children === "string" ? Number.parseFloat(children) : children;
    return new Intl.NumberFormat(readContext(GTContext).locale, options).format(
      value,
    );
  },
  { _gtt: "variable-number" },
);

export const DateTime = Object.assign(
  ({
    children,
    options,
  }: {
    children?: Date | string | null;
    name?: string;
    options?: Intl.DateTimeFormatOptions;
  }) => {
    if (children == null) return null;
    const value = children instanceof Date ? children : new Date(children);
    return new Intl.DateTimeFormat(
      readContext(GTContext).locale,
      options,
    ).format(value);
  },
  { _gtt: "variable-datetime" },
);

interface BranchProps {
  branch?: string | number | boolean;
  children?: FigNode;
  [key: string]: unknown;
}

function BranchComponent({ branch, children, ...branches }: BranchProps) {
  const key = branch?.toString();
  return key && !key.startsWith("data-") && key in branches
    ? (branches[key] as FigNode)
    : children;
}

export const Branch = Object.assign(BranchComponent, { _gtt: "branch" });

export { msg };
