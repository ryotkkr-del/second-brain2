# GitHubとVercelの連携ガイド

GitHubとVercelを連携することで、コードをプッシュするだけで自動デプロイが有効になります。

## 📋 前提条件

- GitHubアカウントを持っていること
- Gitがインストールされていること
- プロジェクトがGitリポジトリとして初期化されていること

## 🚀 ステップ1: Gitリポジトリの初期化（まだの場合）

プロジェクトディレクトリで以下を実行：

```bash
git init
git add .
git commit -m "Initial commit"
```

## 📦 ステップ2: GitHubリポジトリを作成

1. ブラウザで https://github.com にアクセス
2. 右上の **「+」** ボタンをクリック → **「New repository」** を選択
3. リポジトリ名を入力（例：`second-brain2`）
4. **「Public」** または **「Private」** を選択
5. **「Create repository」** をクリック

## 🔗 ステップ3: GitHubリポジトリにコードをプッシュ

GitHubでリポジトリを作成すると、以下のようなコマンドが表示されます。**「…or push an existing repository from the command line」** のセクションのコマンドを実行：

```bash
git remote add origin https://github.com/あなたのユーザー名/second-brain2.git
git branch -M main
git push -u origin main
```

**注意**: `あなたのユーザー名` の部分を実際のGitHubユーザー名に置き換えてください。

## 🔌 ステップ4: VercelでGitHubリポジトリを連携

### 方法1: Vercelダッシュボードから連携（推奨）

1. ブラウザで https://vercel.com/dashboard にアクセス
2. プロジェクト一覧から **「second-brain2」** をクリック
3. 上部メニューの **「Settings」** をクリック
4. 左サイドバーの **「Git」** をクリック
5. **「Connect Git Repository」** ボタンをクリック
6. **「GitHub」** を選択
7. GitHubの認証を完了（初回のみ）
8. リポジトリ一覧から **「second-brain2」** を選択
9. **「Connect」** をクリック

### 方法2: 新規プロジェクトとして連携

1. ブラウザで https://vercel.com/new にアクセス
2. **「Import Git Repository」** をクリック
3. **「GitHub」** を選択して認証
4. リポジトリ一覧から **「second-brain2」** を選択
5. **「Import」** をクリック
6. プロジェクト設定を確認（そのまま **「Deploy」** でOK）

## ⚙️ ステップ5: 環境変数の設定（重要）

GitHubと連携した後も、環境変数は設定する必要があります。

1. Vercelダッシュボードでプロジェクトを開く
2. **「Settings」** → **「Environment Variables」** をクリック
3. **「Add New」** をクリック
4. 以下を入力：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `.env.local` に記載されているAPIキーをコピー&ペースト
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
5. **「Save」** をクリック

## ✅ ステップ6: 自動デプロイの確認

1. コードを変更してコミット：
   ```bash
   git add .
   git commit -m "Update code"
   git push
   ```

2. Vercelダッシュボードの **「Deployments」** タブを確認
3. 自動的にデプロイが開始されることを確認

## 📱 ステップ7: スマホでアクセス

1. Vercelダッシュボードでプロジェクトを開く
2. 上部に表示されているURLをコピー（例：`https://second-brain2-xxxxx.vercel.app`）
3. スマホのブラウザでURLを開く
4. アプリが表示されることを確認

## 🎯 メリット

- ✅ コードをプッシュするだけで自動デプロイ
- ✅ プルリクエストごとにプレビュー環境が作成される
- ✅ デプロイ履歴が管理される
- ✅ ロールバックが簡単

## 🔍 トラブルシューティング

### GitHubへのプッシュが失敗する

- GitHubの認証情報が正しいか確認
- SSHキーが設定されているか確認
- リモートURLが正しいか確認：`git remote -v`

### 自動デプロイが動かない

- Vercelの **「Settings」** → **「Git」** でリポジトリが正しく連携されているか確認
- GitHubのリポジトリ設定で、Vercelアプリが連携されているか確認

---

これで、GitHubとVercelが連携され、コードをプッシュするだけで自動デプロイが有効になります！

