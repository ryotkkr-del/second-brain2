"use client";

import { MobileContainer } from "@/components/mobile-container";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/shared/header";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { TagList } from "@/components/shared/tag-list";
import { EditModal } from "@/components/shared/edit-modal";
import { SearchBar } from "@/components/shared/search-bar";
import { CheckSquare, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useData } from "@/contexts/data-context";
import { EMPTY_STATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

/**
 * タスクページ（モノトーン）
 * 
 * Digital Zenデザイン原則に基づき、完全なモノトーンデザイン
 */
export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; tags: string[]; priority: "HIGH" | "MEDIUM" | "LOW" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks, updateTask, deleteTask, toggleTaskCompletion, searchTasks } = useData();

  // 検索結果をメモ化
  const filteredTasks = useMemo(() => {
    return searchTasks(searchQuery);
  }, [searchQuery, searchTasks]);

  const handleEdit = (task: Task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      tags: task.tags,
      priority: task.priority,
    });
  };

  const handleSave = (data: { title: string; tags: string[]; priority: "HIGH" | "MEDIUM" | "LOW" }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("このタスクを削除しますか？")) {
      deleteTask(id);
    }
  };

  const handleToggleCompletion = (id: string) => {
    toggleTaskCompletion(id);
  };

  return (
    <MobileContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header title="Tasks" onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="p-4 pb-20">
        {/* 検索バー */}
        <div className="mb-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="タイトルやタグで検索..."
          />
        </div>

        {/* 検索結果の表示 */}
        {filteredTasks.length === 0 ? (
          <p className="text-zinc-500 text-center mt-8">
            {searchQuery ? "検索結果が見つかりませんでした" : EMPTY_STATES.TASKS}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "bg-white border rounded-lg p-4 shadow-sm transition-all",
                  task.completed
                    ? "border-zinc-200 opacity-60"
                    : "border-zinc-200"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* 完了ボタン（モノトーン） */}
                  <button
                    onClick={() => handleToggleCompletion(task.id)}
                    className={cn(
                      "flex-shrink-0 mt-0.5 transition-colors",
                      task.completed
                        ? "text-zinc-900 hover:text-zinc-700"
                        : "text-zinc-400 hover:text-zinc-600"
                    )}
                    aria-label={task.completed ? "未完了に戻す" : "完了にする"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <CheckSquare className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {/* 完了済みタスクは打ち消し線 + グレー */}
                      <h3
                        className={cn(
                          "text-base font-semibold",
                          task.completed
                            ? "text-zinc-400 line-through"
                            : "text-zinc-900"
                        )}
                      >
                        {task.title}
                      </h3>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <TagList tags={task.tags} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                      aria-label="編集"
                    >
                      <Edit2 className="h-4 w-4 text-zinc-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
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

      {editingTask && (
        <EditModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
          initialData={editingTask}
          type="TASK"
        />
      )}
    </MobileContainer>
  );
}
