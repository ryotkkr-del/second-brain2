# Gemini API セットアップガイド

## 1. Gemini APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「Get API Key」ボタンをクリック
4. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
5. APIキーをコピー

## 2. 環境変数の設定

プロジェクトのルートディレクトリ（`package.json`がある場所）に `.env.local` ファイルを作成します。

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# macOS/Linux
touch .env.local
```

`.env.local` ファイルに以下の内容を追加：

```env
GEMINI_API_KEY=your_api_key_here
```

`your_api_key_here` の部分を、先ほどコピーしたAPIキーに置き換えてください。

## 3. 環境変数の確認

`.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。
これは安全のためです（APIキーが漏洩しないように）。

## 4. 開発サーバーの再起動

環境変数を変更した後は、開発サーバーを再起動してください：

```bash
# サーバーを停止（Ctrl+C）
# その後、再起動
npm run dev
```

## 5. 動作確認

1. ブラウザで [http://localhost:3000](http://localhost:3000) を開く
2. 入力欄にメッセージを入力（例：「牛乳を買う」）
3. 送信ボタンをクリック
4. AIからの応答が表示されることを確認

## トラブルシューティング

### APIキーエラーが表示される場合

- `.env.local` ファイルが正しい場所にあるか確認
- APIキーが正しく設定されているか確認（余分なスペースや引用符がないか）
- 開発サーバーを再起動

### API応答が返ってこない場合

- ブラウザのコンソール（F12）でエラーを確認
- ネットワーク接続を確認
- Gemini APIの利用制限を確認

### 環境変数が読み込まれない場合

- ファイル名が `.env.local` であることを確認（`.env` ではない）
- プロジェクトのルートディレクトリにあることを確認
- 開発サーバーを再起動

