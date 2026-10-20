---
"deemix": patch
---

Write the m3u8 file into the album folder when every track of the album was already downloaded. The album folder was only recorded after the already-downloaded check, so a fully skipped album fell back to the download root and left a playlist file there whose entries are relative to the album folder and resolve to nothing.
