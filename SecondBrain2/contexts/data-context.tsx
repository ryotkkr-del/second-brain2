"use client";

/**
 * グローバル状態管理 - DataContext
 * 
 * このContextは、アプリ全体でタスク、スケジュール、ログのデータを管理します。
 * 設計書の「グローバル状態管理」セクションに基づいて実装されています。
 * 
 * @see APP_DETAILED_DESCRIPTION.md - グローバル状態管理セクション
 */

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect, useRef } from "react";
import type { Task, Schedule, Log } from "@/lib/types";
import { generateTaskId, generateScheduleId, generateLogId } from "@/lib/utils/ids";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSchedulesFromStorage,
  saveSchedulesToStorage,
  loadLogsFromStorage,
  saveLogsToStorage,
} from "@/lib/utils/storage";
import { searchTasks, searchSchedules, searchLogs } from "@/lib/utils/search";

/**
 * DataContextの型定義
 * 
 * 提供される機能:
 * - データ配列: tasks, schedules, logs
 * - 追加関数: addTask, addSchedule, addLog
 * - 更新関数: updateTask, updateSchedule, updateLog
 * - 削除関数: deleteTask, deleteSchedule, deleteLog
 * - 完了切り替え: toggleTaskCompletion
 * - 検索関数: findTaskByTitle, findScheduleByTitle, findLogByTitle
 * - 検索関数（タイトル・タグ）: searchTasks, searchSchedules, searchLogs
 */
type DataContextType = {
  // データ配列
  tasks: Task[];
  schedules: Schedule[];
  logs: Log[];

  // 追加関数
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  addSchedule: (schedule: Omit<Schedule, "id" | "createdAt">) => void;
  addLog: (log: Omit<Log, "id" | "createdAt">) => void;

  // 更新関数
  updateTask: (id: string, task: Partial<Omit<Task, "id" | "createdAt" | "completed">>) => void;
  updateSchedule: (id: string, schedule: Partial<Omit<Schedule, "id" | "createdAt">>) => void;
  updateLog: (id: string, log: Partial<Omit<Log, "id" | "createdAt">>) => void;

  // 完了切り替え
  toggleTaskCompletion: (id: string) => void;

  // 削除関数
  deleteTask: (id: string) => void;
  deleteSchedule: (id: string) => void;
  deleteLog: (id: string) => void;

  // 検索関数（タイトルのみ、部分一致）
  findTaskByTitle: (title: string) => Task | undefined;
  findScheduleByTitle: (title: string) => Schedule | undefined;
  findLogByTitle: (title: string) => Log | undefined;

  // 検索関数（タイトル・タグ、部分一致）
  searchTasks: (query: string) => Task[];
  searchSchedules: (query: string) => Schedule[];
  searchLogs: (query: string) => Log[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * タイトルでアイテムを検索（部分一致）
 * 
 * @param items - 検索対象のアイテム配列
 * @param searchTitle - 検索するタイトル
 * @returns 見つかったアイテム、見つからない場合はundefined
 */
function findItemByTitle<T extends { title: string }>(
  items: T[],
  searchTitle: string
): T | undefined {
  const normalizedSearch = searchTitle.trim().toLowerCase();
  return items.find(
    (item) => item.title.toLowerCase().includes(normalizedSearch) ||
              normalizedSearch.includes(item.title.toLowerCase())
  );
}

/**
 * データ管理用のContext Provider
 * 
 * このProviderは、アプリ全体でタスク、スケジュール、ログのデータを管理します。
 * 
 * 実装内容:
 * - State管理: tasks, schedules, logs の配列を管理
 * - CRUD操作: 追加、更新、削除、検索機能を提供
 * - LocalStorage永続化: データを自動的に保存・読み込み（デバウンス処理付き）
 * - パフォーマンス最適化: useMemoとuseCallbackでメモ化
 * 
 * @param children - 子コンポーネント
 */
export function DataProvider({ children }: { children: ReactNode }) {
  // State管理: データ配列（初期値はLocalStorageから読み込む）
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  // 初期化フラグ（初期読み込み時は保存しない）
  const isInitialized = useRef(false);
  const saveTimeoutRef = useRef<{
    tasks: NodeJS.Timeout | null;
    schedules: NodeJS.Timeout | null;
    logs: NodeJS.Timeout | null;
  }>({ tasks: null, schedules: null, logs: null });

  // LocalStorageから初期データを読み込む（マウント時のみ）
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    const loadedSchedules = loadSchedulesFromStorage();
    const loadedLogs = loadLogsFromStorage();

    setTasks(loadedTasks);
    setSchedules(loadedSchedules);
    setLogs(loadedLogs);
    isInitialized.current = true;
  }, []);

  // データが変更されるたびにLocalStorageに保存（デバウンス処理）
  useEffect(() => {
    if (!isInitialized.current) return;

    // 既存のタイマーをクリア
    if (saveTimeoutRef.current.tasks) {
      clearTimeout(saveTimeoutRef.current.tasks);
    }

    // 500ms後に保存（デバウンス）
    saveTimeoutRef.current.tasks = setTimeout(() => {
      saveTasksToStorage(tasks);
    }, 500);

    return () => {
      if (saveTimeoutRef.current.tasks) {
        clearTimeout(saveTimeoutRef.current.tasks);
      }
    };
  }, [tasks]);

  useEffect(() => {
    if (!isInitialized.current) return;

    if (saveTimeoutRef.current.schedules) {
      clearTimeout(saveTimeoutRef.current.schedules);
    }

    saveTimeoutRef.current.schedules = setTimeout(() => {
      saveSchedulesToStorage(schedules);
    }, 500);

    return () => {
      if (saveTimeoutRef.current.schedules) {
        clearTimeout(saveTimeoutRef.current.schedules);
      }
    };
  }, [schedules]);

  useEffect(() => {
    if (!isInitialized.current) return;

    if (saveTimeoutRef.current.logs) {
      clearTimeout(saveTimeoutRef.current.logs);
    }

    saveTimeoutRef.current.logs = setTimeout(() => {
      saveLogsToStorage(logs);
    }, 500);

    return () => {
      if (saveTimeoutRef.current.logs) {
        clearTimeout(saveTimeoutRef.current.logs);
      }
    };
  }, [logs]);

  /**
   * タスクを追加
   * 
   * @param task - 追加するタスク（id, createdAt, completedは自動生成）
   */
  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "completed">) => {
    setTasks((prev) => {
      const newTask: Task = {
        ...task,
        id: generateTaskId(),
        completed: false, // デフォルトで未完了
        createdAt: new Date(),
      };
      return [...prev, newTask];
    });
  }, []);

  /**
   * スケジュールを追加
   * 
   * @param schedule - 追加するスケジュール（id, createdAtは自動生成）
   */
  const addSchedule = useCallback((schedule: Omit<Schedule, "id" | "createdAt">) => {
    setSchedules((prev) => {
      const newSchedule: Schedule = {
        ...schedule,
        id: generateScheduleId(),
        createdAt: new Date(),
      };
      return [...prev, newSchedule];
    });
  }, []);

  /**
   * ログを追加
   * 
   * @param log - 追加するログ（id, createdAtは自動生成）
   */
  const addLog = useCallback((log: Omit<Log, "id" | "createdAt">) => {
    setLogs((prev) => {
      const newLog: Log = {
        ...log,
        id: generateLogId(),
        createdAt: new Date(),
      };
      return [...prev, newLog];
    });
  }, []);

  /**
   * タスクを更新
   * 
   * @param id - 更新するタスクのID
   * @param updates - 更新するフィールド（部分更新可能）
   */
  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id" | "createdAt" | "completed">>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  /**
   * スケジュールを更新
   * 
   * @param id - 更新するスケジュールのID
   * @param updates - 更新するフィールド（部分更新可能）
   */
  const updateSchedule = useCallback((id: string, updates: Partial<Omit<Schedule, "id" | "createdAt">>) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === id ? { ...schedule, ...updates } : schedule))
    );
  }, []);

  /**
   * ログを更新
   * 
   * @param id - 更新するログのID
   * @param updates - 更新するフィールド（部分更新可能）
   */
  const updateLog = useCallback((id: string, updates: Partial<Omit<Log, "id" | "createdAt">>) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );
  }, []);

  /**
   * タスクの完了/未完了を切り替え
   * 
   * @param id - 切り替えるタスクのID
   */
  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  /**
   * タスクを削除
   * 
   * @param id - 削除するタスクのID
   */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  /**
   * スケジュールを削除
   * 
   * @param id - 削除するスケジュールのID
   */
  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  }, []);

  /**
   * ログを削除
   * 
   * @param id - 削除するログのID
   */
  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  /**
   * タイトルでタスクを検索（部分一致）
   * 
   * @param title - 検索するタイトル
   * @returns 見つかったタスク、見つからない場合はundefined
   */
  const findTaskByTitle = useCallback((title: string) => {
    return findItemByTitle(tasks, title);
  }, [tasks]);

  /**
   * タイトルでスケジュールを検索（部分一致）
   * 
   * @param title - 検索するタイトル
   * @returns 見つかったスケジュール、見つからない場合はundefined
   */
  const findScheduleByTitle = useCallback((title: string) => {
    return findItemByTitle(schedules, title);
  }, [schedules]);

  /**
   * タイトルでログを検索（部分一致）
   * 
   * @param title - 検索するタイトル
   * @returns 見つかったログ、見つからない場合はundefined
   */
  const findLogByTitle = useCallback((title: string) => {
    return findItemByTitle(logs, title);
  }, [logs]);

  /**
   * タスクを検索（タイトル・タグ、部分一致）
   * 
   * @param query - 検索クエリ
   * @returns 検索結果のタスク配列
   */
  const searchTasksWithQuery = useCallback((query: string) => {
    return searchTasks(tasks, query);
  }, [tasks]);

  /**
   * スケジュールを検索（タイトル・タグ、部分一致）
   * 
   * @param query - 検索クエリ
   * @returns 検索結果のスケジュール配列
   */
  const searchSchedulesWithQuery = useCallback((query: string) => {
    return searchSchedules(schedules, query);
  }, [schedules]);

  /**
   * ログを検索（タイトル・タグ、部分一致）
   * 
   * @param query - 検索クエリ
   * @returns 検索結果のログ配列
   */
  const searchLogsWithQuery = useCallback((query: string) => {
    return searchLogs(logs, query);
  }, [logs]);

  // Context の値をメモ化して再レンダリングを削減
  // パフォーマンス最適化: 依存配列の値が変わったときのみ再計算
  const value = useMemo(
    () => ({
      // データ配列
      tasks,
      schedules,
      logs,

      // 追加関数
      addTask,
      addSchedule,
      addLog,

      // 更新関数
      updateTask,
      updateSchedule,
      updateLog,

      // 完了切り替え
      toggleTaskCompletion,

      // 削除関数
      deleteTask,
      deleteSchedule,
      deleteLog,

      // 検索関数（タイトルのみ）
      findTaskByTitle,
      findScheduleByTitle,
      findLogByTitle,

      // 検索関数（タイトル・タグ）
      searchTasks: searchTasksWithQuery,
      searchSchedules: searchSchedulesWithQuery,
      searchLogs: searchLogsWithQuery,
    }),
    [
      tasks,
      schedules,
      logs,
      addTask,
      addSchedule,
      addLog,
      updateTask,
      updateSchedule,
      updateLog,
      toggleTaskCompletion,
      deleteTask,
      deleteSchedule,
      deleteLog,
      findTaskByTitle,
      findScheduleByTitle,
      findLogByTitle,
      searchTasksWithQuery,
      searchSchedulesWithQuery,
      searchLogsWithQuery,
    ]
  );

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * DataContextを使用するためのカスタムフック
 * 
 * このフックを使用することで、コンポーネントからDataContextの値にアクセスできます。
 * 
 * @returns DataContextType - データ配列とCRUD関数を含むオブジェクト
 * @throws Error - DataProviderの外で使用された場合
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tasks, addTask, toggleTaskCompletion } = useData();
 *   
 *   return (
 *     <div>
 *       {tasks.map(task => (
 *         <div key={task.id}>
 *           {task.title}
 *           <button onClick={() => toggleTaskCompletion(task.id)}>
 *             完了
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
