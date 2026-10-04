---
"deemix": patch
"deemix-webui": patch
---

Fix queue-poison crash when a completed item sits at the head of `queue/order.json`. Completed items are persisted in slimmed form (without their `single`/`collection` payload), so replaying them through `startQueue` built a `Collection` with `collection === undefined` and crashed `Downloader.start` at `collection.tracks.length`, paralyzing the whole queue on every login. `startQueue` now skips entries that are already completed or lack a download payload (keeping their saved state), the `Collection` constructor defaults a missing payload to `{ tracks: [] }`, and `Downloader.start` guards the `tracks` access.
