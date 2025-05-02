import * as React from "react"
import { Check } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command"
import { cn } from "@/common/lib/utils"
import {useEffect} from "react";

export type Option = { value: string; label: string }

type ComboboxInputProps = {
    items: Option[]
    value: string
    onValueChange: (val: string) => void
    onInputChange?: (val: string) => void
    placeholder?: string
    className?: string
}

export function ComboboxInput({
                                  items,
                                  value,
                                  onValueChange,
                                  onInputChange,
                                  placeholder = "Type to search...",
                                  className,
                              }: ComboboxInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)

    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(() => {
        const match = items.find((i) => i.value === value)
        return match?.label || value
    })

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const selectedItem = items.find((item) => item.value === value)

    React.useEffect(() => {
        const match = items.find((i) => i.value === value)
        if (match?.label && match.label !== inputValue) {
            setInputValue(match.label)
        }
    }, [value, items, inputValue])

    const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
    )

    const handleSelect = (item: Option) => {
        setInputValue(item.label)
        onInputChange?.(item.label)
        onValueChange(item.value)
        setOpen(false)

        inputRef.current?.blur()
    }

    return (
        <div className="relative w-full">
            <Command
                className="px-0"
                shouldFilter={false}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onInputChange?.(inputValue)
                        onValueChange(inputValue)
                        setOpen(false)
                        inputRef.current?.blur()
                    }

                    if (e.key === "Escape") {
                        inputRef.current?.blur()
                    }
                }}
            >
                <div className="command-input-wrapper">
                    <CommandInput
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={(val) => {
                            setInputValue(val)
                            onInputChange?.(val)
                            setOpen(true)
                        }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => {
                            setOpen(false)
                            if (selectedItem) {
                                setInputValue(selectedItem.label)
                            }
                        }}
                        placeholder={placeholder}
                        className={cn(
                            "command-input w-full px-3 py-2 rounded-md border border-border bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            className
                        )}
                    />
                </div>
                {open && filteredItems.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full z-50 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto">
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onSelect={() => handleSelect(item)}
                                        className="cursor-pointer px-4 py-2 hover:bg-muted flex items-center gap-2"
                                    >
                                        {selectedItem?.value === item.value ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <span className="w-4 h-4" />
                                        )}
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </div>
                )}
            </Command>
        </div>
    )
}
