"use client";

import { Home, CheckSquare, Calendar, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: MoreHorizontal, label: "More", href: "/more" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * サイドバーコンポーネント（モノトーン）
 * 
 * Digital Zenデザイン原則に基づき、選択状態は黒、非選択時はグレーで表現
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="h-5 w-5 text-zinc-700" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-zinc-100 text-zinc-900 font-semibold"
                          : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
