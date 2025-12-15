import { View, ScrollView, Text } from "react-native";
import { ChatMessage, type ChatMessageData } from "./chat-message.native";
import { useEffect, useRef } from "react";

interface TimelineProps {
  messages: ChatMessageData[];
}

export function Timeline({ messages }: TimelineProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 px-0 py-4"
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View className="gap-1">
        {messages.length === 0 ? (
          <View className="flex items-center justify-center h-full min-h-[200px]">
            <Text className="text-zinc-400 text-sm">メッセージがありません</Text>
          </View>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

