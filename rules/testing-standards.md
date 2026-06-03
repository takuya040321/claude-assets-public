<!--
  rules/testing-standards.md の原本（MVP 版）。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# テスト規約（Web 開発向け MVP）

Vitest + Testing Library + Playwright を中心とした Web 開発リポ向けのテスト規律。

## テスト種類と範囲

| テスト           | ツール                    | 対象                                            | 実行タイミング |
| ---------------- | ------------------------- | ----------------------------------------------- | -------------- |
| Unit Test        | Vitest + Testing Library  | ユーティリティ関数 / コンポーネント描画         | push 前        |
| Integration Test | Vitest + Testing Library  | Server Actions / 外部 API 連携 / データ層       | push 前        |
| E2E Test         | Playwright                | ページ表示 / ナビゲーション / フォーム / レスポンシブ | push 前 |
| Performance Test | Lighthouse CI             | Core Web Vitals（LCP、CLS、INP）                | push 前        |

## テストファイル配置

コロケーション方式を採用する。テスト対象ファイルと同じディレクトリに `.test.ts` / `.test.tsx` を置く。

```
src/
├── components/
│   └── shared/
│       ├── skill-badge.tsx
│       └── skill-badge.test.tsx
├── lib/
│   └── utils/
│       ├── format.ts
│       └── format.test.ts
└── e2e/
    ├── navigation.spec.ts
    └── contact-form.spec.ts
```

- Unit / Integration テスト: `.test.ts` / `.test.tsx`（コロケーション）
- E2E テスト: `src/e2e/` ディレクトリに `.spec.ts`

## 命名規則

### テストファイル名

- テスト対象ファイル名 + `.test.ts` / `.test.tsx`
- E2E: 機能名 + `.spec.ts`

### テストケース

`describe` + `it` で構造化する。命名は英語で書く。

```typescript
describe("SkillBadge", () => {
  it("renders skill name and experience years", () => {
    // ...
  });
});
```

### テストの構造

AAA パターン（Arrange、Act、Assert）に従う:

```typescript
it("validates email format", () => {
  // Arrange
  const invalidEmail = "not-an-email";

  // Act
  const result = contactSchema.safeParse({ email: invalidEmail });

  // Assert
  expect(result.success).toBe(false);
});
```

## テスト実行コマンド

```bash
# Unit / Integration
pnpm test              # 全テスト実行
pnpm test:watch        # ウォッチモード
pnpm test:coverage     # カバレッジ付き

# E2E
pnpm test:e2e          # Playwright 全テスト
pnpm test:e2e:ui       # Playwright UI モード

# Lighthouse
pnpm test:lighthouse   # Lighthouse CI 実行
```

## 品質ゲート（推奨: ローカル Claude Hooks）

`.claude/settings.json` の `PreToolUse` Bash matcher で `git push` 直前に直列実行する。1 つでも失敗すれば push を中止する（`exit 2`）:

1. `pnpm format:check`（Prettier）
2. `pnpm lint`（ESLint）
3. `pnpm exec tsc --noEmit`（TypeScript）
4. `pnpm test`（Vitest unit / integration）
5. `pnpm build`（Next.js）
6. `pnpm test:e2e`（Playwright）
7. `pnpm test:lighthouse`（Lighthouse CI）

### 運用

- `git push` 前に全段階を通過することが必須
- Playwright のブラウザバイナリは事前に `pnpm exec playwright install --with-deps chromium` で導入しておく
- CI/CD パイプライン（GitHub Actions 等）を併用するかは各リポ判断

## カバレッジ方針

| 対象               | 目標カバレッジ           |
| ------------------ | ------------------------ |
| ユーティリティ関数 | 90% 以上                 |
| バリデーション     | 100%                     |
| Server Actions     | 80% 以上                 |
| コンポーネント     | 70% 以上（描画中心）     |
| E2E                | 全ページ・主要フロー     |

- カバレッジ数値の追求よりも、重要なパスのテストを優先する
- 認証・バリデーション・エラーハンドリングは高カバレッジ必須

## 実装時のテスト同時生成

- 新しいコンポーネント・関数を実装する際は、テストも同時に生成する
- commit message にテストの意図と範囲を記録する

## 関連ルール

- `rules/coding-standards.md` — コーディング規約
- `rules/git.md` — Conventional Commits / push 規約

<!-- MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要 -->
