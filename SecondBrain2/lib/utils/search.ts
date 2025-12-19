/**
 * 検索関連のユーティリティ関数
 */

import type { Task, Schedule, Log } from '@/lib/types';

/**
 * タイトルとタグでアイテムを検索（部分一致）
 * 
 * @param items - 検索対象のアイテム配列
 * @param query - 検索クエリ（タイトルまたはタグに一致）
 * @returns 検索結果の配列
 */
export function searchItems<T extends { title: string; tags: string[] }>(
  items: T[],
  query: string
): T[] {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    // タイトルで検索（部分一致）
    const titleMatch = item.title.toLowerCase().includes(normalizedQuery);

    // タグで検索（部分一致）
    const tagMatch = item.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );

    return titleMatch || tagMatch;
  });
}

/**
 * タスクを検索
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  return searchItems(tasks, query);
}

/**
 * スケジュールを検索
 */
export function searchSchedules(schedules: Schedule[], query: string): Schedule[] {
  return searchItems(schedules, query);
}

/**
 * ログを検索
 */
export function searchLogs(logs: Log[], query: string): Log[] {
  return searchItems(logs, query);
}

