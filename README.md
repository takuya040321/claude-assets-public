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

## 収録アセット

### rules/

| ファイル | 内容 |
|---|---|
| git.md | コミット / ブランチ / PR の運用ルール |
| github.md | GitHub Actions・ワークフローの運用ルール |
| coding-standards.md | TypeScript / React の命名規則、ファイル構成 |
| testing-standards.md | Unit / Integration / E2E / Performance / Security の基準 |
| web-security.md | XSS/CSRF 対策、HTTP ヘッダー設定 |
| seo.md | メタタグ、OGP、sitemap、Core Web Vitals |
| accessibility.md | アクセシビリティの最低基準 |

### skills/

| スキル | 内容 |
|---|---|
| core/commit | Conventional Commits 形式でのコミット作成 |
| core/github | PR / Issues / Actions / Release の操作 |
| languages/python | Python のコーディング / テスト / 環境設定 |
| languages/typescript | TypeScript・JavaScript のコーディング / テスト |
| languages/csharp | C# のコーディング / テスト / 環境設定 / Web API |
| languages/gas-spreadsheet | Google Apps Script でのスプレッドシート操作 |
| frameworks/nextjs | Next.js プロジェクトの初期セットアップ手順 |
| testing | Vitest + Playwright でのテスト実行・デバッグ |
| tools/vercel-deploy | Vercel へのデプロイ、ドメイン設定、ロールバック |
| tools/performance-optimization | Core Web Vitals 計測と Lighthouse スコア改善 |

各スキルは `SKILL.md` が入口。必要に応じて同じフォルダの `references/` `scripts/` を参照する。

`skills/frameworks/react/references/component-patterns.md` は Server / Client Components の使い分けをまとめた参考資料（単体の `SKILL.md` は持たない）。

### templates/

| ファイル | 内容 |
|---|---|
| CLAUDE.md.tmpl | Next.js Web リポ向け CLAUDE.md テンプレート |
| docs-structure.md | docs/ ディレクトリ構成のテンプレート |
| eslint.config.js | 共通 ESLint 設定 |
| prettier.config.js | 共通 Prettier 設定 |
| tsconfig.json | 共通 TypeScript 設定 |
