---
"deemix-webui": minor
---

Support serving the web UI under a base path without any configuration: asset URLs are emitted document-relative and the mount prefix is derived client-side from the document URL, so the app works behind a reverse proxy subfolder and in any other prefix-mounting setup. Serving from the root keeps the previous behavior.
