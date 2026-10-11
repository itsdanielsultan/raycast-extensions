import {
  Action,
  ActionPanel,
  Detail,
  environment,
  Icon,
  openExtensionPreferences,
} from "@raycast/api";
import { join } from "node:path";
import { captureActions } from "./lib/shortcuts";

export default function Command() {
  return (
    <Detail
      markdown={`# Connect Cleft to Raycast\n\n## Search and transcripts\n\nIn **Cleft Settings → Local Sync**, enable **Save notes as files**. Use **Show path** to find the active folder, then choose it in this extension’s settings. Use **Save existing notes as files** to include earlier notes. Search reads titles, tags, summaries, and transcripts from those exported copies.\n\n## Voice capture\n\nInstall the three bundled Apple Shortcuts from the action menu. Each contains one native Cleft action: **Start Recording**, **Stop Recording**, or **Continue Last Note**. Keep the suggested names, or set your own shortcut names in extension settings.\n\nCleft must be signed in and microphone access must be allowed. Start Voice Note begins capturing immediately; Continue Last Note appends to your latest Cleft note. Stop and Save Recording tells Cleft to finish the current recording.\n\nCleft handles transcription and formatting. A completed shortcut confirms macOS executed it; check Cleft for recording and processing status. New exports become available when Local Sync writes them. Use Refresh Notes to read changes.\n\nLocal Sync exports are one-way copies. This extension reads them and does not edit or delete notes.`}
      actions={
        <ActionPanel>
          <Action
            title="Choose Local Sync Folder"
            icon={Icon.Gear}
            onAction={openExtensionPreferences}
          />
          {Object.values(captureActions).map((action) => (
            <Action.Open
              title={`Install ${action.title} Shortcut`}
              key={action.file}
              target={join(environment.assetsPath, "shortcuts", action.file)}
              icon={Icon.Download}
            />
          ))}
          <Action.OpenInBrowser
            title="Read Cleft Shortcuts Guide"
            url="https://learn.cleftnotes.com/user-guides/integrations/apple-shortcuts/overview"
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
