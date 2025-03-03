---
"deemix-cli": major
"deemix": major
"deezer-sdk": major
"deemix-gui": major
"deemix-webui": major
---

Initial major release of the deemix monorepo packages with TypeScript rewrite and enhanced error handling.

BREAKING CHANGES:

- Complete restructure of the codebase into a TypeScript-based monorepo
- New modular package architecture:
  - `deemix`: Core library with improved track streaming and decryption
  - `deemix-cli`: Enhanced CLI with robust bitrate handling and error validation
  - `deemix-gui`: Desktop application
  - `deemix-webui`: Web interface
  - `deezer-sdk`: TypeScript SDK with expanded track information
- API Enhancements:
  - Added `downloadURL` property to `APITrack` interface
  - Improved type definitions and removed redundant comments
  - Enhanced error handling for track downloads and streaming
- Improved Input Validation:
  - Strict bitrate parsing and validation
  - ARL token validation and error handling
  - Robust error handling for invalid download objects
- Download System Improvements:
  - Enhanced playlist handling and M3U8 file generation
  - Better progress tracking with validation
  - Improved error logging and user feedback
- Modern Build System:
  - TypeScript-first development
  - Turbo and pnpm workspace optimization
  - Strict type checking enabled

HOW TO UPDATE:

1. For CLI users:
   - Install the new `deemix-cli` package
   - Review the new command-line options and syntax
   - Note: Bitrate specifications now require valid string input
   - ARL token validation is now stricter

2. For SDK users:
   - Update to the new `deezer-sdk` package
   - Use the new `downloadURL` property in `APITrack` interface
   - Review updated type definitions for better type safety
   - Handle potential errors from new validation checks

3. For GUI/WebUI users:
   - Download the new `deemix-gui` application
   - Your existing settings will be migrated automatically
   - Expect improved error messages and download progress tracking

4. For all users:
   - Check the documentation for your specific package
   - Note that configuration files may have a new format
   - Be prepared to handle new validation errors
   - Review the error logging system for better debugging
