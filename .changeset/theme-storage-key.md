---
"deemix-webui": patch
---

Store the selected theme under a dedicated `deemix-selectedTheme` localStorage key instead of the unnamespaced `selectedTheme`, which other applications embedded on the same origin may also occupy - leaving the embedded UI without any theme.
