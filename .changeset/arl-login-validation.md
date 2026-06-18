---
"deemix-webui": patch
---

Validate and sanitize the ARL on login. Surrounding whitespace/newlines are now stripped, and an ARL containing non-hex characters (e.g. a whole cookie row pasted from DevTools) is rejected with a clear "Invalid ARL" message instead of failing silently as a generic "Couldn't log in".
