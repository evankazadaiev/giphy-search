import { GiphyApiProxy } from '@/features/giphy/data/data_sources/api/GiphyApiProxy';
import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest'

const API_KEY = 'test-api-key';

describe('GiphyApiProxy', () => {
    let apiProxy: GiphyApiProxy;

    beforeAll(() => {
        import.meta.env.VITE_APP_GIPHY_API_KEY = API_KEY;
    });

    beforeEach(() => {
        apiProxy = new GiphyApiProxy();
        vi.spyOn(global, 'fetch');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch search results', async () => {
        const searchParams = {
            query: 'funny',
            offset: 0,
            limit: 25,
            rating: 'g',
            lang: 'en',
        };

        const mockResponse = { data: [], pagination: {}, meta: {} };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.search(searchParams);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/gifs/search'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error for failed search', async () => {
        const searchParams = {
            query: 'funny',
            offset: 0,
            limit: 25,
            rating: 'g',
            lang: 'en',
        };

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: false,
            statusText: 'Bad Request',
        });

        await expect(apiProxy.search(searchParams)).rejects.toThrow('Search failed: Bad Request');
    });

    it('should fetch trending results', async () => {
        const trendingParams = {
            offset: 0,
            limit: 25,
            rating: 'g',
        };

        const mockResponse = { data: [], pagination: {}, meta: {} };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.trending(trendingParams);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/gifs/trending'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('should fetch trending search terms', async () => {
        const mockResponse = { data: ['funny', 'cats'] };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.fetchTrendingSearchTerms();

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/trending/searches'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('should fetch GIF by ID', async () => {
        const mockResponse = { data: {} };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.getById('12345');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/gifs/12345'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('should fetch random GIF', async () => {
        const mockResponse = { data: {} };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.random('funny');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/gifs/random'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('should fetch tags', async () => {
        const mockResponse = { data: [] };
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await apiProxy.fetchTags('funny');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.giphy.com/v1/gifs/search/tags'),
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });
});