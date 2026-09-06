---
name: nextjs-setup
description: Next.js プロジェクトの初期セットアップ手順。pnpm + App Router + TypeScript + Tailwind + shadcn/ui の構成で立ち上げる。Web 開発リポの新規作成時、既存リポへの Next.js 導入時に参照。
---

# Next.js Setup（MVP 版）

Next.js + pnpm + App Router + TypeScript + Tailwind + shadcn/ui の構成で新規プロジェクトを立ち上げる手順。

## 前提

- Node.js LTS（22.x 推奨）
- pnpm（`corepack enable` で導入）

## 1. プロジェクト作成

```bash
pnpm create next-app@latest <PROJECT_NAME>
```

対話プロンプトで以下を選択:

| 質問 | 推奨回答 |
|---|---|
| TypeScript を使うか | Yes |
| ESLint を使うか | Yes |
| Tailwind CSS を使うか | Yes |
| `src/` ディレクトリを使うか | Yes |
| App Router を使うか | Yes |
| Turbopack を使うか | Yes |
| import alias をカスタマイズするか | `@/*` のままで OK |

## 2. パッケージマネージャの確定

`package.json` に追加:

```json
{
  "packageManager": "pnpm@<VERSION>"
}
```

`pnpm-workspace.yaml` を作成（モノレポでなくても入れておくと便利）:

```yaml
packages:
  - .
```

## 3. TypeScript 設定

`tsconfig.json` に以下を確認・追記:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`strict` と `noUncheckedIndexedAccess` を有効にすることで配列 / オブジェクト要素の undefined を型で検知できる。

## 4. ESLint / Prettier 導入

```bash
pnpm add -D prettier eslint-config-prettier prettier-plugin-tailwindcss
```

詳細設定は `templates/eslint.config.js` / `templates/prettier.config.js` を参照。

## 5. shadcn/ui 導入

```bash
pnpm dlx shadcn@latest init
```

対話で以下を選択:

| 質問 | 推奨回答 |
|---|---|
| style | デフォルト or `new-york` |
| baseColor | プロジェクトに応じて（`neutral` / `slate` / `zinc` 等） |
| CSS variables を使うか | Yes |

`components.json` が生成される。`aliases` を `@/components` 系に揃える。

コンポーネント追加:

```bash
pnpm dlx shadcn@latest add button card input
```

## 6. ディレクトリ構成（推奨）

```
src/
├── app/                # App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── (route-groups)/
├── components/
│   ├── ui/             # shadcn/ui
│   ├── layout/         # Header, Footer
│   ├── sections/       # ページ固有セクション
│   └── shared/         # 共通コンポーネント
├── lib/
│   ├── data/           # 静的データ
│   ├── utils/          # ユーティリティ関数
│   └── validations/    # Zod スキーマ
└── styles/
    └── globals.css
```

## 7. セキュリティヘッダ（推奨）

`next.config.ts` に追加:

```typescript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

export default {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
} satisfies NextConfig;
```

詳細: `rules/web-security.md`

## 8. .gitignore 確認

`.env*.local` `.env` が除外されていることを確認。
`.env.example` のみコミットする。

## 9. 初回起動

```bash
pnpm dev
```

http://localhost:3000 でトップページが表示されれば OK。

## 10. 追加で入れることが多いもの

| パッケージ | 用途 |
|---|---|
| `react-hook-form` + `@hookform/resolvers` + `zod` | フォーム + バリデーション |
| `framer-motion` | アニメーション |
| `lucide-react` | アイコン（shadcn デフォルト） |
| `clsx` + `tailwind-merge` | className 合成 |
| `next-themes` | ダークモード |

## 11. テスト環境（必要に応じて）

詳細: `skills/testing/SKILL.md`

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @playwright/test
```

## 関連

- `rules/coding-standards.md` — コーディング規約
- `rules/web-security.md` — セキュリティヘッダ
- `templates/eslint.config.js` / `templates/prettier.config.js` / `templates/tsconfig.json`
- `skills/testing/SKILL.md` — テスト環境セットアップ
- `skills/tools/vercel-deploy/SKILL.md` — Vercel デプロイ
