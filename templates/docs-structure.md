<!--
  Web 開発リポ向け docs/ ディレクトリ構造テンプレート（MVP 版）。

  使い方:
    - 新規 Next.js / Vercel Web リポ作成時に docs/ ディレクトリを切り、
      下記の各ファイルを 1 つずつ作成する。
    - 全ファイルが必須ではない。最低 README.md + coding-standards.md + testing.md
      から始めて、必要に応じて追加する。
    - 各ファイルの推奨章立てを参考にしつつ、リポ固有の内容で埋める。
-->

# docs/ ディレクトリ構造テンプレート（Web 開発向け MVP）

Next.js / Vercel を使う Web 開発リポ向けの設計ドキュメント構成テンプレート。

## ディレクトリ構成

```
docs/
├── README.md              # docs 索引（必須）
├── requirements.md        # 要件定義
├── architecture.md        # アーキテクチャ設計
├── coding-standards.md    # コーディング規約（リポ固有部分）
├── testing.md             # テスト方針（リポ固有部分）
├── api.md                 # API 設計（Server Actions、外部 API）
├── data-models.md         # データモデル定義
├── env-vars.md            # 環境変数一覧
├── deploy.md              # デプロイ手順
└── operations.md          # 運用手順
```

## 各ファイルの目的と推奨章立て

### README.md（必須）

docs の索引。各ファイルへのリンクと一行サマリ。

```markdown
# 設計ドキュメント

<REPO_NAME> の設計ドキュメント。

## ドキュメント一覧

| ドキュメント | 内容 | 含まれる図面 |
| --- | --- | --- |
| [requirements.md](requirements.md) | 要件定義 | サイトマップ |
| ...                                |        |            |
```

### requirements.md

- 機能要件 / 非機能要件
- サイトマップ（Mermaid `flowchart`）
- ユーザーストーリー / 受け入れ基準

### architecture.md

- システム構成図（Mermaid `flowchart` / C4 モデル）
- コンポーネント構成図（Mermaid `classDiagram`）
- 採用技術と選定理由
- ディレクトリ構成

### coding-standards.md（リポ固有部分）

- 共通規約は `rules/coding-standards.md` を参照
- リポ固有の規約（独自命名規則、業務ドメイン固有の型設計等）のみ記載

### testing.md（リポ固有部分）

- 共通規約は `rules/testing-standards.md` を参照
- リポ固有のテスト対象（業務ロジック、固有 E2E シナリオ）のみ記載

### api.md

- Server Actions 一覧（入出力、エラーレスポンス）
- 外部 API 連携（エンドポイント、認証、リトライ戦略）
- シーケンス図（Mermaid `sequenceDiagram`）

### data-models.md

- データモデルの TypeScript `type` 定義
- ER 図 / リレーション（Mermaid `erDiagram` 等）
- バリデーションルール

### env-vars.md

- 環境変数のキー名と用途（**値は書かない**）
- 必須 / 任意の区別
- スコープ（Production / Preview / Development）

### deploy.md

- デプロイ手順（リポ固有部分）
- 共通手順は `skills/tools/vercel-deploy/SKILL.md` を参照
- ドメイン構成、Vercel プロジェクト ID 等のリポ固有情報

### operations.md

- 運用手順（監視、ログ確認、障害対応）
- バックアップ / リストア手順
- 定期メンテナンスの手順

## CLAUDE.md からの参照例

リポの `CLAUDE.md` で以下のように docs/ を分類して参照する:

```markdown
## ドキュメント

### 常時参照
- docs/coding-standards.md
- docs/architecture.md

### 実装時に参照
- docs/requirements.md
- docs/api.md
- docs/data-models.md

### テスト時に参照
- docs/testing.md

### デプロイ・運用時に参照
- docs/deploy.md
- docs/operations.md
- docs/env-vars.md
```

## MVP からの育て方

- 最低 `README.md` + `coding-standards.md` + `testing.md` から始める
- 機能追加・運用開始のタイミングで `requirements.md` / `architecture.md` / `deploy.md` を順次追加
- 外部 API 連携が増えたら `api.md` / `data-models.md` を追加
- 運用が複雑化したら `operations.md` を追加

## 関連

- `templates/CLAUDE.md.tmpl` — Next.js Web リポ向け CLAUDE.md テンプレ
- `rules/coding-standards.md` — Web 開発向けコーディング規約 MVP
- `rules/testing-standards.md` — Web 開発向けテスト規約 MVP
- `skills/tools/vercel-deploy/SKILL.md` — Vercel デプロイ手順 MVP

<!-- MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要 -->
