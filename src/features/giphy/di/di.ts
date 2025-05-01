import {GiphyRepository} from "@/features/giphy/data/repository/GiphyRepository.ts";
import {GiphyApiProxy} from "@/features/giphy/data/data_sources/api/GiphyApiProxy.ts";
import {GiphyMemoryCache} from "@/features/giphy/data/data_sources/cache/GiphyMemoryCache.ts";


export const giphyRepository = new GiphyRepository(new GiphyApiProxy(), new GiphyMemoryCache());