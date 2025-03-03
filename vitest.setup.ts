import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock API server setup
export const server = setupServer(
  // Default handlers
  http.get('*/api/track/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Track',
      artist: { name: 'Test Artist' },
      album: { title: 'Test Album' }
    });
  }),

  http.get('*/api/album/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Album',
      artist: { name: 'Test Artist' },
      tracks: {
        data: [
          { id: '1', title: 'Track 1' },
          { id: '2', title: 'Track 2' }
        ]
      }
    });
  })
);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Global test utilities
global.sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock file system
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      writeFile: vi.fn(),
      readFile: vi.fn(),
      mkdir: vi.fn()
    }
  };
});