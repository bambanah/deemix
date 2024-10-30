# deemix-webui

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
