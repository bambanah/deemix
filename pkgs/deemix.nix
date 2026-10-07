{
  lib,
  stdenv,
  src,
  nodejs,
  pnpm,
  fetchPnpmDeps,
  pnpmConfigHook,
  python3,
  makeWrapper,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "deemix";
  version = "4.6.0";

  inherit src;

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 4;
    hash = "sha256-9jZzLtKMv1E8xQSTuaxDJzEOilxrXM/hKZPvkq+IFX0=";
  };

  nativeBuildInputs = [
    nodejs
    pnpm
    pnpmConfigHook
    python3
    makeWrapper
  ];

  buildPhase = ''
    runHook preBuild
    patchShebangs node_modules packages/*/node_modules

    # package.json pins a newer pnpm than nixpkgs ships, so every pnpm invocation
    # would try to download that version from the registry, which the sandbox has
    # no network for. This has to go in pnpm-workspace.yaml: pnpm 11 reads its
    # settings from there rather than .npmrc, and turbo does not forward
    # undeclared env vars to the task processes that run the per-package builds.
    echo 'pmOnFail: ignore' >> pnpm-workspace.yaml

    pnpm run build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share/deemix
    cp -r . $out/share/deemix/

    makeWrapper ${nodejs}/bin/node $out/bin/deemix-webui \
      --add-flags $out/share/deemix/packages/webui/dist/main.js \
      --set NODE_ENV production

    makeWrapper ${nodejs}/bin/node $out/bin/deemix-cli \
      --add-flags $out/share/deemix/packages/cli/dist/main.cjs

    runHook postInstall
  '';

  meta = {
    description = "deemix — Deezer downloader (webui server + cli)";
    homepage = "https://github.com/bambanah/deemix";
    license = lib.licenses.gpl3Only;
    mainProgram = "deemix-webui";
  };
})
