import {
  createElement,
  type FigElement,
  type FigNode,
  isValidElement,
} from "@bgub/fig";
import {
  HTML_CONTENT_PROPS,
  type Variable,
} from "@generaltranslation/format/types";
import { minifyVariableType } from "generaltranslation/internal";
import type { VariableTransformationSuffix } from "generaltranslation/types";
import { hashMessage } from "gt-i18n/internal";
import type { GTTranslationOptions } from "gt-i18n/types";
import type {
  Translation,
  TranslationCatalog,
  TranslationElement,
} from "./state.ts";

export interface JsxTranslationOptions extends GTTranslationOptions {
  context?: string;
  id?: string;
  maxChars?: number;
  requiresReview?: boolean;
}

interface TransformedComponent {
  (props: Record<string, unknown>): FigNode;
  _gtt?: string;
  displayName?: string;
}

interface GTTag {
  branches?: Record<string, TaggedChildren>;
  id: number;
  transformation?: string;
  variableType?: string;
}

type TaggedElement = FigElement<
  Record<string, unknown> & { "data-_gt"?: GTTag; children?: TaggedChildren }
>;
type TaggedChild = TaggedElement | string | number | boolean | null | undefined;
type TaggedChildren = TaggedChild | TaggedChild[];

export function translateJsx(
  children: FigNode,
  catalog: TranslationCatalog,
  locale: string,
  options: JsxTranslationOptions,
): FigNode {
  const tagged = tagChildren(children as TaggedChildren);
  const source = serializeChildren(tagged);
  const target =
    catalog[hashMessage(source, normalizeOptions(locale, options))];
  return renderChildren(tagged, target);
}

function normalizeOptions(locale: string, options: JsxTranslationOptions) {
  return {
    ...options,
    $context: options.$context ?? options.context,
    $format: "JSX" as const,
    $id: options.$id ?? options.id,
    $locale: locale,
    $maxChars: options.$maxChars ?? options.maxChars,
    $requiresReview: options.$requiresReview ?? options.requiresReview,
  };
}

function tagChildren(
  children: TaggedChildren,
  startingIndex = 0,
): TaggedChildren {
  let index = startingIndex;

  const visitChildren = (value: TaggedChildren): TaggedChildren =>
    Array.isArray(value) ? value.map(visit) : visit(value);

  const visit = (child: TaggedChild): TaggedChild => {
    if (!isValidElement(child)) return child;
    index += 1;
    const type = child.type as TransformedComponent | string;
    const transformation =
      typeof type === "function" ? type._gtt?.split("-") : undefined;
    const tag: GTTag = { id: index };
    if (transformation?.[0] === "translate") tag.transformation = "fragment";
    else if (transformation?.[0]) tag.transformation = transformation[0];
    if (transformation?.[0] === "variable") {
      tag.variableType = transformation[1] ?? "variable";
    }
    if (transformation?.[0] === "branch") {
      const { branch: _branch, children: _children, ...branches } = child.props;
      tag.branches = Object.fromEntries(
        Object.entries(branches)
          .filter(([key]) => !key.startsWith("data-"))
          .map(([key, value]) => [
            key,
            tagChildren(value as TaggedChildren, index),
          ]),
      );
    }
    const nextChildren = tag.variableType
      ? child.props.children
      : visitChildren(child.props.children as TaggedChildren);
    return cloneElement(child, {
      ...child.props,
      "data-_gt": tag,
      children: nextChildren,
    });
  };

  return visitChildren(children);
}

function serializeChildren(children: TaggedChildren): Translation {
  const serialize = (child: TaggedChild): Translation => {
    if (!isValidElement(child)) {
      if (child == null || typeof child === "boolean") return "";
      return String(child);
    }
    const tag = child.props["data-_gt"];
    if (tag?.transformation === "variable") {
      return {
        i: tag.id,
        k: variableName(child.props, tag.variableType ?? "variable"),
        v: minifyVariableType(
          (tag.variableType ?? "variable") as VariableTransformationSuffix,
        ),
      };
    }
    const result: TranslationElement = { t: elementName(child) };
    if (tag) result.i = tag.id;
    const data: TranslationElement["d"] = {};
    for (const [shortName, longName] of Object.entries(HTML_CONTENT_PROPS)) {
      const value = child.props[longName];
      if (typeof value === "string") {
        (data as Record<string, unknown>)[shortName] = value;
      }
    }
    if (tag?.transformation === "branch" && tag.branches) {
      data.b = Object.fromEntries(
        Object.entries(tag.branches).map(([key, value]) => [
          key,
          serializeChildren(value),
        ]),
      );
      data.t = "b";
    }
    if (Object.keys(data).length > 0) result.d = data;
    if (child.props.children != null) {
      result.c = serializeChildren(child.props.children as TaggedChildren);
    }
    return result;
  };

  return Array.isArray(children)
    ? (children.map(serialize) as Translation)
    : serialize(children);
}

function renderChildren(
  source: TaggedChildren,
  target: Translation | undefined,
): FigNode {
  if (target == null) return renderDefault(source);
  if (typeof target === "string") return target;
  if (Array.isArray(target)) {
    const sourceChildren = Array.isArray(source) ? source : [source];
    const elements = sourceChildren.filter(isValidElement) as TaggedElement[];
    const variables = new Map<string, TaggedElement>();
    const ordinary: TaggedElement[] = [];
    for (const element of elements) {
      const tag = element.props["data-_gt"];
      if (tag?.transformation === "variable") {
        variables.set(
          variableName(element.props, tag.variableType ?? "variable"),
          element,
        );
      } else {
        ordinary.push(element);
      }
    }
    return target.map((child) => {
      if (typeof child === "string") return child;
      if (isVariable(child)) {
        const variable = variables.get(child.k ?? "");
        return variable ? renderVariable(variable) : null;
      }
      const match =
        ordinary.find((element) => element.props["data-_gt"]?.id === child.i) ??
        ordinary.shift();
      return match ? renderElement(match, child) : null;
    });
  }
  if (isVariable(target) && isValidElement(source)) {
    return renderVariable(source as TaggedElement);
  }
  if (isValidElement(source)) {
    return renderElement(source as TaggedElement, target);
  }
  return renderDefault(source);
}

function renderElement(
  source: TaggedElement,
  target: TranslationElement,
): FigNode {
  const tag = source.props["data-_gt"];
  if (tag?.transformation === "branch") {
    const branch = source.props.branch?.toString();
    const sourceBranch =
      branch && tag.branches?.[branch] !== undefined
        ? tag.branches[branch]
        : (source.props.children as TaggedChildren);
    const targetBranch =
      branch && target.d?.b?.[branch] !== undefined
        ? target.d.b[branch]
        : target.c;
    return renderChildren(sourceBranch, targetBranch);
  }
  if (tag?.transformation === "fragment") {
    return renderChildren(source.props.children as TaggedChildren, target.c);
  }
  const translatedProps: Record<string, unknown> = {};
  for (const [shortName, longName] of Object.entries(HTML_CONTENT_PROPS)) {
    const value = (target.d as Record<string, unknown> | undefined)?.[
      shortName
    ];
    if (typeof value === "string") translatedProps[longName] = value;
  }
  if (source.props.children != null && target.c != null) {
    return cloneElement(source, {
      ...source.props,
      ...translatedProps,
      "data-_gt": undefined,
      children: renderChildren(
        source.props.children as TaggedChildren,
        target.c,
      ),
    });
  }
  return renderDefault(source);
}

function renderDefault(children: TaggedChildren): FigNode {
  const render = (child: TaggedChild): FigNode => {
    if (!isValidElement(child)) return child;
    const element = child as TaggedElement;
    const tag = element.props["data-_gt"];
    if (tag?.transformation === "variable") return renderVariable(element);
    if (tag?.transformation === "branch") {
      const branch = element.props.branch?.toString();
      return renderDefault(
        branch && tag.branches?.[branch] !== undefined
          ? tag.branches[branch]
          : (element.props.children as TaggedChildren),
      );
    }
    if (tag?.transformation === "fragment") {
      return renderDefault(element.props.children as TaggedChildren);
    }
    return cloneElement(element, {
      ...element.props,
      "data-_gt": undefined,
      children:
        element.props.children == null
          ? undefined
          : renderDefault(element.props.children as TaggedChildren),
    });
  };

  return Array.isArray(children) ? children.map(render) : render(children);
}

function renderVariable(element: TaggedElement): FigNode {
  return typeof element.type === "function"
    ? element.type(element.props)
    : element.props.children;
}

function cloneElement(
  element: FigElement,
  props: Record<string, unknown>,
): TaggedElement {
  return createElement(element.type, {
    ...props,
    key: element.key,
  }) as TaggedElement;
}

function elementName(element: TaggedElement): string {
  if (typeof element.type === "string") return element.type;
  const type = element.type as TransformedComponent;
  return type.displayName || type.name || "function";
}

function variableName(props: Record<string, unknown>, type: string): string {
  if (typeof props.name === "string") return props.name;
  const defaults: Record<string, string> = {
    currency: "cost",
    datetime: "date",
    number: "n",
    "relative-time": "time",
    variable: "value",
  };
  const id = (props["data-_gt"] as GTTag | undefined)?.id;
  return `_gt_${defaults[type] ?? "value"}_${id}`;
}

function isVariable(value: TranslationElement | Variable): value is Variable {
  return "k" in value && typeof value.k === "string";
}
