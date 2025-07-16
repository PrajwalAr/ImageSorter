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

## Architecture Patterns

- **IPC Communication**: Electron's inter-process communication
- **Component-based UI**: React component architecture
- **Atomic Design**: UI component organization

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
