import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.js', '**/test.js'],
    globals: true,
    environment: 'jsdom',
  },
});
