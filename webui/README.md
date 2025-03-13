# deemix WebUI

Modern web interface for downloading music from Deezer.

## Features

- Modern, responsive design
- Progressive Web App (PWA) support
- Real-time download progress
- Queue management
- Search and browse functionality
- Playlist and album management
- Dark/Light theme support
- Keyboard shortcuts
- Custom context menus

## Installation

```bash
npm install deemix-webui
# or
yarn add deemix-webui
# or
pnpm add deemix-webui
```

## Usage

### As a standalone application

```bash
# Start the server
pnpm start

# Access the UI at http://localhost:3000
```

### As a component

```typescript
import { DeemixWebUI } from 'deemix-webui';

// Initialize
const webui = new DeemixWebUI({
  apiEndpoint: 'http://localhost:6595',
  defaultTheme: 'dark'
});

// Mount to container
webui.mount('#app');
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Technology Stack

- Vue.js 3
- TypeScript
- Tailwind CSS
- Vite
- Vitest

## Project Structure

```
webui/
├── src/
│   ├── components/    # Vue components
│   ├── composables/   # Vue composables
│   ├── stores/        # State management
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
├── public/           # Static assets
└── tests/           # Test files
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `CTRL+SHIFT+Backspace` | Delete search bar content |
| `CTRL+F` | Focus search bar |
| `CTRL+B` | Toggle download bar |
| `ALT+Left` | Go back |
| `ALT+Right` | Go forward |

## Hidden Features

- `CTRL+SHIFT+Backspace` deletes all the search bar content
- `CTRL+F` focuses the search bar
- `CTRL+B` toggles the download bar
- `ALT+Left` goes back to the previous page, if present (like would happen in the browser)
- `ALT+Right` goes forward to the next page, if present (like would happen in the browser)
- Custom context menu: on certain elements, like download buttons or album covers, when opening the context menu, a custom one with more options will appear instead of the default one

## API Integration

### Configuration

```typescript
interface WebUIConfig {
  apiEndpoint: string;
  defaultTheme?: 'light' | 'dark' | 'system';
  defaultQuality?: '128' | '320' | 'flac';
  allowedQualities?: string[];
  maxConcurrentDownloads?: number;
}
```

### Events

```typescript
// Listen for download events
webui.on('downloadStart', (track) => {
  console.log(`Started downloading: ${track.title}`);
});

webui.on('downloadComplete', (track) => {
  console.log(`Finished downloading: ${track.title}`);
});
```

## Contributing

Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

GPL-3.0-only
