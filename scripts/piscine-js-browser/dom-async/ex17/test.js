import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchJson,
  fetchText,
  checkStatus,
  fetchJsonOrThrow,
  getResponseHeader,
  buildUrl,
  fetchWithParams,
  fetchImage
} from './index.js';

describe('Ex17 - Fetch Basics', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchJson()', () => {
    it('should fetch and parse JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData)
      });

      const data = await fetchJson('/api/data');

      expect(fetch).toHaveBeenCalledWith('/api/data');
      expect(data).toEqual(mockData);
    });
  });

  describe('fetchText()', () => {
    it('should fetch and return text', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('Hello World')
      });

      const text = await fetchText('/api/text');

      expect(text).toBe('Hello World');
    });
  });

  describe('checkStatus()', () => {
    it('should return response status info', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK'
      });

      const result = await checkStatus('/api/data');

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
    });
  });

  describe('fetchJsonOrThrow()', () => {
    it('should return data for successful response', async () => {
      const mockData = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const data = await fetchJsonOrThrow('/api/data');
      expect(data).toEqual(mockData);
    });

    it('should throw for error response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(fetchJsonOrThrow('/api/notfound')).rejects.toThrow();
    });
  });

  describe('getResponseHeader()', () => {
    it('should return specific header value', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        headers: {
          get: (name) => name === 'Content-Type' ? 'application/json' : null
        }
      });

      const contentType = await getResponseHeader('/api/data', 'Content-Type');
      expect(contentType).toBe('application/json');
    });
  });

  describe('buildUrl()', () => {
    it('should build URL with query params', () => {
      const url = buildUrl('/api/search', {
        q: 'javascript',
        page: 1
      });

      expect(url).toContain('/api/search?');
      expect(url).toContain('q=javascript');
      expect(url).toContain('page=1');
    });

    it('should handle special characters', () => {
      const url = buildUrl('/api/search', {
        q: 'hello world'
      });

      expect(url).toContain('q=hello+world');
    });
  });

  describe('fetchWithParams()', () => {
    it('should fetch with query parameters', async () => {
      const mockData = { results: [] };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData)
      });

      await fetchWithParams('/api/search', { q: 'test' });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=test'));
    });
  });

  describe('fetchImage()', () => {
    it('should fetch and return blob', async () => {
      const mockBlob = new Blob(['image data'], { type: 'image/png' });
      global.fetch = vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob)
      });

      const blob = await fetchImage('/image.png');

      expect(blob).toBeInstanceOf(Blob);
    });
  });
});
