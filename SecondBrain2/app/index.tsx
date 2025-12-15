import { MobileContainer } from "@/components/mobile-container.native";
import { BottomNav } from "@/components/bottom-nav.native";
import { ChatInput } from "@/components/chat-input.native";
import { Timeline } from "@/components/timeline.native";
import { useState } from "react";
import { View, Text } from "react-native";
import type { ChatMessageData } from "@/components/chat-message.native";
import Constants from "expo-constants";

// API URL設定（環境変数から取得、デフォルトはlocalhost）
const API_URL = process.env.EXPO_PUBLIC_API_URL 
  ? `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
  : __DEV__ 
    ? `http://localhost:3000/api/chat`
    : "https://your-api-url.com/api/chat";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    const timestamp = new Date().toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ユーザーメッセージを追加
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API呼び出し用のメッセージ形式に変換
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();
      const assistantMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "申し訳ございません。エラーが発生しました。もう一度お試しください。",
        timestamp,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileContainer>
      {/* Header */}
      <View className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <View className="px-4 py-4">
          <Text className="text-xl font-semibold text-center">SecondBrain</Text>
        </View>
      </View>

      {/* Timeline (Scrollable area) */}
      <View className="flex-1 pb-24" style={{ minHeight: "100%" }}>
        <Timeline messages={messages} />
      </View>

      {/* Chat Input (Fixed above bottom nav) */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />

      {/* Bottom Navigation */}
      <BottomNav />
    </MobileContainer>
  );
}

