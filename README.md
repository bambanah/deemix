# Deemix

This is the monorepo for the revived Deemix project, originally created by the very talented [RemixDev](https://gitlab.com/RemixDev).

It contains the following packages:

- **deezer-sdk**: Wrapper for Deezer's [API](https://developers.deezer.com/api)
- **deemix**: The brains of the operation
- **webui**: [Vue.js](https://vuejs.org/) + [Express](https://expressjs.com/) web interface
- **gui**: Packaged [Electron](https://www.electronjs.org/) app

## Downloads

A compiled electron app is available to download from the [releases page](https://github.com/bambanah/deemix/releases).

Deemix is also available as a [docker image](https://github.com/bambanah/deemix/pkgs/container/deemix).

## Feature requests

Before asking for a feature make sure there isn't already an [open issue](https://github.com/bambanah/deemix/issues).

## Developing

This repo uses [pnpm](https://pnpm.io/) for package management and [Turborepo](https://turbo.build/repo/docs) for monorepo management.

### Dependencies

- Install Node.js 20.x
- Enable pnpm:
  ```bash
  corepack enable
  ```

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/bambanah/deemix.git
   # - OR -
   gh repo clone bambanah/deemix
   ```
2. Install dependencies
   ```bash
   pnpm i
   ```
3. Start development server
   ```bash
   pnpm dev
   ```
   - This will start the development server on port 6595
   - It will also watch for changes in dependencies and hot reload the app

### Building the Docker Image

A docker image can be built with the provided Dockerfile.

```bash
docker build -t deemix .
```

### Packaging the Electron GUI

A distributable GUI app can be built with the following command:

```bash
pnpm make
```
