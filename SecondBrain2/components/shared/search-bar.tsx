"use client";

import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * 検索バーコンポーネント（モノトーン）
 */
export function SearchBar({ onSearch, placeholder = "検索...", className }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-lg",
            "bg-zinc-100 border border-transparent",
            "text-sm text-zinc-900 placeholder:text-zinc-500",
            "focus:outline-none focus:border-zinc-300 focus:bg-white",
            "transition-colors"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-zinc-200 transition-colors"
            aria-label="検索をクリア"
          >
            <X className="h-4 w-4 text-zinc-600" />
          </button>
        )}
      </div>
    </div>
  );
}

