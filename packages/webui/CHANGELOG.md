# deemix-webui

## 4.5.0

### Minor Changes

- 2d3aeb3: Add mobile responsive UI with hamburger menu and download sheet

## 4.4.1

### Patch Changes

- 02cdb0f: fix the update check (#238)
- 43eb13c: missing PreviewControls when hovering over the track cover
- e11cf95: center artist names (favorites tab)
- 8cb72b6: fix missing number of tracks in album during the search (#244)
- Updated dependencies [9388fd1]
  - deezer-sdk@1.10.1
  - deemix@3.13.5

## 4.4.0

### Minor Changes

- a0b3fc8: - Added two env vars for disabling chown on container init for data and music directories: DISABLE_OWNERSHIP_CHECK_MUSIC and DISABLE_OWNERSHIP_CHECK_DATA
  - Using DISABLE_OWNERSHIP_CHECK now disables chown for both directories as expected

### Patch Changes

- 49b7795: - optimize component handling with markRaw in search tabs
  - fix "change country" button on the charts page
  - add space between the buttons on the charts page
  - handle undefined MouseEvent
  - center the preview controls
- Updated dependencies [fdd11fd]
  - deemix@3.13.4

## 4.3.5

### Patch Changes

- 34ce4ff: Fix dockerfile

## 4.3.4

### Patch Changes

- 2470a90: Fix favourites download button always showing 0
- 014f8a4: Update about page to remove outdated or redundant information
- Updated dependencies [3c3999d]
  - deemix@3.13.3

## 4.3.3

### Patch Changes

- fd5103f: Fix executeCommand not being saved
- Updated dependencies [059678b]
- Updated dependencies [5fc671e]
  - deemix@3.13.2

## 4.3.2

### Patch Changes

- 079a2fd: Add hint for spotify username to explain that it's the public username, not the one used to sign in
- Updated dependencies [d4015d3]
  - deemix@3.13.1

## 4.3.1

### Patch Changes

- Updated dependencies [ec74308]
  - deemix@3.13.0

## 4.3.0

### Minor Changes

- a56a2d9: Correctly slim the sidebar when slimSidebar enabled

## 4.2.10

### Patch Changes

- 9da832b: Fix appearance settings not saving

## 4.2.9

### Patch Changes

- Updated dependencies [9ea682c]
  - deezer-sdk@1.10.0
  - deemix@3.12.2

## 4.2.8

### Patch Changes

- 70351dd: Fix settings page to properly save bitrate

## 4.2.7

### Patch Changes

- 5f610aa: Minor fixes to ensure search views load as expected
- Updated dependencies [5f610aa]
  - deezer-sdk@1.9.0
  - deemix@3.12.1

## 4.2.6

### Patch Changes

- Updated dependencies [6d90884]
- Updated dependencies [891f179]
  - deemix@3.12.0

## 4.2.5

### Patch Changes

- a5dc8e6: Build docker image for arm64

## 4.2.4

### Patch Changes

- ba4e572: Fix cancelled item not being visually removed from queue

## 4.2.3

### Patch Changes

- 56d4397: Remove "no update available" toast when logging in
- 2fc213b: Fix item in download list not updating visually until a refresh
- 5aa9f76: Display "retry" icon when hovering over retry button in download list

## 4.2.2

### Patch Changes

- 23f876e: Persist Deezer cache when restarting deemix

## 4.2.1

### Patch Changes

- 061147f: Fix refreshing when not on homepage causing 404

## 4.2.0

### Minor Changes

- 748510a: Docker image now correctly sets permissions and supports additional functionality due to being based on lsio/base

## 4.1.4

### Patch Changes

- 44510fd: Actually fix docker permissions

## 4.1.3

### Patch Changes

- 813225f: Fix docker permissions for downloaded files

## 4.1.2

### Patch Changes

- Updated dependencies [c464740]
  - deezer-sdk@1.8.1
  - deemix@3.11.2

## 4.1.1

### Patch Changes

- 57cf04d: Manual deploy

## 4.1.0

### Minor Changes

- b853925: Increase spotify playlist conversion speed
- 4a38238: Significantly faster Deezer API calls by caching using Redis

### Patch Changes

- 656a309: Fix version numbers not displaying correctly
- Updated dependencies [4a38238]
- Updated dependencies [0d08d68]
  - deezer-sdk@1.8.0
  - deemix@3.11.1

## 4.0.3

### Patch Changes

- b55245e: Fix some links being unstyled
- cb28739: Fix Spotify playlist retry not working

## 4.0.2

### Patch Changes

- Updated dependencies [ca61198]
- Updated dependencies [15e03de]
- Updated dependencies [d6c0175]
- Updated dependencies [1453cc7]
  - deemix@3.11.0
  - deezer-sdk@1.7.0

## 4.0.1

### Patch Changes

- 7615e47: Reduce size of built docker image

## 4.0.0

### Major Changes

- a2e64c5: Complete overhaul to bundle server and webui together

### Patch Changes

- Updated dependencies [a2e64c5]
- Updated dependencies [a2e64c5]
  - deezer-sdk@1.6.0
  - deemix@3.10.0

## 3.11.2

### Patch Changes

- 260b1b0: Correctly display per-route titles

## 3.11.1

### Patch Changes

- a8cc14f: Correctly display favicon and capitalize tab title

## 3.11.0

### Minor Changes

- 87a1468: Docker image now runs server via node instead of bundling using pkg

## 3.10.0

### Minor Changes

- 59b9efc: Monorepo Refactor

### Patch Changes

- 0badb7e: Reduce font size on about page
