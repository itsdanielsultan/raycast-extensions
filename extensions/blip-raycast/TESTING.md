# Blip testing status

Mac development candidate for the existing `blip-raycast` package. Automated validation passes; replacement native helpers and actual Raycast workflows remain unverified. Windows support is not claimed.

## Passed independent checks

- Standalone registry dependency installation from the lockfile; no local dependency paths or borrowed dependency directories.
- Raycast build, TypeScript checks, ESLint/formatting checks, manifest validation, and 512×512 icon validation.
- Three tests covering readable file/folder batches, duplicates and unusual names, invalid selections, and all-or-nothing rejection when one item is missing.
- Existing package name and both original command IDs were compared with the current upstream `main` manifest; no duplicate alias commands are present. The manifest and lock roots both use `blip-raycast`, retain original credits, and claim only macOS.
- Both native AppleScript assets compile. Zero-file and invalid-settings-pane calls fail before interacting with an app.
- Public package content and source scans exclude private account/contact data, credentials, machine-specific user paths, and the private verification record.

## Observed app behavior

Manual inspection on Blip for Mac 1.2.3 confirmed its real Settings gear/menu, Settings window, and General, Profile, Devices, and Help toolbar panes. No preferences were changed and no files were sent.

An earlier direct native Services experiment opened Blip's picker but left disposable items unresolved. That helper was removed. The current implementation uses the established Finder Service path and checks complete selection plus bounded picker readiness. Compilation does not establish that this replacement works in the app.

## Required native checks

Use disposable fixtures and never select a recipient during preparation tests.

1. Prepare a same-folder file plus a nonempty folder, then one file. Verify that Blip resolves and retains every item and that the picker readiness postcondition accepts the real resolved window.
2. Verify missing/partial selection failures, cancellation recovery, and refusal of an already-open matching picker. No partial batch should reach Blip and an old picker must not count as a new success.
3. Run all four settings panes using the shipped helper. Verify actual visible pane changes from hidden-popover and already-open-settings states.

## Required Raycast checks

Import using `npm run dev` only when the current Raycast editor is safe to leave. Preserve unfinished input. Run:

- `send-to-blip` — **Prepare Blip Transfer**: verify multi-picker, full Finder prefill, missing/deleted-item errors, and double-submit prevention.
- `send-selected-finder-item` — **Prepare Finder Selection in Blip**: verify full selection, missing selection, app detection, permissions, and cancellation recovery.
- `settings` — **Blip Settings**: verify all four panes and recovery from unavailable controls.

Exercise immediate Pop to Root behavior to verify the suspended-worker handoff. Check permission failures without silently granting new system access. Real app preparation, app sending, and Raycast command success are separate outcomes; no actual send is required for these preparation commands.

The manifest expects the development namespace `itsdanielsultan/blip-raycast` after import. The two original command IDs are retained; no duplicate alias commands are included. The imported namespace itself has not yet been verified in Raycast.

## Release condition

Complete the native and Raycast checks before claiming a working release. Public source can show the candidate's current status; an automated pass alone is not evidence of end-to-end app behavior.
