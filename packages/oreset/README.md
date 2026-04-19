# Oreset.css

**「俺のreset.css」** — ブラウザ差異の除去に徹した、アクセシビリティ重視のリセットCSS。

---

## 名前の由来

「Oreset」は **「俺のreset」** が語源です。そのままコピーして、自分のプロジェクトに合わせて育てていくことを想定しています。

---

## 特徴

- **責務はブラウザ差異の除去のみ。** ベーススタイル（フォント・カラー・余白）は別ファイルに分離する設計
- **ARIAフックをCSSレベルで実装。** `[aria-disabled]` `[aria-busy]` などの状態属性をCSSのフックとして機能させる
- **詳細度ゼロ。** すべてのルールを `:where()` でラップ。書いたスタイルがリセットに負けない
- **日本語対応。** `text-spacing-trim` `text-autospace` `line-break: strict` を標準適用。`:lang(ja)` で日本語環境に最適化
- **UI要素の装飾は消さない。** 問題のあるブラウザ差異だけを修正し、スタイル未適用でも視覚的・アクセシブルに機能する状態を維持
- **論理プロパティを全面採用。** `inline-size` `block-size` `padding-inline` など

---

## 設計思想

### ブラウザとユーザーの設定を尊重する

`font-size` は一切触りません。`h1`〜`h6` のフォントサイズも同様です。2025年5月の仕様変更でブラウザ間の差異が解消されたため、リセット不要になりました。

### `@layer` はimport側で定義する

Oreset自身はレイヤーを宣言しません。使う側が自分のレイヤー構成に組み込めるようにするためです。

```css
@layer reset, base, components, utilities;

@import url("oreset.css") layer(reset);
```

---

## 使い方

### 直接コピー（推奨）

GitHubからソースをコピーして、プロジェクトに合わせて書き換えてください。

### npm

```bash
pnpm add @hilosiva/oreset
```

```css
@layer reset, base, components, utilities;
@import "@hilosiva/oreset" layer(reset);
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@hilosiva/oreset@4.0.3/dist/oreset.css">
```

---

## MCP サーバー（AI エージェント連携）

Claude Code / Cursor などの AI コーディングツールと連携できる MCP サーバーを提供しています。

接続すると、AI エージェントが oreset.css のリセットルールや設計思想をリアルタイムで参照しながらコーディングできるようになります。

```bash
pnpm add -D @hilosiva/oreset-mcp
```

プロジェクトルートの `.mcp.json` に追記（Cursor は `.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "oreset": {
      "command": "npx",
      "args": ["-y", "@hilosiva/oreset-mcp"]
    }
  }
}
```

---

## ブラウザサポート

| ブラウザ | バージョン |
|---|---|
| Chrome | 123以降 |
| Edge | 123以降 |
| Firefox | 125以降 |
| Safari | 17.4以降 |

`:where()` / `:has()` / `:focus-visible` / `svb` 単位 / CSS Anchor Positioning（Popover API）などを使用しています。

---

## ライセンス

MIT License
