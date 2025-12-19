"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_COLORS } from "@/lib/constants";

type Priority = "HIGH" | "MEDIUM" | "LOW";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; tags: string[]; priority: Priority; date?: string }) => void;
  initialData: {
    title: string;
    tags: string[];
    priority: Priority;
    date?: string;
  };
  type: "TASK" | "SCHEDULE" | "LOG";
}

/**
 * 編集モーダルコンポーネント
 */
export function EditModal({ isOpen, onClose, onSave, initialData, type }: EditModalProps) {
  const [title, setTitle] = useState(initialData.title);
  const [tags, setTags] = useState(initialData.tags.join(", "));
  const [priority, setPriority] = useState<Priority>(initialData.priority);
  const [date, setDate] = useState(initialData.date?.split("T")[0] || "");
  const [time, setTime] = useState(initialData.date?.split("T")[1]?.substring(0, 5) || "");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title);
      setTags(initialData.tags.join(", "));
      setPriority(initialData.priority);
      if (initialData.date) {
        const dateObj = new Date(initialData.date);
        setDate(dateObj.toISOString().split("T")[0]);
        setTime(dateObj.toTimeString().substring(0, 5));
      } else {
        setDate("");
        setTime("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const dateTime = type === "SCHEDULE" && date && time ? `${date}T${time}:00` : date || undefined;
    onSave({ title, tags: tagsArray, priority, date: dateTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">編集</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          {type === "SCHEDULE" && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">日付</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">時刻</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">タグ（カンマ区切り）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例: 課題, 学習"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">優先度</label>
            <div className="flex gap-2">
              {(["HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    priority === p
                      ? PRIORITY_COLORS[p]
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

