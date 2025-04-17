# deemix CLI

Command-line interface for downloading music from Deezer.

## Installation

```bash
npm install -g deemix-cli
# or
yarn global add deemix-cli
# or
pnpm add -g deemix-cli
```

## Usage

### Basic Commands

```bash
# Download a track
deemix https://www.deezer.com/track/12345

# Download an album
deemix https://www.deezer.com/album/12345

# Download a playlist
deemix https://www.deezer.com/playlist/12345

# Download multiple items
deemix url1 url2 url3
```

### Options

```bash
Options:
  -b, --bitrate <rate>    Set bitrate (128, 320, flac) [default: "320"]
  -o, --output <dir>      Set output directory [default: "./downloads"]
  -p, --playlist          Create M3U8 playlist file
  -q, --quiet            Reduce output verbosity
  -h, --help             Display help
  -v, --version          Display version
```

### Authentication

On first run, you'll be prompted for your Deezer ARL token. This will be saved for future use.

```bash
# Manual login
deemix login

# Use specific ARL token
deemix --arl YOUR_ARL_TOKEN
```

### Examples

```bash
# Download a track in FLAC quality
deemix -b flac https://www.deezer.com/track/12345

# Download an album to a specific directory
deemix -o ~/Music https://www.deezer.com/album/12345

# Download a playlist and create M3U8 file
deemix -p https://www.deezer.com/playlist/12345

# Download multiple items quietly
deemix -q url1 url2 url3
```

## Features

- Download tracks, albums, and playlists
- Multiple quality options (128kbps, 320kbps, FLAC)
- Automatic metadata tagging
- Playlist file generation
- Progress tracking
- Concurrent downloads
- Error handling and retry logic

## Configuration

Configuration is stored in:

- Windows: `%APPDATA%/deemix/config.json`
- macOS: `~/Library/Application Support/deemix/config.json`
- Linux: `~/.config/deemix/config.json`

### Example Configuration

```json
{
  "downloadLocation": "~/Music",
  "createPlaylist": true,
  "defaultBitrate": "320",
  "concurrent": 3
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run locally
pnpm start

# Run tests
pnpm test
```

## Contributing

Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
