import {
  Toast,
  popToRoot,
  getSelectedFinderItems,
  showHUD,
  showToast,
} from "@raycast/api";
import { hideRaycastForHandoff, prepareTransfer } from "./lib/blip";

export default async function Command() {
  try {
    const items = await getSelectedFinderItems();
    if (!items.length)
      throw new Error("Select one or more files or folders in Finder first.");
    const count = await prepareTransfer(
      items.map((item) => item.path),
      hideRaycastForHandoff,
    );
    await showHUD(
      `Opened Blip with ${count} ${count === 1 ? "item" : "items"} — choose a recipient`,
    );
    await popToRoot();
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Could not prepare transfer",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
