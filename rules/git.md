<!--
  rules/git.md の原本。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# git の運用ルール

この repo の git 操作は **Conventional Commits 厳密準拠** で行う。
詳細な規約・例・ハマりどころは commit skill (`SKILL.md`) を参照。
配備済み repo では `.claude/skills/commit/SKILL.md` から symlink 経由で読める。

## commit message の作法

- フォーマット: `<type>(<scope>): <subject>` (scope は省略可)
- type の例: `feat` / `fix` / `refactor` / `docs` / `chore` / `test` / `style` / `perf` / `build` / `ci`
- subject は **何を変えたか** が一目で分かる具体的な記述
  - 良い例: `feat(inbox): SessionStart hook で OPEN issue を表示`
  - 悪い例: `update`, `fix`, `WIP`
- 必要なら本文で **なぜ** を補足する
- 関連 Issue 番号があれば本文に Issue 参照を入れる
  - **`Closes #N`**: その PR で Issue を完了・クローズする場合に使う
  - **`Refs #N`**: Issue を閉じずに参照だけする補助。クローズはしない

PR は `Closes #N` で **1 Issue を閉じる**。1 Issue = 1 PR を厳守する。
複数 Issue を 1 PR にまとめたり、`Closes #N` で部分対応にしたりしない。
詳細: `task-management.md` の R5。

## push のタイミング

このセクションは「commit 後に自動で push してよいか」を扱う。

- **デフォルト**: commit 後に自動 push してよい
- **案件 repo**(自分以外と共同編集する repo / クライアント納品物を扱う repo / 顧客所有 repo に push する可能性のある repo)は、`CLAUDE.md` 末尾「事業固有セクション」で「指示があったときに push する」に **必ず上書きする(MUST)**

## ブランチ戦略

このセクションは「どのブランチに push するか」を扱う。

- **デフォルト**: `main` 直 push 可
- **案件 repo**(自分以外と共同編集する repo / クライアント納品物を扱う repo / 顧客所有 repo に push する可能性のある repo)は feature ブランチ + PR を必須にする(`CLAUDE.md` 末尾「事業固有セクション」で **必ず上書きする(MUST)**)

## amend の使用条件

- **直前の自分のコミット** かつ **まだ push していない** 場合のみ
- pre-commit hook 失敗時の `--amend` は禁止(失敗時 commit は作られていないので、
  `--amend` は前のコミットを書き換えてしまう)。原因を修正して新規 commit を作る

## commit のタイミング

このセクションは「自動で commit してよいか」を扱う。commit の粒度は次節「commit のタイミング目安」を参照。

- **デフォルト**: ファイル変更後、適切なタイミングで自動 commit してよい
- **案件 repo**(自分以外と共同編集する repo / クライアント納品物を扱う repo / 顧客所有 repo に push する可能性のある repo)は `CLAUDE.md` 末尾「事業固有セクション」で「指示があったときに commit する」に **必ず上書きする(MUST)**

## commit のタイミング目安

- 1 つの会話で完結する変更は、会話の終わりにまとめて commit
- 大きな構造変更(ディレクトリ追加など)は、完成した時点で commit
- 細かすぎる commit (1 行修正ごとに commit) は避ける

## 機密ファイルの扱い

- `.env` / `.env.*`(`.env.example` 除く)、`*.key` / `*.pem` / `*.p12`、トークン・API キー・個人情報を含むファイルは commit しない
- `git add -A` / `git add .` より **個別 add を推奨**(うっかり stage 防止)

## 許可確認スキップ時の自己規律

許可確認をスキップして動くセッションでは、本ルールを **Claude 自身が守る** 前提で成立する。

- 上記の push / ブランチ / amend / 機密ファイルの各規約は、確認ダイアログがなくても守る
- 迷ったら「ユーザーに確認を取る」を選ぶ
- 許可確認スキップは「速度」のためであって「無確認で破壊する」ためではない
