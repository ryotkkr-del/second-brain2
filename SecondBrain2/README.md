# SecondBrain

ADHDを持つユーザーのための、脳の負担を極限まで減らすAIメモアプリ。

ユーザーは整理をせず、ただ入力するだけ。裏側でGemini APIが勝手に整理します。

## コンセプト

- **整理不要:** ユーザーは思考をそのまま入力するだけ
- **自動整理:** AIが自動的にタスク、スケジュール、メモに分類
- **モバイルファースト:** スマートフォンでの使用を前提としたUI/UX

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui
- **Icons:** Lucide React
- **AI Provider:** Google Generative AI (Gemini 1.5 Flash) via Vercel AI SDK
- **PWA:** Progressive Web App対応

## Getting Started

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を追加してください：

```env
GEMINI_API_KEY=your_api_key_here
```

**Gemini APIキーの取得方法:**
1. [Google AI Studio](https://aistudio.google.com/)にアクセス
2. 「Get API Key」をクリック
3. APIキーをコピーして `.env.local` に設定

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. ブラウザで開く

[http://localhost:3000](http://localhost:3000) を開いてアプリを確認してください。

## Project Structure

```
├── app/                    # Routes and pages
│   ├── page.tsx           # Home screen (Timeline & Input)
│   ├── api/
│   │   └── chat/
│   │       └── route.ts   # Gemini API endpoint
│   ├── tasks/             # Tasks page
│   ├── schedule/          # Schedule page
│   └── more/              # More/Settings page
├── components/            # Reusable UI components
│   ├── bottom-nav.tsx    # Bottom navigation bar
│   ├── chat-input.tsx    # Input field with mic & send buttons
│   ├── chat-message.tsx  # Chat message bubble component
│   ├── timeline.tsx      # Scrollable chat timeline
│   ├── mobile-container.tsx # Mobile-first container
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and Zod schemas
│   ├── utils.ts          # Utility functions (cn helper)
│   └── zod.ts            # Zod validation schemas
└── actions/              # Server Actions for Gemini API calls
```

## Design Principles

- **Mobile-First:** Designed primarily for smartphones (iPhone 14/15 Pro size)
- **Desktop View:** Content is centered with max-width (`max-w-md`) and border to simulate mobile app view
- **Minimalist UI:** Low cognitive load, no clutter
- **Fixed Layout:** Bottom navigation and input field are fixed for easy access
- **Color Scheme:** White (#FFFFFF) and gray (#F4F4F5) based minimalist design

## Features

### Current (Implemented)
- ✅ Mobile-first responsive layout
- ✅ Bottom navigation (Home, Tasks, Schedule, More)
- ✅ Chat-style timeline interface
- ✅ Fixed input field with microphone and send buttons
- ✅ User and AI message bubbles with avatars
- ✅ PWA-ready structure
- ✅ **Gemini API integration** - Automatic task/schedule extraction
- ✅ Loading states and error handling

### Planned (Future Implementation)
- 🔄 Voice input functionality
- 🔄 Task management interface
- 🔄 Schedule calendar view
- 🔄 Data persistence (localStorage/Database)
- 🔄 Settings and preferences

## API Integration

### Gemini API Endpoint

`/api/chat` エンドポイントが実装されています：

- **Method:** POST
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "メッセージ内容" },
      { "role": "assistant", "content": "AI応答" }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "message": "AI応答テキスト"
  }
  ```

### System Prompt

AIは以下の情報を自動的に抽出・整理します：
- **タスク**: 買い物、作業、連絡など
- **スケジュール**: 会議、予定、イベントなど
- **メモ**: その他の重要な情報

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

## Development Notes

- The app uses Gemini 1.5 Flash model for fast responses
- Conversation history is limited to the last 10 messages for context
- All components are designed with mobile-first approach
- The layout uses fixed positioning for bottom nav and input field
- Error handling is implemented for API failures

## Troubleshooting

### API Key Error
- `.env.local` ファイルが正しく作成されているか確認
- APIキーが正しく設定されているか確認
- サーバーを再起動してください（環境変数の変更後）

### API Response Error
- Gemini APIの利用制限を確認
- ネットワーク接続を確認
- ブラウザのコンソールでエラーログを確認
