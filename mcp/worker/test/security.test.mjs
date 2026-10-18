import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.mjs";

const host = "mechintel-career-mcp.example.workers.dev";
const secret = "a-long-development-token-for-tests";
const env = { ALLOWED_HOSTS: host, ALLOWED_ORIGINS: "https://chamanprakashkanth.github.io", MCP_BEARER_TOKEN: secret };
const authenticated = { Authorization: `Bearer ${secret}` };
const makeRequest = (headers = {}, path = "/mcp") => new Request(`https://${host}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: "{}" });

test("remote endpoint refuses unknown routes and unapproved hosts/origins", async () => {
  assert.equal((await worker.fetch(makeRequest(authenticated), env)).status, 503); // rate limiter is deliberately absent
  assert.equal((await worker.fetch(makeRequest({}, "/"), env)).status, 404);
  assert.equal((await worker.fetch(new Request("https://wrong.example/mcp", { method: "POST", body: "{}" }), env)).status, 403);
  assert.equal((await worker.fetch(makeRequest({ Origin: "https://attacker.example" }), env)).status, 403);
});

test("remote endpoint fails closed without host, bearer token or limiter", async () => {
  assert.equal((await worker.fetch(makeRequest(authenticated), { ...env, ALLOWED_HOSTS: "" })).status, 503);
  assert.equal((await worker.fetch(makeRequest(authenticated), { ...env, MCP_BEARER_TOKEN: undefined })).status, 503);
  assert.equal((await worker.fetch(makeRequest(authenticated), env)).status, 503);
  assert.equal((await worker.fetch(makeRequest({ Authorization: "Bearer invalid" }), { ...env, MCP_LIMITER: { limit: async () => ({ success: true }) } })).status, 401);
});

test("remote endpoint rate limits authenticated callers before MCP dispatch", async () => {
  const limiter = { limit: async ({ key }) => { assert.equal(key, secret); return { success: false }; } };
  const response = await worker.fetch(makeRequest({ Authorization: `Bearer ${secret}` }), { ...env, MCP_LIMITER: limiter });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
});
