# Image Copier Desktop Application

## Project Goal

Develop a cross-platform desktop application that provides a user-friendly graphical interface to selectively copy image files based on a list provided in a CSV file.

## Core Functionality

1. File Selection (CSV Input)
2. Image Source Directory Selection
3. Image Naming/Matching Options:
   - Flexible Matching (substring search) as default
   - Legacy Explicit Matching (prefix + suffix) as optional
4. Destination Folder Selection
5. Copy Process with validation
6. Results Display (Success/Missing files)
7. Error Handling & User Feedback

## Technical Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS + Shadcn UI
- Desktop Wrapper: Electron.js

## Current Status

- Fully functional MVP completed
- Successfully packaged for macOS
- Production-ready build process implemented
- CSV parser integration completed
