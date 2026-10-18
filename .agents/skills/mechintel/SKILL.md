---
name: mechintel
description: Evaluates mechanical engineering resumes and profiles with MechIntel's deterministic browser and MCP tools, identifies technical skill gaps, matches engineering role lanes, reviews ATS keyword coverage, and builds factual career roadmaps. Use for engineering career planning, resume improvement, role alignment, or local MechIntel MCP integration.
compatibility: Works with repository-local MechIntel files or a configured local MechIntel MCP server. No AI API, external resume upload, or GPU is required for the local workflow.
metadata:
  author: MechIntel
  version: "1.0.0"
---

# MechIntel engineering career workflow

Use MechIntel to organize evidence and plan development. Do not present the estimates as hiring outcomes.

## Privacy and evidence rules

- Prefer a structured profile. If a resume is needed, extract only the engineering facts needed for the task and do not repeat the resume, contact details, or identity in the answer.
- The local MCP server processes supplied text in memory. It does not upload, save, or return raw resume text. Do not copy user data into external services.
- Keep achievements, dates, proficiency, and credentials grounded in user-provided evidence. Suggest edits; never invent qualifications or impact metrics.
- MechIntel's comparison cohort is deterministic synthetic data, not real or anonymized applicants. Scores and demand indices are heuristics, not employment probabilities, verified applicant ranks, live vacancy counts, employer ATS scores, or guarantees.
- ATS output measures coverage against a fixed 13-term keyword list only.

## Workflow

1. Ask for or use a profile with education tier/degree, engineering skills, software tools, projects, internships, certifications, research, and competitions. Use only relevant fields.
2. For an existing resume, use `analyze_ats_alignment` or `analyze_engineer_profile` with resume text only when the user has authorized that analysis. Keep the response focused on extracted evidence and gaps; omit the text itself.
3. Run `analyze_engineer_profile` for an overview, or run `calculate_employability_score`, `match_engineering_roles`, and `identify_skill_gaps` for a narrower question.
4. Select a target pathway from `mechintel://career-taxonomy`; use `generate_career_roadmap` with a realistic number of weekly hours and months.
5. Turn each gap into a small verifiable action: a design artifact, calculation, test, manufacturing plan, or documented result. State assumptions and validation limits.
6. Re-check the profile after the user reports new evidence. Planned learning hours alone do not add skills, credentials, or profile score.

## Example MCP inputs

```json
{
  "target_role": "FEA",
  "tier": "Tier 2",
  "degree": "B.Tech/B.S.",
  "projects": 2,
  "internships": 0,
  "skills": ["Finite Element Analysis (FEA)", "Structural Analysis"],
  "software_tools": ["ANSYS"],
  "certifications": []
}
```

For a roadmap, add `hours_per_week` and `months`, for example `{"hours_per_week": 5, "months": 4}`. Tool outputs contain model scores, role-fit evidence, missing catalog items, milestones, and caveats. They do not include uploaded resume text.

## Existing scoring methods

Read [methodology](references/methodology.md) before interpreting values. The shared implementation is `shared/mechintel-core.js`; public role data is synced from `app.js` into `mcp/data/career-catalog.json` by `npm run sync-catalog --prefix mcp`. Use the sync check before changing role definitions.

## Install the skill

This repository-local copy is the canonical distributable. Install by copying this directory into the target agent's supported skills directory; do not maintain an edited duplicate.

- **Codex:** the repo-local `.agents/skills/mechintel/` convention is discoverable within this repository. For user-wide installation, copy it under `$CODEX_HOME/skills/mechintel/` or `~/.agents/skills/mechintel/` as supported by the configured host.
- **Claude Code:** copy to `.claude/skills/mechintel/` in the project or `~/.claude/skills/mechintel/` for user-wide use.
- **Cursor:** copy to `.cursor/skills/mechintel/` in the project or the Cursor agent skills directory supported by your installed version.
- **Compatible agents:** install the directory under the agent's documented `skills/` search path.

The skill file is also available at the repository's raw URL: <https://raw.githubusercontent.com/ChamanPrakashKanth/Mechanical-Engineering-Market-Position-Dashboard/main/.agents/skills/mechintel/SKILL.md>.

Publishing a `SKILL.md` does not automatically register or activate it in an assistant. Each client must support Agent Skills and be configured to load or install this directory.

## Use the MCP server

See [`mcp/README.md`](../../../mcp/README.md) for local setup, exact tool schemas, and client configuration. Local MCP calls use stdio and need no API key. The optional Worker implementation is separate, authenticated, rate-limited, and not deployed by GitHub Pages.
