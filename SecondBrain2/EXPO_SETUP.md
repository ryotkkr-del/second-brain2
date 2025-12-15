# Expo セットアップガイド

このプロジェクトをExpoで実行するための手順です。

## 前提条件

- Node.js 18以上
- npm または yarn
- Expo Goアプリ（iOS/Androidデバイス用）またはエミュレーター

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルに以下を追加してください：

```env
GEMINI_API_KEY=your_api_key_here
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**注意**: ExpoアプリからNext.jsのAPIルートにアクセスする場合、開発環境では以下のいずれかの方法が必要です：

- **方法1**: Next.js開発サーバーを別ターミナルで起動（`npm run dev`）
- **方法2**: 本番環境のAPI URLを使用

### 3. Expo開発サーバーの起動

```bash
npm run expo
```

または、特定のプラットフォームで起動：

```bash
# iOS
npm run expo:ios

# Android
npm run expo:android

# Web
npm run expo:web
```

### 4. アプリの実行

- **実機**: Expo Goアプリを開き、QRコードをスキャン
- **エミュレーター**: 自動的にエミュレーターで起動します

## プロジェクト構造

```
├── app/
│   ├── _layout.tsx      # Expo Routerのルートレイアウト
│   ├── index.tsx        # ホーム画面（Timeline & Input）
│   ├── tasks.tsx        # タスク画面
│   ├── schedule.tsx     # スケジュール画面
│   └── more.tsx         # 設定画面
├── components/
│   ├── *.native.tsx     # React Native用コンポーネント
│   └── *.tsx            # Next.js用コンポーネント（Web）
├── app.json             # Expo設定ファイル
├── babel.config.js      # Babel設定（NativeWind用）
└── metro.config.js      # Metro bundler設定
```

## 注意事項

1. **API接続**: ExpoアプリからNext.jsのAPIルートにアクセスする場合、同じネットワーク上にある必要があります。開発時は `localhost` ではなく、PCのIPアドレスを使用してください。

2. **プラットフォーム固有のコード**: `.native.tsx` 拡張子のファイルはReact Native専用、`.tsx` ファイルはNext.js専用です。Expoは自動的に適切なファイルを選択します。

3. **NativeWind**: Tailwind CSSクラスをReact Nativeで使用するためにNativeWindを使用しています。スタイリングは `className` プロパティで指定できます。

## トラブルシューティング

### API接続エラー

- Next.js開発サーバーが起動しているか確認
- 同じWi-Fiネットワークに接続しているか確認
- `.env.local` の `EXPO_PUBLIC_API_URL` が正しいか確認

### スタイリングが適用されない

- `npm install` を再実行
- Metro bundlerを再起動（`r` キーを押す）
- キャッシュをクリア: `npx expo start -c`

### アイコンが表示されない

- `lucide-react-native` が正しくインストールされているか確認

