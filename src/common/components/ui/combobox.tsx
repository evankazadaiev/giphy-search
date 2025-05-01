import * as React from "react"
import { Check } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "./command"
import { cn } from "@/common/lib/utils"
import {Input} from "@/common/components/ui/input.tsx";

type ComboboxInputProps = {
    items: { value: string; label: string }[]
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
    const [search, setSearch] = React.useState(value)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        setSearch(value)
    }, [value])

    const filteredItems = items.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
    )

    const handleChange = (val: string) => {
        setSearch(val)
        onInputChange?.(val)
        setOpen(true)
    }

    const handleSelect = (val: string) => {
        onValueChange(val)
        setSearch(val)
        setOpen(false)
    }

    return (
        <div className="relative w-full">
            <Command shouldFilter={false}>

                <Input
                    value={search}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            onValueChange(search) // simulate selecting the current input
                            setOpen(false)
                        }
                    }}
                    placeholder={placeholder}
                    className={cn(
                        "w-full px-4 py-2 rounded-md border border-border bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
                        className
                    )}
                />

                {open && filteredItems.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full z-50 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto">
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={() => handleSelect(item.value)}
                                        className="cursor-pointer px-4 py-2 hover:bg-muted"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                item.value === value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
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
