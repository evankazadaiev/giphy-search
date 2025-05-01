import Masonry from 'react-masonry-css';
import { useEffect, useRef, useCallback } from 'react';
import { useGiphySearch } from '@/features/giphy/hooks/useGiphySearch';
import { Card, CardContent } from '@/common/components/ui/card';
import {Button} from "@/common/components/ui/button.tsx";

export function GiphyGrid({ query }: { query: string }) {
    const { gifs, loadMore, hasMore } = useGiphySearch(query);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
    }, [hasMore, loadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersect);
        if (anchorRef.current) observer.observe(anchorRef.current);
        return () => observer.disconnect();
    }, [onIntersect]);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
        >
            {gifs.map((gif) => (
                <Card
                    key={gif.id}
                    className="relative bg-zinc-800 overflow-hidden rounded-lg group hover:shadow-lg transition-shadow"
                >
                    <CardContent className="p-0">
                        <img
                            src={gif.images.fixed_width.url}
                            alt={gif.title}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />

                        <div
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-sm">
                            <div className="text-white font-medium truncate">{gif.title}</div>
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="ghost" className="text-white px-2 py-1">❤️</Button>
                                <Button size="sm" variant="ghost" className="text-white px-2 py-1">🔗</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div ref={anchorRef} className="h-1"/>
        </Masonry>
    );
}
