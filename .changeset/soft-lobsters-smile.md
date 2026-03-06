---
"deemix": patch
---

Add a fallback for Spotify public playlists that return 404 from the playlist API by parsing track IDs from the public playlist page and resolving tracks individually.

This also improves Spotify playlist link parsing and error code extraction from SDK error messages.
