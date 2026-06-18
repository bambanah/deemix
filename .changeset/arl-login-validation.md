---
"deemix-webui": minor
---

Remove email/password login and make ARL the only login method.

Deezer blocks the legacy `auth/token` email/password endpoint (HTTP 403), so that login path could never succeed — it only ever surfaced as a generic "Couldn't log in". The email/password form, the `loginEmail` route, and the access-token plumbing have been removed, and ARL login is now shown directly in Settings.

ARL login is also hardened: surrounding whitespace/newlines are stripped, and a value containing non-hex characters (e.g. a whole cookie row pasted from DevTools) is rejected with a clear "Invalid ARL" message instead of failing silently with an opaque "Cookie failed to parse".
