import {GiphySearchResponseData} from "@/common/types/giphy/giphy";

export class GiphyMemoryCache {
    private cache = new Map<string, GiphySearchResponseData>();

    get(query: string, offset: number) {
        return this.cache.get(`${query}-${offset}`);
    }

    set(query: string, offset: number, data: GiphySearchResponseData) {
        this.cache.set(`${query}-${offset}`, data);
    }
}