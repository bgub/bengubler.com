export function serializeJavaScript(
  value: unknown,
  seen = new Set<object>(),
): string {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean" || typeof value === "number") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new TypeError("Content contains a non-finite number");
    }
    return String(value);
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError("Content contains an invalid Date");
    }
    return `new Date(${JSON.stringify(value.toISOString())})`;
  }
  if (typeof value !== "object") {
    throw new TypeError(`Content contains unsupported ${typeof value} value`);
  }
  if (seen.has(value)) throw new TypeError("Content contains a circular value");
  seen.add(value);

  let serialized: string;
  if (Array.isArray(value)) {
    serialized = `[${value.map((item) => serializeJavaScript(item, seen)).join(",")}]`;
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(
        `Content contains unsupported ${value.constructor?.name ?? "object"}`,
      );
    }
    const properties = Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .map(
        ([key, child]) =>
          `${serializePropertyKey(key)}:${serializeJavaScript(child, seen)}`,
      );
    serialized = `{${properties.join(",")}}`;
  }

  seen.delete(value);
  return serialized;
}

function serializePropertyKey(key: string): string {
  const serialized = JSON.stringify(key);
  return key === "__proto__" ? `[${serialized}]` : serialized;
}
