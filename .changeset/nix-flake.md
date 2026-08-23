---
"deemix": minor
"deemix-cli": minor
"deemix-webui": minor
---

Add a Nix flake for reproducible builds of the webui server and cli. `nix build .#webui` / `.#cli`, `nix run .#webui`, and `nix develop` for a dev shell.
