# 🚀 Vercelデプロイ クイックガイド

## 最短手順（3ステップ）

### 1️⃣ デプロイ
```bash
npx vercel
```
**質問への回答**: 
- `Set up and deploy?` → **`y`**
- `Link to existing project?` → **`N`**（初回）
- その他は**Enter**でデフォルト選択

### 2️⃣ 環境変数設定（最重要！）
```bash
npx vercel env add GEMINI_API_KEY production
```
**質問への回答**:
- `What's the value?` → **`.env.local`のAPIキーをコピー&ペースト**
- `Add to which Environments?` → **`Production`を選択**

### 3️⃣ 再デプロイ（環境変数を反映）
```bash
npx vercel --prod
```

## ✅ 完了！

表示されたURL（例: `https://secondbrain2-xxxxx.vercel.app`）をスマホで開いて動作確認！

---

**詳細は `VERCEL_DEPLOY.md` を参照してください**

