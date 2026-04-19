#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Data — oreset.css v4.0.3
// ---------------------------------------------------------------------------

const RESET_RULES = [
  {
    selector: "*, ::before, ::after",
    category: "Global",
    properties: [
      { property: "box-sizing", value: "border-box", note: "全要素でボーダーボックスモデルを統一" },
      { property: "min-inline-size", value: "0", note: "flex/gridアイテムのオーバーフロー問題を防ぐ" },
      { property: "padding", value: "0", note: "ブラウザデフォルトパディングをリセット" },
      { property: "margin", value: "0", note: "ブラウザデフォルトマージンをリセット" },
      { property: "border-width", value: "1px", note: "border-styleを指定するだけで1pxの枠線が出る" },
    ],
  },
  {
    selector: ":where(html)",
    category: "Document & Sections",
    properties: [
      { property: "-webkit-text-size-adjust / text-size-adjust", value: "none", note: "none を使用。100%ではなく none — iOS Safariで必要" },
      { property: "scrollbar-gutter", value: "stable", note: "スクロールバーの有無でレイアウトシフトを防ぐ" },
      { property: "text-spacing-trim", value: "trim-start", note: "日本語句読点の行頭スペースを除去" },
      { property: "text-autospace", value: "normal", note: "和欧文間の自動スペーシングを有効化" },
      { property: "line-break", value: "strict", note: "日本語の厳密な禁則処理" },
      { property: "overflow-wrap", value: "anywhere", note: "長い文字列の折り返しを許可" },
      { property: "-webkit-tap-highlight-color", value: "transparent", note: "タップハイライトを非表示" },
      { property: "interpolate-size", value: "allow-keywords", note: "height: autoへのトランジションを可能にする" },
      { property: "line-height", value: "1.5", note: "WCAG準拠のベースライン。ブラウザデフォルト（約1.2）は狭すぎる" },
    ],
  },
  {
    selector: ":where(html:has(dialog:modal[open]))",
    category: "Document & Sections",
    properties: [
      { property: "overflow", value: "hidden", note: "モーダルダイアログ表示中の背景スクロールを防止" },
    ],
  },
  {
    selector: ":where(body)",
    category: "Document & Sections",
    properties: [
      { property: "min-block-size", value: "100svb", note: "最小高さを画面全体に（Small Viewport考慮）" },
      { property: "overflow-x", value: "clip", note: "clip を使用。hidden ではなく clip — BFCを生成せず、stickyポジションを維持" },
    ],
  },
  {
    selector: ":where(:is(h1, h2, h3, h4, h5, h6):lang(en))",
    category: "Document & Sections",
    properties: [
      { property: "text-wrap", value: "balance", note: "英語見出しの最終行1語だけになる（widow）を防ぐ" },
    ],
  },
  {
    selector: ":where(hr)",
    category: "Grouping content",
    properties: [
      { property: "border-width", value: "0", note: "デフォルト枠線をリセット" },
      { property: "border-block-start", value: "1px solid", note: "論理プロパティで水平線を実現" },
      { property: "color", value: "inherit", note: "色を継承" },
      { property: "block-size", value: "0", note: "高さをゼロに" },
    ],
  },
  {
    selector: ":where(ul, ol)",
    category: "Grouping content",
    properties: [
      { property: "list-style-type", value: '""', note: '空文字列を使用。none ではなく "" — Safariがlist roleを剥奪するのを防ぐ' },
    ],
  },
  {
    selector: ":where(pre)",
    category: "Grouping content",
    properties: [
      { property: "text-autospace", value: "no-autospace", note: "モノスペースフォントの整列を崩さないよう自動スペーシングを無効化" },
    ],
  },
  {
    selector: ":where(address:lang(ja))",
    category: "Grouping content",
    properties: [
      { property: "font-style", value: "unset", note: "日本語住所のイタリック体を解除" },
    ],
  },
  {
    selector: ":where(p:lang(en))",
    category: "Grouping content",
    properties: [
      { property: "text-wrap", value: "pretty", note: "英語段落の最終行の孤立した単語を防ぐ" },
    ],
  },
  {
    selector: ":where(b, strong)",
    category: "Text-level semantics",
    properties: [
      { property: "font-weight", value: "700", note: "太字を数値で明示（ブラウザ差異を吸収）" },
    ],
  },
  {
    selector: ":where(small)",
    category: "Text-level semantics",
    properties: [
      { property: "font-size", value: "max(0.625rem, 0.8em)", note: "ブラウザデフォルト(0.8em)を維持しつつ10pxのアクセシビリティフロアを設ける" },
    ],
  },
  {
    selector: ":where(code, kbd, samp)",
    category: "Text-level semantics",
    properties: [
      { property: "font-family", value: "ui-monospace, monospace", note: "等幅フォントに統一" },
    ],
  },
  {
    selector: ":where(em:lang(ja), i:lang(ja), cite:lang(ja), dfn:lang(ja))",
    category: "Text-level semantics",
    properties: [
      { property: "font-style", value: "normal", note: "日本語コンテンツのイタリック体を解除" },
    ],
  },
  {
    selector: ":where(:any-link)",
    category: "Text-level semantics",
    properties: [
      { property: "color", value: "unset", note: "リンクの色を継承" },
      { property: "text-decoration-skip-ink", value: "auto", note: "下線がグリフと交差しないように自動調整" },
    ],
  },
  {
    selector: ":where(img, svg, video, canvas, audio, iframe, embed, object)",
    category: "Embedded content",
    properties: [
      { property: "display", value: "block flow", note: "インライン要素によるベースライン問題を解消" },
    ],
  },
  {
    selector: ":where(img, picture, svg, video)",
    category: "Embedded content",
    properties: [
      { property: "max-inline-size", value: "100%", note: "親要素をはみ出さないように制限" },
      { property: "block-size", value: "auto", note: "アスペクト比を維持" },
    ],
  },
  {
    selector: ":where(iframe)",
    category: "Embedded content",
    properties: [
      { property: "border", value: "unset", note: "iframeのデフォルト枠線を除去" },
    ],
  },
  {
    selector: ":where(table)",
    category: "Tabular data",
    properties: [
      { property: "border-collapse", value: "collapse", note: "セル間の二重枠線を解消" },
    ],
  },
  {
    selector: ":where(caption, th)",
    category: "Tabular data",
    properties: [
      { property: "text-align", value: "unset", note: "デフォルトの中央揃え・左揃えをリセット" },
    ],
  },
  {
    selector: ":where(th)",
    category: "Tabular data",
    properties: [
      { property: "font-weight", value: "700", note: "太字を数値で明示" },
    ],
  },
  {
    selector: ":where(input, button, textarea, select, optgroup)",
    category: "Forms",
    properties: [
      { property: "font", value: "unset", note: "フォーム要素のフォントをページのフォントに継承させる" },
      { property: "color", value: "unset", note: "フォーム要素の色を継承" },
      { property: "letter-spacing", value: "inherit", note: "文字間隔を継承" },
      { property: "word-spacing", value: "inherit", note: "単語間隔を継承" },
      { property: "font-feature-settings", value: "inherit", note: "OpenType機能を継承" },
      { property: "font-variation-settings", value: "inherit", note: "可変フォント設定を継承" },
    ],
  },
  {
    selector: ":where(button, input[type='button'], input[type='submit'], input[type='reset'])",
    category: "Forms",
    properties: [
      { property: "border-radius", value: "unset", note: "ブラウザデフォルトの角丸をリセット" },
      { property: "background-color", value: "unset", note: "デフォルト背景色をリセット" },
      { property: "touch-action", value: "manipulation", note: "ダブルタップズームを無効化してレスポンス向上" },
      { property: "border-style", value: "solid", note: "border-widthが1pxに設定済みなので、border-styleを指定すると枠線が表示される" },
    ],
  },
  {
    selector: ":where(input:not([type='button'], [type='submit'], [type='reset']), textarea, [contenteditable])",
    category: "Forms",
    properties: [
      { property: "text-autospace", value: "no-autospace", note: "テキスト入力中の予期せぬスペース挿入を防ぐ" },
    ],
  },
  {
    selector: ":where(input[type='radio'], input[type='checkbox'])",
    category: "Forms",
    properties: [
      { property: "margin", value: "unset", note: "ラジオ・チェックボックスのマージンをリセット" },
    ],
  },
  {
    selector: ":where(input[type='search'])",
    category: "Forms",
    properties: [
      { property: "-webkit-appearance", value: "textfield", note: "Webkit検索フィールドのデフォルトスタイルを除去" },
    ],
  },
  {
    selector: ":where(input[type='tel'], input[type='url'], input[type='email'], input[type='number'])",
    category: "Forms",
    properties: [
      { property: "direction", value: "ltr", note: "プレースホルダーが非表示（入力あり）の場合、左から右へ表示を強制" },
    ],
  },
  {
    selector: ":where(textarea)",
    category: "Forms",
    properties: [
      { property: "resize", value: "block", note: "縦方向（ブロック方向）のみリサイズ可能に制限" },
    ],
  },
  {
    selector: ":where(textarea:not([rows]))",
    category: "Forms",
    properties: [
      { property: "min-block-size", value: "10em", note: "rows属性なしのtextareaに最小高さを設定" },
    ],
  },
  {
    selector: ":where(fieldset)",
    category: "Forms",
    properties: [
      { property: "padding", value: "unset", note: "デフォルトパディングをリセット" },
      { property: "border", value: "unset", note: "デフォルト枠線をリセット" },
    ],
  },
  {
    selector: ":where(legend)",
    category: "Forms",
    properties: [
      { property: "padding-inline", value: "unset", note: "デフォルトインラインパディングをリセット" },
    ],
  },
  {
    selector: ":where(progress)",
    category: "Forms",
    properties: [
      { property: "vertical-align", value: "unset", note: "デフォルトの垂直揃えをリセット" },
    ],
  },
  {
    selector: ":where(::placeholder)",
    category: "Forms",
    properties: [
      { property: "opacity", value: "unset", note: "Firefoxのプレースホルダー半透明問題を解消" },
    ],
  },
  {
    selector: ":where(dialog, [popover])",
    category: "Interactive",
    properties: [
      { property: "max-inline-size", value: "unset", note: "デフォルトの最大幅制限を解除" },
      { property: "max-block-size", value: "unset", note: "デフォルトの最大高さ制限を解除" },
      { property: "color", value: "unset", note: "色を継承" },
      { property: "background-color", value: "unset", note: "背景色をリセット" },
      { property: "border-style", value: "none", note: "デフォルト枠線を非表示" },
      { property: "overscroll-behavior-block", value: "contain", note: "ダイアログ内のスクロールが背景に伝播しないよう制御" },
    ],
  },
  {
    selector: ":where(dialog)",
    category: "Interactive",
    properties: [
      { property: "margin", value: "auto", note: "ダイアログをビューポート中央に配置" },
    ],
  },
  {
    selector: ":where(dialog:not([open], [popover]), [popover]:not(:popover-open))",
    category: "Interactive",
    properties: [
      { property: "display", value: "none", note: "非表示状態のdialog・popoverをhiddenに" },
    ],
  },
  {
    selector: ":where(summary)",
    category: "Interactive",
    properties: [
      { property: "list-style-type", value: '""', note: '空文字列を使用。none ではなく "" — SafariのARIAロール剥奪防止' },
    ],
  },
  {
    selector: ":where(summary)::-webkit-details-marker",
    category: "Interactive",
    properties: [
      { property: "display", value: "none", note: "WebkitのdetailsデフォルトマーカーをCSSで非表示" },
    ],
  },
  {
    selector: ":where(button, label, select, summary, [role='button'], [role='link'], [role='option'], [role='tab'])",
    category: "Accessibility",
    properties: [
      { property: "cursor", value: "pointer", note: "インタラクティブ要素にポインターカーソルを適用" },
    ],
  },
  {
    selector: ":where(input[type='file'])::-webkit-file-upload-button, :where(input[type='file'])::file-selector-button",
    category: "Accessibility",
    properties: [
      { property: "cursor", value: "pointer", note: "ファイル選択ボタンにポインターカーソルを適用" },
    ],
  },
  {
    selector: ":where([disabled], label:has(> input:disabled), label:has(+ input:disabled))",
    category: "Accessibility",
    properties: [
      { property: "cursor", value: "not-allowed", note: "無効化された要素・ラベルに禁止カーソルを表示" },
    ],
  },
  {
    selector: ":where([aria-disabled='true'])",
    category: "Accessibility",
    properties: [
      { property: "cursor", value: "not-allowed", note: "aria-disabled要素に禁止カーソルを表示（ARIAフック）" },
    ],
  },
  {
    selector: ":where([aria-busy='true'])",
    category: "Accessibility",
    properties: [
      { property: "cursor", value: "progress", note: "処理中要素にプログレスカーソルを表示（ARIAフック）" },
    ],
  },
  {
    selector: ":where([role='button'], [role='tab'], [role='option'])",
    category: "Accessibility",
    properties: [
      { property: "touch-action", value: "manipulation", note: "カスタムインタラクティブ要素のダブルタップズームを無効化" },
    ],
  },
  {
    selector: ":where([hidden]:not([hidden='until-found']))",
    category: "Accessibility",
    properties: [
      { property: "display", value: "none", note: "hidden属性をdisplay:noneに。until-found は beforematch イベントのため除外" },
    ],
  },
  {
    selector: ":where(:focus:not(:focus-visible))",
    category: "Accessibility",
    properties: [
      { property: "outline", value: "none", note: "マウス操作時のフォーカスリングを非表示（キーボード操作時は維持）" },
    ],
  },
  {
    selector: ":where(:focus-visible, :target)",
    category: "Accessibility",
    properties: [
      { property: "scroll-margin-block", value: "8vh", note: "フォーカス・アンカーリンク到達時に要素が見切れないようスクロールマージンを設定" },
    ],
  },
  {
    selector: "@media (prefers-reduced-motion: reduce) — *, ::before, ::after, ::backdrop",
    category: "Accessibility / Reduced Motion",
    properties: [
      { property: "animation-duration", value: "0.01ms !important", note: "0ではなく0.01ms — animationendイベントがJSで確実に発火する" },
      { property: "animation-iteration-count", value: "1 !important", note: "アニメーションを1回だけ実行" },
      { property: "animation-delay", value: "unset !important", note: "遅延をリセット" },
      { property: "transition-delay", value: "unset !important", note: "トランジション遅延をリセット" },
      { property: "transition-duration", value: "0.01ms !important", note: "トランジションをほぼ無効化" },
      { property: "scroll-behavior", value: "auto !important", note: "スムーズスクロールを無効化" },
      { property: "view-transition-name", value: "none !important", note: "View Transitionsを無効化" },
    ],
  },
];

const USAGE_GUIDE = `
# oreset.css v4.0.3 — 設計思想・使い方・注意点

## 概要

oreset.css（「俺のreset.css」）は、ブラウザ差異の除去に徹したアクセシビリティ重視のリセットCSSです。
Qlio（キュリオ）が開発しています。

## 設計原則

### 1. 責務はブラウザ差異の除去のみ
ベーススタイル（フォント・カラー・余白）は別ファイルに分離する設計です。
oreset.css はリセットに専念し、プロジェクト固有の見た目は別の CSS ファイルで定義します。

### 2. 詳細度ゼロ（:where() ラッパー）
すべてのルールを :where() でラップしています。
詳細度が 0 になるため、プロジェクト側で書いたスタイルがリセットに負けることがありません。
特殊な詳細度管理や !important が不要になります。

### 3. @layer はimport側で定義する
oreset.css 自身はレイヤーを宣言しません。
使う側が自分のレイヤー構成に組み込めるようにするためです。

### 4. ARIAフックをCSSレベルで実装
[aria-disabled] / [aria-busy] などのWAI-ARIA状態属性をCSSのフックとして機能させています。
HTML の aria 属性と CSS カーソルスタイルが連動するため、JSの実装漏れを防ぎます。

### 5. 日本語対応
text-spacing-trim / text-autospace / line-break: strict を標準適用。
:lang(ja) セレクタで日本語環境に特化したリセットも含みます。

### 6. 論理プロパティを全面採用
inline-size / block-size / padding-inline など CSS 論理プロパティを使用しています。
国際化・縦書き対応が容易になります。

### 7. UI要素の装飾は消さない
button / input などのデフォルトの見た目（フォーム部品らしさ）を完全に消しません。
スタイル未適用でも視覚的・アクセシブルに機能する状態を維持します。

## 使い方

### 推奨: 直接コピー
GitHub からソースをコピーして、プロジェクトに合わせて書き換えてください。
「俺のreset」の名の通り、自分のプロジェクトに育てることを想定した設計です。

### npm インストール
\`\`\`bash
pnpm add @hilosiva/oreset
\`\`\`

### CSS での使い方（@layer を使った推奨パターン）
\`\`\`css
@layer reset, base, components, utilities;

@import url("@hilosiva/oreset/dist/oreset.css") layer(reset);
\`\`\`

### CDN
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@hilosiva/oreset@4.0.3/dist/oreset.css">
\`\`\`

## ブラウザサポート

| ブラウザ | バージョン |
|---|---|
| Chrome | 123以降 |
| Edge | 123以降 |
| Firefox | 125以降 |
| Safari | 17.4以降 |

使用している主な機能: :where() / :has() / :focus-visible / svb 単位 / Popover API

## 注意点・FAQ

### フォントサイズを一切触らない理由
2025年5月の仕様変更でブラウザ間の h1〜h6 サイズ差異が解消されました。
そのため h1〜h6 のフォントサイズリセットは不要になっています。
font-size を触ると、ユーザーのブラウザ設定を上書きしてアクセシビリティが低下します。

### list-style-type に none ではなく "" を使う理由
Safari は list-style: none を指定すると aria role="list" を自動で剥奪する挙動があります。
空文字列（""）にすることでスクリーンリーダーへのリスト情報を保持したまま表示をリセットできます。

### overflow-x: clip を body に使う理由
overflow-x: hidden は新しい BFC（ブロック書式コンテキスト）を生成するため、
position: sticky が機能しなくなることがあります。
clip は BFC を生成しないため、sticky ポジションを維持できます。

### reduced-motion で 0 ではなく 0.01ms にする理由
animation-duration: 0 にすると JavaScript の animationend イベントが発火しない場合があります。
0.01ms にすることでアニメーションはほぼ瞬時に終わりつつ、イベントが確実に発火します。

### dialog/popover の margin: auto について
:where(dialog) に margin: auto を設定することで、showModal() 時に
CSS を追加しなくてもダイアログが自動的にビューポート中央に配置されます。

### text-size-adjust: none を使う理由
100% ではなく none を指定しています。iOS Safari では 100% が正しく機能しないためです。

## ライセンス

MIT License
`;

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "oreset-mcp",
  version: "0.1.0",
});

// Tool 1: get_reset_rules
server.registerTool(
  "get_reset_rules",
  {
    description:
      "oreset.css がどの HTML 要素・セレクタにどんなリセットを当てているかを返します。カテゴリでフィルタリング可能。カテゴリ一覧: Global / Document & Sections / Grouping content / Text-level semantics / Embedded content / Tabular data / Forms / Interactive / Accessibility / Accessibility / Reduced Motion",
    inputSchema: {
      category: z
        .string()
        .optional()
        .describe(
          "絞り込むカテゴリ名（省略時は全カテゴリを返す）。例: 'Forms', 'Accessibility'"
        ),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ category }) => {
    const rules = category
      ? RESET_RULES.filter((r) =>
          r.category.toLowerCase().includes(category.toLowerCase())
        )
      : RESET_RULES;

    if (rules.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `カテゴリ "${category}" に一致するルールが見つかりませんでした。\n利用可能なカテゴリ: ${[...new Set(RESET_RULES.map((r) => r.category))].join(", ")}`,
          },
        ],
      };
    }

    const lines: string[] = [];

    // カテゴリでグループ化して出力
    const grouped = new Map<string, typeof rules>();
    for (const rule of rules) {
      if (!grouped.has(rule.category)) grouped.set(rule.category, []);
      grouped.get(rule.category)!.push(rule);
    }

    for (const [cat, catRules] of grouped) {
      lines.push(`## ${cat}`);
      lines.push("");
      for (const rule of catRules) {
        lines.push(`### \`${rule.selector}\``);
        for (const prop of rule.properties) {
          lines.push(`- **${prop.property}**: \`${prop.value}\``);
          lines.push(`  - ${prop.note}`);
        }
        lines.push("");
      }
    }

    return {
      content: [
        {
          type: "text",
          text: lines.join("\n"),
        },
      ],
      structuredContent: { rules },
    };
  }
);

// Tool 2: get_usage_guide
server.registerTool(
  "get_usage_guide",
  {
    description:
      "oreset.css の設計思想・使い方・注意点・FAQ を返します。プロジェクトへの組み込み方法や、なぜこの実装なのかの理由を理解するために使用してください。",
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: USAGE_GUIDE,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("oreset-mcp server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
