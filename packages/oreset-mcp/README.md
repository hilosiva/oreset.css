# @hilosiva/oreset-mcp

[oreset.css](https://github.com/hilosiva/oreset.css) のリセットルールと設計思想を、AI コーディングツールが MCP 経由で参照できるようにするサーバーです。

Claude Code / Cursor などと連携することで、AI エージェントが oreset.css の仕様を理解した状態でコーディングをサポートします。

---

## 提供ツール

| ツール名 | 説明 |
|---|---|
| `get_reset_rules` | 各 HTML 要素へのリセット内容を返す。カテゴリでフィルタ可能 |
| `get_usage_guide` | 設計思想・使い方・注意点・FAQ を返す |

---

## セットアップ

### Claude Code

プロジェクトルートに `.mcp.json` を作成して追記：

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

### Cursor

`.cursor/mcp.json` に追記：

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

## ライセンス

MIT
