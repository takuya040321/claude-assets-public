<!--
  rules/accessibility.md の原本（MVP 版）。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# アクセシビリティ規約（Web 開発向け MVP）

WCAG 2.1 レベル AA を目標とする Web アプリ向けのアクセシビリティ規律。
Lighthouse CI のアクセシビリティスコアを **0.9 以上** で品質ゲートする。

## セマンティック HTML

意味に合った HTML タグを使う:

| 用途 | 使うタグ |
|---|---|
| ページ見出し | `<h1>` 〜 `<h6>`（階層を飛ばさない） |
| ナビゲーション | `<nav>` |
| メインコンテンツ | `<main>`（1 ページに 1 つ） |
| ヘッダ・フッタ | `<header>` `<footer>` |
| 補足情報 | `<aside>` |
| 記事・セクション | `<article>` `<section>` |
| ボタン | `<button>`（`<div onClick>` は NG） |
| リンク | `<a href>`（`<span onClick>` は NG） |
| リスト | `<ul>` `<ol>` `<li>` |

### よくある誤り

- `<div onClick>` でクリック可能要素を作る → `<button>` を使う
- `<h1>` を見た目のためにスキップして `<h3>` から始める → 階層を守る
- `<img>` に `alt` を付けない → 必ず付ける（装飾画像は `alt=""`）

## ARIA 属性

セマンティック HTML で表現できない場合に補助的に使う。
**「セマンティック HTML より ARIA」ではなく「セマンティック HTML で済むなら ARIA は使わない」** が原則。

主要な属性:

| 属性 | 用途 |
|---|---|
| `aria-label` | 視覚的なラベルがない要素に名前を付ける |
| `aria-labelledby` | 別要素の text をラベルとして参照 |
| `aria-describedby` | 補足説明の参照 |
| `aria-expanded` | 展開状態（アコーディオン等） |
| `aria-hidden` | スクリーンリーダーから隠す（装飾要素） |
| `role` | 要素の役割を上書き（セマンティック HTML 使えるなら不要） |

例:

```html
<!-- アイコンのみのボタン -->
<button aria-label="メニューを開く">
  <MenuIcon aria-hidden="true" />
</button>

<!-- アコーディオン -->
<button aria-expanded="false" aria-controls="panel-1">詳細を見る</button>
<div id="panel-1" hidden>...</div>
```

## キーボード操作

全てのインタラクションを **マウスなし** で完結できるようにする:

- Tab で全フォーカス可能要素を移動できる
- フォーカス順序が視覚順序と一致する
- Enter / Space で活性化できる
- Escape でモーダル・ドロップダウンを閉じられる
- フォーカスインジケータ（focus ring）を消さない
  - Tailwind の `focus-visible:outline-none` だけで終わらせない
  - 代替の `focus-visible:ring-2` 等を必ず付ける

## カラーコントラスト

WCAG AA 基準:

| 種別 | コントラスト比 |
|---|---|
| 通常テキスト（18px 未満） | 4.5:1 以上 |
| 大きいテキスト（18px 以上 / 14px 太字） | 3:1 以上 |
| UI コンポーネント・グラフィック | 3:1 以上 |

確認ツール:

- Chrome DevTools の Lighthouse / Accessibility パネル
- Stark / axe DevTools 拡張機能

## フォーカス管理

- モーダル / ダイアログ表示時はフォーカスをモーダル内に閉じ込める（focus trap）
- モーダルを閉じたら呼び出し元の要素にフォーカスを戻す
- ページ遷移時はフォーカスを `<main>` 先頭等の意味のある位置に移す

## フォーム

- 全 input に `<label>` を関連付ける（`htmlFor` + `id` or 入れ子）
- エラーメッセージは `aria-describedby` でフィールドに紐付ける
- 必須項目は `required` 属性 + 視覚表示の両方
- エラーは色だけで示さない（テキスト or アイコンも併用）

```html
<label htmlFor="email">メールアドレス</label>
<input
  id="email"
  type="email"
  required
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && <p id="email-error">有効なメールアドレスを入力してください</p>}
```

## 画像 / メディア

- `<img>` には `alt` 属性を必ず付ける
  - 意味のある画像: 内容を説明する alt
  - 装飾画像: `alt=""`（空文字列）
- 動画には字幕（captions）を付ける
- 音声には文字起こし（transcript）を提供

## 動きと音

- 自動再生される音声 / 動画は **デフォルトでミュート**
- アニメーションは `prefers-reduced-motion` メディアクエリで無効化可能にする

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- 点滅は 1 秒間に 3 回以下に抑える（光感受性発作の予防）

## 言語属性

- `<html lang="ja">` で文書全体の言語を指定
- 部分的に別言語のテキストは `<span lang="en">` で指定

## 確認ツール

| ツール | 用途 |
|---|---|
| Lighthouse | スコア化（CI で 0.9 以上を基準） |
| axe DevTools | 詳細なルール違反検出 |
| WAVE | ビジュアル化された違反表示 |
| スクリーンリーダー | NVDA（Windows）/ VoiceOver（macOS） |
| キーボードのみ操作テスト | Tab / Enter / Space / Esc のみで全操作 |

## 関連ルール

- `rules/coding-standards.md` — セマンティック HTML はコーディング規約の一部
- `rules/seo.md` — アクセシビリティは SEO にも効く
- `rules/testing-standards.md` — E2E テストでキーボード操作を検証

<!-- MVP 版 (2026-06-03)、claude-assets-public 昇格時は全文精査要 -->
