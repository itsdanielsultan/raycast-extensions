import { Detail } from "@raycast/api";
import { LibraryProblem } from "./components/library-problem";
import { NoteDetail } from "./components/note";
import { useLibrary } from "./lib/use-library";

export default function Command() {
  const { library, error, isLoading } = useLibrary();
  if (error) return <LibraryProblem error={error} />;
  if (isLoading) return <Detail isLoading />;
  if (library?.limited || library?.skipped) {
    return (
      <LibraryProblem
        error={
          new Error(
            "Some exports could not be read, so the latest note cannot be determined reliably. Choose a smaller Cleft export folder or resolve file access, then retry.",
          )
        }
      />
    );
  }
  const note = library?.notes[0];
  if (!note)
    return (
      <LibraryProblem
        error={new Error("No Cleft notes are exported in this folder yet.")}
      />
    );
  return <NoteDetail note={note} transcript />;
}
