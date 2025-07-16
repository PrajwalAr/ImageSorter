import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: [path.resolve(__dirname, '__tests__/setup.js')],
    include: ['**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['main.js'],
    },
  },
});
