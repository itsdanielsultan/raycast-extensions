# Cleft Notes testing

## Verification status

The extension builds, passes TypeScript and Raycast lint validation, and passes ten automated tests. A disposable note created and processed in Cleft produced a genuine Local Sync export that the extension's actual reader parsed and searched successfully. All three signed shortcut templates were previewed in Apple Shortcuts, recognized as native Cleft actions, imported, and read back with the expected default names.

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
4. Create a disposable text note containing a unique test phrase. Save it in Cleft, verify processing completes, and verify the `.md` export appears. Search that phrase in Raycast, read the transcript and summary, copy the disposable text and read it back, and check **Read Latest Transcript** against the newest export. Apply a disposable tag and verify the filter after refreshing.
5. With microphone permission already established and controlled test audio available, run **Start Voice Note** from Raycast. Confirm the Cleft timer is running. Run **Stop and Save Recording**, then confirm that Cleft saved and processed the disposable note. Continue only after confirming that the disposable note is Cleft's latest note; stop again and verify the appended result.
6. If audio export is enabled, verify **Play Exported Audio** opens the disposable companion recording.
7. Clean up only the disposable test notes through a reversible app action. Preserve the app's original one-way exports while observing its cleanup behavior.

## Permissions and setup

Cleft requires sign-in and microphone access for recording. Raycast needs access to the exact Local Sync export folder. If a scoped folder permission prompt appears, grant that folder only as intended. A failure to read a sandbox folder from another process does not prove Raycast itself lacks access; test the Raycast worker separately. No Cleft cloud API credential is required.

Stop a live test if a new permission prompt, unavailable test input, or unconfirmed recording state prevents a controlled capture. Resolve that concrete setup requirement before recording.

## Sources

- [Cleft Shortcuts integration](https://learn.cleftnotes.com/user-guides/integrations/apple-shortcuts/overview)
- [Cleft Local Sync format and behavior](https://learn.cleftnotes.com/user-guides/integrations/local-sync/overview)
- [Cleft macOS guide](https://learn.cleftnotes.com/user-guides/macos)
- [Apple Shortcuts command-line guide](https://support.apple.com/guide/shortcuts-mac/run-shortcuts-from-the-command-line-apd455c82f02/mac)
