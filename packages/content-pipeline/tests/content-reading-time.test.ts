import assert from "node:assert/strict";
import test from "node:test";
import { getReadingTime } from "../src/content-reading-time.ts";

test("returns structured reading-time data", () => {
  assert.deepEqual(getReadingTime(""), { minutes: 0, words: 0 });
  assert.deepEqual(
    getReadingTime(Array.from({ length: 200 }, () => "word").join(" ")),
    { minutes: 1, words: 200 },
  );
  assert.deepEqual(
    getReadingTime(Array.from({ length: 202 }, () => "word").join(" ")),
    { minutes: 2, words: 202 },
  );
  assert.deepEqual(getReadingTime("一、二、三"), { minutes: 1, words: 3 });
});

test("supports a custom reading speed", () => {
  assert.deepEqual(getReadingTime("one two three", { wordsPerMinute: 2 }), {
    minutes: 2,
    words: 3,
  });
  assert.throws(
    () => getReadingTime("hello", { wordsPerMinute: 0 }),
    /positive number/,
  );
});
