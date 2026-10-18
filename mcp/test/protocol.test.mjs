import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import catalog from "../data/career-catalog.json" with { type: "json" };
import core from "../../shared/mechintel-core.js";

const here = path.dirname(fileURLToPath(import.meta.url));
let client;
let transport;

before(async () => {
  transport = new StdioClientTransport({ command: process.execPath, args: [path.resolve(here, "../server.mjs")] });
  client = new Client({ name: "mechintel-protocol-tests", version: "1.0.0" });
  await client.connect(transport);
});

after(async () => {
  await client?.close();
  await transport?.close();
});

function parseResult(response) {
  assert.ok(response.content?.[0]?.text, "tool returns a text result");
  return JSON.parse(response.content[0].text);
}

test("MCP starts over stdio and discovers six tools plus two resources", async () => {
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map(tool => tool.name).sort(), [
    "analyze_ats_alignment", "analyze_engineer_profile", "calculate_employability_score",
    "generate_career_roadmap", "identify_skill_gaps", "match_engineering_roles"
  ]);
  const resources = await client.listResources();
  assert.deepEqual(resources.resources.map(resource => resource.uri).sort(), ["mechintel://assessment-methodology", "mechintel://career-taxonomy"]);
});

test("score tool is deterministic and shared with the browser engine", async () => {
  const args = { tier: "Tier 2", degree: "B.Tech/B.S.", skills: ["Finite Element Analysis (FEA)", "Structural Analysis"], software_tools: ["ANSYS"], projects: 2, internships: 0, certifications: [] };
  const first = parseResult(await client.callTool({ name: "calculate_employability_score", arguments: args }));
  const second = parseResult(await client.callTool({ name: "calculate_employability_score", arguments: args }));
  assert.deepEqual(first, second);
  const profile = core.normalizeProfile(args);
  assert.deepEqual(first.scores, core.calculateScores(profile, {
    SolidWorks: 50, CATIA: 20, Creo: 20, "AutoCAD": 40, "Fusion 360": 30,
    "Siemens NX": 10, ANSYS: 30, Abaqus: 10, MATLAB: 20, Python: 20, Excel: 60
  }));
  const app = await readFile(path.resolve(here, "../../app.js"), "utf8");
  assert.match(app, /return MechIntelCore\.calculateScores\(profile, proficiencyValues, courseCount\)/);
  assert.match(app, /return MechIntelCore\.scoreRole\(role, profile, softwareProficiency, selectedDomains\)/);
  assert.match(app, /MechIntelCore\.careerRoadmap\(profile,/);
  assert.match(app, /MechIntelCore\.atsAlignment\(profile\)/);
});

test("role matching and skill gap tools return catalog-backed, bounded results", async () => {
  const matches = parseResult(await client.callTool({ name: "match_engineering_roles", arguments: { cluster: "CAE/Simulation", skills: ["Finite Element Analysis (FEA)"], projects: 2, limit: 3 } }));
  assert.equal(matches.matches.length, 3);
  assert.ok(matches.matches.every(match => match.profile_fit >= 1 && match.profile_fit <= 99));
  const gaps = parseResult(await client.callTool({ name: "identify_skill_gaps", arguments: { target_role: "FEA", skills: ["Finite Element Analysis (FEA)"], software_tools: ["ANSYS"] } }));
  assert.deepEqual(gaps.missing_skills, catalog.domains.FEA.skills.filter(skill => !["Finite Element Analysis (FEA)"].includes(skill)));
});

test("ATS and resume analysis omit raw identity and resume text", async () => {
  const resume = "Asha Example asha.private@example.com +1 415 555 0134 completed a SolidWorks FEA project and internship.";
  const ats = parseResult(await client.callTool({ name: "analyze_ats_alignment", arguments: { resume_text: resume } }));
  assert.ok(ats.score > 0);
  const analysis = parseResult(await client.callTool({ name: "analyze_engineer_profile", arguments: { resume_text: resume } }));
  const serialized = JSON.stringify(analysis);
  assert.ok(!serialized.includes("asha.private@example.com"));
  assert.ok(!serialized.includes("415 555 0134"));
  assert.ok(!serialized.includes("Asha Example"));
  assert.ok(!serialized.includes(resume));
  assert.match(analysis.benchmark, /synthetic/i);
});

test("roadmap validates limits and returns deterministic plan outputs", async () => {
  const args = { target_role: "Robotics", skills: ["Robotics"], software_tools: ["MATLAB"], projects: 1, hours_per_week: 4, months: 3 };
  const first = parseResult(await client.callTool({ name: "generate_career_roadmap", arguments: args }));
  const second = parseResult(await client.callTool({ name: "generate_career_roadmap", arguments: args }));
  assert.deepEqual(first, second);
  assert.equal(first.planned_hours, 48);
  const invalid = await client.callTool({ name: "generate_career_roadmap", arguments: { ...args, months: 100 } });
  assert.equal(invalid.isError, true);
});

test("missing, malformed and oversized input fail without echoing supplied content", async () => {
  const missing = await client.callTool({ name: "identify_skill_gaps", arguments: { skills: ["CAD"] } });
  assert.equal(missing.isError, true);
  const malformed = await client.callTool({ name: "calculate_employability_score", arguments: { tier: "Tier X", skills: ["DO_NOT_ECHO_SECRET"] } });
  assert.equal(malformed.isError, true);
  assert.ok(!JSON.stringify(malformed).includes("DO_NOT_ECHO_SECRET"));
  const oversized = await client.callTool({ name: "analyze_ats_alignment", arguments: { resume_text: "private-".repeat(7000) } });
  assert.equal(oversized.isError, true);
  assert.ok(!JSON.stringify(oversized).includes("private-private"));
});

test("Agent Skill metadata follows the published name and description rules", async () => {
  const file = path.resolve(here, "../../.agents/skills/mechintel/SKILL.md");
  const skill = await readFile(file, "utf8");
  const match = skill.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(match, "YAML frontmatter exists");
  const frontmatter = match[1];
  const name = frontmatter.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1];
  assert.equal(name, "mechintel");
  assert.equal(path.basename(path.dirname(file)), name);
  assert.ok(name.length <= 64 && !name.startsWith("-") && !name.endsWith("-") && !name.includes("--"));
  assert.ok(description && description.length <= 1024);
  assert.match(frontmatter, /^compatibility:\s*.+$/m);
  assert.match(skill, /does not automatically register or activate/i);
  assert.match(skill, /raw.githubusercontent.com/);
});

test("career catalog sync stays identical to app.js source constants", async () => {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.resolve(here, "../scripts/sync-catalog.mjs")], { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`catalog sync exited ${code}`)));
  });
  const resynced = JSON.parse(await readFile(path.resolve(here, "../data/career-catalog.json"), "utf8"));
  assert.deepEqual(resynced, catalog);
});
