// templates/eslint.config.js（MVP 版テンプレ）
//
// Next.js + TypeScript プロジェクト向けの ESLint 設定テンプレ。
// プロジェクトでは `eslint.config.mjs` などにコピー / 改変して使う。
//
// 前提パッケージ:
//   pnpm add -D eslint eslint-config-next eslint-config-prettier
//
// MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // any 禁止（型安全性確保）
      "@typescript-eslint/no-explicit-any": "error",

      // 未使用変数禁止（_ プレフィックスは許容）
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
