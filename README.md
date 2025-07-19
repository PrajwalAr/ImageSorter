# ImageSorter - Electron Desktop Application

### Development Approach

This project was developed using Vibe Coding and Context Engineering methodologies with AI model contributions: DeepSeek-R1 (90%), Kimi-K2 (6%), and Gemini 2.0 (4%)

## Overview

Desktop utility for organizing image collections by copying them to categorized directories. Provides progress tracking and notifications.

## Key Features

- **Image Sorting**: Copy images to target directories
- **Progress Tracking**: Real-time progress indicators
- **Notification System**: Toast notifications for operations
- **Responsive UI**: Built with Tailwind CSS and Radix UI components
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Demo

Here is a demonstration of ImageSorter in action:

![ImageSorter Demo](demo/imageSort_app_demo.mov.gif)

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with animation support
- **UI Components**: Radix UI primitives
- **Build**: Electron Forge
- **Testing**: Vitest + React Testing Library

## Development Setup

### Prerequisites

- Node.js v18+
- npm

### Installation & Running

```bash
# Clone repository
git clone https://github.com/PrajwalAr/ImageSorter.git

# Install dependencies
cd ImageSorter
npm install

# Start development mode
npm run dev
```

### Building the Application

```bash
# Build for current platform
npm run build

# Platform-specific builds
npm run build:mac
npm run build:win
```

## Windows Build Requirements

To create Windows installers on macOS, you need to:

1. Install Wine for cross-compilation:

   ```bash
   brew install wine
   ```

2. Set environment variables for code signing (optional but recommended):

   ```bash
   export WINDOWS_CERTIFICATE_FILE=/path/to/cert.pfx
   export WINDOWS_CERTIFICATE_PASSWORD='your_password'
   ```

3. Run the build command:

   ```bash
   npm run build:win
   ```

## Troubleshooting

If the Windows build fails:

- Ensure Wine is properly installed
- Check available disk space
- Verify network connection for dependencies
- Confirm Electron Forge and dependencies are properly installed

## Architecture Patterns

- **IPC Communication**: Electron's inter-process communication
- **Component-based UI**: React component architecture
- **Atomic Design**: UI component organization

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
