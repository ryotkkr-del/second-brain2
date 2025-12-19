"use client";

import { TimelineItem } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef, useMemo } from "react";
import { formatTime } from "@/lib/utils/date";
import { EMPTY_STATES } from "@/lib/constants";

interface TimelineProps {
  items: TimelineItem[];
}

/**
 * タイムラインコンポーネント
 */
export function Timeline({ items }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // メッセージデータをメモ化して再レンダリングを削減
  const messages = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        role: item.role === "user" ? ("user" as const) : ("assistant" as const),
        content: item.content,
        timestamp: formatTime(item.timestamp),
      })),
    [items]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-zinc-400 text-sm">
        {EMPTY_STATES.MESSAGES}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-0 py-4 scrollbar-thin"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.2) transparent",
      }}
    >
      <div className="space-y-1">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
