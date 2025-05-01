import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { mock, when, resetCalls, anything } from 'ts-mockito';
import { useGiphySearch } from '@/features/giphy/hooks/useGiphySearch';
import { GiphySearchResponseData, ISearchDTO, ITrendingDTO, GiphyGif } from '@/common/types/giphy/giphy';
import { giphyRepository } from '@/features/giphy/di/di.ts';

const mockRepository = mock<typeof giphyRepository>();

vi.doMock('@/features/giphy/di/di', () => ({
    giphyRepository: mockRepository,
}));

const mockGifs: GiphyGif[] = Array.from({ length: 25 }, (_, i) => ({
    id: `gif-${i}`,
    title: `Gif ${i}`,
    url: `https://example.com/gif-${i}.gif`,
    source: `https://source.com/gif-${i}`,
    images: {
        fixed_width: {
            url: `https://example.com/gif-${i}.gif`,
            width: '200',
            height: '200'
        },
        original: {
            url: `https://example.com/gif-${i}-original.gif`,
            width: '500',
            height: '500'
        },
    },
}));

describe('useGiphySearch', () => {
    const mockResponse = {
        data: mockGifs,
        pagination: { total_count: 100 },
    };

    const instance = mockRepository as unknown as {
        search: (params: ISearchDTO, signal: AbortSignal) => Promise<GiphySearchResponseData['data']>;
        trending: (params: ITrendingDTO, signal: AbortSignal) => Promise<GiphySearchResponseData['data']>;
    };

    beforeEach(() => {
        resetCalls(mockRepository);
    });

    it('loads gifs on initial query render using search', async () => {
        when(instance.search(anything(), anything())).thenResolve(mockResponse.data);

        const { result, waitForNextUpdate } = renderHook(() => useGiphySearch('funny'));

        expect(result.current.isLoading).toBe(true);

        await waitForNextUpdate();

        expect(result.current.gifs).toHaveLength(25);
        expect(result.current.hasMore).toBe(true);
        expect(result.current.isLoading).toBe(false);
    });

    it('loads trending gifs when query is empty', async () => {
        when(instance.trending(anything(), anything())).thenResolve(mockResponse.data);

        const { result, waitForNextUpdate } = renderHook(() => useGiphySearch(''));

        await waitForNextUpdate();

        expect(result.current.gifs).toHaveLength(25);
    });

    it('loads more gifs on loadMore call', async () => {
        when(instance.search(anything(), anything()))
            .thenResolve(mockResponse.data)
            .thenResolve(mockResponse.data);

        const { result, waitForNextUpdate } = renderHook(() => useGiphySearch('more'));

        await waitForNextUpdate();

        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.gifs).toHaveLength(50);
    });

});