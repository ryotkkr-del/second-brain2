# Vercelデプロイガイド

このガイドでは、Next.jsプロジェクトをVercelにデプロイして、スマホ実機で動作確認する手順を説明します。

## 📋 前提条件

- GitHubアカウント（推奨）またはVercelアカウント
- `.env.local` ファイルに `GEMINI_API_KEY` が設定されていること

## 🚀 ステップ1: Vercel CLIでデプロイ

### 1-1. ターミナルでプロジェクトディレクトリに移動

```bash
cd C:\Users\ryo9t\SecondBrain2
```

### 1-2. Vercelにデプロイ

```bash
npx vercel
```

### 1-3. 質問への回答

初回デプロイ時、以下の質問が順番に表示されます。**太字の部分**を入力してください：

#### Q1: Set up and deploy "C:\Users\ryo9t\SecondBrain2"?
```
? Set up and deploy "C:\Users\ryo9t\SecondBrain2"? [y/N]
```
**回答: `y` を入力してEnter**

#### Q2: Which scope do you want to deploy to?
```
? Which scope do you want to deploy to?
  > Your Name (your-email@example.com)
```
**回答: 自分のアカウントを選択（矢印キーで移動、Enterで決定）**

#### Q3: Link to existing project?
```
? Link to existing project? [y/N]
```
**回答: `N` を入力してEnter**（初回は新規プロジェクト）

#### Q4: What's your project's name?
```
? What's your project's name? secondbrain2
```
**回答: そのままEnter**（デフォルトの `secondbrain2` でOK）

#### Q5: In which directory is your code located?
```
? In which directory is your code located? ./
```
**回答: そのままEnter**（現在のディレクトリでOK）

#### Q6: Want to override the settings?
```
? Want to override the settings? [y/N]
```
**回答: `N` を入力してEnter**（デフォルト設定でOK）

### 1-4. デプロイ完了

デプロイが完了すると、以下のようなURLが表示されます：

```
✅ Production: https://secondbrain2-xxxxx.vercel.app
```

**このURLをメモしておいてください！**

---

## 🔐 ステップ2: 環境変数の設定（最重要）

デプロイは完了しましたが、まだGemini APIが動きません。環境変数を設定する必要があります。

### 方法A: CLIコマンドで設定（推奨・簡単）

ターミナルで以下のコマンドを実行：

```bash
npx vercel env add GEMINI_API_KEY production
```

#### 質問への回答：

#### Q1: What's the value of GEMINI_API_KEY?
```
? What's the value of GEMINI_API_KEY?
```
**回答: `.env.local` ファイルに記載されている `GEMINI_API_KEY` の値をコピー&ペーストしてEnter**

#### Q2: Add GEMINI_API_KEY to which Environments?
```
? Add GEMINI_API_KEY to which Environments (select multiple)? 
  ◯ Production
  ◯ Preview  
  ◯ Development
```
**回答: `Production` を選択（スペースキーで選択、Enterで決定）**

**重要**: PreviewとDevelopmentにも設定する場合は、両方選択してください。

### 方法B: Vercelダッシュボードで設定

1. ブラウザで https://vercel.com/dashboard にアクセス
2. プロジェクト一覧から `secondbrain2` をクリック
3. 上部メニューの **「Settings」** をクリック
4. 左サイドバーの **「Environment Variables」** をクリック
5. **「Add New」** ボタンをクリック
6. 以下を入力：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `.env.local` に記載されているAPIキーをコピー&ペースト
   - **Environment**: `Production` にチェック（Preview、Developmentにもチェック推奨）
7. **「Save」** をクリック

---

## 🔄 ステップ3: 再デプロイ（環境変数を反映）

環境変数を追加した後、**必ず再デプロイ**が必要です。

### 方法1: CLIで再デプロイ

```bash
npx vercel --prod
```

### 方法2: ダッシュボードで再デプロイ

1. Vercelダッシュボードでプロジェクトを開く
2. **「Deployments」** タブをクリック
3. 最新のデプロイメントの右側の **「...」** メニューをクリック
4. **「Redeploy」** を選択

---

## 📱 ステップ4: スマホ実機で動作確認

### 4-1. URLを確認

デプロイ完了後、以下のようなURLが表示されます：
```
✅ Production: https://secondbrain2-xxxxx.vercel.app
```

### 4-2. スマホでアクセス

1. スマホのブラウザ（Safari/Chrome）を開く
2. 上記のURLを入力してアクセス
3. アプリが表示されることを確認

### 4-3. 動作確認

1. 画面下部の入力欄に文字を入力（例：「明日の会議を覚えておいて」）
2. 送信ボタンをクリック
3. AIからの応答が表示されることを確認

**✅ 成功**: AIが応答を返せば完了です！

**❌ エラーが出る場合**: 
- ブラウザのコンソール（開発者ツール）でエラーを確認
- Vercelダッシュボードの「Functions」タブでログを確認
- 環境変数が正しく設定されているか再確認

---

## 🔍 トラブルシューティング

### エラー: "GEMINI_API_KEY is not set"

**原因**: 環境変数が設定されていない、または再デプロイしていない

**解決方法**:
1. 環境変数が正しく設定されているか確認（ステップ2）
2. 再デプロイを実行（ステップ3）

### エラー: "Failed to get response from Gemini API"

**原因**: APIキーが間違っている、またはAPIキーの権限が不足している

**解決方法**:
1. `.env.local` のAPIキーが正しいか確認
2. [Google AI Studio](https://aistudio.google.com/) でAPIキーが有効か確認
3. Vercelの環境変数に正しい値が設定されているか確認

### デプロイが失敗する

**原因**: ビルドエラーや依存関係の問題

**解決方法**:
1. ローカルで `npm run build` を実行してエラーを確認
2. Vercelダッシュボードの「Deployments」タブでエラーログを確認

---

## 📝 今後の更新方法

コードを変更した後、再度デプロイするには：

```bash
npx vercel --prod
```

または、GitHubと連携している場合は、`main` ブランチにプッシュするだけで自動デプロイされます。

---

## 🎉 完了！

これで、スマホ実機でアプリを動作確認できるようになりました！

**次のステップ**:
- PWAとしてインストール（ホーム画面に追加）
- カスタムドメインの設定
- パフォーマンスの最適化

