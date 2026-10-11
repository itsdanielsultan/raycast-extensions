import test from "node:test";
import assert from "node:assert/strict";
import { helperArguments, validateAppPath } from "../src/commands.ts";

test("uses the exact Highlight AI path and rejects similarly named apps", () => {
  assert.equal(validateAppPath(""), "/Applications/Highlight.app");
  assert.throws(() => validateAppPath("/Applications/Highlights.app"));
  assert.throws(() => validateAppPath("/Applications/Highlighter.app"));
  assert.throws(() => validateAppPath("Highlight.app"));
});
test("passes paths as separate arguments without evaluating shell syntax", () => {
  const appPath = "/Users/example/$(anything)/Highlight.app";
  assert.deepEqual(helperArguments("/assets/control.js", appPath, "search"), ["-l", "JavaScript", "/assets/control.js", appPath, "search"]);
});
test("rejects arbitrary key injection and unsupported actions", () => {
  assert.throws(() => helperArguments("/assets/control.js", "/Applications/Highlight.app", "delete"));
});
