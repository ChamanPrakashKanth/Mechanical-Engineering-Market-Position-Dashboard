import catalog from "../data/career-catalog.json" with { type: "json" };

const PROFILE_FIELDS = {
  region: undefined,
  tier: undefined,
  degree: undefined,
  cluster: undefined,
  projects: undefined,
  internships: undefined,
  research_papers: undefined,
  competitions: undefined,
  completed_course_count: undefined,
  skills: undefined,
  software_tools: undefined,
  certifications: undefined,
  software_proficiency: undefined
};

function profileSchema(z) {
  return {
    region: z.enum(["India", "Global"]).optional(),
    tier: z.enum(["Tier 1", "Tier 2", "Tier 3"]).optional(),
    degree: z.enum(["B.Tech/B.S.", "M.Tech/M.S.", "Ph.D."]).optional(),
    cluster: z.string().max(100).optional(),
    projects: z.number().int().min(0).max(10).optional(),
    internships: z.number().int().min(0).max(5).optional(),
    research_papers: z.number().int().min(0).max(10).optional(),
    competitions: z.number().int().min(0).max(10).optional(),
    completed_course_count: z.number().int().min(0).max(100).optional(),
    skills: z.array(z.string().max(120)).max(100).optional(),
    software_tools: z.array(z.string().max(120)).max(100).optional(),
    certifications: z.array(z.string().max(120)).max(100).optional(),
    software_proficiency: z.record(z.string().max(80), z.number().min(0).max(100)).optional()
  };
}

function result(value) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

function failure(error) {
  const message = error instanceof RangeError ? error.message : error instanceof TypeError ? error.message : "Request could not be processed.";
  return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: message, privacy: "Resume text and personal fields are not included in errors." }) }] };
}

function getProfile(input, core) {
  let parsed = {};
  if (typeof input.resume_text === "string") {
    const { raw_text: _redactedText, ...safeParsed } = core.parseResumeText(input.resume_text);
    parsed = safeParsed;
  }
  const supplied = Object.fromEntries(Object.entries(PROFILE_FIELDS).filter(([key]) => input[key] !== undefined).map(([key]) => [key, input[key]]));
  const merged = { ...parsed, ...supplied };
  return core.normalizeProfile(merged);
}

function proficiencyFor(profile) {
  return Object.keys(profile.software_proficiency).length ? profile.software_proficiency : {
    SolidWorks: 50, CATIA: 20, Creo: 20, AutoCAD: 40, "Fusion 360": 30,
    "Siemens NX": 10, ANSYS: 30, Abaqus: 10, MATLAB: 20, Python: 20, Excel: 60
  };
}

function domainFor(name) {
  const domain = catalog.domains[name];
  if (!domain) throw new TypeError(`Unknown target_role. Choose one of: ${Object.keys(catalog.domains).join(", ")}`);
  return { ...domain, name };
}

function matchedRoles(profile, core) {
  const selectedDomains = core.resolveSpecialtyDomains(profile.cluster);
  return catalog.roles.map(role => core.scoreRole(role, profile, proficiencyFor(profile), selectedDomains))
    .sort((a, b) => b.score - a.score || b.demand - a.demand);
}

export function registerMechIntelTools(server, z, core) {
  const profile = profileSchema(z);
  const profileInput = z.object({ ...profile, resume_text: z.string().max(core.MAX_TEXT_LENGTH).optional(), target_role: z.string().max(100).optional() });
  const planningInput = z.object({ ...profile, resume_text: z.string().max(core.MAX_TEXT_LENGTH).optional(), target_role: z.string().min(1).max(100), hours_per_week: z.number().min(0).max(80), months: z.number().int().min(1).max(60) });

  server.registerTool("analyze_engineer_profile", {
    description: "Analyze a mechanical engineering profile or resume using MechIntel's local deterministic methods. Resume data is processed in memory and is never uploaded or returned.",
    inputSchema: profileInput.shape
  }, input => {
    try {
      const candidate = getProfile(input, core);
      const scores = core.calculateScores(candidate, proficiencyFor(candidate), candidate.completed_course_count);
      const ats = core.atsAlignment(candidate);
      const roles = matchedRoles(candidate, core).slice(0, 5).map(({ title, domain, score, demand, skillHits, softwareHits, missing }) => ({ title, domain, score, demand_index: demand, matched_skills: skillHits, matched_software: softwareHits, next_gaps: missing }));
      const selected = input.target_role ? domainFor(input.target_role) : null;
      const gaps = selected ? { target_role: input.target_role, missing_skills: selected.skills.filter(skill => !candidate.skills.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(skill))), missing_software: selected.software.filter(tool => !candidate.software_tools.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(tool))), suggested_certifications: selected.certs.filter(cert => !candidate.certifications.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(cert))) } : undefined;
      return result({ scores, ats_alignment: ats, role_matches: roles, skill_gaps: gaps, benchmark: "The site's 100,000-profile comparison cohort is deterministic synthetic data, not real or anonymized applicants.", limitations: ["Role fit and scores are educational heuristics, not verified employment probabilities, applicant ranks, or employer ATS results.", "Resume parsing uses fixed local keyword rules and may miss context."] });
    } catch (error) { return failure(error); }
  });

  server.registerTool("calculate_employability_score", {
    description: "Calculate MechIntel's existing readiness, employability, market-position, recruiter-readiness and competency heuristics for a structured profile.",
    inputSchema: profileInput.shape
  }, input => {
    try {
      const candidate = getProfile(input, core);
      return result({ scores: core.calculateScores(candidate, proficiencyFor(candidate), candidate.completed_course_count), methodology: "Same shared deterministic score functions used by the browser UI.", benchmark: "Synthetic comparison data only; score is not a hiring probability or actual applicant rank." });
    } catch (error) { return failure(error); }
  });

  server.registerTool("match_engineering_roles", {
    description: "Rank the site's curated engineering role lanes against a profile using the browser's deterministic skill, software, specialty, certification, and evidence weights.",
    inputSchema: z.object({ ...profile, resume_text: z.string().max(core.MAX_TEXT_LENGTH).optional(), limit: z.number().int().min(1).max(10).optional() }).shape
  }, input => {
    try {
      const candidate = getProfile(input, core);
      return result({ matches: matchedRoles(candidate, core).slice(0, input.limit ?? 5).map(({ title, domain, score, demand, skillHits, softwareHits, missing }) => ({ title, domain, profile_fit: score, demand_index: demand, matched_skills: skillHits, matched_software: softwareHits, next_gaps: missing })), interpretation: "Profile-fit and demand indices are heuristic planning aids, not live job counts or hiring probabilities." });
    } catch (error) { return failure(error); }
  });

  server.registerTool("analyze_ats_alignment", {
    description: "Check exact coverage of MechIntel's fixed 13-term mechanical engineering keyword list. This does not claim to reproduce a commercial ATS.",
    inputSchema: z.object({ ...profile, resume_text: z.string().max(core.MAX_TEXT_LENGTH).optional() }).shape
  }, input => {
    try { return result(core.atsAlignment(getProfile(input, core))); }
    catch (error) { return failure(error); }
  });

  server.registerTool("identify_skill_gaps", {
    description: "Compare a profile with an existing MechIntel engineering pathway and list missing skills, software and certifications.",
    inputSchema: z.object({ ...profile, resume_text: z.string().max(core.MAX_TEXT_LENGTH).optional(), target_role: z.string().min(1).max(100) }).shape
  }, input => {
    try {
      const candidate = getProfile(input, core);
      const domain = domainFor(input.target_role);
      return result({ target_role: input.target_role, missing_skills: domain.skills.filter(skill => !candidate.skills.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(skill))), missing_software: domain.software.filter(tool => !candidate.software_tools.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(tool))), suggested_certifications: domain.certs.filter(cert => !candidate.certifications.some(item => core.normalizeJobTerm(item) === core.normalizeJobTerm(cert))), interpretation: "Catalog gap check only; suggested credentials are not represented as earned." });
    } catch (error) { return failure(error); }
  });

  server.registerTool("generate_career_roadmap", {
    description: "Generate a deterministic learning plan for an existing engineering pathway. Planned hours do not change profile scores or imply hiring outcomes.",
    inputSchema: planningInput.shape
  }, input => {
    try { return result(core.careerRoadmap(getProfile(input, core), domainFor(input.target_role), input.hours_per_week, input.months)); }
    catch (error) { return failure(error); }
  });

  server.registerResource("career-taxonomy", "mechintel://career-taxonomy", { mimeType: "application/json", description: "Public MechIntel role, skill, software, certification and demand-index catalog extracted from the browser application." }, async uri => ({ contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(catalog, null, 2) }] }));
  server.registerResource("assessment-methodology", "mechintel://assessment-methodology", { mimeType: "text/markdown", description: "Score weights, interpretation limits and synthetic benchmark notice." }, async uri => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: "# MechIntel assessment methodology\n\nThe local score formula weights academics 25%, skills and tools 35%, experience 30%, and research/certifications 10%. Derived dashboard metrics reuse the same formulas as the browser UI. ATS coverage is the fraction of 13 fixed terms found in listed skills/tools. Role fit uses 32% skill match, 28% tool proficiency, 20% specialty alignment, 8% listed certification match and 12% project/internship evidence. Career-path alignment uses the listed role skills, tools, projects and planned learning hours.\n\nThe benchmark is a deterministic synthetic cohort, not real or anonymized applicant data. Scores and ranks are directional model outputs, not employment probabilities, actual applicant ranks, employer ATS scores or guarantees. Resume text is processed only in memory; tool outputs and errors omit raw resume text and extracted identity fields.\n" }] }));
}

export { catalog };
