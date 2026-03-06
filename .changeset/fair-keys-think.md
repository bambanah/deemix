---
"deemix": patch
---

Improve Spotify public playlist fallback reliability and fix playlist post-processing completion.

- Expand public playlist fallback by merging track IDs from Spotify's embed page when standard page data is truncated.
- Ensure collection post-download tasks continue when one track entry is missing, so playlist files (`.m3u8`) are still created.
