// templates/prettier.config.js（MVP 版テンプレ）
//
// Next.js + Tailwind プロジェクト向けの Prettier 設定テンプレ。
// プロジェクトでは `.prettierrc` or `prettier.config.js` にコピーして使う。
//
// 前提パッケージ:
//   pnpm add -D prettier prettier-plugin-tailwindcss
//
// MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要

/** @type {import("prettier").Config} */
const config = {
  // セミコロンあり
  semi: true,

  // ダブルクォート
  singleQuote: false,

  // インデント 2 スペース
  tabWidth: 2,

  // 末尾カンマあり（diff の差分を小さくする）
  trailingComma: "all",

  // 1 行 100 文字
  printWidth: 100,

  // Tailwind の className を自動ソート
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
