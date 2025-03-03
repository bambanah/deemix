# Deezer SDK

A TypeScript SDK for interacting with the Deezer API.

## Features

- Full TypeScript support with comprehensive type definitions
- Modern ESM and CommonJS support
- Complete Deezer API coverage
- Built-in error handling and validation
- Automatic rate limiting and retries

## Installation

```bash
npm install deezer-sdk
# or
yarn add deezer-sdk
# or
pnpm add deezer-sdk
```

## Quick Start

```typescript
import { Deezer } from 'deezer-sdk';

// Initialize the SDK
const dz = new Deezer();

// Login with ARL token
await dz.loginViaArl('your_arl_token');

// Search for tracks
const results = await dz.search('artist:eminem');

// Get track details
const track = await dz.getTrack('12345');

// Download track
const downloadURL = track.downloadURL;
```

## API Reference

### Authentication

```typescript
// Login with ARL token
await dz.loginViaArl(arlToken: string): Promise<boolean>

// Check login status
const isLoggedIn = await dz.checkLogin(): Promise<boolean>
```

### Track Operations

```typescript
// Get track by ID
const track = await dz.getTrack(id: string): Promise<APITrack>

// Search tracks
const results = await dz.search(
  query: string,
  options?: APIOptions
): Promise<SearchResults>

// Get track download URL
const url = track.downloadURL
```

### Types

```typescript
interface APITrack {
  id: number;
  title: string;
  duration: number;
  track_position: number;
  disk_number: number;
  rank: number;
  release_date: string;
  explicit_lyrics: boolean;
  preview: string;
  bpm: number;
  gain: number;
  available_countries: string[];
  downloadURL?: string;
  // ... other properties
}
```

## Error Handling

The SDK includes built-in error handling for common scenarios:

```typescript
try {
  const track = await dz.getTrack('invalid_id');
} catch (error) {
  if (error instanceof DeezerAPIError) {
    console.error('API Error:', error.message);
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
