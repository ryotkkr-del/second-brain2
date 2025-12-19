"use client";

import { cn } from "@/lib/utils";
import { PRIORITY_COLORS } from "@/lib/constants";

type Priority = "HIGH" | "MEDIUM" | "LOW";

interface PriorityBadgeProps {
  priority: Priority;
}

/**
 * 優先度バッジコンポーネント（モノトーン）
 * 
 * Digital Zenデザイン原則に基づき、色ではなく背景の濃さで重要度を表現
 */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        PRIORITY_COLORS[priority]
      )}
    >
      {priority}
    </span>
  );
}
