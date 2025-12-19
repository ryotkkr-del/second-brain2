/**
 * データ型定義
 * 
 * 設計書の「データ構造」セクションに基づいて定義されています。
 * @see APP_DETAILED_DESCRIPTION.md - データ構造セクション
 */

import type { ActionItem } from '@/lib/zod';

/**
 * タスク型
 * 
 * 明確な行動が必要なもの（買う、やる、行く、連絡する など）
 * 
 * @property id - 一意のID（自動生成）
 * @property title - タスクのタイトル
 * @property tags - タグの配列
 * @property priority - 優先度（HIGH, MEDIUM, LOW）
 * @property completed - 完了状態（true: 完了, false: 未完了）
 * @property createdAt - 作成日時
 */
export type Task = {
  id: string;
  title: string;
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  createdAt: Date;
};

/**
 * スケジュール型
 * 
 * 特定の日時が決まっているもの（会議、約束、イベント など）
 * 
 * @property id - 一意のID（自動生成）
 * @property title - スケジュールのタイトル
 * @property date - 日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）
 * @property tags - タグの配列
 * @property priority - 優先度（HIGH, MEDIUM, LOW）
 * @property createdAt - 作成日時
 */
export type Schedule = {
  id: string;
  title: string;
  date: string; // ISO 8601形式
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: Date;
};

/**
 * ログ型
 * 
 * それ以外（アイデア、感情、事実のメモ など）
 * 
 * @property id - 一意のID（自動生成）
 * @property title - ログのタイトル
 * @property tags - タグの配列
 * @property priority - 優先度（HIGH, MEDIUM, LOW）
 * @property createdAt - 作成日時
 */
export type Log = {
  id: string;
  title: string;
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: Date;
};

// AI応答型（zodからインポート）
export type { AIResponse, ActionItem } from '@/lib/zod';

/**
 * タイムラインアイテム型
 * 
 * チャットインターフェースで表示されるメッセージアイテム
 * 
 * @property id - 一意のID（自動生成）
 * @property role - メッセージの送信者（user: ユーザー, ai: AI）
 * @property content - メッセージ内容
 * @property timestamp - 送信日時
 * @property actions - 裏側で登録されたデータ（オプション、複数対応）
 */
export type TimelineItem = {
  id: string;
  role: 'user' | 'ai';
  content: string; // メッセージ内容
  timestamp: Date;
  actions?: ActionItem[]; // 裏側で登録されたデータ（オプション、複数対応）
};
