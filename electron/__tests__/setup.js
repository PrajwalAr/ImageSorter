import { vi } from 'vitest';

// Mock Electron with proper named exports
vi.mock('electron', () => {
  return {
    ipcMain: {
      handle: vi.fn(),
      removeHandler: vi.fn(),
    },
    app: {
      getPath: vi.fn((name) => `/mock/${name}`),
      whenReady: vi.fn().mockResolvedValue(),
    }
  };
});

// Mock fs module with proper promises interface
vi.mock('fs', () => {
  const actual = vi.importActual('fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: vi.fn(),
      copyFile: vi.fn(),
    }
  };
});

// Mock csv-parser
vi.mock('csv-parser', () => {
  return function () {
    return {
      on: vi.fn().mockImplementation(function (event, callback) {
        if (event === 'data') this.dataCallback = callback;
        if (event === 'end') this.endCallback = callback;
        return this;
      }),
    };
  };
});
