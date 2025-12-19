"use client";

import { MobileContainer } from "@/components/mobile-container";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/shared/header";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { TagList } from "@/components/shared/tag-list";
import { EditModal } from "@/components/shared/edit-modal";
import { SearchBar } from "@/components/shared/search-bar";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useData } from "@/contexts/data-context";
import { EMPTY_STATES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils/date";
import type { Schedule } from "@/lib/types";

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{ id: string; title: string; date: string; tags: string[]; priority: "HIGH" | "MEDIUM" | "LOW" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { schedules, updateSchedule, deleteSchedule, searchSchedules } = useData();

  // 検索結果をメモ化
  const filteredSchedules = useMemo(() => {
    return searchSchedules(searchQuery);
  }, [searchQuery, searchSchedules]);

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({
      id: schedule.id,
      title: schedule.title,
      date: schedule.date,
      tags: schedule.tags,
      priority: schedule.priority,
    });
  };

  const handleSave = (data: { title: string; tags: string[]; priority: "HIGH" | "MEDIUM" | "LOW"; date?: string }) => {
    if (editingSchedule && data.date) {
      updateSchedule(editingSchedule.id, data);
      setEditingSchedule(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("このスケジュールを削除しますか？")) {
      deleteSchedule(id);
    }
  };

  return (
    <MobileContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header title="Schedule" onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="p-4 pb-20">
        {/* 検索バー */}
        <div className="mb-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="タイトルやタグで検索..."
          />
        </div>

        {/* 検索結果の表示 */}
        {filteredSchedules.length === 0 ? (
          <p className="text-zinc-500 text-center mt-8">
            {searchQuery ? "検索結果が見つかりませんでした" : EMPTY_STATES.SCHEDULES}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-zinc-900">
                        {schedule.title}
                      </h3>
                      <PriorityBadge priority={schedule.priority} />
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(schedule.date)}</span>
                    </div>
                    <TagList tags={schedule.tags} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                      aria-label="編集"
                    >
                      <Edit2 className="h-4 w-4 text-zinc-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                      aria-label="削除"
                    >
                      <Trash2 className="h-4 w-4 text-zinc-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingSchedule && (
        <EditModal
          isOpen={!!editingSchedule}
          onClose={() => setEditingSchedule(null)}
          onSave={handleSave}
          initialData={editingSchedule}
          type="SCHEDULE"
        />
      )}
    </MobileContainer>
  );
}
