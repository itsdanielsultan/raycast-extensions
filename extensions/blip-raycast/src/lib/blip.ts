import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import {
  PopToRootType,
  closeMainWindow,
  environment,
  getApplications,
} from "@raycast/api";
import { validatePaths } from "./paths";
import { SettingsFailure, settingsFailure } from "./settings-errors";

const execFileAsync = promisify(execFile);

export function hideRaycastForHandoff(): Promise<void> {
  return closeMainWindow({ popToRootType: PopToRootType.Suspended });
}

async function requireBlip(): Promise<void> {
  const applications = await getApplications();
  if (
    !applications.some(
      (application) => application.bundleId === "net.blip.macos",
    )
  ) {
    throw new Error(
      "Install Blip for Mac from blip.net before using this command.",
    );
  }
}

export async function prepareTransfer(
  paths: string[],
  beforeHandoff?: () => Promise<void>,
): Promise<number> {
  const validPaths = await validatePaths(paths);
  await requireBlip();
  await beforeHandoff?.();
  try {
    const { stdout } = await execFileAsync(
      "/usr/bin/osascript",
      [
        join(environment.assetsPath, "prepare-files.applescript"),
        ...validPaths,
      ],
      { timeout: 30000, maxBuffer: 65536 },
    );
    if (stdout.trim() !== "prepared")
      throw new Error("Blip did not confirm the selection.");
    return validPaths.length;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    if (message.includes("BLIP_EXISTING_PICKER")) {
      throw new Error(
        "Finish or close the existing Blip recipient picker, then try again.",
      );
    }
    if (message.includes("BLIP_PICKER_NOT_READY")) {
      throw new Error(
        "Blip opened but the selected files did not become ready. Close the unfinished picker and try selecting the items directly in Finder.",
      );
    }
    if (message.includes("BLIP_PARTIAL_FINDER_SELECTION")) {
      throw new Error(
        "Finder could not select the complete batch. Put the items in one folder or select them together in Finder, then try again.",
      );
    }
    if (
      message.includes("BLIP_SERVICE_DISABLED") ||
      message.includes("BLIP_SERVICE_NOT_FOUND")
    ) {
      throw new Error(
        "Blip's file service is unavailable. Enable Blip in System Settings → Keyboard → Keyboard Shortcuts → Services, then try again.",
      );
    }
    throw new Error(
      automationError(
        message,
        "Blip could not prepare this transfer. Open Blip once and try again.",
      ),
    );
  }
}

export type SettingsPane = "General" | "Profile" | "Devices" | "Help";

export async function openSettings(
  pane: SettingsPane,
  beforeHandoff?: () => Promise<void>,
): Promise<void> {
  try {
    await requireBlip();
    await beforeHandoff?.();
    const { stdout } = await execFileAsync(
      "/usr/bin/osascript",
      [join(environment.assetsPath, "open-settings.applescript"), pane],
      { timeout: 15000, maxBuffer: 65536 },
    );
    if (stdout.trim() !== pane) throw new SettingsFailure("pane_not_confirmed");
  } catch (error) {
    throw settingsFailure(error);
  }
}

function automationError(details: string, fallback: string): string {
  if (
    details.includes("-1743") ||
    details.toLowerCase().includes("not authorized to send apple events")
  ) {
    return "Allow Raycast to control Finder, Blip and System Events in System Settings → Privacy & Security → Automation.";
  }
  if (
    details.toLowerCase().includes("assistive access") ||
    details.includes("-25211")
  ) {
    return "Enable Raycast in System Settings → Privacy & Security → Accessibility.";
  }
  return fallback;
}
