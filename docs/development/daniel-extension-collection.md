# Raycast extension development collection

This branch contains four development candidates: Highlight AI, Blip, Cleft Notes, and Sunflower. They are public source for review and testing. They have not been released in the Raycast Store, and end-to-end verification remains incomplete.

Each package has independently installed dependencies, a portable lockfile, passing build/lint/type checks, and meaningful automated adapter tests. Its TESTING.md records observed app behavior and remaining live checks.

| Package | Current limitation |
| --- | --- |
| Highlight AI | A working official installer and actual app/Raycast control tests are still needed. |
| Blip | Replacement file-preparation helpers, cancellation, settings, and actual Raycast handoff tests remain pending. The commands prepare files; sending is a separate user action. |
| Cleft Notes | Genuine native text capture/export and shortcut imports were checked. Raycast export access and voice recording workflows remain pending. |
| Sunflower | Twelve native controls were checked using a disposable disk. Actual Raycast command execution remains pending. |

The wider collection is being developed separately. Public development source, verified functionality, official publication, and announcement emails are separate milestones.
