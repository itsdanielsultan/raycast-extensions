# Blip testing status

Mac development candidate for the existing `blip-raycast` package. Automated validation passes. Actual Raycast checks passed for core transfer preparation. All four existing-window settings panes passed on the previous helper revision, while hidden startup timed out twice. The new bounded helper is statically checked but has not been executed in the app. Windows support is not claimed.

## Passed independent checks

- Standalone registry dependency installation from the lockfile; no local dependency paths or borrowed dependency directories.
- Raycast build, TypeScript checks, ESLint/formatting checks, manifest validation, and 512×512 icon validation.
- Seven tests cover readable file/folder batches, duplicates and unusual names, invalid/missing selections, native error-code parsing, redaction of unknown payloads, permission/time-limit distinction, and retention of safe stage reasons across the command boundary.
- Existing package name and both original command IDs were compared with the current upstream `main` manifest; no duplicate alias commands are present. The manifest and lock roots both use `blip-raycast`, retain original credits, and claim only macOS.
- Both native AppleScript assets compile. Zero-file and invalid-settings-pane calls fail before interacting with an app.
- Public package content and source scans exclude private account/contact data, credentials, machine-specific user paths, and the private verification record.

## Observed app behavior

Manual inspection on Blip for Mac 1.2.3 confirmed its real Settings gear/menu, Settings window, and General, Profile, Devices, and Help toolbar panes. No preferences were changed and no files were sent.

Later packaged-command checks reached Profile and Devices while Blip Settings was already open. A General action from a hidden popover closed Raycast, but Settings did not visibly open automatically. Manual gear → Settings… subsequently opened General. The helper's exit status and output were not captured, so this observation does not establish which startup stage failed. Opening an already-existing Settings window bypasses that startup path.

An earlier direct native Services experiment opened Blip's picker but left disposable items unresolved. That helper was removed. The current implementation uses the established Finder Service path and checks complete Finder selection before invoking it. A fresh coordinated Raycast slot verified the replacement helper for the disposable fixtures described below.

## Passed coordinated Raycast workflows

- Form preparation of one disposable file showed the correct fixture name, 35 bytes, and an enabled **Find People & Devices** field.
- Retrying with the existing picker open was correctly blocked by an actual Raycast HUD message.
- Form preparation of a same-folder file plus a nonempty folder showed two items totaling 77 bytes and an enabled recipient search field. A duplicate file entry was deduplicated.
- The Finder-selection command prepared the same two-item, 77-byte batch.
- General and Help navigated successfully with Blip Settings already open. Together with the prior Profile/Devices checks, all four existing-window settings routes passed on the previous helper revision. They must regress again on the new bounded revision.
- All test pickers were closed. No recipient was selected, no files were sent, and no preferences were changed.

The hidden-popover General route reproduced the lack of a visible Settings window. Two subsequent runs logged the safe development reason `timeout`, showing that the 15-second subprocess limit terminated startup. Manual gear → Settings… opened live Settings. The broad global Accessibility traversal is a concrete performance concern; the exact failing query and the new helper’s behavior still require live observations.

## Failure observability

The command previously updated a progress toast after Raycast had been hidden, leaving the failing branch without readable feedback. It now hides that toast and shows a HUD reason. Known helper stage codes map to allowlisted, actionable messages for unavailable Settings button, menu item, or window/pane; permissions and helper termination have separate reasons. Unknown errors get a safe fallback.

Extension feedback uses only allowlisted messages. In development only, a fixed reason key is logged without the native command, stderr, paths, account data, or UI contents. The privacy/error-protocol tests pass. Two actual hidden-state runs produced only the fixed development reason `timeout` and no Settings window. The failure HUD was not visually captured; no visible-HUD pass is claimed.

## New bounded Settings helper — not yet live verified

The new revision replaces repeated global Accessibility tree scans with direct-child, role-filtered traversal of the observed popover/container and Settings gear. The menu search stays within that gear and its immediate observed container; only the known **Settings…** menu item is targeted. Only container roles are traversed; scroll areas, lists, tables, text fields, and images are excluded from descent. The gear query asks for a button matching the known Settings description. The helper does not request account-field values or record UI text; the native filtering implementation may inspect control metadata. A group-backed row can still be visited for role metadata within the bounds, so the exact tree scope requires live verification.

Explicit limits are eight process roots, sixteen direct children per queried container, depth four, forty-eight visited nodes per scan, and 240 queries for the request. Application/Accessibility operations have a one-second Apple-event response timeout. Gear, menu, and window phases have three-second elapsed checks, within a ten-second helper deadline and the existing fifteen-second subprocess cap. Apple-event timeout stops waiting; it does not guarantee cancellation of a target-side operation.

Query timeout, helper deadline, and scope-limit outcomes now have separate safe reason keys. These bounds and parsing pass compilation/static checks, not native execution. The unchanged prior publication snapshot is not silently replaced by this revision; a working-release claim for this revision requires fresh live checks. The checked development source can be published with these limitations.

## Readiness check limits

The transfer helper currently accepts a window whose title matches the expected item count or single-file name and which contains any enabled text field. That is a heuristic; it does not identify the recipient search field specifically, inspect the resolved item identities, or independently prove that every file resolved. An old matching picker is rejected before invocation. Fresh fixture checks independently confirmed the single-file name, expected batch count and combined size, previews, and enabled recipient search field; the implementation remains a heuristic and has not been exhaustively verified against every possible window/input state.

The readiness loop now uses a 15-second elapsed cutoff checked between Accessibility queries. An individual query can extend beyond that check, and the command's overall subprocess timeout remains 30 seconds. The former 150-iteration loop did not establish a 15-second elapsed deadline because query time was additional. The elapsed-cutoff source was used in the successful coordinated fixture runs; timeout/error behavior beyond those runs remains to be checked.

The settings helper returns a pane label after clicking the matching toolbar button; the returned label alone is not a visible-pane postcondition. The recorded General, Help, Profile, and Devices outcomes were verified independently in the app with Settings already open on the previous helper revision.

## Required native checks

Use disposable fixtures and never select a recipient during preparation tests.

1. Core single-file and same-folder batch preparation passed. Still test missing/deleted items, partial cross-folder selection, cancellation recovery, and timeout behavior. Capture sanitized helper reasons and visible fixture names when exercising failures.
2. The existing-picker guard passed. Verify that other window/input states cannot satisfy the generic readiness heuristic without the intended resolved items.
3. All four settings panes passed with Settings already open on the previous revision. Regress all four existing-window routes and hidden-popover startup using the new bounded helper and safe reason. Capture the returned reason and safe helper exit information, plus the gear/menu/window state after activate, reopen, gear click, and Settings… click. Record any existing hidden/minimized Settings window before the run. Avoid capturing private stderr/UI/account contents in public evidence. Do not diagnose startup from Raycast closing alone.

## Required Raycast checks

Import using `npm run dev` only when the current Raycast editor is safe to leave. Preserve unfinished input. Run:

- `send-to-blip` — **Prepare Blip Transfer**: core form single-file/batch and duplicate-entry flows passed. Remaining checks include full Finder prefill, missing/deleted-item errors, and double-submit prevention.
- `send-selected-finder-item` — **Prepare Finder Selection in Blip**: the two-item selected batch passed. Remaining checks include missing selection/app, permission errors, and cancellation recovery.
- `settings` — **Blip Settings**: all four existing-window panes passed on the previous helper. The new bounded helper, hidden startup, visible failure HUD, and unavailable-control recovery remain pending.

Exercise immediate Pop to Root behavior to verify the suspended-worker handoff. Check permission failures without silently granting new system access. Real app preparation, app sending, and Raycast command success are separate outcomes; no actual send is required for these preparation commands.

The manifest expects the development namespace `itsdanielsultan/blip-raycast` after import. The two original command IDs are retained; no duplicate alias commands are included. The migrated package was imported and its commands executed in Raycast; individual deep-link URLs have not been separately tested.

## Release condition

Complete the native and Raycast checks before claiming a working release. Public source can show the candidate's current status; an automated pass alone is not evidence of end-to-end app behavior.
