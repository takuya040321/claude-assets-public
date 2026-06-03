<!--
  rules/coding-standards.md の原本（MVP 版）。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# コーディング規約（Web 開発向け MVP）

TypeScript / React / Next.js を中心とした Web 開発リポ向けの標準規律。

## TypeScript

### strict mode

`tsconfig.json` で `strict: true` を必ず設定する:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### any 禁止

- `any` は使わない。`unknown` + 型ガードで代替する
- ESLint の `@typescript-eslint/no-explicit-any` を `error` に設定
- やむを得ない場合は `// eslint-disable-next-line` + コメントで理由を明記

### 型定義

- コンポーネントの Props / データモデル / ユーティリティ型は `type` を使う
- ライブラリ都合で `interface` が必要なときのみ `interface`

## React コンポーネント

### 関数コンポーネント

- 関数宣言（`function`）を使う。アロー関数はコールバック内のみ
- `export default` はページコンポーネント（`page.tsx`、`layout.tsx`）のみ
- それ以外は名前付きエクスポート（`export function`）

### Props 型定義

- Props 型はコンポーネントと同じファイルで定義する
- 外部から参照が必要な場合のみ `export` する

### Server / Client の分離（Next.js App Router）

- デフォルトは Server Components
- `"use client"` はファイル先頭に書く（インライン宣言しない）
- Client Components は最小範囲に絞る

## ファイル・ディレクトリ命名

### ファイル名

- kebab-case を使う: `skill-badge.tsx`、`contact-form.tsx`
- PascalCase は使わない
- テストファイル: `<対象>.test.ts` / `<対象>.test.tsx`

### ディレクトリ名

- kebab-case を使う
- Next.js の規約に従うもの（`(marketing)/`、`(detail)/` 等）はそのまま

### 特殊ファイル（Next.js App Router）

- `page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx`

## インポート順序

以下の順序で並べ、グループ間に空行を入れる（ESLint `import/order` で自動ソート）:

1. React / Next.js
2. 外部ライブラリ
3. 内部モジュール（エイリアス `@/`）
4. 型（type-only import）
5. スタイル

## スタイリング

### Tailwind CSS

- ユーティリティクラスを直接使う
- カスタムクラスは `@apply` ではなくコンポーネント化で解決する
- 長いクラスリストは改行して整理する
- `prettier-plugin-tailwindcss` で自動ソートする

### cn ユーティリティ

`clsx` + `tailwind-merge` を組み合わせた `cn()` で条件付きクラスを整理する。

## ESLint / Prettier

- ESLint 設定: `next/core-web-vitals` + `next/typescript` を base にする
- `@typescript-eslint/no-explicit-any`: `error`
- `@typescript-eslint/no-unused-vars`: `error`（`argsIgnorePattern: "^_"`）
- `import/order`: `error`（`newlines-between: always`）
- Prettier: `semi: true`、`singleQuote: false`、`tabWidth: 2`、`printWidth: 100`、`trailingComma: "all"`

## git commit

詳細: `rules/git.md`、`skills/core/commit/SKILL.md`

- Conventional Commits 準拠
- type: `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf`

## 適用範囲

- TypeScript + React + Next.js を使う Web 開発リポ全般
- バックエンド専用 / 非 Web プロジェクトは別ルール

## 関連ルール

- `rules/git.md` — Conventional Commits / push 規約
- `rules/testing-standards.md` — テスト方針
- `skills/core/commit/SKILL.md` — commit message 作成スキル

<!-- MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要 -->
