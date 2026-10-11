import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validatePaths } from "../src/lib/paths.ts";

test("validates multi-file batches, spaces, unicode and newline names without dropping items", async () => {
  const root = await mkdtemp(join(tmpdir(), "blip-test-"));
  try {
    const paths = [
      join(root, "sample notes.txt"),
      join(root, 'café\nquote".txt'),
      join(root, "folder"),
    ];
    await Promise.all([
      writeFile(paths[0], "disposable"),
      writeFile(paths[1], "disposable"),
      mkdir(paths[2]),
    ]);
    assert.deepEqual(await validatePaths(paths), paths);
    assert.deepEqual(await validatePaths([...paths, paths[0]]), paths);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects empty and relative selections", async () => {
  await assert.rejects(validatePaths([]), /Choose at least one/);
  await assert.rejects(validatePaths(["relative.txt"]), /file picker/);
});

test("rejects the whole batch if one item was removed", async () => {
  const root = await mkdtemp(join(tmpdir(), "blip-test-"));
  try {
    const existing = join(root, "existing.txt");
    await writeFile(existing, "disposable");
    await assert.rejects(
      validatePaths([existing, join(root, "missing.txt")]),
      /Cannot read/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
