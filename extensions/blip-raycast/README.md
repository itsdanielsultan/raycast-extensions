# Blip

Mac development candidate for the existing `blip-raycast` package. It prepares file batches in Blip and navigates its settings panes from Raycast. The automated checks pass. Actual Raycast checks passed for single-file and file/folder preparation, the Finder-selection command, and the existing-picker guard. The previous settings helper passed all four panes with Settings already open, but hidden startup timed out twice. A new bounded settings helper is statically checked and still requires live verification. See [TESTING.md](TESTING.md) before relying on this package.

| Command                          | Behavior                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Prepare Blip Transfer            | Pick files and folders together, optionally filled from the full Finder selection. |
| Prepare Finder Selection in Blip | Prepare every selected Finder item.                                                |
| Blip Settings                    | Open General, Devices, Profile, or Help.                                           |

## Setup

1. Install [Blip for Mac](https://blip.net/download) and open it once.
2. Install this development extension using the steps below.
3. Enable Raycast in System Settings → Privacy & Security → Accessibility.
4. Allow the expected Finder, Blip, and System Events controls in System Settings → Privacy & Security → Automation if macOS requests them.
5. Enable **Blip…** in System Settings → Keyboard → Keyboard Shortcuts → Services if its Service is unavailable.

## Transfer preparation

The extension reveals and selects your chosen items in Finder, checks that every item remains selected, and invokes Blip's installed **Blip…** Service. Finder selection changes as part of this handoff. If Finder cannot retain the complete batch, put the items in one folder or select them together in Finder and try again.

The helper currently uses a matching picker title and an enabled text field as a readiness heuristic. Live fixture checks showed the expected resolved file/folder items and enabled recipient search field. The implementation still uses a generic title/text-field heuristic rather than identifying those fields directly. If a matching picker is already open, finish or close it before starting another preparation. See the live-test limits in [TESTING.md](TESTING.md).

You choose the recipient and complete the transfer in Blip. These commands do not choose recipients or send automatically.

## Settings

The settings command targets Blip's actual Settings gear/menu and toolbar through macOS Accessibility. The previous helper passed General, Devices, Profile, and Help with Settings already open. Its hidden-startup path exceeded the subprocess limit. The new helper uses shallow, scoped queries around the observed Settings gear/menu, with per-query and overall limits; it remains unverified in the app. Until verified, open Blip’s Settings gear → Settings… manually. Failure reasons are sanitized; development diagnostics record only a fixed key. A visible failure HUD has not yet been independently captured. It does not use guessed URL routes or private APIs.

## Development

Requires macOS, Raycast, and Node.js 22.18 or newer. This candidate does not claim Windows support.

```sh
npm ci
npm run build
npm run lint
npm run typecheck
npm test
npm run dev
```

`npm run dev` imports the commands into Raycast. Build and test success establish source correctness only; native app and actual Raycast workflows have separate verification records.

## Existing integration and license

[Aaron's existing Blip extension](https://www.raycast.com/astroboii47/blip-raycast) uses Finder Services to stage one item. Its [source](https://github.com/raycast/extensions/tree/main/extensions/blip-raycast) informed this integration under the MIT license. This candidate adds complete-batch checks, readiness checks, and settings-pane navigation. This is an update candidate for that existing package, not a second extension. The original command IDs `send-to-blip` and `send-selected-finder-item` are preserved with clearer Prepare titles; the only additional command is `settings`.

Source is MIT licensed. Upstream attribution is preserved in [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Blip's name and icon belong to Blip Studio Inc.; this is an independent integration.
