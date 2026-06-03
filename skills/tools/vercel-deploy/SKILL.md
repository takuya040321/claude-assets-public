---
name: vercel-deploy
description: Vercel への Next.js アプリのデプロイ手順。プロジェクト初期セットアップ・ドメイン設定・本番デプロイ・ロールバックを扱う。Vercel への新規プロジェクト追加時、デプロイトラブル時、ロールバック判断時に参照。
---

# Vercel Deploy（MVP 版）

Next.js アプリを Vercel にデプロイする手順。

## 初期セットアップ

1. Vercel にログイン（GitHub 連携を推奨）
2. 「Add New Project」から GitHub リポジトリをインポート
3. 以下を設定:

| 項目             | 設定値                           |
| ---------------- | -------------------------------- |
| Framework Preset | Next.js                          |
| Build Command    | `pnpm build`                     |
| Output Directory | `.next`（デフォルト）            |
| Install Command  | `pnpm install --frozen-lockfile` |
| Node.js Version  | 22.x（または LTS 最新）          |

### プロジェクト設定（推奨初期値）

| 項目        | 設定値                |
| ----------- | --------------------- |
| プラン      | Hobby（無料、個人利用） |
| リージョン  | Tokyo (hnd1) 等、ユーザー所在地に近いリージョン |
| Auto-deploy | 有効（main ブランチ） |

## ドメイン設定

### カスタムドメインの追加

1. Vercel ダッシュボード → Settings → Domains
2. 取得済みのドメインを追加（Vercel 経由で取得する場合は年額課金あり）
3. DNS 設定は Vercel が自動管理（または外部 DNS の場合は指示に従う）
4. SSL 証明書も自動発行・更新

### ドメイン構成例

| ドメイン                     | 設定                                    |
| ---------------------------- | --------------------------------------- |
| `<DOMAIN>`                   | プライマリドメイン                      |
| `www.<DOMAIN>`               | プライマリへリダイレクト                |
| `<PROJECT>.vercel.app`       | Vercel デフォルトドメイン（残しておく） |

## 環境変数設定

- Vercel ダッシュボードの Settings → Environment Variables から設定する
- `Production` / `Preview` / `Development` でスコープを分ける
- secret は repo に commit しない（`.env.local` も commit しない）
- リポ側に `docs/env-vars.md` 等で **キー名と用途** のみ記録する（値は書かない）

## デプロイフロー

### 通常フロー

```
ローカル開発
  → 品質ゲート（push 前にローカル Hooks で format / lint / type-check / test / build / E2E）
  → main に push
  → Vercel が本番に自動デプロイ
```

### プレビューデプロイ

- PR を作成すると Vercel が自動でプレビュー URL を生成する
- URL 形式: `https://<PROJECT>-<hash>-<USERNAME>.vercel.app`
- PR にコメントとしてプレビュー URL が自動投稿される
- PR を更新するたびにプレビューも自動更新

### 本番デプロイ

- main ブランチへの push / マージで自動本番デプロイ
- 通常 1 分以内に反映
- ゼロダウンタイムデプロイ（Immutable Deployments）

### デプロイ確認

デプロイ後に以下を確認する:

- Vercel ダッシュボードでデプロイステータスが `Ready`
- 本番 URL でページ表示を確認
- Lighthouse スコアが基準値を満たしているか

## ロールバック

### Vercel ダッシュボードから（緊急時）

1. Vercel ダッシュボード → Deployments
2. ロールバック先のデプロイを選択
3. 「...」メニュー → 「Promote to Production」
4. 即座に指定したデプロイが本番に切り替わる

### git revert から（通常）

問題のあるコミットを revert して main に push する:

```bash
git revert <commit-hash>
git push origin main
# Vercel が自動で本番デプロイ
```

### 使い分け

- 緊急時（本番障害発生中）→ Vercel ダッシュボードから即時ロールバック
- 通常時 → git revert（テスト・レビューを経るため安全）

## トラブルシュート（MVP 抜粋）

| 症状                                | 対処                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| Build エラーで Ready にならない      | Vercel Logs で stack trace 確認 → ローカル `pnpm build` 再現 |
| 環境変数の反映が古い                | 環境変数変更後は手動再デプロイが必要                       |
| プレビュー URL が生成されない        | PR の base ブランチ設定 / Vercel 連携状態を確認            |
| 本番ドメインが繋がらない            | DNS 反映待ち（最大 48h）/ SSL 証明書の発行待ち             |

## 関連

- `rules/coding-standards.md` — コード品質基準
- `rules/testing-standards.md` — push 前品質ゲート
- Next.js 公式デプロイガイド: https://nextjs.org/docs/deployment

<!-- MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要 -->
