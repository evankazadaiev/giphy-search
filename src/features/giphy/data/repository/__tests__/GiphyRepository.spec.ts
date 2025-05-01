import { GiphyRepository } from '@/features/giphy/data/repository/GiphyRepository';
import { GiphyApiProxy } from '@/features/giphy/data/data_sources/api/GiphyApiProxy';
import { GiphyMemoryCache } from '@/features/giphy/data/data_sources/cache/GiphyMemoryCache';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { GiphySearchResponseData, ISearchDTO, ITrendingDTO } from '@/common/types/giphy/giphy';

describe('GiphyRepository', () => {
    let apiMock: GiphyApiProxy;
    let cacheMock: GiphyMemoryCache;
    let repository: GiphyRepository;

    beforeEach(() => {
        apiMock = mock(GiphyApiProxy);
        cacheMock = mock(GiphyMemoryCache);
        repository = new GiphyRepository(instance(apiMock), instance(cacheMock));
    });

    it('should return cached data for search if available', async () => {
        const mockQuery = 'funny';
        const mockOffset = 0;
        const mockResponse: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        when(cacheMock.get(mockQuery, mockOffset)).thenReturn(mockResponse);

        const result = await repository.search({ query: mockQuery, offset: mockOffset } as ISearchDTO);

        expect(result).toEqual(mockResponse);
        verify(cacheMock.get(mockQuery, mockOffset)).once();
        verify(apiMock.search(anything(), anything())).never();
    });

    it('should fetch data from API for search if not cached', async () => {
        const mockQuery = 'funny';
        const mockOffset = 0;
        const mockResponse: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        when(cacheMock.get(mockQuery, mockOffset)).thenReturn(undefined);
        when(apiMock.search(anything(), anything())).thenResolve(mockResponse);

        const result = await repository.search({ query: mockQuery, offset: mockOffset } as ISearchDTO);

        expect(result).toEqual(mockResponse);
        verify(cacheMock.get(mockQuery, mockOffset)).once();
        verify(apiMock.search(anything(), anything())).once();
        verify(cacheMock.set(mockQuery, mockOffset, mockResponse)).once();
    });

    it('should return cached data for trending if available', async () => {
        const mockOffset = 0;
        const mockResponse: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        when(cacheMock.get('tranding', mockOffset)).thenReturn(mockResponse);

        const result = await repository.trending({ offset: mockOffset } as ITrendingDTO);

        expect(result).toEqual(mockResponse);
        verify(cacheMock.get('tranding', mockOffset)).once();
        verify(apiMock.trending(anything(), anything())).never();
    });

    it('should fetch data from API for trending if not cached', async () => {
        const mockOffset = 0;
        const mockResponse: GiphySearchResponseData = {
            data: [],
            pagination: { total_count: 0, count: 0, offset: 0 },
            meta: { status: 200, msg: 'OK', response_id: '12345' },
        };

        when(cacheMock.get('tranding', mockOffset)).thenReturn(undefined);
        when(apiMock.trending(anything(), anything())).thenResolve(mockResponse);

        const result = await repository.trending({ offset: mockOffset } as ITrendingDTO);

        expect(result).toEqual(mockResponse);
        verify(cacheMock.get('tranding', mockOffset)).once();
        verify(apiMock.trending(anything(), anything())).once();
        verify(cacheMock.set('tranding', mockOffset, mockResponse)).once();
    });

    it('should fetch trending search terms from API', async () => {
        const mockTerms = ['funny', 'cats', 'dogs'];

        when(apiMock.fetchTrendingSearchTerms(anything())).thenResolve({ data: mockTerms });

        const result = await repository.fetchTrendingSearchTerms();

        expect(result).toEqual(mockTerms);
        verify(apiMock.fetchTrendingSearchTerms(anything())).once();
    });

    it('should fetch tags from API', async () => {
        const mockQuery = 'funny';
        const mockTags = ['funny', 'hilarious'];

        when(apiMock.fetchTags(mockQuery, anything())).thenResolve(mockTags);

        const result = await repository.fetchTags(mockQuery);

        expect(result).toEqual(mockTags);
        verify(apiMock.fetchTags(mockQuery, anything())).once();
    });
});