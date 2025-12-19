import { z } from "zod";

// アクションアイテムのスキーマ
const actionItemSchema = z.object({
  type: z.enum(['TASK', 'SCHEDULE', 'LOG']),
  title: z.string().describe('タスク/予定/メモのタイトル'),
  date: z.string().optional().describe('ISO 8601形式の日付 (YYYY-MM-DDTHH:mm:ss)。SCHEDULEの場合のみ必須'),
  tags: z.array(z.string()).describe('内容に関連するタグを2-3個'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('緊急度や重要度'),
});

// 編集用の部分的なデータスキーマ（すべてのフィールドがオプショナル）
const partialActionItemSchema = z.object({
  type: z.enum(['TASK', 'SCHEDULE', 'LOG']).optional(),
  title: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
});

// コマンドタイプ
const commandSchema = z.object({
  type: z.enum(['DELETE', 'EDIT']),
  targetType: z.enum(['TASK', 'SCHEDULE', 'LOG']),
  targetTitle: z.string().describe('削除・編集対象のタイトル（部分一致で検索）'),
  newData: partialActionItemSchema.optional().describe('EDITの場合のみ：編集後のデータ（変更されたフィールドのみを含める）'),
});

// AI応答のスキーマ
export const aiResponseSchema = z.object({
  reply: z.string().describe('ユーザーへの自然で親しげな日本語の返答'),
  actions: z.array(actionItemSchema).describe('登録するデータの配列。複数のタスク/予定/メモを個別に認識してください。挨拶や不明瞭な入力の場合は空配列[]'),
  commands: z.array(commandSchema).describe('削除・編集コマンドの配列。ユーザーが「削除」「編集」などの指示をした場合に使用'),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
export type ActionItem = z.infer<typeof actionItemSchema>;
export type Command = z.infer<typeof commandSchema>;
