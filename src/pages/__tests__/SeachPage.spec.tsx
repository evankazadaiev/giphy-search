import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '@/pages/SearchPage';
import { giphyRepository } from '@/features/giphy/di/di';
import { vi } from 'vitest';
import type { Mock } from 'vitest'
import {GiphySearchResponseData} from "@/common/types/giphy/giphy";

vi.mock('@/features/giphy/di/di', () => ({
    giphyRepository: {
        fetchTrendingSearchTerms: vi.fn(),
        trending: vi.fn(),
        search: vi.fn(),
        fetchTags: vi.fn(),
    },
}));

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

export const mockSearch: GiphySearchResponseData = {
    data: [
        {
            id: '1',
            title: 'Trending GIF 1',
            url: '',
            source: '',
            images: {
                fixed_width: { url: '', width: '200', height: '150' },
                original: { url: '', width: '500', height: '400' },
            },
        },
        {
            id: '2',
            title: 'Trending GIF 2',
            url: '',
            source: '',
            images: {
                fixed_width: { url: '', width: '200', height: '150' },
                original: { url: '', width: '500', height: '400' },
            },
        },
    ],
    pagination: { total_count: 2, count: 2, offset: 0 },
    meta: { status: 200, msg: 'OK', response_id: '12345' },
};

describe('SearchPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the search page correctly', async () => {
        (giphyRepository.fetchTrendingSearchTerms as Mock).mockResolvedValue(['funny', 'cat', 'dog']);
        (giphyRepository.fetchTags as Mock).mockResolvedValue(['cat']);
        (giphyRepository.trending as Mock).mockResolvedValue(mockSearch);
        (giphyRepository.search as Mock).mockResolvedValue(mockSearch);

        render(
            <BrowserRouter>
                <SearchPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Find your next favorite GIF')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search GIFs...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('#funny')).toBeInTheDocument();
            expect(screen.getByText('#cat')).toBeInTheDocument();
            expect(screen.getByText('#dog')).toBeInTheDocument();
        });
    });

    it('updates the query when typing in the search box', async () => {
        (giphyRepository.fetchTrendingSearchTerms as Mock).mockResolvedValue([]);
        (giphyRepository.fetchTags as Mock).mockResolvedValue(['cat']);
        (giphyRepository.trending as Mock).mockResolvedValue(mockSearch);
        (giphyRepository.search as Mock).mockResolvedValue(mockSearch);

        render(
            <BrowserRouter>
                <SearchPage />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Search GIFs...');
        fireEvent.change(input, { target: { value: 'cats' } });

        expect(input).toHaveValue('cats');
    });

    it('renders the GiphyGrid with the correct query', async () => {
        (giphyRepository.fetchTrendingSearchTerms as Mock).mockResolvedValue([]);
        (giphyRepository.fetchTags as Mock).mockResolvedValue(['cat']);
        (giphyRepository.trending as Mock).mockResolvedValue(mockSearch);
        (giphyRepository.search as Mock).mockResolvedValue(mockSearch);

        render(
            <BrowserRouter>
                <SearchPage />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Search GIFs...');
        fireEvent.change(input, { target: { value: 'funny' } });

        await waitFor(() => {
            expect(screen.getByText('Find your next favorite GIF')).toBeInTheDocument();
        });

        // Ensure the GiphyGrid is re-rendered with the updated query
        expect(screen.getByPlaceholderText('Search GIFs...')).toHaveValue('funny');
    });
});