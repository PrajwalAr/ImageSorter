import { app } from 'electron';
import fs from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleCopyImages, handleSelectCSV } from '../ipcHandlers.js';

// Mock setup
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
    removeHandler: vi.fn(),
  },
  app: {
    getPath: vi.fn((name) => `/mock/${name}`),
    whenReady: vi.fn().mockResolvedValue(),
  }
}));

vi.mock('fs');
vi.mock('csv-parser');

describe('Main Process Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    app.getPath.mockReturnValue('/mock/user/documents');
  });

  describe('CSV Parsing', () => {
    it('should parse valid CSV files correctly', async () => {
      // Mock fs.readFile to return a CSV string
      fs.promises.readFile.mockResolvedValue(
        'filename,new_filename\nimg1.jpg,new1.jpg\nimg2.png,new2.png'
      );

      const mockEvent = { reply: vi.fn() };
      await handleSelectCSV(mockEvent, '/path/to/valid.csv');

      expect(fs.promises.readFile).toHaveBeenCalledWith('/path/to/valid.csv', 'utf-8');
      expect(mockEvent.reply).toHaveBeenCalledWith('csv-data', [
        { filename: 'img1.jpg', new_filename: 'new1.jpg' },
        { filename: 'img2.png', new_filename: 'new2.png' }
      ]);
    });

    it('should handle CSV parsing errors', async () => {
      // Mock readFile to throw an error
      fs.promises.readFile.mockRejectedValue(new Error('File not found'));

      const mockEvent = { reply: vi.fn() };
      await handleSelectCSV(mockEvent, '/path/to/invalid.csv');

      expect(mockEvent.reply).toHaveBeenCalledWith('csv-error', 'Error reading CSV file: File not found');
    });
  });

  describe('Image Copying', () => {
    it('should copy images to destination directory', async () => {
      const mockEvent = { reply: vi.fn() };
      const images = [
        { filename: 'img1.jpg', new_filename: 'new1.jpg' },
        { filename: 'img2.png', new_filename: 'new2.png' }
      ];

      // Mock successful copy operations
      fs.promises.copyFile.mockResolvedValue();

      await handleCopyImages(mockEvent, {
        csvData: images,
        sourceDir: '/source/images',
        destDir: '/destination'
      });

      expect(fs.promises.copyFile).toHaveBeenCalledTimes(2);
      expect(fs.promises.copyFile).toHaveBeenCalledWith(
        '/source/images/img1.jpg',
        '/destination/new1.jpg'
      );
      expect(fs.promises.copyFile).toHaveBeenCalledWith(
        '/source/images/img2.png',
        '/destination/new2.png'
      );
      expect(mockEvent.reply).toHaveBeenCalledWith('copy-complete', { success: 2, errors: [] });
    });

    it('should handle file copy errors', async () => {
      const mockEvent = { reply: vi.fn() };
      const images = [
        { filename: 'img1.jpg', new_filename: 'new1.jpg' },
        { filename: 'missing.png', new_filename: 'new2.png' }
      ];

      // Mock one successful and one failed copy
      fs.promises.copyFile.mockImplementation((src) => {
        if (src.includes('missing.png')) {
          return Promise.reject(new Error('File not found'));
        }
        return Promise.resolve();
      });

      await handleCopyImages(mockEvent, {
        csvData: images,
        sourceDir: '/source/images',
        destDir: '/destination'
      });

      expect(mockEvent.reply).toHaveBeenCalledWith('copy-complete', {
        success: 1,
        errors: [{
          filename: 'missing.png',
          error: 'File not found'
        }]
      });
    });
  });
});
