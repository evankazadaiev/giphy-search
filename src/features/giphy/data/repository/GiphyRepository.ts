import {GiphyApiProxy} from "@/features/giphy/data/data_sources/api/GiphyApiProxy.ts";
import {
    GiphyMemoryCache,
} from "@/features/giphy/data/data_sources/cache/GiphyMemoryCache.ts";
import {ISearchDTO, ITrendingDTO} from "@/common/types/giphy/giphy";

export class GiphyRepository {
    constructor(private api: GiphyApiProxy, private cache: GiphyMemoryCache) {}

    async search(searchDTO: ISearchDTO, signal?: AbortSignal) {
        try {
            const cached = this.cache.get(searchDTO.query, searchDTO.offset);

            if (cached) return cached;

            const result = await this.api.search(searchDTO, signal);
            this.cache.set(searchDTO.query, searchDTO.offset, result);

            return result;
        } catch (e) {
            console.error('Search failed:', e);
            throw e;
        }
    }

    async trending(trendingDTO: ITrendingDTO, signal?: AbortSignal) {
        try {
            const cached = this.cache.get("tranding", trendingDTO.offset);

            if (cached) return cached;

            const result = await this.api.trending(trendingDTO, signal);
            this.cache.set("tranding", trendingDTO.offset, result);

            return result;
        } catch (e) {
            console.error('Trending search failed:', e);
            throw e;
        }
    }

    async fetchTrendingSearchTerms(signal?: AbortSignal): Promise<string[]> {
        try {
            const res = await this.api.fetchTrendingSearchTerms(signal);
            return res.data;
        } catch (e) {
            console.error('Fetch trending terms failed:', e);
            throw e;
        }
    }

    async fetchTags(query: string, signal?: AbortSignal) {
        try {
            const result = await this.api.fetchTags(query, signal);

            return result;
        } catch(e) {
            console.error('Fetch tags failed:', e);
            throw e;
        }
    }
}