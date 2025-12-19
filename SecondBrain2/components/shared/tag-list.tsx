"use client";

import { Tag } from "lucide-react";

interface TagListProps {
  tags: string[];
}

/**
 * タグリストコンポーネント
 */
export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded-full"
        >
          <Tag className="h-3 w-3" />
          {tag}
        </span>
      ))}
    </div>
  );
}

