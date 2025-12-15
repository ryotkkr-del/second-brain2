import { View, Text } from "react-native";
import { Brain, User } from "lucide-react-native";
import { cn } from "@/lib/utils";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <View
      className={cn(
        "flex items-start gap-2 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <View className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 items-center justify-center">
        {isUser ? (
          <User size={16} color="#ffffff" />
        ) : (
          <Brain size={16} color="#ffffff" />
        )}
      </View>

      {/* Message bubble */}
      <View className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <View
          className={cn(
            "rounded-2xl px-4 py-2.5 max-w-[75%]",
            "bg-zinc-100"
          )}
        >
          <Text className="text-sm leading-relaxed text-zinc-900">
            {message.content}
          </Text>
        </View>
        <Text className="text-xs text-zinc-500 px-1">
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}

