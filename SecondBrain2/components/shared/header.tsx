"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

/**
 * 共通ヘッダーコンポーネント（モノトーン）
 * 
 * Digital Zenデザイン原則に基づき、完全なモノトーンデザイン
 */
export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
      <div className="px-4 py-4 flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors mr-3"
          aria-label="メニューを開く"
        >
          <Menu className="h-6 w-6 text-zinc-900" />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center text-zinc-900">{title}</h1>
        <div className="w-10" />
      </div>
    </header>
  );
}
