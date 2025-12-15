"use client";

import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ 
  onSend, 
  placeholder = "今、何を考えていますか?",
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend?.(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-2 bg-white z-10 border-t border-zinc-200">
      <div className="flex items-center gap-2">
        {/* Microphone button */}
        <button
          type="button"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
          aria-label="音声入力"
        >
          <Mic className="h-5 w-5 text-zinc-700" />
        </button>

        {/* Input field */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "flex-1 h-12 px-4 rounded-full bg-zinc-100",
            "border border-transparent focus:border-zinc-300 focus:outline-none",
            "text-sm placeholder:text-zinc-500",
            "transition-colors",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            "transition-colors",
            message.trim()
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          )}
          aria-label="送信"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

