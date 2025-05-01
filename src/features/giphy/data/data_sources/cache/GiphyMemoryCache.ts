import {GiphyGif} from "@/common/types/giphy/giphy";

export class GiphyMemoryCache {
    private cache = new Map<string, GiphyGif[]>();

    get(query: string, offset: number) {
        return this.cache.get(`${query}-${offset}`);
    }

    set(query: string, offset: number, gifs: GiphyGif[]) {
        this.cache.set(`${query}-${offset}`, gifs);
    }
}