# deemix GUI

Cross-platform desktop application for downloading music from Deezer.

## Features

- Modern, intuitive user interface
- Cross-platform support (Windows, macOS, Linux)
- Download queue management
- Real-time progress tracking
- Configurable download settings
- Dark/Light theme support
- System tray integration
- Automatic updates

## Installation

Download the latest release for your platform:

- Windows: `deemix-gui-setup.exe`
- macOS: `deemix-gui.dmg`
- Linux: `deemix-gui.AppImage` or `.deb`

Or install via package managers:

```bash
# Windows (winget)
winget install deemix-gui

# macOS (Homebrew)
brew install --cask deemix-gui

# Linux (Snap)
snap install deemix-gui
```

## Screenshots

[Add screenshots here]

## Development

### Prerequisites

- Node.js 20 or higher
- pnpm 9.10.0 or higher
- Platform-specific build dependencies:
  - Windows: Visual Studio Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: `build-essential` and required libraries

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build application
pnpm build

# Package application
pnpm package

# Create installers
pnpm make
```

### Project Structure

```
gui/
├── src/
│   ├── main/           # Main process code
│   ├── renderer/       # Renderer process code
│   ├── preload/       # Preload scripts
│   └── shared/        # Shared code
├── resources/         # Application resources
├── build/            # Build configuration
└── out/             # Build output
```

### Technology Stack

- Electron
- Vue.js
- TypeScript
- Tailwind CSS
- Electron Builder

### Debugging

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Use VS Code debugging configurations:
   - "Debug GUI": Launch Electron with debugger
   - "Debug Renderer": Attach Chrome DevTools

### Building

```bash
# Build for current platform
pnpm make

# Build for specific platform
pnpm make --platform=win32
pnpm make --platform=darwin
pnpm make --platform=linux
```

### Code Signing

1. Set up certificates:
   - Windows: Code Signing Certificate
   - macOS: Apple Developer Certificate
   - Linux: GPG Key

2. Configure in `electron-builder.yml`:

   ```yaml
   win:
     certificateFile: path/to/cert
   mac:
     identity: Developer ID
   ```

## Contributing

Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

GPL-3.0-only
