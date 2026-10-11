import {
  Action,
  ActionPanel,
  Detail,
  Icon,
  openExtensionPreferences,
} from "@raycast/api";

export function LibraryProblem({ error }: { error?: Error }) {
  const denied = error && /EACCES|EPERM|not permitted/i.test(error.message);
  return (
    <Detail
      markdown={`# ${denied ? "Allow Raycast to read Cleft exports" : "Connect your Cleft notes"}\n\n${denied ? "macOS blocked access to the export folder. Use the active Local Sync folder and allow Raycast access in System Settings → Privacy & Security if macOS prompts you." : "Search uses Cleft’s Local Sync Markdown files. Open Cleft Settings → Local Sync, enable Save notes as files, and use Show path to find the active folder. Choose that folder in this extension’s settings."}\n\nUse **Save existing notes as files** in Cleft to include older notes. Search is read-only, and edits to exported copies do not sync back to Cleft.\n\n${error && !denied ? `**Status:** ${error.message}` : ""}`}
      actions={
        <ActionPanel>
          <Action
            title="Choose Local Sync Folder"
            icon={Icon.Gear}
            onAction={openExtensionPreferences}
          />
          <Action.OpenInBrowser
            title="Read Local Sync Guide"
            url="https://learn.cleftnotes.com/user-guides/integrations/local-sync/overview"
          />
        </ActionPanel>
      }
    />
  );
}
