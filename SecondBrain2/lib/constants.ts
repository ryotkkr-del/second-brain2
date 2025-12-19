// 定数定義

export const HEADER_HEIGHT = 64; // px

export const MIN_VIEWPORT_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export const ERROR_MESSAGES = {
  API_KEY_MISSING: "申し訳ございません。APIキーが設定されていません。設定を確認してください。",
  PARSE_ERROR: "申し訳ございません。応答の解析に失敗しました。もう一度お試しください。",
  VALIDATION_ERROR: "申し訳ございません。応答の形式が正しくありませんでした。もう一度お試しください。",
  GENERIC_ERROR: "申し訳ございません。エラーが発生しました。もう一度お試しください。",
} as const;

/**
 * 優先度バッジのスタイル（モノトーン）
 * 
 * Digital Zenデザイン原則に基づき、色ではなく背景の濃さで重要度を表現
 * - HIGH: 黒背景 + 白文字（最も重要）
 * - MEDIUM: 薄いグレー背景 + 黒文字（中程度）
 * - LOW: 白背景 + グレー文字 + ボーダー（低）
 */
export const PRIORITY_COLORS = {
  HIGH: "bg-zinc-900 text-zinc-50",
  MEDIUM: "bg-zinc-200 text-zinc-900",
  LOW: "bg-white text-zinc-500 border border-zinc-200",
} as const;

export const EMPTY_STATES = {
  TASKS: "タスクがありません",
  SCHEDULES: "スケジュールがありません",
  LOGS: "ログがありません",
  MESSAGES: "メッセージがありません",
} as const;
