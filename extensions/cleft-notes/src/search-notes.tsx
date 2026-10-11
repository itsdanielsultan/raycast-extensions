import { Action, ActionPanel, Icon, Keyboard, List } from "@raycast/api";
import { useState } from "react";
import { LibraryProblem } from "./components/library-problem";
import { NoteActions } from "./components/note";
import { searchNotes } from "./lib/notes";
import { useLibrary } from "./lib/use-library";

export default function Command() {
  const { library, error, isLoading, refresh } = useLibrary();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  if (error) return <LibraryProblem error={error} />;
  const notes = library?.notes ?? [];
  const matches = searchNotes(notes, query, tag);
  const tags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort(
    (a, b) => a.localeCompare(b),
  );
  const subtitle = `${matches.length} matches${matches.length > 200 ? "; showing first 200, refine your search" : ""}${library?.skipped ? `; ${library.skipped} unreadable or oversized files skipped` : ""}${library?.limited ? "; folder exceeds search limits" : ""}`;
  return (
    <List
      isLoading={isLoading}
      filtering={false}
      searchText={query}
      onSearchTextChange={setQuery}
      searchBarPlaceholder="Search titles, summaries, transcripts, and tags…"
      searchBarAccessory={
        <List.Dropdown tooltip="Filter by tag" value={tag} onChange={setTag}>
          <List.Dropdown.Item title="All Tags" value="" />
          {tags.map((value) => (
            <List.Dropdown.Item title={value} value={value} key={value} />
          ))}
        </List.Dropdown>
      }
    >
      <List.EmptyView
        title={notes.length ? "No Matching Notes" : "No Cleft Exports Found"}
        description={
          notes.length
            ? "Try a shorter phrase or another tag."
            : "Use Save existing notes as files in Cleft Local Sync settings, then refresh."
        }
        actions={
          <ActionPanel>
            <Action
              title="Refresh Notes"
              icon={Icon.ArrowClockwise}
              onAction={refresh}
              shortcut={Keyboard.Shortcut.Common.Refresh}
            />
            <Action.OpenInBrowser
              title="Read Local Sync Guide"
              url="https://learn.cleftnotes.com/user-guides/integrations/local-sync/overview"
            />
          </ActionPanel>
        }
      />
      <List.Section title="Cleft Notes" subtitle={subtitle}>
        {matches.slice(0, 200).map((note) => (
          <List.Item
            key={note.path}
            title={note.title}
            subtitle={note.tags.map((value) => `#${value}`).join(" ")}
            icon={Icon.Document}
            accessories={[{ date: note.created, tooltip: "Created" }]}
            actions={
              <ActionPanel>
                <NoteActions note={note} />
                <Action
                  title="Refresh Notes"
                  icon={Icon.ArrowClockwise}
                  onAction={refresh}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
