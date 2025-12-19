'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiResponseSchema, type AIResponse } from '@/lib/zod';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getTodayDateString } from '@/lib/utils/date';

/**
 * AIプロンプトを生成
 */
function createPrompt(input: string, todayStr: string): string {
  return `あなたは「優秀で気が利く個人の秘書」です。
ユーザーの入力に対し、短く親しげな日本語で返事をしてください。
同時に、その内容を TASK / SCHEDULE / LOG のいずれかに分類してデータを抽出してください。

**重要: 複数の項目を認識してください**
- ユーザーが「線形代数の課題　ディープラーニングの勉強」のように複数の項目を一度に入力した場合、それぞれを個別のアイテムとして認識してください
- 「、」「　」「、」「と」などの区切り文字で分割されている場合、それぞれを別々のアイテムとして扱ってください
- 例：「牛乳を買う、パンを買う」→ 2つのTASK
- 例：「明日10時に会議、来週の打ち合わせ」→ 2つのSCHEDULE

**削除・編集コマンドの認識:**
- ユーザーが「削除」「消して」「取り消し」などの言葉を使った場合、commands配列にDELETEコマンドを追加してください
- ユーザーが「編集」「変更」「修正」などの言葉を使った場合、commands配列にEDITコマンドを追加してください
- targetTitleは、削除・編集対象のタイトルを推測してください（部分一致で検索されます）
- EDITコマンドのnewDataには、**変更されたフィールドのみ**を含めてください（例：時間だけ変更する場合はdateのみ）
- 例：「線形代数の課題を削除して」→ commands: [{ type: "DELETE", targetType: "TASK", targetTitle: "線形代数の課題" }]
- 例：「会議の時間を15時に変更」→ commands: [{ type: "EDIT", targetType: "SCHEDULE", targetTitle: "会議", newData: { date: "2024-01-15T15:00:00" } }]
- 例：「会議のタイトルを「打ち合わせ」に変更」→ commands: [{ type: "EDIT", targetType: "SCHEDULE", targetTitle: "会議", newData: { title: "打ち合わせ" } }]
- 削除・編集の指示がない場合は、commands を空配列 [] にしてください

**返答のルール:**
- ユーザーの入力に対して、自然で親しげな日本語で返事をしてください
- 複数の項目を登録した場合は、その数を伝えてください（例：「了解です。2つのタスクを登録しました。」）
- 削除・編集を行った場合は、その内容を伝えてください（例：「了解です。線形代数の課題を削除しました。」）
- 挨拶や不明瞭な入力の場合は、聞き返してください（例：「もう少し詳しく教えていただけますか？」）
- 返答は1-2文程度にしてください

**データ抽出のルール:**
- **TASK:** 明確な行動が必要なもの（買う、やる、行く、連絡する など）
- **SCHEDULE:** 特定の日時が決まっているもの（会議、約束、イベント など）
- **LOG:** それ以外（アイデア、感情、事実のメモ など）
- 挨拶や不明瞭な入力の場合は、actions を空配列 [] にしてください

**今日の日付:** ${todayStr}
**相対的な表現（「明日」「来週」など）は今日の日付を基準に解釈してください**

以下のJSON形式で必ず1つのオブジェクトを返してください：
{
  "reply": "ユーザーへの自然な返答",
  "actions": [
    {
      "type": "TASK" | "SCHEDULE" | "LOG",
      "title": "タイトル",
      "date": "ISO 8601形式（SCHEDULEの場合のみ必須、例: 2024-01-15T10:00:00）",
      "tags": ["タグ1", "タグ2"],
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "commands": [
    {
      "type": "DELETE" | "EDIT",
      "targetType": "TASK" | "SCHEDULE" | "LOG",
      "targetTitle": "削除・編集対象のタイトル",
      "newData": {
        "type": "TASK" | "SCHEDULE" | "LOG" (オプショナル),
        "title": "タイトル" (オプショナル),
        "date": "ISO 8601形式" (オプショナル),
        "tags": ["タグ1", "タグ2"] (オプショナル),
        "priority": "HIGH" | "MEDIUM" | "LOW" (オプショナル)
      } // EDITの場合のみ、変更されたフィールドのみを含める
    }
  ]
}

**重要:** 
- actions と commands は必ず配列として返してください（空配列でも可）
- SCHEDULE の場合は date フィールドが必須です
- EDITコマンドのnewDataには、変更されたフィールドのみを含めてください（すべてのフィールドは不要）
- tags は必ず配列形式で返してください（例: ["タグ1", "タグ2"]）
- priority は必ず "HIGH" | "MEDIUM" | "LOW" のいずれかで返してください

**ユーザーの入力:** "${input}"`;
}

/**
 * アクションアイテムを正規化（デフォルト値で補完）
 */
function normalizeActionItem(item: unknown): unknown {
  if (typeof item !== 'object' || item === null) {
    return {
      type: 'LOG',
      title: '',
      tags: [],
      priority: 'MEDIUM',
    };
  }

  const obj = item as Record<string, unknown>;
  return {
    type: obj.type || 'LOG',
    title: typeof obj.title === 'string' ? obj.title : '',
    date: typeof obj.date === 'string' ? obj.date : undefined,
    tags: Array.isArray(obj.tags) ? obj.tags.filter((t): t is string => typeof t === 'string') : [],
    priority: obj.priority === 'HIGH' || obj.priority === 'MEDIUM' || obj.priority === 'LOW' ? obj.priority : 'MEDIUM',
  };
}

/**
 * コマンドを正規化（デフォルト値で補完）
 */
function normalizeCommand(cmd: unknown): unknown {
  if (typeof cmd !== 'object' || cmd === null) {
    return {
      type: 'DELETE',
      targetType: 'TASK',
      targetTitle: '',
      newData: undefined,
    };
  }

  const obj = cmd as Record<string, unknown>;
  const normalized: Record<string, unknown> = {
    type: obj.type === 'DELETE' || obj.type === 'EDIT' ? obj.type : 'DELETE',
    targetType: obj.targetType === 'TASK' || obj.targetType === 'SCHEDULE' || obj.targetType === 'LOG' ? obj.targetType : 'TASK',
    targetTitle: typeof obj.targetTitle === 'string' ? obj.targetTitle : '',
  };

  if (obj.newData !== undefined && obj.newData !== null) {
    normalized.newData = normalizeActionItem(obj.newData);
  }

  return normalized;
}

/**
 * パースとバリデーションを実行（デフォルト値で補完）
 */
function validateResponse(parsed: unknown): AIResponse | null {
  // デフォルト値で補完
  const withDefaults: Record<string, unknown> = {
    reply: '',
    actions: [],
    commands: [],
    ...(typeof parsed === 'object' && parsed !== null ? parsed : {}),
  };

  // actions配列の各要素を正規化
  if (Array.isArray(withDefaults.actions)) {
    withDefaults.actions = withDefaults.actions.map(normalizeActionItem);
  } else {
    withDefaults.actions = [];
  }

  // commands配列の各要素を正規化
  if (Array.isArray(withDefaults.commands)) {
    withDefaults.commands = withDefaults.commands.map(normalizeCommand);
  } else {
    withDefaults.commands = [];
  }

  // replyが文字列でない場合は空文字列に
  if (typeof withDefaults.reply !== 'string') {
    withDefaults.reply = '';
  }

  const validated = aiResponseSchema.safeParse(withDefaults);
  if (!validated.success) {
    // 常にエラー詳細をログ出力（本番環境でも問題を把握するため）
    console.error('Validation error:', JSON.stringify(validated.error.errors, null, 2));
    console.error('Normalized object:', JSON.stringify(withDefaults, null, 2));
    return null;
  }
  return validated.data;
}

/**
 * モデルを初期化してAPI呼び出しを実行
 * フォールバックモデルを使用してエラーを回避
 */
async function callGeminiWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string
): Promise<string> {
  // 優先順位順にモデルを試行
  const modelNames = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ];

  let lastError: Error | null = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      
      // Native JSON Modeでは、text()メソッドがJSON文字列を返す
      let jsonText: string;
      try {
        jsonText = response.text();
      } catch {
        // フォールバック: partsから直接取得
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts && parts.length > 0 && 'text' in parts[0]) {
          jsonText = parts[0].text as string;
        } else {
          throw new Error("Failed to extract JSON from response");
        }
      }

      return jsonText.trim();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // 次のモデルを試行
      continue;
    }
  }

  // すべてのモデルで失敗した場合
  throw lastError || new Error("All models failed");
}

/**
 * ユーザー入力を分析し、AI応答を返す
 * 
 * パフォーマンス最適化:
 * - Native JSON Mode (responseMimeType: "application/json") を有効化してパースエラーを防止
 * - フォールバックモデルを使用してエラーを回避
 */
export async function analyzeInput(input: string): Promise<AIResponse> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: ERROR_MESSAGES.API_KEY_MISSING,
      actions: [],
      commands: [],
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const todayStr = getTodayDateString();
    const prompt = createPrompt(input, todayStr);
    
    // API呼び出し（フォールバックモデルを使用）
    const jsonText = await callGeminiWithFallback(genAI, prompt);
    
    // JSONパース（Native JSON Modeにより、通常は有効なJSONが返る）
    const parsed = JSON.parse(jsonText.trim()) as unknown;
    
    // バリデーション（デフォルト値で補完）
    const validated = validateResponse(parsed);
    if (!validated) {
      return {
        reply: ERROR_MESSAGES.VALIDATION_ERROR,
        actions: [],
        commands: [],
      };
    }

    return validated;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analyze input error:', error);
    return {
      reply: `${ERROR_MESSAGES.GENERIC_ERROR}: ${errorMessage}`,
      actions: [],
      commands: [],
    };
  }
}
