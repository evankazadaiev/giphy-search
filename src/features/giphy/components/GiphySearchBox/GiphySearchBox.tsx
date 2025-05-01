import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from '@/common/components/ui/button';
import { giphyRepository } from "@/features/giphy/di/di";
import { useDebounce } from "@/common/hooks/useDebounce";
import { ComboboxInput } from "@/common/components/ui/combobox"
import {GiphyAutocompleteTag} from "@/common/types/giphy/giphy";

interface IGiphyAutocompleteOption {
    value: string;
    label: string;
}

export function GiphySearchBox({
                                   initialQuery,
                                   onQueryChange,
                               }: {
    initialQuery: string;
    onQueryChange: (q: string) => void;
}) {
    const [value, setValue] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState<IGiphyAutocompleteOption[]>([]);
    const skipSuggestion = useRef(false);
    const debouncedValue = useDebounce(value);

    useEffect(() => {
        setValue(initialQuery);
        skipSuggestion.current = true;
    }, [initialQuery]);

    useEffect(() => {
        if (skipSuggestion.current) {
            skipSuggestion.current = false;
            return;
        }

        if (!debouncedValue.trim()) return setSuggestions([]);

        (async () => {
            const res = await giphyRepository.fetchTags(debouncedValue);

            console.log(res.data);
            setSuggestions(res.data
                .map((s: GiphyAutocompleteTag) => ({ value: s.name, label: s.name })));
        })();
    }, [debouncedValue]);

    const handleSearch = () => {
        onQueryChange(value.trim());
    };

    const handleSelect = (suggestion: string) => {
        setValue(suggestion);
        onQueryChange(suggestion);
    };

    return (
        <div className="relative flex gap-2 items-start">
            <div className="w-full relative">
                <ComboboxInput
                    items={suggestions}
                    value={value}
                    onValueChange={handleSelect}
                    onInputChange={setValue}
                    placeholder="Search GIFs..."
                    className="bg-white text-black placeholder:text-gray-400 border-gray-300 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 dark:border-zinc-700"
                />
            </div>
            <Button variant="default" onClick={handleSearch}>
                <Search className="h-4 w-4" />
            </Button>
        </div>
    );
}
