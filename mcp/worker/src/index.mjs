import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import core from "../../../shared/mechintel-core.js";
import { registerMechIntelTools } from "../../src/tools.mjs";

const handler = createMcpHandler(() => {
  const server = new McpServer({ name: "mechintel-career-intelligence", version: "1.0.0" });
  registerMechIntelTools(server, z, core);
  return server;
});

function equalSecret(left, right) {
  if (!left || !right) return false;
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0);
  return diff === 0;
}

function allowedOrigin(origin, env) {
  if (!origin) return true; // non-browser MCP clients still require bearer auth
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function allowedHost(host, env) {
  const allowed = (env.ALLOWED_HOSTS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  return allowed.length > 0 && allowed.includes(host.toLowerCase());
}

export const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/mcp") return new Response("Not found", { status: 404 });
    if (!allowedHost(request.headers.get("Host") || url.host, env)) return new Response("Host is not configured", { status: env.ALLOWED_HOSTS ? 403 : 503 });
    const origin = request.headers.get("Origin") || "";
    if (!allowedOrigin(origin, env)) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
        "Access-Control-Expose-Headers": "MCP-Session-Id, MCP-Protocol-Version",
        "Vary": "Origin"
      } });
    }
    if (!env.MCP_BEARER_TOKEN) return new Response("MCP authentication is not configured", { status: 503 });
    const authorization = request.headers.get("Authorization") || "";
    const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!equalSecret(supplied, env.MCP_BEARER_TOKEN)) return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
    if (!env.MCP_LIMITER) return new Response("Rate limiting is not configured", { status: 503 });
    const rate = await env.MCP_LIMITER.limit({ key: supplied });
    if (!rate.success) return new Response("Rate limit exceeded", { status: 429, headers: { "Retry-After": "60" } });
    const response = await handler.fetch(request);
    if (!origin) return response;
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Expose-Headers", "MCP-Session-Id, MCP-Protocol-Version");
    headers.append("Vary", "Origin");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};

export default worker;
