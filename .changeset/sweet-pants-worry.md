---
"deemix-cli": major
"deemix": major
"deezer-sdk": major
"deemix-gui": major
"deemix-webui": major
---

Initial major release of the deemix monorepo packages.

BREAKING CHANGES:

- Complete restructure of the codebase into a monorepo
- New package architecture with separate CLI, GUI, and WebUI packages
- Updated Deezer SDK with improved TypeScript support

HOW TO UPDATE:

- If using the CLI: Install the new `deemix-cli` package
- If using the GUI: Install the new `deemix-gui` package
- If using the SDK: Update imports to use the new `deezer-sdk` package
- Review the documentation for each package for specific migration steps
