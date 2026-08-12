import assert from "node:assert/strict";
import test from "node:test";
import { serializeJavaScript } from "../src/serialize.ts";

test("serializes content values as executable JavaScript", async () => {
  const specialProperty = JSON.parse('{"__proto__":{"preserved":true}}');
  const value = {
    date: new Date("2026-01-01T00:00:00.000Z"),
    nested: [null, true, 42, "text"],
    omitted: undefined,
    ...specialProperty,
  };
  const code = serializeJavaScript(value);
  const module = await import(
    `data:text/javascript,${encodeURIComponent(`export const value = ${code}`)}`
  );

  assert.deepEqual(module.value, {
    date: value.date,
    nested: value.nested,
    ...specialProperty,
  });
  assert.equal(Object.hasOwn(module.value, "__proto__"), true);
  assert.equal(module.value.preserved, undefined);
});

test("rejects values that cannot be emitted safely", () => {
  const circular: Record<string, unknown> = {};
  circular.self = circular;

  assert.throws(() => serializeJavaScript(Number.NaN), /non-finite number/);
  assert.throws(() => serializeJavaScript(new Date("invalid")), /invalid Date/);
  assert.throws(() => serializeJavaScript(new Map()), /unsupported Map/);
  assert.throws(() => serializeJavaScript(circular), /circular value/);
});
