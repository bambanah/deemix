{
  description = "Nix packaging for deemix (webui server + cli)";

  inputs = {
    # Pinned by explicit rev for reproducibility.
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/89570f24e97e614aa34aa9ab1c927b6578a43775.tar.gz";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        deemix = pkgs.callPackage ./pkgs/deemix.nix {
          src = self;
          nodejs = pkgs.nodejs_24;
          pnpm = pkgs.pnpm_11;
        };

        withMain =
          prog:
          deemix.overrideAttrs (old: {
            meta = old.meta // {
              mainProgram = prog;
            };
          });
      in
      {
        packages.default = deemix;
        packages.webui = withMain "deemix-webui";
        packages.cli = withMain "deemix-cli";

        apps.webui = {
          type = "app";
          program = "${deemix}/bin/deemix-webui";
        };
        apps.cli = {
          type = "app";
          program = "${deemix}/bin/deemix-cli";
        };
        apps.default = self.apps.${system}.webui;

        devShells.default = pkgs.mkShell {
          inputsFrom = [ deemix ];
          packages = [
            pkgs.nodejs_24
            pkgs.pnpm_11
          ];
        };
      }
    );
}
