---
paths:
  - "**/.github/**"
  - "**/*workflow*"
---

<!--
  このファイルは rules/github.md の原本で、各 repo の
  .claude/rules/github.md には symlink で配備されます。
  - 内容の更新は原本側で行ってください(各 repo で直接編集すると
    symlink 経由で全 repo に影響します)。
  - 配備: install-rules.sh に repo の root を渡す。
  - 公式仕様: https://code.claude.com/docs/en/memory.md#organize-rules-with-clauderules
    `.claude/rules/*.md` は path 指定 frontmatter がなければ常時ロードされます。
-->

# GitHub 操作のルール

GitHub 操作は環境(PC CLI / Web)によってツール選択が変わる。本ルールは環境判定とそれぞれでやれる操作の範囲を定める。

## 環境判定

セッション起動時に `which gh` で確認する:

- **gh あり** → PC CLI 環境(macOS の Claude Code 等)。**`gh` コマンド優先** で操作
- **gh なし** → Web 環境(iPhone の Claude アプリ等)。**GitHub MCP の範囲内** で操作

## PC CLI 環境(gh あり)でやれる操作

- リポ閲覧・検索
- リポ作成: `gh repo create`
- リポ rename: `gh repo rename`
- リポ可視性変更: `gh repo edit --visibility`(本ルール「慎重に扱う操作」参照)
- PR 作成・レビュー・マージ・コメント
- Issue 作成・更新・コメント・close
- CI 確認: `gh run list`、`gh workflow run`
- release / tag 操作
- ブランチ操作

## Web 環境(gh なし)でやれる操作と制約

GitHub MCP のツールセット範囲内で操作:

- リポ閲覧、PR、Issue、コミット、release、ブランチ等は MCP で可能
- ただし **リポ rename / 削除 / visibility 変更等は MCP に該当ツールがない**
  → 該当操作は本人作業として案内する

## 慎重に扱う操作

以下は「確認必須: 外部影響系」に該当し、明示依頼があったときのみ実行する。詳細は `rules/autonomous-mode.md` を参照。

- `gh repo delete`(リポ削除)
- `gh repo edit --visibility public`(公開化)
- secret 系操作、organization 設定変更
- 他人のリポへの操作(明示スコープ外は触らない)

## 関連ルール

- `rules/autonomous-mode.md`: 自走 OK / 確認必須 / 禁止維持の 3 区分(本ルールの上位枠組み)
- `rules/git.md`: commit / push / branch / amend の運用
- `rules/escalation.md`: 他 repo / PA への申し送りの判断軸
