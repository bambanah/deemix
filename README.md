# Deemix

This is the monorepo for the revived Deemix project, originally created by the very talented [RemixDev](https://gitlab.com/RemixDev).

The docker image was heavily inspired by the fantastic work of [Bockiii](https://gitlab.com/Bockiii/deemix-docker).

### Packages in this Repo

- **deezer-sdk**: Wrapper for Deezer's [API](https://developers.deezer.com/api)
- **deemix**: The brains of the operation
- **webui**: [Vue.js](https://vuejs.org/) + [Express](https://expressjs.com/) web interface
- **gui**: Packaged [Electron](https://www.electronjs.org/) app

<a href='https://ko-fi.com/L3L71IQN1F' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Downloads

### Standalone Electron App

[https://github.com/bambanah/deemix/releases](https://github.com/bambanah/deemix/releases)

Note: The app is not signed (because it's crazy expensive), so you'll need to disable the security warnings when running it.

#### For MacOS

```bash
xattr -d com.apple.quarantine /Applications/deemix.app
```

Modify path if installed to a different locaiton

### Docker Image

Deemix is also available as a [docker image](https://github.com/bambanah/deemix/pkgs/container/deemix).

#### Example Usage

```bash
docker run -d --name Deemix \
  -v /path/to/music:/downloads \
  -v /path/to/config:/config \
  -p 6595:6595 \
  ghcr.io/bambanah/deemix:latest
```

#### Parameters

All paremeters are optional - if not specified, the default value will be used.

You'll probably want to at least map the download and config folders, as well as the port.

| Parameter                               | Description                                               | Default      |
|-----------------------------------------|-----------------------------------------------------------|--------------|
| `-v /path/to/music:/downloads`          | Path to the music folder                                  |              |
| `-v /path/to/config:/config`            | Path to the config folder                                 |              |
| `-p 6595:6595`                          | Port mapped to the host                                   |              |
| `-e DEEMIX_SERVER_PORT=6595`            | Port to expose the server on                              | `6595`       |
| `-e DEEMIX_DATA_DIR=/config`            | Path to the config folder                                 | `/config`    |
| `-e DEEMIX_MUSIC_DIR=/downloads`        | Path to the music folder                                  | `/downloads` |
| `-e DEEMIX_HOST=0.0.0.0`                | Host to bind the server to                                | `0.0.0.0`    |
| `-e DEEMIX_SINGLE_USER=true`            | Enables single user mode                                  | `true`       |
| `-e PUID=1000`                          | User ID to use for downloaded files                       | `1000`       |
| `-e PGID=1000`                          | Group ID to use for downloaded files                      | `1000`       |
| `-e UMASK_SET=022`                      | Set umask                                                 | `022`        |
| `-e DISABLE_OWNERSHIP_CHECK=true`       | Disable ownership fix on container start globally         |              |
| `-e DISABLE_OWNERSHIP_CHECK_MUSIC=true` | Disable ownership fix on container start for music files  |              |
| `-e DISABLE_OWNERSHIP_CHECK_DATA=true`  | Disable ownership fix on container start for config files |              |

## Feature requests

Before asking for a feature make sure there isn't already an [open issue](https://github.com/bambanah/deemix/issues).

## Developing

This repo uses [pnpm](https://pnpm.io/) for package management and [Turborepo](https://turbo.build/repo/docs) for monorepo management.

### Dependencies

- Install Node.js 24.x
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
