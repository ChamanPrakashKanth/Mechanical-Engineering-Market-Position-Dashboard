# MechIntel MCP and agent integration

MechIntel exposes a local, read-only Model Context Protocol server for deterministic mechanical engineering career analysis. It uses the official TypeScript MCP SDK over stdio and shares pure scoring functions with the browser application through `../shared/mechintel-core.js`. It makes no model/API calls and uses no GPU.

## Local installation

Requirements: Node.js 20 or later. From the repository root:

```powershell
npm ci --prefix mcp
npm run sync-catalog --prefix mcp
npm test --prefix mcp
npm start --prefix mcp
```

The server waits for MCP JSON-RPC on stdin/stdout. Configure an MCP client to start it; do not double-click the script.

## Client configuration

Replace the path with this repository's absolute path.

**Codex** (`~/.codex/config.toml`):

```toml
[mcp_servers.mechintel]
command = "node"
args = ["C:/path/to/repository/mcp/server.mjs"]
```

**Claude Desktop**:

```json
{"mcpServers":{"mechintel":{"command":"node","args":["C:/path/to/repository/mcp/server.mjs"]}}}
```

**Cursor** (`.cursor/mcp.json`):

```json
{"mcpServers":{"mechintel":{"command":"node","args":["C:/path/to/repository/mcp/server.mjs"]}}}
```

Other clients that support stdio MCP can use the same command and absolute script path. Reload the client after changing configuration.

## Tools and input schema

Each tool accepts optional structured profile fields: `region` (`India` or `Global`), `tier` (`Tier 1`–`Tier 3`), `degree` (`B.Tech/B.S.`, `M.Tech/M.S.`, `Ph.D.`), `cluster`, `projects` (0–10), `internships` (0–5), `research_papers` (0–10), `competitions` (0–10), `completed_course_count` (0–100), `skills`, `software_tools`, `certifications`, and `software_proficiency` (0–100 per tool). String arrays are limited to 100 short items. Optional `resume_text` is capped at 50,000 characters and is never persisted or returned.

| Tool | Additional input | Returns |
| --- | --- | --- |
| `analyze_engineer_profile` | Optional `resume_text`, `target_role` | Score indicators, fixed ATS coverage, top five role matches, optional target gaps, caveats |
| `calculate_employability_score` | — | Readiness, market-position, employability, recruiter-readiness, competency, completion indicators |
| `match_engineering_roles` | Optional `resume_text`, `limit` 1–10 | Catalog role matches, evidence, heuristic fit and fixed demand index |
| `analyze_ats_alignment` | Optional `resume_text` | Coverage against a fixed 13-term keyword list, present/missing terms and interpretation |
| `identify_skill_gaps` | Required `target_role` | Missing catalog skills/software and suggested certifications (never marked earned) |
| `generate_career_roadmap` | Required `target_role`, `hours_per_week` 0–80, `months` 1–60 | Deterministic plan estimate and evidence-oriented milestones |

### Example tool request

```json
{
  "name": "identify_skill_gaps",
  "arguments": {
    "target_role": "FEA",
    "tier": "Tier 2",
    "degree": "B.Tech/B.S.",
    "projects": 2,
    "skills": ["Finite Element Analysis (FEA)", "Structural Analysis"],
    "software_tools": ["ANSYS"],
    "certifications": []
  }
}
```

### Example response shape

```json
{
  "target_role": "FEA",
  "missing_skills": ["Vibration Analysis"],
  "missing_software": ["Abaqus", "Siemens NX"],
  "suggested_certifications": ["FEA Specialist Certification"],
  "interpretation": "Catalog gap check only; suggested credentials are not represented as earned."
}
```

Exact results depend on the supplied profile and current catalog.

## Read-only resources

- `mechintel://career-taxonomy` — public domains, role names, skills, software, certifications and fixed demand indices.
- `mechintel://assessment-methodology` — weights, interpretation limits and synthetic-data notice.

Role/domain data is generated from `DOMAINS_CATALOG` and `LINKEDIN_JOB_ROLES` in `app.js`. After changing them, run `npm run sync-catalog --prefix mcp`; tests detect drift.

## Scoring and privacy

The website and MCP call the same shared deterministic score, ATS, role-fit, parser and career-roadmap functions. See [the scoring methodology](../.agents/skills/mechintel/references/methodology.md). The site's 100,000-profile comparison cohort is deterministic synthetic data, not real or anonymized people. Scores and role fits are planning heuristics, not employment probabilities, actual applicant ranks, live job counts, employer ATS scores, or guarantees.

Resume text is processed in memory and discarded after a tool call. Raw text and parsed identity fields are omitted from results and safe errors. The local process is accessible to the configured OS user and any client allowed to launch it.

## Remote Worker path

`worker/` contains a separate Cloudflare Worker implementation using the official MCP server package and Streamable HTTP at `/mcp`. GitHub Pages remains static and is not an MCP runtime. There is no deployed endpoint.

Before a deliberate deployment:

1. Install Worker dependencies: `npm ci --prefix mcp/worker`.
2. Set exact `ALLOWED_HOSTS` and `ALLOWED_ORIGINS` in `worker/wrangler.toml`.
3. In `worker/wrangler.toml`, replace the example `namespace_id` with a positive integer unique to your Cloudflare account. The example binding allows 60 requests per token per 60 seconds; tune it for your use case. Cloudflare documents that rate-limit counters are location-local and that the namespace ID must be unique within the account.
4. Set a high-entropy bearer secret using `npx wrangler secret put MCP_BEARER_TOKEN` from `mcp/worker/`.
5. Review account plan, host/origin allowlists, CORS, rate limiting and logging. Never log request bodies or bearer tokens. For multiple users, use OAuth/Cloudflare Access rather than sharing one bearer token.
6. Check the build and confirm Wrangler lists `env.MCP_LIMITER`: `npm run check --prefix mcp/worker`.
7. Deploy only when ready: `npm run deploy --prefix mcp/worker`.
8. Verify the real `/mcp` endpoint with MCP Inspector and valid authorization.

The Worker fails closed without a configured host allowlist, bearer secret or rate-limit binding. No Cloudflare account, secret, DNS record, paid service, or public endpoint was created by this implementation.

## Protocol verification

Run `npm test --prefix mcp`. The official MCP TypeScript client connects to the server over stdio, discovers tools/resources, invokes valid and invalid inputs, checks deterministic output, shared-engine parity, catalog sync, metadata rules, oversized/malformed inputs and privacy-safe responses. The Worker has a separate build check.
