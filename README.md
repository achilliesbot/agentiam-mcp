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

🚧 **Skeleton.** Wiring underway. Pin `main` for the latest; tag releases will follow once the payment-flow tests pass.

## Discovery references

- AgentIAM x402 manifest: https://achillesalpha.com/.well-known/x402
- AgentIAM MCP discovery: https://achillesalpha.com/.well-known/mcp.json
- MCP Registry: `io.github.achilliesbot/ep-agentiam`
- x402scan: https://www.x402scan.com/server/de9dbadb-6475-43f2-a621-a805fb1c661e
- 402index: https://402index.io

## License

MIT.
