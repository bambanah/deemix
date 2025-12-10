---
"deemix-webui": minor
---

- Added two env vars for disabling chown on container init for data and music directories: DISABLE_OWNERSHIP_CHECK_MUSIC and DISABLE_OWNERSHIP_CHECK_DATA
- Using DISABLE_OWNERSHIP_CHECK now disables chown for both directories as expected
