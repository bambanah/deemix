---
"deemix": minor
---

Add `%bitrate%` template variable to track and playlist name generators

The `%bitrate%` variable (resolving to `FLAC`, `320`, `128`, etc.) was previously only available in album folder names (`generateAlbumName`) and download object names (`generateDownloadObjectName`).

This adds support for `%bitrate%` in:
- `generateTrackName()` — used by `tracknameTemplate`, `albumTracknameTemplate`, and `playlistTracknameTemplate`
- `generatePlaylistName()` — used by `playlistNameTemplate`

The value reflects the actual downloaded quality after any bitrate fallback, ensuring files are always organized in the correct quality folder.
