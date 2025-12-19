import { Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

/**
 * チャットメッセージコンポーネント（メモ化）
 */
export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-2 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Brain className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 max-w-[75%]",
            "bg-zinc-100 text-zinc-900",
            "text-sm leading-relaxed whitespace-pre-wrap break-words"
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-zinc-500 px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
});
