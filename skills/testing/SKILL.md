---
name: testing
description: Vitest + Playwright によるテスト実行手順。セットアップ・実行コマンド・デバッグ方法を扱う。テスト規律は rules/testing-standards.md に分離。テスト環境構築時、テスト実行・デバッグ時に参照。
---

# Testing（MVP 版）

Vitest + Testing Library + Playwright のテスト環境セットアップと実行手順。

テストの **規律**（何をテストするか / カバレッジ方針）は `rules/testing-standards.md` を参照。
本スキルは **実行手順**（どう動かすか / どう直すか）に絞る。

## セットアップ

### Unit / Integration（Vitest）

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

`vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});
```

`vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

`tsconfig.json` の `compilerOptions.types` に `"vitest/globals"` を追加（globals: true の場合）。

### E2E（Playwright）

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
  },
});
```

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## 実行コマンド

### Unit / Integration

```bash
pnpm test                          # 全テスト実行（CI 用）
pnpm test:watch                    # ウォッチモード（開発中）
pnpm test:coverage                 # カバレッジ付き
pnpm test <file-path>              # 単一ファイル
pnpm test -t "test name"           # テスト名で絞り込み
```

### E2E

```bash
pnpm test:e2e                      # 全 E2E テスト
pnpm test:e2e:ui                   # UI モード（インタラクティブ）
pnpm test:e2e --headed             # ヘッドフルモード（ブラウザ表示）
pnpm test:e2e --debug              # Playwright Inspector でデバッグ
pnpm test:e2e <file-path>          # 単一ファイル
```

## サンプルテスト

### Unit（コンポーネント）

```typescript
// skill-badge.test.tsx
import { render, screen } from "@testing-library/react";
import { SkillBadge } from "./skill-badge";

describe("SkillBadge", () => {
  it("renders skill name", () => {
    render(<SkillBadge name="TypeScript" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});
```

### Integration（Server Action）

```typescript
// contact.test.ts
import { sendContact } from "./contact";

describe("sendContact", () => {
  it("returns success on valid input", async () => {
    const result = await sendContact({ email: "test@example.com", message: "hi" });
    expect(result.success).toBe(true);
  });
});
```

### E2E

```typescript
// navigation.spec.ts
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});
```

## デバッグ手順

### Vitest

| 症状 | 対処 |
|---|---|
| `document is not defined` | `vitest.config.ts` の `environment: "jsdom"` を確認 |
| `expect(...).toBeInTheDocument is not a function` | `vitest.setup.ts` で `@testing-library/jest-dom/vitest` を import |
| import が解決しない | `vite.config` / `vitest.config` の `resolve.alias` に `@/*` を追加 |
| テストがハング | 非同期処理に `await` 漏れがないか確認 |

### Playwright

| 症状 | 対処 |
|---|---|
| `webServer` がタイムアウト | `command` をローカルで実行してエラーを確認 |
| 要素が見つからない | `page.pause()` でブラウザを止めて DOM 確認 / locator を見直す |
| flaky テスト | `page.waitForSelector` / `expect.toBeVisible()` で明示的待機 |
| trace を確認したい | 失敗時の `trace.zip` を `playwright show-trace` で開く |

### Playwright Inspector

```bash
pnpm test:e2e --debug
```

ステップ実行 / 要素ハイライト / DOM 検査が可能。

## CI / push 前 Hook での実行

Claude Code の `.claude/settings.json` の `PreToolUse` Bash matcher で `git push` 前に直列実行する例:

```json
{
  "hooks": {
    "PreToolUse": {
      "Bash": [
        { "matcher": "git push", "command": "pnpm test && pnpm test:e2e" }
      ]
    }
  }
}
```

詳細: `rules/testing-standards.md` の「品質ゲート」セクション。

## レポート

- Vitest: `--reporter=verbose` で詳細出力
- Playwright: `playwright-report/index.html` を `pnpm exec playwright show-report` で開く

## カバレッジ

```bash
pnpm test:coverage
```

`coverage/index.html` で詳細を確認。

カバレッジ目標は `rules/testing-standards.md` の「カバレッジ方針」に従う。

## 関連

- `rules/testing-standards.md` — テスト規律（何をテストするか）
- `skills/frameworks/nextjs/SKILL.md` — Next.js 初期セットアップ
- `skills/tools/vercel-deploy/SKILL.md` — push 前品質ゲート
- `skills/testing/webapp-testing/SKILL.md` — Playwright を使ったローカル webapp 操作・検証（Python ベース、ブラックボックス的に使用）
