<!--
  rules/web-security.md の原本（MVP 版）。各 repo の .claude/rules/ には symlink で配備。
  更新はこの原本側で行う。
  配備: install-rules.sh に repo の root を渡す。
-->

# Web セキュリティ規約（MVP）

Next.js / Vercel を中心とした Web アプリ向けのセキュリティ規律。
「最低限ここまではやる」を MVP で揃え、必要に応じて派生ルールで拡張する。

## HTTP セキュリティヘッダ

`next.config.ts` で全パスに対して以下のヘッダを付与する:

```typescript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
```

| ヘッダ | 目的 |
|---|---|
| `X-Frame-Options: DENY` | クリックジャッキング防止（iframe 埋め込み禁止） |
| `X-Content-Type-Options: nosniff` | MIME スニッフィング防止 |
| `Referrer-Policy` | 外部遷移時に Referer から内部 URL を漏らさない |
| `Permissions-Policy` | カメラ・マイク・位置情報を不要なら無効化 |

### CSP（Content-Security-Policy）

CSP は強力だが Next.js では nonce 管理が必要で MVP では省略可。
本格運用時に以下を検討する:

- `script-src 'self' 'nonce-<random>'`
- `style-src 'self' 'unsafe-inline'`（Tailwind 等で必要）
- `connect-src 'self' <外部 API>`

## XSS 対策

- React のデフォルトエスケープを信頼する。`dangerouslySetInnerHTML` は原則禁止
- 使う場合は **入力源をサニタイズしたデータのみ**（DOMPurify 等）
- Markdown レンダリングは信頼できるパーサ + サニタイザを通す

## CSRF 対策

- **Server Actions** を使う場合、Next.js 内蔵の Origin 検証が効く（Same-Origin 必須）
- 外部 API への state 変更リクエストは:
  - `SameSite=Lax` or `Strict` Cookie
  - CSRF トークン（state 変更系は POST + token 検証）

## 認証・認可

- 認証情報は **必ず HttpOnly + Secure + SameSite=Lax** Cookie で保持
- localStorage / sessionStorage に認証トークンを置かない（XSS で全奪取される）
- セッション切れ時の挙動を明示（自動ログアウト or リフレッシュ）
- 認可判定は **サーバー側で必ず実施**（クライアント側 hide はバイパス可能）

## 入力バリデーション

- 全ての外部入力（フォーム、API パラメータ、URL クエリ）に **Zod 等のスキーマ検証** を通す
- クライアント側検証は UX のため、**サーバー側でも必ず再検証** する
- エラーメッセージで内部実装を露出させない（"Database connection failed" 等 NG）

## 環境変数とシークレット

- `.env` `.env.local` を repo にコミットしない（`.gitignore` で必ず除外）
- `.env.example` のみコミットし、**値は空 or プレースホルダ**
- 公開してよい値のみ `NEXT_PUBLIC_*` プレフィックス（クライアント JS に埋め込まれる）
- サーバー専用シークレット（API キー / DB 接続情報）は `NEXT_PUBLIC_*` を付けない
- Vercel 等のホスティング側で Production / Preview / Development の **スコープを分ける**

## 依存パッケージの脆弱性

- `pnpm audit` を定期実行（push 前 Hooks に組み込み可）
- Dependabot / Renovate で自動 PR を有効化
- 重大度 `high` 以上は対応必須、`moderate` は判断
- ロックファイル（`pnpm-lock.yaml`）を必ずコミット、`--frozen-lockfile` でビルド

## reCAPTCHA / ボット対策

- 公開フォーム（問い合わせ・新規登録）には reCAPTCHA v3 等のボット判定を入れる
- スコア閾値はフォームの重要度で調整（一般問い合わせ 0.5、決済 0.7 等）
- サーバー側で必ず検証（クライアントから渡された score を信用しない）

## ログとモニタリング

- アクセスログ・エラーログに **個人情報・トークンを書かない**
- ログ送信前にマスキング処理を入れる
- 異常な認証失敗・大量リクエストは検知できる粒度でログを残す

## 関連ルール

- `rules/coding-standards.md` — コーディング規約
- `rules/testing-standards.md` — セキュリティテスト（XSS / CSRF / バリデーション）
- `rules/git.md` — secret commit 禁止
