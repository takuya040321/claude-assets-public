---
name: performance-optimization
description: Web パフォーマンス最適化のスキル。Core Web Vitals 計測・画像最適化・コード分割・Lighthouse CI による品質ゲートを扱う。パフォーマンス問題発覚時、Lighthouse スコア改善時、新規ページ公開前に参照。
---

# Performance Optimization（MVP 版）

Next.js + Vercel を前提とした Web パフォーマンス最適化の主要観点。
Lighthouse CI で **Performance スコア 0.9 以上** を目標とする。

## Core Web Vitals（最優先指標）

Google の検索順位にも影響する主要 3 指標:

| 指標 | 内容 | 目標値 |
|---|---|---|
| LCP（Largest Contentful Paint） | 最大コンテンツの描画時間 | 2.5 秒以内 |
| CLS（Cumulative Layout Shift） | レイアウトのずれ累積 | 0.1 以下 |
| INP（Interaction to Next Paint） | 入力応答性 | 200ms 以下 |

旧指標 FID（First Input Delay）は 2024 年に INP に置き換えられた。

### 計測方法

| ツール | 用途 |
|---|---|
| Chrome DevTools / Lighthouse | ローカル計測 |
| PageSpeed Insights | 実ユーザーデータ（CrUX）含む |
| Vercel Analytics | 本番の実ユーザー計測 |
| Lighthouse CI | CI / push 前ゲート |

## Lighthouse CI 設定

`.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start",
      "startServerReadyPattern": "Ready in",
      "url": ["http://localhost:3000"],
      "numberOfRuns": 1,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "document-title": ["error", { "minScore": 1 }],
        "meta-description": ["error", { "minScore": 1 }],
        "viewport": ["error", { "minScore": 1 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

実行:

```bash
pnpm add -D @lhci/cli
pnpm exec lhci autorun
```

## 画像最適化

### `next/image` を使う

```tsx
import Image from "next/image";

<Image
  src="/hero.png"
  alt="..."
  width={1200}
  height={630}
  priority  // LCP 対象画像
/>
```

- 自動で WebP / AVIF 配信
- レスポンシブ srcset 生成
- lazy load（priority 以外）

### LCP 画像は priority

ファーストビューの主要画像には `priority` を付ける（preload される）。

### 適切なサイズ

- 大きい画像をそのまま使わない（リサイズ済みを配信）
- アイコン類は SVG を優先（軽量 + 拡大に強い）

## フォント最適化

### `next/font` を使う

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
```

- 自動でセルフホスト化（CLS 防止）
- `display: "swap"` でフォント読み込み中もテキスト表示

### サブセット化

日本語フォントは subset 機能で必要文字のみ配信。

## コード分割

### Dynamic Import

ファーストビューで不要なコンポーネントは動的 import:

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <p>Loading...</p>,
});
```

### Server Components を優先

Server Components はクライアント JS バンドルに含まれない。
Client Components は本当に必要な箇所だけにする。

## レンダリング戦略

| 戦略 | 用途 |
|---|---|
| 静的生成（SSG / `generateStaticParams`） | 変更頻度が低いページ |
| ISR（`revalidate`） | 定期更新が必要なページ |
| SSR | リクエストごとに動的 |
| PPR（Partial Prerendering） | 静的部分 + 動的部分の混在 |

**MVP 原則**: 静的にできるものは静的にする。SSR を default にしない。

## バンドルサイズ削減

### Bundle Analyzer

```bash
pnpm add -D @next/bundle-analyzer
```

```typescript
// next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer";

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })({
  // ...
});
```

```bash
ANALYZE=true pnpm build
```

### 重い依存を削る

- Moment.js → date-fns / dayjs
- Lodash → lodash-es + tree-shaking or 個別 import
- Material-UI 等の重量級 UI lib → 必要箇所だけ shadcn 等の軽量実装に置き換え

## CLS 対策

### 画像 / 動画に width / height を指定

- `<Image>` は width / height 必須
- 外部埋め込み（YouTube 等）は aspect-ratio で予約

### Web フォント

- `next/font` で自動 swap
- フォントによる縦幅変化を防ぐため `size-adjust` / `font-display` を活用

### Skeleton UI / Placeholder

- ロード中の領域を予約しておく
- 後から要素が挿入される場合は `min-height` で予約

## INP 対策

### 長い JS タスクを分割

- 100ms 以上ブロックする処理はワーカー / 非同期化
- イベントハンドラ内で重い処理を避ける

### React の useTransition

```tsx
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

const handleClick = () => {
  startTransition(() => {
    setHeavyState(/* ... */);
  });
};
```

## キャッシュ戦略

### CDN（Vercel Edge Network）

- 静的アセットは自動キャッシュ
- ISR で動的ページも CDN キャッシュ

### Cache-Control ヘッダ

- 静的アセット: `public, max-age=31536000, immutable`
- HTML: ISR で制御

## チェックリスト

- [ ] LCP 画像に `priority` を付けた
- [ ] 全画像が `next/image` 経由
- [ ] フォントが `next/font` 経由
- [ ] バンドルサイズを確認した（200KB 以下推奨）
- [ ] Lighthouse Performance 0.9 以上
- [ ] CLS 0.1 以下（DevTools の Performance パネルで確認）

## 関連

- `rules/seo.md` — Core Web Vitals は SEO にも効く
- `rules/testing-standards.md` — Lighthouse CI を push 前ゲートに組み込む
- `skills/frameworks/nextjs/SKILL.md` — 初期セットアップ
- `skills/tools/vercel-deploy/SKILL.md` — Vercel デプロイ
