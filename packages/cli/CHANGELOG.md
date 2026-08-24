# deemix-cli

## 0.2.0

### Minor Changes

- e801e18: Bundle cli with webui docker image
- 7dcc3b6: Add a Nix flake for reproducible builds of the webui server and cli. `nix build .#webui` / `.#cli`, `nix run .#webui`, and `nix develop` for a dev shell.

### Patch Changes

- Updated dependencies [7dcc3b6]
- Updated dependencies [e801e18]
  - deemix@3.14.0

## 0.1.0

### Minor Changes

- f120283: Correctly create portable config

## 0.0.2

### Patch Changes

- 78cdd4d: Fix error with missing asset causing crash

## 0.0.1

### Patch Changes

- be606cc: Initial version
