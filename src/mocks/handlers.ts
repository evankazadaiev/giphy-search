import { http, HttpResponse } from 'msw';
import {
    GiphyGif,
    GiphySearchResponseData,
    GiphySingleResponse,
    GiphyRandomResponse,
    GiphyAutocompleteResponse
} from '@/common/types/giphy/giphy';
import test from "./test.gif";
import test2 from "./test2.gif";
import test3 from "./test3.gif";
import test4 from "./test4.gif";
import { v4 as uuidv4 } from 'uuid';

const gifSources = [test, test2, test3, test4];

const TRENDING_TAGS = ["dogs", "cats", "funny", "dance", "meme", "reaction"];

function generateMockGifs(): GiphyGif[] {
    return Array.from({ length: 12 }).map((_, i) => ({
        id: uuidv4(),
        title: `Mock GIF ${i}`,
        url: '',
        source: '',
        images: {
            fixed_width: {
                url: gifSources[i % gifSources.length],
                width: '200',
                height: '150',
            },
            original: {
                url: gifSources[i % gifSources.length],
                width: '500',
                height: '400',
            },
        },
    }));
}


const autocompleteMock: GiphyAutocompleteResponse = {
    data: [
        { name: 'cat' },
        { name: 'cat meme' },
        { name: 'cat dance' },
        { name: 'cat reaction' },
    ],
    meta: {
        status: 200,
        msg: 'OK',
        response_id: 'mocked-autocomplete',
    },
};

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

export const handlers = [
    http.get('https://api.giphy.com/v1/gifs/search', ({ request }) => {
        const url = new URL(request.url);
        const offset = Number(url.searchParams.get('offset') ?? 0);

        const shuffled = shuffle(generateMockGifs());

        const response: GiphySearchResponseData = {
            data: shuffled,
            pagination: {
                total_count: 100,
                count: shuffled.length,
                offset,
            },
            meta: { status: 200, msg: 'OK', response_id: 'mocked' },
        };

        return HttpResponse.json(response);
    }),

    http.get('https://api.giphy.com/v1/trending/searches', () => {
        return HttpResponse.json({
            data: TRENDING_TAGS,
            meta: { status: 200, msg: 'OK', response_id: 'mocked' },
        });
    }),

    http.get('https://api.giphy.com/v1/gifs/search/tags', ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get('q')?.toLowerCase() ?? '';
        const filtered = autocompleteMock.data.filter((tag) =>
            tag.name.includes(q)
        );

        return HttpResponse.json({
            data: filtered,
            meta: autocompleteMock.meta,
        });
    }),

    http.get('https://api.giphy.com/v1/gifs/trending', ({ request }) => {
        const url = new URL(request.url);
        const offset = Number(url.searchParams.get('offset') ?? 0);

        const response: GiphySearchResponseData = {
            data: generateMockGifs(),
            pagination: {
                total_count: 100,
                count: 12,
                offset,
            },
            meta: { status: 200, msg: 'OK', response_id: 'mocked' },
        };

        return HttpResponse.json(response);
    }),

    http.get('https://api.giphy.com/v1/gifs/:id', () => {
        const response: GiphySingleResponse = {
            data: generateMockGifs()[0],
            meta: { status: 200, msg: 'OK', response_id: 'mocked' },
        };

        return HttpResponse.json(response);
    }),

    http.get('https://api.giphy.com/v1/gifs/random', () => {
        const response: GiphyRandomResponse = {
            data: generateMockGifs()[0],
            meta: { status: 200, msg: 'OK', response_id: 'mocked' },
        };

        return HttpResponse.json(response);
    }),
];
