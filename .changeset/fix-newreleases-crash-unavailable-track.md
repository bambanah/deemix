---
"deemix-webui": patch
---

Fix crash in `/api/newReleases` when Deezer feed contains geo-blocked or unavailable albums. Each album is now fetched with a `.catch()` so unavailable albums are skipped with a warning instead of crashing the process.
