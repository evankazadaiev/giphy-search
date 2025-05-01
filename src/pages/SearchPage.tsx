import { useSearchParams } from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import { GiphySearchBox } from "@/features/giphy/components/GiphySearchBox/GiphySearchBox";
import { GiphyGrid } from "@/features/giphy/components/GiphyGrid/GiphyGrid";
import { Button } from "@/common/components/ui/button";
import {giphyRepository} from "@/features/giphy/di/di.ts";


export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = useMemo(() => searchParams.get("q") || "", [searchParams]);

    const [trendingTags, setTrendingTags] = useState<string[]>([]);

    useEffect(() => {
        giphyRepository.fetchTrendingSearchTerms().then(setTrendingTags).catch(console.error);
    }, []);

    const handleQueryChange = (newQuery: string, newPage = 1) => {
        const next = new URLSearchParams(searchParams);
        next.set("q", newQuery);
        next.set("page", String(newPage));
        setSearchParams(next);
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
            <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 px-4 py-4">
                <div className="max-w-6xl mx-auto space-y-4">
                    <h1 className="text-3xl font-bold">Find your next favorite GIF</h1>
                    <GiphySearchBox initialQuery={query} onQueryChange={handleQueryChange} />
                    <div className="flex flex-wrap gap-2">
                        {trendingTags.map((tag) => (
                            <Button
                                key={tag}
                                variant="secondary"
                                className="rounded-full px-4 py-1 text-sm shadow-sm transition-colors"
                                onClick={() => handleQueryChange(tag)}
                            >
                                #{tag}
                            </Button>


                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <GiphyGrid query={query} />
                </div>
            </div>
        </div>
    );
}
