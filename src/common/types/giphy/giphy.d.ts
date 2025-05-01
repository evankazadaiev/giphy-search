export interface GiphySearchResponseData {
    data: GiphyGif[];
    pagination: GiphyPagination;
    meta: GiphyMeta;
}

export interface GiphySingleResponse {
    data: GiphyGif;
    meta: GiphyMeta;
}

export interface GiphyAutocompleteTag {
    name: string;
}

export interface GiphyAutocompleteResponse {
    data: GiphyAutocompleteTag[];
    meta: GiphyMeta;
}

export interface GiphyRandomResponse {
    data: GiphyGif;
    meta: GiphyMeta;
}

export interface ISearchDTO {
    query: string;
    offset: number;
    limit: number;
    rating: string;
    lang: string;
}

export interface ITrendingDTO {
    offset: number;
    limit: number;
    rating: string;
}


export interface GiphyGif {
    id: string;
    title: string;
    url: string;
    images: {
        fixed_width: {
            url: string;
            width: string;
            height: string;
        };
        original: {
            url: string;
            width: string;
            height: string;
        };
    };
    user?: {
        avatar_url: string;
        username: string;
        display_name: string;
        is_verified: boolean;
    };
    source: string;
}

export interface GiphyPagination {
    total_count: number;
    count: number;
    offset: number;
}

export interface GiphyMeta {
    status: number;
    msg: string;
    response_id: string;
}
