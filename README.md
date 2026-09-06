# claude-assets-public

Public リポ向けの共通アセット（rules / skills / templates）を管理するリポジトリ。

## 概要

Claude Code で Web プロジェクトを開発する際に共通で使えるルール・スキル・テンプレートを蓄積する。非公開の原本リポジトリから、公開可能なアセットをホワイトリスト方式で同期している。

## 使い方

public リポの `.claude/rules/` や `.claude/skills/` からこのリポへ symlink を張る。

```bash
# 例: Web リポの .claude/rules から接続
ln -s ~/projects/claude-assets-public/rules/coding-standards.md .claude/rules/coding-standards.md
```

## ディレクトリ構成

```
claude-assets-public/
├── rules/       # Web 開発の共通ルール
├── skills/      # Web 開発の共通スキル
├── templates/   # Web プロジェクトのテンプレート
└── bin/         # インストールスクリプト
```

## 管理方針

- source of truth は非公開の原本リポジトリ
- 原本リポ側の `public-sync.yaml` でホワイトリスト指定されたファイルのみ同期
- 同期前に個人情報・secret の自動スキャンを実施
- 同期はスキャン通過後に main へ直接反映
- 新規コンテンツは Web プロジェクト開発で作成 → 汎用的なものをこのリポに昇格

## 予定コンテンツ

Web プロジェクトの開発に合わせて順次追加。

### rules/

| ファイル | 内容 |
|---|---|
| coding-standards.md | TypeScript / React の命名規則、ファイル構成 |
| web-security.md | XSS/CSRF 対策、HTTP ヘッダー設定 |
| testing-standards.md | Unit / Integration / E2E / Performance / Security の基準 |
| seo.md | メタタグ、OGP、sitemap、Core Web Vitals |
| accessibility.md | アクセシビリティの最低基準 |

### skills/

| ファイル | 内容 |
|---|---|
| nextjs-setup.md | Next.js プロジェクト初期セットアップ手順 |
| component-patterns.md | Server / Client Components の使い分け |
| testing.md | Vitest + Playwright でのテスト作成 |
| vercel-deploy.md | Vercel デプロイ + ドメイン設定 |
| performance-optimization.md | Lighthouse スコア改善パターン |

### templates/

| ファイル | 内容 |
|---|---|
| CLAUDE.md.tmpl | public Web プロジェクト用 CLAUDE.md テンプレート |
| eslint.config.js | 共通 ESLint 設定 |
| prettier.config.js | 共通 Prettier 設定 |
| tsconfig.json | 共通 TypeScript 設定 |
