import { useEffect, useState, useCallback, useRef } from 'react';
import { GiphyGif, GiphySearchResponseData } from '@/common/types/giphy/giphy';
import { giphyRepository } from "@/features/giphy/di/di.ts";

const LIMIT = 25;

export function useGiphySearch(query: string) {
    const [gifs, setGifs] = useState<GiphyGif[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const controllerRef = useRef<AbortController | null>(null);

    const load = useCallback(
        async (reset: boolean = false) => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            const controller = new AbortController();
            controllerRef.current = controller;

            const currentOffset = reset ? 0 : offset;

            setIsLoading(true);
            try {
                let res: GiphySearchResponseData;

                if (query.trim()) {
                    res = await giphyRepository.search(
                        {
                            query,
                            offset: currentOffset,
                            limit: LIMIT,
                            rating: 'g',
                            lang: 'en',
                        },
                        controller.signal
                    );
                } else {
                    res = await giphyRepository.trending(
                        {
                            offset: currentOffset,
                            limit: LIMIT,
                            rating: 'g',
                        },
                        controller.signal
                    );
                }

                setGifs(prev => reset ? res.data : [...prev, ...res.data]);
                setOffset(reset ? LIMIT : currentOffset + LIMIT);
                setHasMore(res.pagination.total_count > currentOffset + LIMIT);
            } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                    console.error('Giphy fetch failed:', e);
                    setGifs([]);
                    setHasMore(false);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [query, offset]
    );

    useEffect(() => {
        setOffset(0);
        load(true);
    }, [query]);

    return {
        gifs,
        hasMore,
        loadMore: () => load(false),
        isLoading,
    };
}
