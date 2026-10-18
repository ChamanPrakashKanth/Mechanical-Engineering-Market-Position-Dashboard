# MechIntel scoring and interpretation

## Browser-aligned deterministic calculations

The website and the local MCP server call the same pure functions in `shared/mechintel-core.js`.

- **Readiness (0–100):** academics 25%, skills and tools 35%, experience 30%, and research/certifications 10%. Academic tier and degree are weighted 60/40 within academics. Skills breadth and average software proficiency are weighted 40/60 within the skills/tools component. Experience uses internships, project count, and competitions at 40/40/20. Research and certifications use 50/50.
- **Employability heuristic:** `round(projectScore × 0.30 + internshipScore × 0.50 + meanToolProficiency × 0.20)`. Project count is capped at 3 × 33; internships at 2 × 50.
- **Market-position and recruiter-readiness indicators:** derived deterministic dashboard values; they are not measured market outcomes.
- **Engineering competency:** 70% mean software proficiency plus 30% skill count (20 points per skill, capped at 100), plus at most 20 points from completed website courses. Supply `completed_course_count` to MCP when matching a browser profile with completed courses.
- **ATS keyword coverage:** fraction of 13 fixed terms found in listed skills and software: GD&T, FEA, CFD, CAD, ANSYS, SolidWorks, Revit, HVAC, Six Sigma, ASME, DFM, MATLAB, and CNC.
- **Role fit:** skill match 32%, average required-tool proficiency 28%, specialty alignment 20%, certification match 8%, and project/internship evidence 12%. A demand index is a fixed catalog field, not current job-posting data.
- **Career-path alignment:** listed pathway skills 55%, listed software 30%, project evidence up to 15%, and a planned-hours increment capped at 20 points. It is a planning aid; planned hours do not modify actual skills or profile scores.

The site's current front-end benchmark generator creates a deterministic 10,000-record representative sample and scales some displayed counts to a nominal 100,000-profile synthetic comparison. The records are generated, not sourced from people. No MCP tool claims a verified rank or employment probability.

## Resume parser limits

The parser uses fixed substring and keyword rules, estimates project count from occurrences of `project` or `design`, and redacts common email and phone patterns from its `raw_text` return. This is not a complete parser or a privacy guarantee for all forms of identifying data. MCP tools discard the parser's text field and return only analysis outputs; do not log or echo incoming requests.

## Inputs and units

- Score inputs are bounded integers and short string lists.
- Software proficiency is a numeric value from 0 to 100.
- Roadmap learning hours are 0–80 per week and duration is 1–60 months.
- Resume text is limited to 50,000 characters and is not persisted.

For exact current mappings, consult `mcp/data/career-catalog.json`, which is generated from the role and domain constants in `app.js`.
