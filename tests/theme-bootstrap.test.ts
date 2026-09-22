import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { themeScript, themeStorageKey } from "../src/lib/theme-bootstrap.ts";

for (const stored of ["light", "dark", "system", null, "invalid", "blocked"]) {
  for (const prefersDark of [false, true]) {
    test(`theme bootstrap synchronizes icon and colors before hydration: ${stored}, dark=${prefersDark}`, () => {
      const classes = new Set<string>();
      const root = {
        dataset: {} as Record<string, string>,
        style: { colorScheme: "" },
        classList: { add: (value: string) => classes.add(value) },
      };
      runInNewContext(themeScript, {
        document: { documentElement: root },
        localStorage: {
          getItem(key: string) {
            assert.equal(key, themeStorageKey);
            if (stored === "blocked") throw new Error("Storage denied");
            return stored;
          },
        },
        matchMedia: () => ({ matches: prefersDark }),
      });
      const theme = stored === "light" || stored === "dark" ? stored : "system";
      const resolved =
        theme === "system" ? (prefersDark ? "dark" : "light") : theme;
      assert.equal(root.dataset.theme, theme);
      assert.equal(root.style.colorScheme, resolved);
      assert.deepEqual([...classes], [resolved]);
    });
  }
}
