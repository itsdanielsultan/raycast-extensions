# Verification status

This is development source, with real Highlight AI and Raycast worker testing still pending.

## Passed

- Independent dependency installation from the portable package lock.
- Raycast production build, TypeScript, lint, manifest, icon, and formatting checks.
- Five static tests covering app identity/path validation, shell-safe argument boundaries, rejection of arbitrary control injection, rejection of similarly named apps with the wrong bundle ID, and identity validation before native UI access.
- Native JXA helper compilation.
- Missing-app and similarly named-app rejection before key delivery.
- Read-only process/window guard syntax check and a source review.

The command keeps its view available while its native helper runs by using Raycast's suspended Pop to Root behavior. A shortcut acknowledgment is reported only as a shortcut request, never as a completed task, sent message, or successful search result.

An official download candidate for Highlight 1.3.284 (Apple silicon) has bundle ID `tv.medal.highlight`, bundle name `Highlight`, and executable `Highlight`. The helper now requires that exact identity before any native UI access. The safety tests evaluate only its pure identity predicate and inspect operation order; they do not execute the native helper or interact with the app. Obtaining an installer candidate does not establish sign-in or control success.

## Required before a working release

1. Complete signature/notarization inspection of the official installer candidate before authorized installation and existing-account setup.
2. Confirm the installed app matches the expected identity and has a visible assistant panel with default documented hotkeys.
3. Run Open Highlight Search, Start New Chat, and Open Task Capture from actual Raycast. Observe the intended native UI outcomes, including an unsent task composer.
4. Verify the missing-app setup view and permission/error recovery in Raycast.

No private application database, capture API, or undocumented URL scheme is used. The package does not send captured text or files, sign in automatically, submit tasks/messages, or alter privacy settings. The native app's own account and context settings remain the user's choice.

## Development

Use Node 22.18 or later. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Start `npm run dev` to import into Raycast for live testing. A successful build is not proof of an app workflow.
