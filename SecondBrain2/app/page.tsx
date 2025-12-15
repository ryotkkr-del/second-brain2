"use client";

import { MobileContainer } from "@/components/mobile-container";
import { BottomNav } from "@/components/bottom-nav";
import { ChatInput } from "@/components/chat-input";
import { Timeline } from "@/components/timeline";
import { useState } from "react";
import type { ChatMessageData } from "@/components/chat-message";

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

      const response = await fetch("/api/chat", {
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
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-center">SecondBrain</h1>
        </div>
      </header>

      {/* Timeline (Scrollable area) */}
      <div className="flex flex-col pb-24" style={{ minHeight: "calc(100vh - 64px)" }}>
        <Timeline messages={messages} />
      </div>

      {/* Chat Input (Fixed above bottom nav) */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />

      {/* Bottom Navigation */}
      <BottomNav />
    </MobileContainer>
  );
}
