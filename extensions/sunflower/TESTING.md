# Sunflower testing

Date: October 10, 2026 (America/Toronto).

## Identity and integration

- The integration targets Gjorge Karakabakov's Sunflower disk space analyzer.
- Official sources: [product](https://sunflower.karakabakov.com/), [support](https://sunflower.karakabakov.com/support/), [release notes](https://sunflower.karakabakov.com/whats-new/).
- Official Sunflower 1.2 download: `https://sunflower.karakabakov.com/downloads/Sunflower.dmg`.
- Download SHA-256 matched the published value: `144ceee92336acc58b619a1bde3163bf462221d8ac48160ec606ef93c2b38eaf`.
- Read-only bundle inspection: `com.sunflower.app`, version 1.2/build 3, macOS 15+, arm64. Code signature verification passed; Developer ID Application: Gjorge Karakabakov (`LEAXQ5K9CK`); notarization ticket is stapled.
- The package has no URL handlers or scripting dictionary resources. No public scan-data API or App Intents integration was found in the official documentation or bundle. Private debug flags and saved-scan formats are not used.
- Version 1.2 release notes document native menu and keyboard controls for six views, navigation, Rescan, Quick Look, and Reveal in Finder. These are the integration surface.
- Official `raycast/extensions` top-level extension tree inspected via GitHub API; `truncated: false`; no Sunflower extension. Existing `disk-usage` is an independent scanner. Raycast already offers launching and Search Menu Bar Items.

## Automated checks passed

- TypeScript: `npm run typecheck`.
- Tests: `npm test`, 4 passed. Explicit native acknowledgement required before success; unavailable/permission results remain failures; unknown command rejected; deletion actions excluded.
- Native script: `osacompile` succeeded.
- Lint, manifest, icon, and formatting: `npm run fix-lint` passed.
- Raycast build: `npm run build` compiled all 3 entry points, generated definitions, and passed its TypeScript check.
- Distribution build writes to the extension's own ignored `dist/` folder via `ray build -e dist -o dist`. The compiled output includes the native script and icon assets.
- Icon is 512 × 512 PNG, derived from the official app bundle.
- Standalone npm lockfile has no linked or outside-package dependency entries. A clean `npm ci --ignore-scripts` installed an independent dependency tree; TypeScript, all 4 tests, lint/manifest/icon/formatting, and the distribution build passed against that tree.
- Source safeguard: closing Raycast uses `PopToRootType.Suspended`, supported by the installed `@raycast/api` 2.7.3 declarations, to keep the view worker alive while the native menu helper finishes even when the user's Pop to Root Search setting is immediate. This is a source-level safeguard; the actual Raycast worker workflow remains unverified.
- After that safeguard, TypeScript, Raycast lint/manifest/icon/formatting checks, the distribution build, and verification-document formatting were rechecked and passed.

## Live native-app checks passed

Sunflower 1.2 was launched from its verified, read-only mounted official disk image. It was not installed into Applications. Onboarding was continued without granting Full Disk Access.

The following checks used the live macOS Accessibility tree through computer-use tools, rather than a mock or saved screenshot:

- Menu names match every implemented mapping exactly. File: Rescan, Quick Look, Reveal in Finder. View: Rings, Treemap, List, Largest, Kinds, Untouched. Go: Back, Forward, Enclosing Folder.
- Before a scan, all twelve applicable native actions were disabled. After a completed scan, all six view actions were enabled. Quick Look and Reveal remained disabled until an item was selected.
- A private 8 MiB HFS+ sparse disk image containing `TestFolder/sample.txt` and `TestFolder/Nested/other.txt` was created for testing. Sunflower's disk picker recognized **Sunflower Verification**. The final scan used the standard `/Volumes/Sunflower Verification` mount, and its List and Largest views showed the two disposable files.
- Each of the six View menu actions was invoked and the app's selected view changed accordingly. Kinds reported the two test documents; Untouched correctly showed that all disposable contents had changed within the last year.
- Rescan was accepted through the enabled File menu action. Its request returned to the disk view for Sunflower Verification.
- Back returned from TestFolder to the verification volume; Forward returned to TestFolder; Enclosing Folder returned to the verification volume.
- Quick Look displayed the actual disposable sample text. Reveal in Finder opened TestFolder with `sample.txt` selected.
- The created Finder and scan windows were closed after testing, and the disposable volume was unmounted successfully.

The first scan attempt used a custom mount point under the scratch directory and stayed at **Looking around…**. Closing that test window and remounting the same image in the standard `/Volumes` location resolved it. This is a test-environment observation, rather than a claim about supported formats or a vendor defect. Sunflower also displayed a disk-access warning with a total larger than the disposable volume; the test did not grant access or rely on that number.

No user files were deleted, caches reclaimed, apps uninstalled, administrator helper installed, or additional permissions granted. There was no external transmission, publication, or email.

## Actual Raycast representative workflows

On October 13, 2026, the verified official app was available in Applications and the frozen development package was imported during an exclusive test window. Native Raycast displayed all three commands.

Passed with a disposable 8 MiB verification volume:

- Before scanning, **Show Largest Files** displayed the actual Raycast failure HUD with actionable unavailable-state guidance.
- **Show Largest Files** changed the completed fixture scan from List to Largest and displayed the known disposable file paths.
- **Control Sunflower** displayed its searchable list; **Show List** changed Largest back to List.
- After adding a synthetic marker to the fixture, **Rescan Disk** made the marker appear in the live scan. This confirmed a fresh scan beyond menu acknowledgment.

The volume initially mounted with `-nobrowse` was omitted from the app's disk list. A plain `hdiutil attach` mount followed by **File → New Window** displayed the verification volume. Only that explicitly labelled disk was selected. The user disk's scan button and Full Disk Access control were not used.

The two extra test windows were closed with observed app controls, the original Ready to Scan window was preserved, the synthetic marker was moved to private recovery, the fixture volume was ejected, and the development process was stopped. Raycast returned to empty root search. No user file, clipboard, or new permission was changed.

All three entry points have representative real-worker proof. Still required before a complete working release:

1. Run the remaining individual view, navigation, Quick Look and Reveal controls from Raycast against the disposable volume; native mapping tests alone do not prove every Raycast action.
2. Verify missing-app and permission-recovery behavior, obtaining user assistance for any specific new security prompt.
3. Exercise immediate Pop to Root behavior and confirm the suspended worker completes the handoff.

## Release gate

**Not fully verified.** Automated checks, native menu behavior, and representative Raycast workflows passed; remaining individual controls and recovery cases are pending. Publication does not change this verification status.
