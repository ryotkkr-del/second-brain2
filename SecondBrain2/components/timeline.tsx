"use client";

import { ChatMessage, type ChatMessageData } from "./chat-message";
import { useEffect, useRef } from "react";

interface TimelineProps {
  messages: ChatMessageData[];
}

export function Timeline({ messages }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px] text-zinc-400 text-sm">
            メッセージがありません
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
}

