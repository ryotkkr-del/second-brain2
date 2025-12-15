import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Gemini 1.5 Flash を使用
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    // 最新のユーザーメッセージを取得
    const userMessage = messages[messages.length - 1]?.content;
    if (!userMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `あなたは「SecondBrain」というADHDを持つユーザーのためのAIアシスタントです。
ユーザーの入力から、以下の情報を自動的に抽出・整理してください：

1. **タスク**: 買い物、作業、連絡など、実行すべき行動
2. **スケジュール**: 会議、予定、イベントなど、時間が指定された予定
3. **メモ**: その他の重要な情報

応答は簡潔に、以下の形式で返してください：
- タスクが含まれる場合: 「✓ [タスク名] タスクを作成しました」
- スケジュールが含まれる場合: 「✓ [予定名]を予定に追加しました\n✓ [日時]に設定しました」
- リマインダーを設定した場合: 「✓ [時刻]にリマインダーを設定しました」`,
    });

    // 会話履歴を構築（最後の10メッセージまで、現在のメッセージを除く）
    const historyMessages = messages.slice(-10, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // チャット履歴を使用して会話を開始
    const chat = model.startChat({
      history: historyMessages,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to get response from Gemini API",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

