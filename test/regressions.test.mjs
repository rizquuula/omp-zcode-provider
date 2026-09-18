import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../extensions/zcode-provider.ts", import.meta.url),
  "utf8",
);

test("only explicitly enabled Desktop providers are synchronized", () => {
  assert.match(source, /enabled\?: boolean \}\)\.enabled !== true/);
});

test("prompt_completed cannot terminate a turn", () => {
  assert.doesNotMatch(source, /reason === ["']prompt_completed["'][^\n]*settled\s*=\s*true/);
  assert.match(source, /ev\.type === ["']turn\.completed["']/);
  assert.match(source, /ev\.type === ["']turn\.failed["']/);
});

test("headless config watchers are unreferenced", () => {
  assert.match(source, /watcher\.unref\(\)/);
});

test("ZCode model limits are exposed to omp", () => {
  assert.match(source, /contextWindow: m\.contextWindow \?\? 200000/);
  assert.match(source, /maxTokens: m\.maxTokens \?\? 8192/);
});
