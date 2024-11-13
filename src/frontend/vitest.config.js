// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', // Choose 'istanbul' or 'v8'
      reporter: ['text', 'json', 'html'], // Formats for the coverage report
      include: ['src/pages/*.jsx', 'src/component/*.jsx','src/context/*.jsx'], // Adjust to your project's source folder
      exclude: [],
      reportsDirectory: './coverage', // Directory to store coverage reports
    },
  },
});
