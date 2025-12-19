/**
 * LocalStorage関連のユーティリティ関数
 */

import type { Task, Schedule, Log } from '@/lib/types';

const STORAGE_KEYS = {
  TASKS: 'secondbrain_tasks',
  SCHEDULES: 'secondbrain_schedules',
  LOGS: 'secondbrain_logs',
} as const;

/**
 * LocalStorageからデータを読み込む
 * Date型は文字列として保存されているため、復元が必要
 */
function loadFromStorage<T extends { createdAt: Date }>(
  key: string
): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Array<Omit<T, 'createdAt'> & { createdAt: string }>;
    
    // Date型を復元
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    })) as T[];
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return [];
  }
}

/**
 * LocalStorageにデータを保存
 */
function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

/**
 * タスクをLocalStorageから読み込む
 */
export function loadTasksFromStorage(): Task[] {
  return loadFromStorage<Task>(STORAGE_KEYS.TASKS);
}

/**
 * タスクをLocalStorageに保存
 */
export function saveTasksToStorage(tasks: Task[]): void {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

/**
 * スケジュールをLocalStorageから読み込む
 */
export function loadSchedulesFromStorage(): Schedule[] {
  return loadFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES);
}

/**
 * スケジュールをLocalStorageに保存
 */
export function saveSchedulesToStorage(schedules: Schedule[]): void {
  saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
}

/**
 * ログをLocalStorageから読み込む
 */
export function loadLogsFromStorage(): Log[] {
  return loadFromStorage<Log>(STORAGE_KEYS.LOGS);
}

/**
 * ログをLocalStorageに保存
 */
export function saveLogsToStorage(logs: Log[]): void {
  saveToStorage(STORAGE_KEYS.LOGS, logs);
}

