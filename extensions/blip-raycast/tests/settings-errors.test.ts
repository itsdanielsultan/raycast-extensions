import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SettingsFailure,
  settingsFailure,
} from "../src/lib/settings-errors.ts";

test("native stage failures become actionable messages without retaining stderr", () => {
  for (const [code, expectedKind] of [
    ["BLIP_SETTINGS_BUTTON_NOT_FOUND", "settings_button"],
    ["BLIP_SETTINGS_MENU_NOT_FOUND", "settings_menu"],
    ["BLIP_SETTINGS_WINDOW_NOT_FOUND", "settings_window"],
    ["BLIP_SETTINGS_QUERY_TIMEOUT", "query_timeout"],
    ["BLIP_SETTINGS_HELPER_TIMEOUT", "startup_deadline"],
    ["BLIP_SETTINGS_SCOPE_LIMIT", "scope_limit"],
    ["BLIP_UNKNOWN_SETTINGS_PANE", "unknown_pane"],
  ]) {
    const failure = settingsFailure(
      new Error(
        `Command failed: PRIVATE_PAYLOAD\nexecution error: ${code} (-2700)`,
      ),
    );
    assert.equal(failure.kind, expectedKind);
    assert.ok(failure.message.length > 0);
    assert.equal(failure.message.includes("PRIVATE_PAYLOAD"), false);
    assert.equal(failure.message.includes(code), false);
    assert.equal(failure.cause, undefined);
  }
});

test("unknown native failures cannot expose their original payload", () => {
  for (const error of [
    new Error("PRIVATE_PAYLOAD"),
    "PRIVATE_PAYLOAD",
    { message: "PRIVATE_PAYLOAD" },
  ]) {
    const failure = settingsFailure(error);
    assert.equal(failure.kind, "unknown");
    assert.equal(failure.message.includes("PRIVATE_PAYLOAD"), false);
  }
});

test("permission and terminated-helper failures remain distinguishable and safe", () => {
  assert.equal(
    settingsFailure(new Error("PRIVATE_PAYLOAD (-1743)")).kind,
    "automation",
  );
  assert.equal(
    settingsFailure(new Error("PRIVATE_PAYLOAD not allowed assistive access"))
      .kind,
    "accessibility",
  );
  const timeout = Object.assign(new Error("Command failed: PRIVATE_PAYLOAD"), {
    killed: true,
    signal: "SIGTERM",
  });
  const failure = settingsFailure(timeout);
  assert.equal(failure.kind, "timeout");
  assert.equal(failure.message.includes("PRIVATE_PAYLOAD"), false);
});

test("sanitized settings failures preserve their stage across the command boundary", () => {
  const failure = new SettingsFailure("pane_not_confirmed");
  assert.equal(settingsFailure(failure), failure);
});
