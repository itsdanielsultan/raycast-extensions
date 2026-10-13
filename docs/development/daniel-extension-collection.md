# Raycast extension development collection

This branch contains four development candidates: Highlight AI, Blip, Cleft Notes, and Sunflower. They are public source for review and testing. They have not been released in the Raycast Store, and end-to-end verification remains incomplete.

Each package has independently installed dependencies, a portable lockfile, passing build/lint/type checks, and meaningful automated adapter tests. Its TESTING.md records observed app behavior and remaining live checks.

| Package | Observed workflows and remaining checks |
| --- | --- |
| Highlight AI | The official signed and notarized app was installed and its identity verified. Login, app setup, privacy permissions and actual Raycast controls remain pending. |
| Blip | Actual Raycast file and Finder-selection handoffs reached the recipient picker with disposable fixtures; duplicate items and an already-open picker were handled. Settings actions passed with Settings already open. Starting from the hidden popover timed out; the revised bounded query still requires a live check. No files were sent. |
| Cleft Notes | Genuine native text capture/export and shortcut imports were checked. Setup errors permit retry, and incomplete scans are identified. Raycast export-folder access, audio/voice workflows and full command acceptance remain pending. |
| Sunflower | Three actual Raycast command paths refused an unavailable action, changed List/Largest views, and rescanned a disposable volume to find a new marker. Every exposed individual action and remaining error paths still need command-level acceptance. |

The wider collection is being developed separately. Public development source, verified functionality, official publication, and announcement emails are separate milestones.
