import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { registerMechIntelTools } from "./src/tools.mjs";

const require = createRequire(import.meta.url);
const core = require("../shared/mechintel-core.js");

export function createServer() {
  const server = new McpServer({ name: "mechintel-career-intelligence", version: "1.0.0" });
  registerMechIntelTools(server, z, core);
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  const transport = new StdioServerTransport();
  server.connect(transport).catch(error => {
    console.error("MechIntel MCP server failed to start:", error?.message || "unknown error");
    process.exitCode = 1;
  });
}
