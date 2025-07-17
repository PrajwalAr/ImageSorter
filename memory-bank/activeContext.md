# Active Context

## Recent Changes

1. Added Content Security Policy to index.html
2. Fixed Electron loading sequence to prevent blank screens
3. Configured Vite to use port 5174
4. Updated IPC handlers for file operations
5. Enhanced error handling in main process
6. Implemented toast notifications for user feedback during file operations
7. Added progress tracking for copy operations
8. Enhanced CSV filename handling with case-insensitive resolution
9. Added support for filenames with/without extensions
10. Removed unused ipcHandlers.js module

## Technical Decisions

- Used Shadcn UI components for consistent styling
- Implemented Electron IPC for secure file operations
- Added TypeScript interfaces for strict typing
- Used Vite for fast development experience
- Configured Tailwind CSS for utility-first styling
- Implemented case-insensitive filename resolution algorithm
- Added flexible extension handling for image files

## Important Patterns

- Main process handles file system operations
- Renderer process manages UI state
- IPC communication for dialog operations
- Context API for state management
- Toast notifications for user feedback
- Progress tracking for long-running operations
- Case-insensitive filename matching
- File extension fallback mechanism

## Production Deployment Fixes (2025-07-16)

- Fixed blank Electron window issue by:
  - Correcting production path resolution using `app.getAppPath()`
  - Adding error handling for file loading failures
- Resolved CSV parser dependency issues
- Configured Forge to include renderer build output
- Created unified build scripts
- Fixed production file path resolution in electron/main.js
- Updated Forge configuration to remove redundant file copying

## Pending Tasks

- Add unit tests for core functionality
- Implement automated builds
- Create installers for different platforms
<<<<<<< HEAD
- Verify filename resolution across different filesystems
=======
- Verify filename resolution across different filesystems
>>>>>>> dc474c1 (Sanity commit)
