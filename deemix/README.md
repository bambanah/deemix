# deemix Core

Core library for downloading music from Deezer with TypeScript support.

## Features

- Robust download engine with retry mechanisms
- Full metadata support
- Multiple quality options
- Progress tracking and event system
- Comprehensive error handling
- TypeScript-first development

## Installation

```bash
npm install deemix
# or
yarn add deemix
# or
pnpm add deemix
```

## Usage

```typescript
import { Deemix } from 'deemix';
import { Deezer } from 'deezer-sdk';

// Initialize
const deezer = new Deezer();
const deemix = new Deemix(deezer);

// Login
await deezer.loginViaArl('your_arl_token');

// Configure download settings
const settings = {
  downloadLocation: './downloads',
  createPlaylist: true,
  overwriteFiles: false,
  queueConcurrency: 3,
  tags: {
    saveArtwork: true,
    embedArtwork: true,
    padTracks: true,
    dateFormat: 'YYYY-MM-DD'
  }
};

// Download a track
const track = await deezer.getTrack('12345');
await deemix.downloadTrack(track, settings);

// Download with progress tracking
deemix.on('downloadProgress', (progress) => {
  console.log(`Progress: ${progress.percentage}%`);
});

deemix.on('downloadComplete', (track) => {
  console.log(`Downloaded: ${track.title}`);
});
```

## API Reference

### Main Class

```typescript
class Deemix {
  constructor(deezer: Deezer);

  // Download methods
  async downloadTrack(track: APITrack, settings: Settings): Promise<void>;
  async downloadAlbum(album: APIAlbum, settings: Settings): Promise<void>;
  async downloadPlaylist(playlist: APIPlaylist, settings: Settings): Promise<void>;

  // Event handling
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}
```

### Settings

```typescript
interface Settings {
  downloadLocation: string;
  createPlaylist?: boolean;
  overwriteFiles?: boolean;
  queueConcurrency?: number;
  tags?: {
    saveArtwork?: boolean;
    embedArtwork?: boolean;
    padTracks?: boolean;
    dateFormat?: string;
  };
}
```

### Events

- `downloadProgress`: Emitted during download with progress information
- `downloadComplete`: Emitted when a download finishes
- `downloadError`: Emitted when an error occurs
- `queueUpdate`: Emitted when the download queue changes

## Error Handling

```typescript
import { DownloadError } from 'deemix';

try {
  await deemix.downloadTrack(track, settings);
} catch (error) {
  if (error instanceof DownloadError) {
    console.error('Download failed:', error.message);
    console.error('Track:', error.track);
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm type-check
```

## Contributing

Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
