import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GiphySearchBox } from '@/features/giphy/components/GiphySearchBox/GiphySearchBox';
import { giphyRepository } from '@/features/giphy/di/di';
import { vi } from 'vitest';
import type { Mock } from 'vitest'

vi.mock('@/features/giphy/di/di', () => ({
    giphyRepository: {
        fetchTags: vi.fn(),
    },
}));

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('GiphySearchBox', () => {
    const mockOnQueryChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with initial query', () => {
        render(<GiphySearchBox initialQuery="funny" onQueryChange={mockOnQueryChange} />);

        const input = screen.getByPlaceholderText('Search GIFs...');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('funny');
    });

    it('updates input value on user typing', () => {
        render(<GiphySearchBox initialQuery="" onQueryChange={mockOnQueryChange} />);

        const input = screen.getByPlaceholderText('Search GIFs...');
        fireEvent.change(input, { target: { value: 'cats' } });

        expect(input).toHaveValue('cats');
    });

    it('fetches and displays suggestions based on input', async () => {
        const mockSuggestions = [
            { name: 'cat' },
            { name: 'cat funny' },
        ];
        (giphyRepository.fetchTags as Mock).mockResolvedValue({ data: mockSuggestions });

        render(<GiphySearchBox initialQuery="" onQueryChange={mockOnQueryChange} />);

        const input = screen.getByPlaceholderText('Search GIFs...');
        fireEvent.change(input, { target: { value: 'ca' } });

        await waitFor(() => {
            expect(giphyRepository.fetchTags).toHaveBeenCalledWith('ca');
        });

        await waitFor(() => {
            expect(screen.getByText('cat')).toBeInTheDocument();
            expect(screen.getByText('cat funny')).toBeInTheDocument();
        });
    });

    it('calls onQueryChange when search button is clicked', () => {
        render(<GiphySearchBox initialQuery="funny" onQueryChange={mockOnQueryChange} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnQueryChange).toHaveBeenCalledWith('funny');
    });

    it('calls onQueryChange when a suggestion is selected', async () => {
        const mockSuggestions = [
            { name: 'cat' },
            { name: 'dog' },
        ];
        (giphyRepository.fetchTags as Mock).mockResolvedValue({ data: mockSuggestions });

        render(<GiphySearchBox initialQuery="" onQueryChange={mockOnQueryChange} />);

        const input = screen.getByPlaceholderText('Search GIFs...');
        fireEvent.change(input, { target: { value: 'ca' } });

        await waitFor(() => {
            expect(screen.getByText('cat')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('cat'));

        expect(mockOnQueryChange).toHaveBeenCalledWith('cat');
    });
});