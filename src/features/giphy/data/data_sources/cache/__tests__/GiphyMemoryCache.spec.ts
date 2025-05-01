import { GiphyMemoryCache } from '@/features/giphy/data/data_sources/cache/GiphyMemoryCache';
import { GiphySearchResponseData } from '@/common/types/giphy/giphy';

describe('GiphyMemoryCache', () => {
    let cache: GiphyMemoryCache;

    beforeEach(() => {
        cache = new GiphyMemoryCache();
    });

    it('should store and retrieve data from the cache', () => {
        const query = 'funny';
        const offset = 0;
        const mockData: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        cache.set(query, offset, mockData);
        const result = cache.get(query, offset);

        expect(result).toEqual(mockData);
    });

    it('should return undefined for non-existent cache entries', () => {
        const result = cache.get('non-existent-query', 0);
        expect(result).toBeUndefined();
    });

    it('should handle multiple cache entries correctly', () => {
        const query1 = 'funny';
        const query2 = 'cats';
        const offset1 = 0;
        const offset2 = 10;

        const mockData1: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        const mockData2: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 10 },
            meta: { status: 200, msg: 'OK', response_id: '67890' },
        };

        cache.set(query1, offset1, mockData1);
        cache.set(query2, offset2, mockData2);

        expect(cache.get(query1, offset1)).toEqual(mockData1);
        expect(cache.get(query2, offset2)).toEqual(mockData2);
    });
});