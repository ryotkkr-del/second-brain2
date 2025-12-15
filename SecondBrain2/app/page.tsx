"use client";

import { MobileContainer } from "@/components/mobile-container";
import { Sidebar } from "@/components/sidebar";
import { ChatInput } from "@/components/chat-input";
import { Timeline } from "@/components/timeline";
import { Menu } from "lucide-react";
import { useState } from "react";
import type { ChatMessageData } from "@/components/chat-message";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "応答を取得できませんでした",
        timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error && error.message.includes("GEMINI_API_KEY")
          ? "APIキーが設定されていません。設定を確認してください。"
          : "申し訳ございません。エラーが発生しました。もう一度お試しください。",
        timestamp,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileContainer>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors mr-3"
            aria-label="メニューを開く"
          >
            <Menu className="h-6 w-6 text-zinc-700" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">SecondBrain</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Timeline (Scrollable area) */}
      <div className="flex flex-col pb-20" style={{ minHeight: "calc(100vh - 64px)" }}>
        <Timeline messages={messages} />
      </div>

      {/* Chat Input (Fixed at bottom) */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </MobileContainer>
  );
}
