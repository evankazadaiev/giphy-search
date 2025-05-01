import { useCallback } from 'react';
import { Masonry, useInfiniteLoader } from 'masonic';
import { useGiphySearch } from '@/features/giphy/hooks/useGiphySearch';
import { Card, CardContent } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import {GiphyGif} from "@/common/types/giphy/giphy";

export function GiphyGrid({ query }: { query: string }) {
    const { gifs, loadMore, hasMore } = useGiphySearch(query);

    const loadMoreItems = useCallback(
        async () => {
            if (hasMore) {
                await loadMore();
            }
        },
        [hasMore, loadMore]
    );

    const isItemLoaded = (index: number) => !!gifs[index];

    const maybeLoadMore = useInfiniteLoader(loadMoreItems, {
        isItemLoaded,
        threshold: 5,
    });

    const renderCard = ({ data }: { data: GiphyGif }) => (
        <Card
            key={data.id}
            className="relative bg-zinc-800 overflow-hidden rounded-lg group hover:shadow-lg transition-shadow"
        >
            <CardContent className="p-0">
                <img
                    src={data.images.fixed_width.url}
                    alt={data.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-sm">
                    <div className="text-white font-medium truncate">{data.title}</div>
                    <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="ghost" className="text-white px-2 py-1">
                            ❤️
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white px-2 py-1">
                            🔗
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Masonry
            key={query}
            items={gifs}
            columnWidth={250}
            columnGutter={16}
            render={renderCard}
            onRender={maybeLoadMore}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            height={window.innerHeight - 100}
        />

    );
}
