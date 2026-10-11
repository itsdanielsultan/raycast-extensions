import {
  Action,
  ActionPanel,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useState } from "react";
import { actions, MenuAction } from "./lib/actions";
import { errorMessage, performAction } from "./lib/sunflower";

const categories = ["Views", "Scan", "Navigation", "Selected Item"] as const;
const categoryIcons = {
  Views: Icon.AppWindow,
  Scan: Icon.ArrowClockwise,
  Navigation: Icon.Folder,
  "Selected Item": Icon.Document,
};

export default function Command() {
  const [busy, setBusy] = useState(false);

  async function run(action: MenuAction) {
    if (busy) return;
    setBusy(true);
    try {
      await performAction(action);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Could not control Sunflower",
        message: errorMessage(error),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <List
      isLoading={busy}
      searchBarPlaceholder="Switch views, navigate, or rescan…"
    >
      {categories.map((category) => (
        <List.Section key={category} title={category}>
          {actions
            .filter((action) => action.category === category)
            .map((action) => (
              <List.Item
                key={action.id}
                title={action.title}
                subtitle={action.description}
                icon={categoryIcons[category]}
                actions={
                  <ActionPanel>
                    <Action
                      title={action.title}
                      icon={categoryIcons[category]}
                      onAction={() => run(action)}
                    />
                    <Action.OpenInBrowser
                      title="Sunflower Help"
                      url="https://sunflower.karakabakov.com/support/"
                    />
                  </ActionPanel>
                }
              />
            ))}
        </List.Section>
      ))}
    </List>
  );
}
