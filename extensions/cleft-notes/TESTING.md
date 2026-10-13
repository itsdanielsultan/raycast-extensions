# Cleft Notes testing

## Verification status

The extension builds, passes TypeScript and Raycast lint validation, and passes eleven automated tests. A disposable note created and processed in Cleft produced a genuine Local Sync export that the extension's actual reader parsed and searched successfully. All three signed shortcut templates were previewed in Apple Shortcuts, recognized as native Cleft actions, imported, and read back with the expected default names.

The following still need live verification in Raycast:

- Reading the original active Cleft export folder from the Raycast worker.
- Searching, filtering, opening summaries and transcripts, copying text, and playing exported audio in Raycast.
- Starting, stopping, and continuing a disposable voice note through Raycast, with Cleft recording and processing outcomes visibly confirmed.

Shortcut import or a successful build does not establish those outcomes. A completed native shortcut establishes execution by macOS; check Cleft for recording, processing, and saved-note state.

## Automated checks

```sh
npm ci
npm run build
npm run lint
npm run typecheck
npm test
```

Tests cover Cleft's documented YAML/Markdown format, quoted titles, UTC dates, transcript-only search, tags, accent-insensitive multi-term search, foreign or malformed files, nested exports, optional audio, symlinks, file-size limits, missing folders, exact native process arguments, missing-shortcut handling, propagated failures, and shortcut filenames matching their imported default names.

## Live test procedure

1. Install the development extension with `npm run dev` and open **Configure Cleft Integration** in Raycast.
2. Install the three signed shortcut templates. In their previews, verify that each contains exactly one native Cleft action. Keep the default names or set the corresponding extension preference.
3. In Cleft, confirm sign-in and wait for notes to load. Confirm that no recording is already running. In **Settings → Local Sync**, enable **Save notes as files**, obtain the exact active folder with **Show path**, and choose that folder in the extension's settings. Backfill existing notes only if you want them searchable.
4. Reuse an existing genuine disposable export when available; a new note is unnecessary for the reader checks. Search its known test phrase in Raycast, read the transcript and summary, copy the disposable text and read it back, and check **Read Latest Transcript** against the newest export actually present. Test a tag already in that export if available. If no disposable export exists, create a disposable text note, save it in Cleft, verify processing completes, and confirm the `.md` file appears. An exported copy can remain searchable after its source note is archived.
5. With microphone permission already established and controlled test audio available, run **Start Voice Note** from Raycast. Confirm the Cleft timer is running. Run **Stop and Save Recording**, then confirm that Cleft saved and processed the disposable note. Continue only after confirming that the disposable note is Cleft's latest note; stop again and verify the appended result.
6. If audio export is enabled, verify **Play Exported Audio** opens the disposable companion recording.
7. Clean up only the disposable test notes through a reversible app action. Preserve the app's original one-way exports while observing its cleanup behavior.

## Permissions and setup

Cleft requires sign-in and microphone access for recording. Choose the exact active Local Sync folder using the extension's **Local Sync Folder** directory picker; this stores a path and does not itself confirm read access. On a read error, use **Retry Reading Folder** (`⌘R`) after correcting the selection or resolving an intended scoped prompt. Retry reads the current preference again. If a macOS access request appears, check that it concerns Raycast and the intended Cleft folder; if the error persists, record the exact wording before changing broader access. A failure to read a sandbox folder from another process does not prove Raycast itself lacks access; test the Raycast worker separately. No Cleft cloud API credential is required.

Stop a live test if a new permission prompt, unavailable test input, or unconfirmed recording state prevents a controlled capture. Resolve that concrete setup requirement before recording.

## Sources

- [Cleft Shortcuts integration](https://learn.cleftnotes.com/user-guides/integrations/apple-shortcuts/overview)
- [Cleft Local Sync format and behavior](https://learn.cleftnotes.com/user-guides/integrations/local-sync/overview)
- [Cleft macOS guide](https://learn.cleftnotes.com/user-guides/macos)
- [Apple Shortcuts command-line guide](https://support.apple.com/guide/shortcuts-mac/run-shortcuts-from-the-command-line-apd455c82f02/mac)
