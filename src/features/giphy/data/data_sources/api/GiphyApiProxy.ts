import {ISearchDTO, ITrendingDTO} from "@/common/types/giphy/giphy";

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const API_KEY = import.meta.env.VITE_APP_GIPHY_API_KEY;

export class GiphyApiProxy {
    async search({query, offset = 0, limit = 25, rating = 'g', lang = 'en'}: ISearchDTO, signal?: AbortSignal) {
        const url = new URL(`${BASE_URL}/search`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('q', query);
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('offset', String(offset));
        url.searchParams.set('rating', rating);
        url.searchParams.set('lang', lang);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
        return res.json();
    }

    async trending({offset = 0, limit = 25, rating = 'g'}: ITrendingDTO, signal?: AbortSignal) {
        const url = new URL(`${BASE_URL}/trending`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('offset', String(offset));
        url.searchParams.set('rating', rating);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Trending failed: ${res.statusText}`);
        return res.json();
    }

    async fetchTrendingSearchTerms(signal?: AbortSignal) {
        const url = new URL('https://api.giphy.com/v1/trending/searches');
        url.searchParams.set('api_key', API_KEY);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Trending terms fetch failed: ${res.statusText}`);
        return res.json();
    }

    async getById(id: string, signal?: AbortSignal) {
        const url = new URL(`${BASE_URL}/${id}`);
        url.searchParams.set('api_key', API_KEY);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Get by ID failed: ${res.statusText}`);
        return res.json();
    }

    async random(tag = '', rating = 'g', signal?: AbortSignal) {
        const url = new URL(`${BASE_URL}/random`);
        url.searchParams.set('api_key', API_KEY);
        if (tag) url.searchParams.set('tag', tag);
        url.searchParams.set('rating', rating);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Random failed: ${res.statusText}`);
        return res.json();
    }

    async fetchTags(query: string, signal?: AbortSignal) {
        const url = new URL('https://api.giphy.com/v1/gifs/search/tags');
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('q', query);

        const res = await fetch(url.toString(), { signal });
        if (!res.ok) throw new Error(`Autocomplete failed: ${res.statusText}`);
        return res.json();
    }
}
