---
"deezer-sdk": patch
---

Fix crash in `mapGwTrackToDeezer` when Deezer GW API returns tracks without `MEDIA` or `EXPLICIT_TRACK_CONTENT` fields. Added optional chaining to prevent "Cannot read properties of undefined (reading 'HREF')" error when downloading albums.
