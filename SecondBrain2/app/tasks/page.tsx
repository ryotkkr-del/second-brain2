"use client";

import { MobileContainer } from "@/components/mobile-container";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MobileContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors mr-3"
            aria-label="メニューを開く"
          >
            <Menu className="h-6 w-6 text-zinc-700" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Tasks</h1>
          <div className="w-10" />
        </div>
      </header>
      <div className="p-4">
        <p className="text-zinc-500 text-center mt-8">タスク一覧はここに表示されます</p>
      </div>
    </MobileContainer>
  );
}

