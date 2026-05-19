#!/usr/bin/env node
/**
 * agentiam-mcp — Stdio MCP server wrapping AgentIAM's 18 x402 endpoints.
 *
 * Each tool maps 1:1 to an x402-paid HTTP endpoint at https://achillesalpha.com.
 * In this initial release, tool calls return the AgentIAM endpoint's 402 challenge
 * (payment manifest + sample response) so MCP clients can discover the catalog
 * without holding USDC. Wallet-signing payment flow lands in a follow-up.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE = "https://achillesalpha.com";

const TOOLS = [
  // Safety pillars
  { name: "noleak",            path: "/x402/noleak",            price: "0.01",  desc: "Verify execution integrity — detect leaks, injection, unauthorized data flow." },
  { name: "memguard",          path: "/x402/memguard",          price: "0.01",  desc: "Verify memory/state — detect drift, corruption, unauthorized modifications." },
  { name: "riskoracle",        path: "/x402/riskoracle",        price: "0.01",  desc: "Pre-action risk scoring — multi-factor analysis before executing an action." },
  { name: "secureexec",        path: "/x402/secureexec",        price: "0.01",  desc: "Sandboxed tool execution with proof hash." },
  { name: "flowcore",          path: "/x402/flowcore",          price: "0.02",  desc: "Full orchestration pipeline — chains NoLeak + MemGuard + RiskOracle + SecureExec." },
  // Audit / policy
  { name: "audit",             path: "/x402/audit",             price: "0.03",  desc: "OWASP-class code safety audit." },
  { name: "validate",          path: "/x402/validate",          price: "0.01",  desc: "Deterministic policy validation — risk + compliance + proof hash." },
  { name: "risk_check",        path: "/x402/risk-check",        price: "0.005", desc: "Lightweight risk score by action type/value/leverage." },
  // Intelligence
  { name: "research",          path: "/api/v1/research",        price: "0.05",  desc: "Structured intel brief — web research + analysis." },
  { name: "intelligence_report", path: "/x402/intelligence-report", price: "0.05", desc: "Deep DELPHI synthesis — cross-referenced signals." },
  // DELPHI graph
  { name: "delphi",                 path: "/x402/delphi",                 price: "0.01", desc: "Real-time intel signals (crypto, AI, DeFi, macro)." },
  { name: "delphi_entity",          path: "/x402/delphi/graph/entity",    price: "0.01", desc: "Knowledge graph entity lookup + relationships." },
  { name: "delphi_query",           path: "/x402/delphi/graph/query",     price: "0.01", desc: "Graph query by predicate/subject/object." },
  { name: "delphi_timeline",        path: "/x402/delphi/graph/timeline",  price: "0.01", desc: "Chronological fact history for any entity." },
  { name: "delphi_contradictions",  path: "/x402/delphi/graph/contradictions", price: "0.01", desc: "Conflicting intelligence detection." },
  // Signals
  { name: "latest_signals",    path: "/x402/latest-signals",    price: "0.001", desc: "Cheapest entry — latest signals across all categories." },
  { name: "signal_query",      path: "/x402/signal-query",      price: "0.002", desc: "Query signals by type/severity/keyword/time." },
  { name: "publish_signal",    path: "/x402/publish-signal",    price: "0.005", desc: "Publish a signal — earn 70% of downstream query fees." },
];

const server = new Server(
  { name: "agentiam-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => ({
    name: t.name,
    description: `${t.desc} ($${t.price} USDC per call on Base, via x402.)`,
    inputSchema: {
      type: "object",
      properties: {
        input: { type: "object", description: "Free-form input payload for the AgentIAM endpoint. Schema details at " + BASE + t.path },
      },
    },
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find((t) => t.name === req.params.name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }], isError: true };
  }
  const body = JSON.stringify(req.params.arguments?.input ?? {});
  const resp = await fetch(BASE + tool.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow",
  });
  const text = await resp.text();
  if (resp.status === 402) {
    const header = resp.headers.get("payment-required");
    let challenge = text;
    if (header) {
      try {
        challenge = JSON.stringify(JSON.parse(Buffer.from(header, "base64").toString("utf8")), null, 2);
      } catch { /* fall back to raw header */ challenge = header; }
    }
    return {
      content: [{
        type: "text",
        text: `402 Payment Required — $${tool.price} USDC.\n\n` +
              `This MCP wrapper currently surfaces AgentIAM's 402 challenge for discovery. ` +
              `To call paid, sign an x402 payment header and POST directly to ${BASE}${tool.path}.\n\n` +
              `Challenge:\n${challenge}`,
      }],
    };
  }
  return { content: [{ type: "text", text }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
