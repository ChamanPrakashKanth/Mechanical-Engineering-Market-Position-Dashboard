(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.MechIntelCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const MAX_TEXT_LENGTH = 50000;
    const ATS_KEYWORDS = ["gd&t", "fea", "cfd", "cad", "ansys", "solidworks", "revit", "hvac", "six sigma", "asme", "dfm", "matlab", "cnc"];

    function normalizeProfile(input) {
        if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("profile must be an object");
        const list = (key, max = 100) => {
            const value = input[key] ?? [];
            if (!Array.isArray(value) || value.length > max || value.some(item => typeof item !== "string" || item.length > 120)) {
                throw new TypeError(`${key} must be an array of at most ${max} short strings`);
            }
            return value.map(item => item.trim()).filter(Boolean);
        };
        const count = (key, max) => {
            const value = input[key] ?? 0;
            if (!Number.isInteger(value) || value < 0 || value > max) throw new TypeError(`${key} must be an integer from 0 to ${max}`);
            return value;
        };
        const enumValue = (key, allowed, fallback) => {
            const value = input[key] ?? fallback;
            if (!allowed.includes(value)) throw new TypeError(`${key} must be one of: ${allowed.join(", ")}`);
            return value;
        };
        const skills = list("skills");
        const software_tools = list("software_tools");
        const certifications = list("certifications");
        const proficiency = input.software_proficiency ?? {};
        if (!proficiency || typeof proficiency !== "object" || Array.isArray(proficiency) || Object.keys(proficiency).length > 30) throw new TypeError("software_proficiency must be an object with at most 30 tools");
        const software_proficiency = {};
        for (const [tool, value] of Object.entries(proficiency)) {
            if (tool.length > 80 || !Number.isFinite(value) || value < 0 || value > 100) throw new TypeError("software proficiency values must be from 0 to 100");
            software_proficiency[tool] = value;
        }
        return {
            region: enumValue("region", ["India", "Global"], "India"),
            tier: enumValue("tier", ["Tier 1", "Tier 2", "Tier 3"], "Tier 2"),
            degree: enumValue("degree", ["B.Tech/B.S.", "M.Tech/M.S.", "Ph.D."], "B.Tech/B.S."),
            cluster: typeof input.cluster === "string" && input.cluster.length <= 100 ? input.cluster : "Design Engineering",
            projects: count("projects", 10), internships: count("internships", 5),
            research_papers: count("research_papers", 10), competitions: count("competitions", 10),
            completed_course_count: count("completed_course_count", 100),
            skills, software_tools, certifications, software_proficiency
        };
    }

    function parseResumeText(text) {
        if (typeof text !== "string") throw new TypeError("resume_text must be a string");
        if (text.length > MAX_TEXT_LENGTH) throw new RangeError(`resume_text must be ${MAX_TEXT_LENGTH} characters or fewer`);
        const lower = text.toLowerCase();
        const cleaned = text
            .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, "[REDACTED_EMAIL]")
            .replace(/\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, "[REDACTED_PHONE]");
        const skills = [];
        const software_tools = [];
        const certifications = [];
        if (lower.includes("gd&t") || lower.includes("geometric dimensioning")) skills.push("GD&T (Geometric Dimensioning & Tolerancing)");
        if (lower.includes("fea") || lower.includes("finite element")) skills.push("Finite Element Analysis (FEA)");
        if (lower.includes("cfd") || lower.includes("computational fluid")) skills.push("Computational Fluid Dynamics (CFD)");
        if (lower.includes("hvac")) skills.push("HVAC Design");
        if (lower.includes("mechatronics")) skills.push("Mechatronics");
        if (lower.includes("solidworks")) software_tools.push("SolidWorks");
        if (lower.includes("autocad")) software_tools.push("AutoCAD");
        if (lower.includes("ansys")) software_tools.push("ANSYS");
        if (lower.includes("matlab")) software_tools.push("MATLAB");
        if (lower.includes("cswa")) certifications.push("Certified SolidWorks Associate (CSWA)");
        if (lower.includes("cswp")) certifications.push("Certified SolidWorks Professional (CSWP)");
        return {
            region: lower.includes("mit") || lower.includes("stanford") ? "Global" : "India",
            tier: lower.includes("iit") || lower.includes("bits") ? "Tier 1" : "Tier 2",
            degree: lower.includes("master") || lower.includes("m.tech") ? "M.Tech/M.S." : "B.Tech/B.S.",
            projects: Math.min(Math.max(Math.round((lower.match(/project|design/g) || []).length / 2), 1), 5),
            internships: Math.min((lower.match(/internship|intern\b|trainee/g) || []).length, 2),
            research_papers: lower.includes("publication") ? 1 : 0,
            competitions: lower.includes("fsae") || lower.includes("baja") ? 1 : 0,
            skills, software_tools, certifications, raw_text: cleaned
        };
    }

    function calculateScores(profile, proficiencyValues = {}, completedCourseCount = 0) {
        const acadBase = profile.tier === "Tier 1" ? 100 : (profile.tier === "Tier 2" ? 70 : 40);
        const degBase = profile.degree === "B.Tech/B.S." ? 70 : (profile.degree === "M.Tech/M.S." ? 85 : 100);
        const acadWeighted = (acadBase * 0.6 + degBase * 0.4) * 0.25;
        const values = Object.values(proficiencyValues);
        const swAverage = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        const skillsWeighted = (swAverage * 0.6 + Math.min(profile.skills.length * 20, 100) * 0.4) * 0.35;
        const internVal = Math.min(profile.internships * 50, 100);
        const projVal = Math.min(profile.projects * 33, 100);
        const compVal = Math.min(profile.competitions * 50, 100);
        const expWeighted = (internVal * 0.4 + projVal * 0.4 + compVal * 0.2) * 0.30;
        const paperVal = Math.min(profile.research_papers * 50, 100);
        const certVal = Math.min(profile.certifications.length * 50, 100);
        const extraWeighted = (paperVal * 0.5 + certVal * 0.5) * 0.10;
        const courseBonus = Math.min(completedCourseCount * 2.5, 20);
        const readiness = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10) / 10;
        const marketPosition = Math.round(readiness * 0.9 + (profile.tier === "Tier 1" ? 10 : 0));
        const employability = Math.round(projVal * 0.3 + internVal * 0.5 + swAverage * 0.2);
        const recruiter = Math.round(acadBase * 0.3 + internVal * 0.4 + certVal * 0.3);
        const engineeringCompetency = Math.min(100, Math.round(swAverage * 0.7 + Math.min(profile.skills.length * 20, 100) * 0.3 + courseBonus));
        let completion = 20;
        if (profile.projects > 0) completion += 15;
        if (profile.internships > 0) completion += 15;
        if (profile.skills.length > 0) completion += 15;
        if (profile.certifications.length > 0) completion += 15;
        if (profile.research_papers > 0) completion += 10;
        if (profile.competitions > 0) completion += 10;
        return {
            readiness: Math.min(readiness, 100), marketPosition: Math.min(marketPosition, 100),
            employability: Math.min(employability, 100), recruiter: Math.min(recruiter, 100),
            engineeringCompetency: Math.min(engineeringCompetency, 100), completion: Math.min(completion, 100)
        };
    }

    function atsAlignment(profile) {
        const terms = [...profile.skills, ...profile.software_tools].map(value => value.toLowerCase());
        const present = ATS_KEYWORDS.filter(keyword => terms.some(term => term.includes(keyword)));
        return { score: Math.round(present.length / ATS_KEYWORDS.length * 100), present, missing: ATS_KEYWORDS.filter(keyword => !present.includes(keyword)), keywords_checked: ATS_KEYWORDS.length, interpretation: "Keyword coverage against MechIntel's fixed keyword list; not a commercial ATS score or hiring prediction." };
    }

    function normalizeJobTerm(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9+#]+/g, " ").trim(); }
    function resolveSpecialtyDomains(domain) {
        const map = {
            "CAD Design": ["Design Engineering", "Automotive", "Aerospace"],
            "CAE/Simulation": ["FEA", "CFD", "Thermal Engineering"],
            "Robotics/Mechatronics": ["Robotics", "Mechatronics", "Maintenance Engineering"],
            "Manufacturing/Operations": ["Manufacturing Engineering", "Production Engineering", "Quality Engineering", "Industrial Engineering"],
            "HVAC/Thermal": ["HVAC", "Thermal Engineering", "CFD"]
        };
        return map[domain] || [domain];
    }
    function scoreRole(role, profile, proficiency, selectedDomains = [profile.cluster]) {
        const profileSkills = (profile.skills || []).map(normalizeJobTerm);
        const profileCerts = (profile.certifications || []).map(normalizeJobTerm);
        const skillHits = role.keywords.filter(item => profileSkills.includes(normalizeJobTerm(item)));
        const certHits = role.certs.filter(item => profileCerts.includes(normalizeJobTerm(item)));
        const softwareHits = role.software.filter(item => (proficiency[item] || 0) >= 40);
        const softwareScore = role.software.length ? role.software.reduce((sum, item) => sum + Math.min(100, proficiency[item] || 0), 0) / role.software.length : 0;
        const skillScore = role.keywords.length ? skillHits.length / role.keywords.length * 100 : 0;
        const certScore = role.certs.length ? certHits.length / role.certs.length * 100 : 100;
        const domainScore = selectedDomains.includes(role.domain) || profile.cluster === role.domain ? 100 : 30;
        const evidenceScore = Math.min(100, (Number(profile.projects) || 0) * 14 + (Number(profile.internships) || 0) * 24);
        const score = Math.round(skillScore * .32 + softwareScore * .28 + domainScore * .20 + certScore * .08 + evidenceScore * .12);
        const missing = [...role.keywords.filter(item => !skillHits.includes(item)), ...role.software.filter(item => !softwareHits.includes(item))].slice(0, 3);
        return { ...role, score: Math.max(1, Math.min(99, score)), skillHits, softwareHits, missing };
    }

    function careerRoadmap(profile, domain, hoursPerWeek, months) {
        if (!Number.isFinite(hoursPerWeek) || hoursPerWeek < 0 || hoursPerWeek > 80 || !Number.isInteger(months) || months < 1 || months > 60) throw new TypeError("hours_per_week must be 0–80 and months must be an integer from 1–60");
        const currentSkills = [...profile.skills, ...profile.certifications].map(item => item.toLowerCase());
        const presentSkills = domain.skills.filter(skill => currentSkills.some(item => item.includes(skill.toLowerCase()) || skill.toLowerCase().includes(item)));
        const missingSkills = domain.skills.filter(skill => !presentSkills.includes(skill));
        const currentTools = profile.software_tools.map(item => item.toLowerCase());
        const presentTools = domain.software.filter(tool => currentTools.includes(tool.toLowerCase()));
        const baseAlignment = presentSkills.length / Math.max(domain.skills.length, 1) * 55 + presentTools.length / Math.max(domain.software.length, 1) * 30 + Math.min(profile.projects * 3, 15);
        const effortGain = Math.min(20, hoursPerWeek * months / 12 * 0.22);
        const score = Math.min(100, Math.round(baseAlignment + effortGain));
        const milestones = [];
        if (missingSkills.length) milestones.push(`Practice and document: ${missingSkills.slice(0, 2).join("; ")}.`);
        if (presentTools.length < domain.software.length) milestones.push(`Build a small portfolio artifact using ${domain.software.find(tool => !presentTools.includes(tool))}.`);
        milestones.push("Complete one role-relevant project and record the method, constraints, and measured result.");
        if (domain.certs.length) milestones.push(`Review the pathway for ${domain.certs[0]}; list it only after earning it.`);
        return { role: domain.name, score, present_skills: presentSkills, missing_skills: missingSkills, present_software: presentTools, planned_hours: hoursPerWeek * months * 4, milestones: milestones.slice(0, 4), caveat: "Planning estimate only; learning hours do not add skills or predict hiring." };
    }

    return { MAX_TEXT_LENGTH, ATS_KEYWORDS, normalizeProfile, parseResumeText, calculateScores, atsAlignment, normalizeJobTerm, resolveSpecialtyDomains, scoreRole, careerRoadmap };
});
