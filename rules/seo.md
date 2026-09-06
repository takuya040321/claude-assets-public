<!--
  rules/seo.md の原本（MVP 版）。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# SEO 規約（Web 開発向け MVP）

Next.js App Router を前提とした SEO 規律。
「最低限ここまでは整える」を MVP で揃える。

## meta タグ

Next.js App Router では `generateMetadata` or `metadata` export で設定する。

### 全ページ必須

```typescript
export const metadata: Metadata = {
  title: "<ページ固有タイトル> | <サイト名>",
  description: "<120-160 文字の説明>",
  alternates: { canonical: "<絶対 URL>" },
};
```

- `title`: 各ページ固有、サイト名を付ける場合は末尾に統一
- `description`: 120-160 文字推奨、検索結果に表示される
- `canonical`: 重複コンテンツの正規 URL を明示

### サイト全体の既定値（root layout）

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://<DOMAIN>"),
  title: { default: "<デフォルトタイトル>", template: "%s | <サイト名>" },
  description: "<デフォルト説明>",
};
```

## OGP（Open Graph Protocol）

SNS でシェアされたときの表示を制御する。

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: "<タイトル>",
    description: "<説明>",
    url: "<絶対 URL>",
    siteName: "<サイト名>",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "<タイトル>",
    description: "<説明>",
    images: ["/og-image.png"],
  },
};
```

- OG 画像は 1200x630px 推奨
- ページ固有 OG 画像を用意できない場合はサイト共通の OG 画像を使う

## sitemap.xml

`src/app/sitemap.ts` で動的生成する:

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://<DOMAIN>/", lastModified: new Date(), priority: 1.0 },
    { url: "https://<DOMAIN>/about", lastModified: new Date(), priority: 0.8 },
    // ...
  ];
}
```

- 全公開ページを列挙する
- `lastModified` を更新タイミングと連動させる
- 動的ページが多い場合はデータソースから自動生成

## robots.txt

`src/app/robots.ts` で生成する:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: "https://<DOMAIN>/sitemap.xml",
  };
}
```

- 公開してよいパスのみ allow
- `/api/` `/admin/` 等の内部パスは disallow
- sitemap.xml の URL を明示

## 構造化データ（JSON-LD）

検索結果のリッチリザルト対応のため、ページ種別に応じた JSON-LD を埋め込む。

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "<組織名>",
  url: "https://<DOMAIN>",
  logo: "https://<DOMAIN>/logo.png",
};

// ページ内で <script type="application/ld+json"> として埋め込む
```

主要な type:

| ページ種別 | type |
|---|---|
| トップ・組織情報 | `Organization` |
| 記事・ブログ | `Article` / `BlogPosting` |
| 製品ページ | `Product` |
| FAQ | `FAQPage` |
| パンくず | `BreadcrumbList` |

## URL 設計

- `kebab-case` で統一（`/about-us` ◯ / `/aboutUs` ✕）
- 階層を浅く（理想は 2-3 階層以内）
- 日本語 URL は避ける（エンコードで可読性が落ちる）
- 末尾スラッシュの有無を統一（Next.js は `trailingSlash: false` がデフォルト）

## 画像の SEO

- `<Image>` コンポーネント（next/image）を使う
- `alt` 属性は必ず設定（装飾画像は `alt=""`）
- ファイル名は意味のある英単語（`hero-image.png` ◯ / `IMG_001.png` ✕）

## 内部リンク

- 関連ページへの内部リンクを意識的に張る
- アンカーテキストは内容を表す具体的な文言（"こちら" ✕ / "サービス詳細" ◯）

## パフォーマンス（SEO 影響）

- Core Web Vitals（LCP / CLS / INP）は SEO 順位に影響する
- 詳細: `skills/tools/performance-optimization/SKILL.md`

## モバイル対応

- Google はモバイルファーストインデックス
- レスポンシブデザイン必須、PC 専用ページは避ける
- `viewport` meta は Next.js が自動設定

## 確認ツール

| ツール | 用途 |
|---|---|
| Google Search Console | インデックス状況 / 検索パフォーマンス |
| Lighthouse | SEO スコア（Lighthouse CI で自動化） |
| PageSpeed Insights | Core Web Vitals 実測 |
| ogp.me 確認ツール / Twitter Card Validator | OGP プレビュー |

## 関連ルール

- `rules/accessibility.md` — アクセシビリティは SEO にも効く
- `skills/tools/performance-optimization/SKILL.md` — Core Web Vitals
