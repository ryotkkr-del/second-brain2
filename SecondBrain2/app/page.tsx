"use client";

import { MobileContainer } from "@/components/mobile-container";
import { Sidebar } from "@/components/sidebar";
import { ChatInput } from "@/components/chat-input";
import { Timeline } from "@/components/timeline";
import { Header } from "@/components/shared/header";
import { useState, useCallback } from "react";
import { analyzeInput } from "@/app/actions";
import type { TimelineItem } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { generateTimelineId } from "@/lib/utils/ids";
import { MIN_VIEWPORT_HEIGHT, ERROR_MESSAGES } from "@/lib/constants";
import type { ActionItem, Command } from "@/lib/zod";

const ERROR_MESSAGE = ERROR_MESSAGES.GENERIC_ERROR;

/**
 * アクションタイプに応じてデータを保存
 */
function saveActionData(
  action: ActionItem,
  { addTask, addSchedule, addLog }: ReturnType<typeof useData>
): void {
  const { type, title, date, tags, priority } = action;

  switch (type) {
    case "TASK":
      addTask({ title, tags, priority });
      break;
    case "SCHEDULE":
      if (date) {
        addSchedule({ title, date, tags, priority });
      }
      break;
    case "LOG":
      addLog({ title, tags, priority });
      break;
  }
}

/**
 * 複数のアクションを保存
 */
function saveActions(
  actions: ActionItem[],
  dataContext: ReturnType<typeof useData>
): void {
  actions.forEach((action) => {
    saveActionData(action, dataContext);
  });
}

/**
 * コマンドを実行（削除・編集）
 */
function executeCommand(
  command: Command,
  dataContext: ReturnType<typeof useData>
): boolean {
  const { type, targetType, targetTitle, newData } = command;

  let targetItem;
  switch (targetType) {
    case "TASK":
      targetItem = dataContext.findTaskByTitle(targetTitle);
      if (targetItem) {
        if (type === "DELETE") {
          dataContext.deleteTask(targetItem.id);
        } else if (type === "EDIT" && newData) {
          // 部分的な更新を適用（undefinedのフィールドは既存の値を保持）
          dataContext.updateTask(targetItem.id, {
            ...(newData.title !== undefined && { title: newData.title }),
            ...(newData.tags !== undefined && { tags: newData.tags }),
            ...(newData.priority !== undefined && { priority: newData.priority }),
          });
        }
      }
      break;
    case "SCHEDULE":
      targetItem = dataContext.findScheduleByTitle(targetTitle);
      if (targetItem) {
        if (type === "DELETE") {
          dataContext.deleteSchedule(targetItem.id);
        } else if (type === "EDIT" && newData) {
          // 部分的な更新を適用（undefinedのフィールドは既存の値を保持）
          dataContext.updateSchedule(targetItem.id, {
            ...(newData.title !== undefined && { title: newData.title }),
            ...(newData.date !== undefined && { date: newData.date }),
            ...(newData.tags !== undefined && { tags: newData.tags }),
            ...(newData.priority !== undefined && { priority: newData.priority }),
          });
        }
      }
      break;
    case "LOG":
      targetItem = dataContext.findLogByTitle(targetTitle);
      if (targetItem) {
        if (type === "DELETE") {
          dataContext.deleteLog(targetItem.id);
        } else if (type === "EDIT" && newData) {
          // 部分的な更新を適用（undefinedのフィールドは既存の値を保持）
          dataContext.updateLog(targetItem.id, {
            ...(newData.title !== undefined && { title: newData.title }),
            ...(newData.tags !== undefined && { tags: newData.tags }),
            ...(newData.priority !== undefined && { priority: newData.priority }),
          });
        }
      }
      break;
  }

  return !!targetItem;
}

/**
 * 複数のコマンドを実行
 */
function executeCommands(
  commands: Command[],
  dataContext: ReturnType<typeof useData>
): void {
  commands.forEach((command) => {
    executeCommand(command, dataContext);
  });
}

/**
 * タイムラインアイテムを作成
 */
function createTimelineItem(
  role: "user" | "ai",
  content: string,
  actions?: ActionItem[]
): TimelineItem {
  return {
    id: generateTimelineId(role),
    role,
    content,
    timestamp: new Date(),
    actions,
  };
}

export default function Home() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useData();

  const handleSend = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      // Optimistic UI: 即座にユーザーメッセージを追加
      const userItem = createTimelineItem("user", trimmedContent);
      setItems((prev) => [...prev, userItem]);
      setIsLoading(true);

      try {
        const response = await analyzeInput(trimmedContent);

        // AIの返信をチャットメッセージとして表示
        const aiItem = createTimelineItem("ai", response.reply, response.actions);
        setItems((prev) => [...prev, aiItem]);

        // 裏側でデータを保存（複数のアクションに対応）
        if (response.actions.length > 0) {
          saveActions(response.actions, dataContext);
        }

        // コマンドを実行（削除・編集）
        if (response.commands.length > 0) {
          executeCommands(response.commands, dataContext);
        }
      } catch (error) {
        const errorItem = createTimelineItem("ai", ERROR_MESSAGE);
        setItems((prev) => [...prev, errorItem]);
      } finally {
        setIsLoading(false);
      }
    },
    [dataContext]
  );

  return (
    <MobileContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Header title="SecondBrain" onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col pb-20" style={{ minHeight: MIN_VIEWPORT_HEIGHT }}>
        <Timeline items={items} />
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </MobileContainer>
  );
}
