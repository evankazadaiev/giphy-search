import { render, screen, fireEvent } from '@testing-library/react';
import { GiphyGrid } from '@/features/giphy/components/GiphyGrid/GiphyGrid';
import { useGiphySearch } from '@/features/giphy/hooks/useGiphySearch';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import type { Mock } from 'vitest'

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

vi.mock('@/features/giphy/hooks/useGiphySearch', () => ({
    useGiphySearch: vi.fn(),
}));

describe('GiphyGrid', () => {
    const mockGifs = [
        {
            id: '1',
            title: 'Funny Cat',
            images: { fixed_width: { url: 'https://example.com/cat.gif' } },
        },
        {
            id: '2',
            title: 'Dancing Dog',
            images: { fixed_width: { url: 'https://example.com/dog.gif' } },
        },
    ];

    beforeEach(() => {
        (useGiphySearch as Mock).mockReturnValue({
            gifs: mockGifs,
            loadMore: vi.fn(),
            hasMore: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders GIFs correctly', () => {
        render(<GiphyGrid query="funny" />);

        expect(screen.getByAltText('Funny Cat')).toBeInTheDocument();
        expect(screen.getByAltText('Dancing Dog')).toBeInTheDocument();
    });

    it('calls loadMore when scrolling near the bottom', () => {
        const loadMoreMock = vi.fn();
        (useGiphySearch as Mock).mockReturnValue({
            gifs: mockGifs,
            loadMore: loadMoreMock,
            hasMore: true,
        });

        render(<GiphyGrid query="funny" />);

        fireEvent.scroll(window, { target: { scrollY: 1000 } });

        expect(loadMoreMock).toHaveBeenCalled();
    });
});