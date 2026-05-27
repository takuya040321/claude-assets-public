# claude-assets-public

Public リポ向けの共通アセット管理リポジトリ。

## このリポの位置づけ

- private の `claude-assets` から公開可能なアセットを同期して管理
- public リポ（e2life-website 等）から symlink で接続して使う
- コンテンツは Web プロジェクト開発で作成 → 汎用的なものをここに昇格

## ディレクトリ構成

- `rules/` — Web 開発の共通ルール
- `skills/` — Web 開発の共通スキル
- `templates/` — Web プロジェクトのテンプレート
- `bin/` — インストールスクリプト

## 同期の仕組み

- source of truth は claude-assets（private）
- claude-assets 側の `public-sync.yaml` でホワイトリスト指定
- 同期は PR 経由でレビュー後マージ

## 注意事項

- このリポは public。個人情報・secret・private 固有の情報を含めないこと
- 新規ファイル追加時は `public-sync.yaml` のホワイトリストに追加してから同期
