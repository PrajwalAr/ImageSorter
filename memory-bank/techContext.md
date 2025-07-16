# Technical Context

## Technologies Used

- Electron v28
- React v18
- TypeScript v5.2
- Vite v5
- Tailwind CSS v3.3
- Shadcn UI

## Development Setup

1. Node.js v18+
2. npm v9+
3. VSCode with ESLint/Prettier

## Key Dependencies

- Electron Forge 7.8.1
- csv-parser 3.2.0 (main process only)
- Vite 5.4.19 (renderer build)
- concurrently 9.2.0 (development scripts)
- wait-on 8.0.3 (development scripts)

## Tool Usage

- `npm run dev`: Start development server
- `npm run build:renderer`: Build production renderer bundle
- `npm run build:mac`: Build macOS application
- `npm run build:win`: Build Windows application

## Technical Constraints

- File operations only in main process
- Limited to macOS during development
- Requires Node.js runtime

## Production Build Configuration

- Vite configured with base path './'
- Asset files hashed for cache busting
- Electron path resolution handles both dev and prod environments
- Content Security Policy allows 'unsafe-inline' styles
