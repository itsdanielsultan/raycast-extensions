const reasons = {
  settings_button:
    "Blip's Settings button is unavailable. Open its menu bar panel and retry.",
  settings_menu:
    "Blip's Settings menu item is unavailable. Open Settings manually and retry.",
  settings_window:
    "Blip Settings did not become available. Open Settings manually and retry.",
  query_timeout:
    "Blip's Settings controls did not respond. Open Settings manually and retry.",
  startup_deadline:
    "Blip Settings startup did not finish in time. Open Settings manually and retry.",
  scope_limit:
    "Blip's Settings controls could not be located. Open Settings manually and retry.",
  unknown_pane: "Choose General, Profile, Devices, or Help in Blip Settings.",
  missing_app: "Install Blip for Mac from blip.net before using this command.",
  automation:
    "Allow Raycast to control Blip and System Events in Privacy & Security → Automation.",
  accessibility:
    "Enable Raycast in Privacy & Security → Accessibility, then retry.",
  timeout:
    "Blip Settings did not respond in time. Open Settings manually and retry.",
  pane_not_confirmed:
    "The requested Blip settings pane was not confirmed. Open Settings manually and retry.",
  unknown: "Could not open Blip Settings. Open Settings manually and retry.",
} as const;

type FailureKind = keyof typeof reasons;

/** Holds only an allowlisted reason, never the native command or stderr. */
export class SettingsFailure extends Error {
  readonly kind: FailureKind;

  constructor(kind: FailureKind) {
    super(reasons[kind]);
    this.name = "SettingsFailure";
    this.kind = kind;
  }
}

export function settingsFailure(error: unknown): SettingsFailure {
  if (error instanceof SettingsFailure) return error;
  const message = error instanceof Error ? error.message : "";
  const normalized = message.toLowerCase();

  if (/\bBLIP_SETTINGS_BUTTON_NOT_FOUND\b/.test(message))
    return new SettingsFailure("settings_button");
  if (/\bBLIP_SETTINGS_MENU_NOT_FOUND\b/.test(message))
    return new SettingsFailure("settings_menu");
  if (/\bBLIP_SETTINGS_WINDOW_NOT_FOUND\b/.test(message))
    return new SettingsFailure("settings_window");
  if (/\bBLIP_SETTINGS_QUERY_TIMEOUT\b/.test(message))
    return new SettingsFailure("query_timeout");
  if (/\bBLIP_SETTINGS_HELPER_TIMEOUT\b/.test(message))
    return new SettingsFailure("startup_deadline");
  if (/\bBLIP_SETTINGS_SCOPE_LIMIT\b/.test(message))
    return new SettingsFailure("scope_limit");
  if (/\bBLIP_UNKNOWN_SETTINGS_PANE\b/.test(message))
    return new SettingsFailure("unknown_pane");
  if (message === reasons.missing_app)
    return new SettingsFailure("missing_app");
  if (
    message.includes("-1743") ||
    /not authori[sz]ed to send apple events/.test(normalized)
  ) {
    return new SettingsFailure("automation");
  }
  if (message.includes("-25211") || normalized.includes("assistive access")) {
    return new SettingsFailure("accessibility");
  }
  if (error instanceof Error && "killed" in error && error.killed === true) {
    return new SettingsFailure("timeout");
  }
  return new SettingsFailure("unknown");
}
