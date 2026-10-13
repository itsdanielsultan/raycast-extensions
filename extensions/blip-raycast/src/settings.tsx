import {
  Action,
  ActionPanel,
  Icon,
  List,
  PopToRootType,
  Toast,
  environment,
  popToRoot,
  showHUD,
  showToast,
} from "@raycast/api";
import {
  hideRaycastForHandoff,
  openSettings,
  type SettingsPane,
} from "./lib/blip";
import { useRef } from "react";
import { settingsFailure } from "./lib/settings-errors";

const panes: { name: SettingsPane; subtitle: string; icon: Icon }[] = [
  {
    name: "General",
    subtitle: "Save location, sounds, auto-accept and speed limits",
    icon: Icon.Gear,
  },
  {
    name: "Devices",
    subtitle: "Manage your linked devices",
    icon: Icon.Desktop,
  },
  { name: "Profile", subtitle: "Manage your Blip profile", icon: Icon.Person },
  {
    name: "Help",
    subtitle: "App help and diagnostics",
    icon: Icon.QuestionMarkCircle,
  },
];

export default function Command() {
  const opening = useRef(false);
  async function open(pane: SettingsPane) {
    if (opening.current) return;
    opening.current = true;
    let toast: Toast | undefined;
    try {
      toast = await showToast({
        style: Toast.Style.Animated,
        title: `Opening Blip ${pane}`,
      });
      await openSettings(pane, hideRaycastForHandoff);
      await toast.hide();
      await popToRoot();
    } catch (error) {
      const failure = settingsFailure(error);
      await toast?.hide().catch(() => undefined);
      if (environment.isDevelopment) {
        console.warn("Blip Settings failed", { reason: failure.kind });
      }
      await showHUD(failure.message, {
        popToRootType: PopToRootType.Suspended,
      });
    } finally {
      opening.current = false;
    }
  }
  return (
    <List searchBarPlaceholder="Search Blip settings…">
      {panes.map((pane) => (
        <List.Item
          key={pane.name}
          title={pane.name}
          subtitle={pane.subtitle}
          icon={pane.icon}
          actions={
            <ActionPanel>
              <Action
                title={`Open Blip ${pane.name}`}
                icon={Icon.Gear}
                onAction={() => open(pane.name)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
