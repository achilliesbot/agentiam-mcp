# agentiam-mcp

> Stdio MCP server wrapping all 18 [AgentIAM](https://achillesalpha.com) x402 endpoints — agent identity, safety, and intelligence for autonomous agents on Base Mainnet.

## What this is

`agentiam-mcp` exposes the AgentIAM HTTP catalog as a Model Context Protocol (MCP) server. Any MCP-capable client (Claude Desktop, Cursor, VS Code, LangChain, etc.) can call the 18 endpoints as tools.

Endpoints:
- **Safety pillars** — `noleak`, `memguard`, `riskoracle`, `secureexec`, `flowcore`
- **Audit / policy** — `audit`, `validate`, `risk-check`
- **Intelligence** — `research`, `intelligence-report`
- **DELPHI knowledge graph** — `delphi`, `delphi.entity`, `delphi.query`, `delphi.timeline`, `delphi.contradictions`
- **Signals** — `latest-signals`, `signal-query`, `publish-signal`

Pricing: $0.001–$0.05 USDC per call, settled on Base via x402.

## Status

**v0.1.0 — discovery mode.** All 18 tools are registered. Tool calls return the AgentIAM endpoint's decoded x402 challenge (resource URL, accepts array, bazaar extension, schema), so MCP clients can browse the catalog without holding USDC. Wallet-signed payment flow (per-call USDC settlement) ships in v0.2.

## Install

```bash
git clone https://github.com/achilliesbot/agentiam-mcp.git
cd agentiam-mcp
npm install
```

## Run (standalone)

```bash
node src/index.mjs
# stdio MCP server — speaks JSON-RPC over stdin/stdout
```

## Configure in Claude Desktop / Cursor / VS Code

Add to your MCP config (`claude_desktop_config.json` on macOS at
`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "agentiam": {
      "command": "node",
      "args": ["/absolute/path/to/agentiam-mcp/src/index.mjs"]
    }
  }
}
```

Restart the client. The 18 AgentIAM tools (`noleak`, `memguard`, `riskoracle`,
`secureexec`, `flowcore`, `audit`, `validate`, `risk_check`, `research`,
`intelligence_report`, `delphi`, `delphi_entity`, `delphi_query`,
`delphi_timeline`, `delphi_contradictions`, `latest_signals`, `signal_query`,
`publish_signal`) appear in the tool picker.

## Run via Docker

```bash
docker build -t agentiam-mcp .
docker run -i agentiam-mcp
```

## Smoke test

```bash
( echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0.1"}}}'
  sleep 0.3
  echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  sleep 0.3
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
  sleep 1
) | node src/index.mjs
```

You should see a JSON-RPC response listing 18 tools.

## Discovery references

- AgentIAM x402 manifest: https://achillesalpha.com/.well-known/x402
- AgentIAM MCP discovery: https://achillesalpha.com/.well-known/mcp.json
- MCP Registry: `io.github.achilliesbot/ep-agentiam`
- x402scan: https://www.x402scan.com/server/de9dbadb-6475-43f2-a621-a805fb1c661e
- 402index: https://402index.io

## License

MIT.
