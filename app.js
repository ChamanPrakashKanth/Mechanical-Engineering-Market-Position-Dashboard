// Application Logic for ME Market Position Dashboard

// Seeded Random Generator for deterministic dataset generation
function createRandom(seed) {
    let currentSeed = seed;
    return function() {
        // Linear Congruential Generator (LCG)
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };
}

// Global variables
let candidates = [];
let targetProfile = null;
let filteredCandidates = [];
let currentPage = 1;
const pageSize = 12;

// Standard Mechanical Engineering taxonomy for normalization and parsing
const SKILLS_DICT = {
    "gd&t": "GD&T (Geometric Dimensioning & Tolerancing)",
    "geometric dimensioning": "GD&T (Geometric Dimensioning & Tolerancing)",
    "tolerance analysis": "Tolerance Analysis",
    "fea": "Finite Element Analysis (FEA)",
    "finite element": "Finite Element Analysis (FEA)",
    "cfd": "Computational Fluid Dynamics (CFD)",
    "computational fluid": "Computational Fluid Dynamics (CFD)",
    "product design": "Product Design",
    "sheet metal": "Sheet Metal Design",
    "injection molding": "Injection Molding Design",
    "heat transfer": "Heat Transfer",
    "thermodynamics": "Thermodynamics",
    "fluid mechanics": "Fluid Mechanics",
    "kinematics": "Kinematics & Dynamics",
    "dynamics": "Kinematics & Dynamics",
    "lean manufacturing": "Lean Manufacturing",
    "six sigma": "Six Sigma",
    "quality control": "Quality Control & Assurance",
    "mechatronics": "Mechatronics",
    "control systems": "Control Systems",
    "piping design": "Piping Design",
    "structural analysis": "Structural Analysis",
    "dfm": "DFM (Design for Manufacturing)",
    "dfma": "DFM (Design for Manufacturing)",
    "hvac": "HVAC Design",
    "vibration analysis": "Vibration Analysis",
    "cnc programming": "CNC Programming",
    "embedded systems": "Embedded Systems",
    "robotics": "Robotics"
};

const SOFTWARE_DICT = {
    "solidworks": "SolidWorks",
    "solid works": "SolidWorks",
    "autocad": "AutoCAD",
    "ansys": "ANSYS",
    "matlab": "MATLAB",
    "catia": "CATIA",
    "fusion 360": "Fusion 360",
    "revit": "Revit",
    "labview": "LabVIEW",
    "abaqus": "Abaqus",
    "simulink": "Simulink",
    "python": "Python",
    "c++": "C++",
    "solidcam": "SolidCAM",
    "comsol": "COMSOL",
    "inventor": "Autodesk Inventor",
    "creo": "PTC Creo",
    "pro-e": "PTC Creo",
    "pro/engineer": "PTC Creo",
    "nx": "Siemens NX",
    "nastran": "Nastran",
    "hypermesh": "HyperMesh",
    "fluent": "Fluent",
    "mastercam": "Mastercam",
    "minitab": "Minitab"
};

const CERTS_DICT = {
    "cswa": "Certified SolidWorks Associate (CSWA)",
    "cswp": "Certified SolidWorks Professional (CSWP)",
    "cswpe": "Certified SolidWorks Professional (CSWP)",
    "cswpa": "Certified SolidWorks Advanced (CSWPA)",
    "six sigma green": "Lean Six Sigma Green Belt",
    "six sigma yellow": "Lean Six Sigma Yellow Belt",
    "six sigma black": "Lean Six Sigma Black Belt",
    "autodesk certified": "Autodesk Certified Professional",
    "hvac design": "HVAC Design Certificate",
    "ashrae": "ASHRAE Member Certification",
    "asme": "ASME Member / Cert",
    "fea specialist": "FEA Specialist Certification",
    "labview associate": "CLAD (Certified LabVIEW Associate Developer)",
    "pmp": "Project Management Professional (PMP)"
};

// College lists for dataset generation
const COLLEGES = {
    "India": {
        "Tier 1": ["IIT Bombay", "IIT Madras", "IIT Delhi", "IIT Kharagpur", "NIT Trichy", "NIT Surathkal", "BITS Pilani"],
        "Tier 2": ["VIT Vellore", "Manipal MIT", "Anna University", "Delhi Technological University (DTU)", "RV College of Engineering", "PSG College of Technology", "COEP Pune"],
        "Tier 3": ["Mumbai University", "Pune University", "VTU Belgaum", "GTU Ahmedabad", "Anna Univ Affiliated Colleges", "JNTU Hyderabad", "Local Engineering College"]
    },
    "Global": {
        "Tier 1": ["MIT", "Stanford University", "UC Berkeley", "Georgia Institute of Technology", "Imperial College London", "ETH Zurich", "TU Munich"],
        "Tier 2": ["Penn State University", "Purdue University", "University of Michigan", "TU Delft", "University of Toronto", "UNSW Sydney", "KTH Royal Institute"],
        "Tier 3": ["State University System", "Regional Technical College", "City College of Technology", "International Polytechnic", "National Institute of Science"]
    }
};

// Helper: Seeded candidate dataset generator
function generateDataset(size = 100000) {
    const random = createRandom(42); // Fixed seed
    const data = [];
    
    // Five main career clusters
    const clusters = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"];
    
    // Probability configurations for clusters
    const clusterProb = {
        "CAD Design": {
            skills: ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Sheet Metal Design", "DFM (Design for Manufacturing)", "Tolerance Analysis", "Injection Molding Design"],
            software: ["SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "PTC Creo", "Autodesk Inventor"],
            certs: ["Certified SolidWorks Associate (CSWA)", "Certified SolidWorks Professional (CSWP)", "Autodesk Certified Professional"]
        },
        "CAE/Simulation": {
            skills: ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis", "Vibration Analysis"],
            software: ["ANSYS", "Abaqus", "MATLAB", "Fluent", "COMSOL", "HyperMesh", "Nastran"],
            certs: ["FEA Specialist Certification", "ANSYS Certified Professional"]
        },
        "Robotics/Mechatronics": {
            skills: ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems", "Kinematics & Dynamics"],
            software: ["MATLAB", "Simulink", "Python", "C++", "LabVIEW", "Arduino"],
            certs: ["CLAD (Certified LabVIEW Associate Developer)", "ASME Member / Cert"]
        },
        "Manufacturing/Operations": {
            skills: ["Lean Manufacturing", "Six Sigma", "Quality Control & Assurance", "CNC Programming"],
            software: ["AutoCAD", "SolidCAM", "Minitab", "Mastercam"],
            certs: ["Lean Six Sigma Yellow Belt", "Lean Six Sigma Green Belt", "Lean Six Sigma Black Belt"]
        },
        "HVAC/Thermal": {
            skills: ["HVAC Design", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Piping Design"],
            software: ["AutoCAD", "Revit"],
            certs: ["HVAC Design Certificate", "ASHRAE Member Certification"]
        }
    };

    for (let i = 0; i < size; i++) {
        // 1. Geography and College
        const isIndia = random() < 0.60; // 60% India, 40% Global
        const region = isIndia ? "India" : "Global";
        
        let tier;
        const tierRoll = random();
        if (tierRoll < 0.15) tier = "Tier 1";
        else if (tierRoll < 0.60) tier = "Tier 2";
        else tier = "Tier 3";
        
        const collegeList = COLLEGES[region][tier];
        const college = collegeList[Math.floor(random() * collegeList.length)];
        
        // 2. Degree & Grad Year
        let degree;
        const degRoll = random();
        if (degRoll < 0.75) degree = "B.Tech/B.S.";
        else if (degRoll < 0.95) degree = "M.Tech/M.S.";
        else degree = "Ph.D.";
        
        const gradYear = 2022 + Math.floor(random() * 5); // 2022 to 2026
        
        // 3. Cluster and Skills/Software/Certs
        const cluster = clusters[Math.floor(random() * clusters.length)];
        const config = clusterProb[cluster];
        
        // Add random items from cluster pools
        const skills = [];
        config.skills.forEach(s => {
            if (random() < 0.7) skills.push(s);
        });
        // 15% chance to have a cross-discipline skill
        if (random() < 0.15) {
            const otherCluster = clusters.find(c => c !== cluster);
            const otherSkill = clusterProb[otherCluster].skills[0];
            if (!skills.includes(otherSkill)) skills.push(otherSkill);
        }
        
        const software_tools = [];
        config.software.forEach(sw => {
            if (random() < 0.65) software_tools.push(sw);
        });
        
        const certifications = [];
        config.certs.forEach(cert => {
            if (random() < 0.25) certifications.push(cert);
        });
        
        // 4. Counts (Projects, Internships, Research, Competitions)
        // Adjust counts probabilistically based on college tier and degree
        let projects = 1 + Math.floor(random() * 3); // base 1-3
        if (tier === "Tier 1") projects += Math.floor(random() * 3);
        else if (tier === "Tier 2") projects += Math.floor(random() * 2);
        
        let internships = 0;
        const internRoll = random();
        if (tier === "Tier 1") {
            internships = internRoll < 0.2 ? 0 : (internRoll < 0.7 ? 1 : 2);
        } else if (tier === "Tier 2") {
            internships = internRoll < 0.4 ? 0 : (internRoll < 0.9 ? 1 : 2);
        } else {
            internships = internRoll < 0.7 ? 0 : 1;
        }
        
        let research_papers = 0;
        if (degree === "Ph.D.") {
            research_papers = 2 + Math.floor(random() * 4);
        } else if (degree === "M.Tech/M.S.") {
            research_papers = random() < 0.4 ? 1 : 0;
        } else {
            research_papers = random() < 0.05 ? 1 : 0;
        }
        
        let competitions = 0;
        const compRoll = random();
        if (tier === "Tier 1" || tier === "Tier 2") {
            competitions = compRoll < 0.75 ? 0 : (compRoll < 0.95 ? 1 : 2);
        } else {
            competitions = compRoll < 0.95 ? 0 : 1;
        }
        
        // Calculate composite score for ranking
        const score = calculateScore({
            tier,
            degree,
            skills,
            software_tools,
            certifications,
            projects,
            internships,
            research_papers,
            competitions
        });

        data.push({
            id: `ME-${i+10000}`,
            region,
            college,
            tier,
            degree,
            gradYear,
            cluster,
            skills,
            software_tools,
            certifications,
            projects,
            internships,
            research_papers,
            competitions,
            score
        });
    }
    
    return data;
}

// Calculate composite score (0-100) based on profile attributes
function calculateScore(profile) {
    let academicScore = 0;
    if (profile.tier === "Tier 1") academicScore = 100;
    else if (profile.tier === "Tier 2") academicScore = 70;
    else academicScore = 40;
    
    let degreeVal = 0;
    if (profile.degree === "Ph.D.") degreeVal = 100;
    else if (profile.degree === "M.Tech/M.S." || profile.degree === "M.S.") degreeVal = 85;
    else degreeVal = 70;
    
    const academicWeighted = (academicScore * 0.6 + degreeVal * 0.4) * 0.25; // 25% weight
    
    // Skills and tools (35% weight)
    const skillCount = profile.skills ? profile.skills.length : 0;
    const toolCount = profile.software_tools ? profile.software_tools.length : 0;
    const skillScore = Math.min(skillCount * 12, 100);
    const toolScore = Math.min(toolCount * 15, 100);
    const skillsWeighted = (skillScore * 0.5 + toolScore * 0.5) * 0.35;
    
    // Practical experience (30% weight)
    const internships = profile.internships || 0;
    const projects = profile.projects || 0;
    const competitions = profile.competitions || 0;
    
    const internScore = Math.min(internships * 50, 100);
    const projectScore = Math.min(projects * 33, 100);
    const compScore = Math.min(competitions * 50, 100);
    
    const experienceWeighted = (internScore * 0.4 + projectScore * 0.4 + compScore * 0.2) * 0.30;
    
    // Research and certs (10% weight)
    const papers = profile.research_papers || 0;
    const certsCount = profile.certifications ? profile.certifications.length : 0;
    
    const paperScore = Math.min(papers * 50, 100);
    const certScore = Math.min(certsCount * 50, 100);
    
    const academicExtrasWeighted = (paperScore * 0.5 + certScore * 0.5) * 0.10;
    
    const totalScore = academicWeighted + skillsWeighted + experienceWeighted + academicExtrasWeighted;
    return Math.round(totalScore * 10) / 10;
}

// Parse raw resume text and extract known skills, software, certs
function parseResumeText(text) {
    const textLower = text.toLowerCase();
    const skills = new Set();
    const software = new Set();
    const certs = new Set();
    
    // 1. Extract Skills
    for (const [key, value] of Object.entries(SKILLS_DICT)) {
        if (textLower.includes(key)) {
            skills.add(value);
        }
    }
    
    // 2. Extract Software Tools
    for (const [key, value] of Object.entries(SOFTWARE_DICT)) {
        // Escape special characters (like + in c++) to prevent regex compilation syntax errors
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Word boundary match to prevent matching partial words
        const regex = new RegExp(`\\b${escapedKey}\\b`, 'i');
        if (regex.test(textLower)) {
            software.add(value);
        }
    }
    
    // 3. Extract Certifications
    for (const [key, value] of Object.entries(CERTS_DICT)) {
        if (textLower.includes(key)) {
            certs.add(value);
        }
    }
    
    // 4. Heuristics for counts
    // Projects
    let projectCount = 2; // Default
    const projMatches = textLower.match(/project|capstone|design challenge/g);
    if (projMatches) {
        projectCount = Math.min(Math.max(Math.floor(projMatches.length / 2), 1), 6);
    }
    
    // Internships
    let internCount = 0;
    const internMatches = textLower.match(/internship|intern\b|trainee/g);
    if (internMatches) {
        internCount = Math.min(Math.max(Math.floor(internMatches.length / 2), 0), 3);
    }
    
    // Research papers
    let paperCount = 0;
    if (textLower.includes("publication") || textLower.includes("published") || textLower.includes("journal") || textLower.includes("conference paper")) {
        paperCount = 1;
        const pubMatches = textLower.match(/journal|conference|ieee|asme/g);
        if (pubMatches) {
            paperCount = Math.min(Math.floor(pubMatches.length / 2) + 1, 4);
        }
    }
    
    // Competitions
    let competitionCount = 0;
    if (textLower.includes("formula sae") || textLower.includes("fsae") || textLower.includes("baja") || textLower.includes("robocon") || textLower.includes("go-kart") || textLower.includes("competition")) {
        competitionCount = 1;
    }
    
    // Determine college tier / region heuristics
    let region = "India";
    if (textLower.includes("mit") || textLower.includes("stanford") || textLower.includes("berkeley") || textLower.includes("university of") || textLower.includes("college") && !textLower.includes("india")) {
        // Simple heuristic: if university name doesn't sound Indian, guess Global
        if (!textLower.includes("iit") && !textLower.includes("nit") && !textLower.includes("pune") && !textLower.includes("mumbai") && !textLower.includes("delhi")) {
            region = "Global";
        }
    }
    
    let tier = "Tier 3";
    if (textLower.includes("iit ") || textLower.includes("indian institute of technology") || textLower.includes("bits pilani") || textLower.includes("mit ") || textLower.includes("stanford")) {
        tier = "Tier 1";
    } else if (textLower.includes("nit ") || textLower.includes("vit ") || textLower.includes("vellore") || textLower.includes("delhi technological") || textLower.includes("dtu") || textLower.includes("purdue") || textLower.includes("delft")) {
        tier = "Tier 2";
    }
    
    let degree = "B.Tech/B.S.";
    if (textLower.includes("m.tech") || textLower.includes("master of technology") || textLower.includes("master of science") || textLower.includes("m.s.")) {
        degree = "M.Tech/M.S.";
    } else if (textLower.includes("ph.d") || textLower.includes("doctor of philosophy")) {
        degree = "Ph.D.";
    }

    return {
        region,
        tier,
        degree,
        graduation_year: 2026,
        skills: Array.from(skills),
        software_tools: Array.from(software),
        certifications: Array.from(certs),
        projects: projectCount,
        internships: internCount,
        research_papers: paperCount,
        competitions: competitionCount
    };
}

// Perform Market Position Analysis
function runAnalysis(profile) {
    targetProfile = profile;
    targetProfile.score = calculateScore(targetProfile);
    
    // 1. Identify Match Cluster first to enable specialty percentile
    const clusters = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"];
    const clusterKeywords = {
        "CAD Design": ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Sheet Metal Design", "DFM (Design for Manufacturing)", "Tolerance Analysis", "Injection Molding Design", "SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "PTC Creo", "Autodesk Inventor", "Certified SolidWorks Associate (CSWA)", "Certified SolidWorks Professional (CSWP)", "Autodesk Certified Professional"],
        "CAE/Simulation": ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis", "Vibration Analysis", "ANSYS", "Abaqus", "MATLAB", "Fluent", "COMSOL", "HyperMesh", "Nastran", "FEA Specialist Certification", "ANSYS Certified Professional"],
        "Robotics/Mechatronics": ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems", "Kinematics & Dynamics", "MATLAB", "Simulink", "Python", "C++", "LabVIEW", "Arduino", "CLAD (Certified LabVIEW Associate Developer)", "ASME Member / Cert"],
        "Manufacturing/Operations": ["Lean Manufacturing", "Six Sigma", "Quality Control & Assurance", "CNC Programming", "AutoCAD", "SolidCAM", "Minitab", "Mastercam", "Lean Six Sigma Yellow Belt", "Lean Six Sigma Green Belt", "Lean Six Sigma Black Belt"],
        "HVAC/Thermal": ["HVAC Design", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Piping Design", "AutoCAD", "Revit", "HVAC Design Certificate", "ASHRAE Member Certification"]
    };
    
    let bestCluster = "CAD Design";
    let maxIntersection = 0;
    let clusterMatches = {};
    
    const targetAttrs = [...(targetProfile.skills || []), ...(targetProfile.software_tools || []), ...(targetProfile.certifications || [])];
    
    clusters.forEach(c => {
        const intersection = targetAttrs.filter(x => clusterKeywords[c].includes(x)).length;
        clusterMatches[c] = intersection;
        if (intersection > maxIntersection) {
            maxIntersection = intersection;
            bestCluster = c;
        }
    });
    
    // Calculate match strength as percentage of target cluster keywords matched (capped/scaled)
    const matchStrength = Math.min(Math.round((maxIntersection / Math.max(targetAttrs.length, 3)) * 100), 100);
    
    // 2. Calculate absolute ordinal ranks (descending sort, highest score first)
    const allScoresSorted = candidates.map(c => c.score).sort((a, b) => b - a);
    const indiaCandidates = candidates.filter(c => c.region === "India");
    const indiaScoresSorted = indiaCandidates.map(c => c.score).sort((a, b) => b - a);
    
    // Filter for same region and same college tier group
    const tierCandidates = candidates.filter(c => c.region === targetProfile.region && c.tier === targetProfile.tier);
    const tierScoresSorted = tierCandidates.map(c => c.score).sort((a, b) => b - a);
    
    // Filter for same cluster specialization (globally)
    const clusterCandidates = candidates.filter(c => c.cluster === bestCluster);
    const clusterScoresSorted = clusterCandidates.map(c => c.score).sort((a, b) => b - a);
    
    // Helper function for ordinal rank calculation
    function getOrdinalRank(scoreList, score) {
        if (scoreList.length === 0) return 1;
        let countHigher = 0;
        for (let i = 0; i < scoreList.length; i++) {
            if (scoreList[i] > score) {
                countHigher++;
            } else {
                break; // Because list is sorted descending
            }
        }
        return countHigher + 1; // 1-based rank
    }
    
    const globalRank = getOrdinalRank(allScoresSorted, targetProfile.score);
    const indiaRank = getOrdinalRank(indiaScoresSorted, targetProfile.score);
    const tierRank = getOrdinalRank(tierScoresSorted, targetProfile.score);
    const clusterRank = getOrdinalRank(clusterScoresSorted, targetProfile.score);
    
    const globalTotal = allScoresSorted.length;
    const indiaTotal = indiaScoresSorted.length;
    const tierTotal = tierScoresSorted.length;
    const clusterTotal = clusterScoresSorted.length;
    
    // Convert ranks to percentile percentages for animating SVG circles (0 to 100)
    const globalPercentile = Math.round((1 - (globalRank - 1) / globalTotal) * 100);
    const indiaPercentile = Math.round((1 - (indiaRank - 1) / indiaTotal) * 100);
    const tierPercentile = Math.round((1 - (tierRank - 1) / tierTotal) * 100);
    const clusterPercentile = Math.round((1 - (clusterRank - 1) / clusterTotal) * 100);
    
    const ranks = {
        global: { pct: globalPercentile, rank: globalRank, total: globalTotal },
        india: { pct: indiaPercentile, rank: indiaRank, total: indiaTotal },
        tier: { pct: tierPercentile, rank: tierRank, total: tierTotal },
        cluster: { pct: clusterPercentile, rank: clusterRank, total: clusterTotal }
    };
    
    // 3. Strengths & Weaknesses
    const strengths = [];
    const weaknesses = [];
    
    // Academic & Credentials checks
    if (targetProfile.tier === "Tier 1") {
        strengths.push("Graduate of a Tier 1 Elite institution, highly valued by top engineering employers.");
    } else if (targetProfile.tier === "Tier 3") {
        weaknesses.push("Tier 3 college background. Academic brand visibility is low; require stronger project/certification offsets.");
    }
    
    // Degree level check
    if (targetProfile.degree === "Ph.D." || targetProfile.degree === "M.Tech/M.S." || targetProfile.degree === "M.S.") {
        strengths.push(`Advanced degree (${targetProfile.degree}) signals deep theoretical and technical specialization.`);
    }
    
    // Skills count check
    const totalSkillsCount = (targetProfile.skills?.length || 0) + (targetProfile.software_tools?.length || 0);
    if (totalSkillsCount >= 8) {
        strengths.push(`Diverse skill and toolset (${totalSkillsCount} items), placing you in the top 20% for raw tool breadth.`);
    } else if (totalSkillsCount <= 3) {
        weaknesses.push("Limited skill list. Most mechanical engineers demonstrate competence in at least 5-6 tools and skills.");
    }
    
    // Project & Internship benchmarks
    if ((targetProfile.internships || 0) >= 2) {
        strengths.push(`Excellent internship record (${targetProfile.internships} roles), demonstrating strong industry readiness.`);
    } else if ((targetProfile.internships || 0) === 0) {
        weaknesses.push("Lack of industry internship experience. Highly recommended to pursue industrial training or co-ops.");
    }
    
    if ((targetProfile.projects || 0) >= 4) {
        strengths.push(`Strong portfolio build with ${targetProfile.projects} projects, showing practical engineering capabilities.`);
    } else if ((targetProfile.projects || 0) <= 1) {
        weaknesses.push("Sparse project portfolio. Entry-level hiring depends heavily on capstone projects and design builds.");
    }
    
    if ((targetProfile.competitions || 0) >= 1) {
        strengths.push("Participation in engineering competitions (e.g. Formula SAE / BAJA) demonstrates teamwork and design compliance.");
    }
    
    if ((targetProfile.research_papers || 0) >= 1) {
        strengths.push(`Research contribution (${targetProfile.research_papers} papers) showcases scholarly capability and R&D competence.`);
    }
    
    if (targetProfile.certifications?.length >= 2) {
        strengths.push("Professional certifications indicate verified software skillsets beyond academic syllabus.");
    } else if ((targetProfile.certifications?.length || 0) === 0) {
        weaknesses.push("Zero professional certifications. Software credentials like CSWA/CSWP or Six Sigma significantly boost resume validation.");
    }
    
    // Add default feedback if lists are empty
    if (strengths.length === 0) strengths.push("Basic academic baseline established.");
    if (weaknesses.length === 0) weaknesses.push("No immediate red flags detected in candidate profile.");
    
    // 4. Skill Gap Analysis
    // Compile frequencies of skills, tools, certs for candidates in the SAME cluster in the database
    const clusterPeers = candidates.filter(c => c.cluster === bestCluster);
    const totalPeers = clusterPeers.length;
    
    const peerSkillsFreq = {};
    const peerToolsFreq = {};
    const peerCertsFreq = {};
    
    clusterPeers.forEach(p => {
        p.skills.forEach(s => peerSkillsFreq[s] = (peerSkillsFreq[s] || 0) + 1);
        p.software_tools.forEach(t => peerToolsFreq[t] = (peerToolsFreq[t] || 0) + 1);
        p.certifications.forEach(c => peerCertsFreq[c] = (peerCertsFreq[c] || 0) + 1);
    });
    
    // Create lists sorted by frequency
    const gapAnalysis = [];
    const allKeywords = [...clusterKeywords[bestCluster]];
    
    allKeywords.forEach(kw => {
        let freq = 0;
        let category = "Skill";
        
        if (Object.values(SKILLS_DICT).includes(kw)) {
            freq = peerSkillsFreq[kw] || 0;
            category = "Skill";
        } else if (Object.values(SOFTWARE_DICT).includes(kw)) {
            freq = peerToolsFreq[kw] || 0;
            category = "Software Tool";
        } else if (Object.values(CERTS_DICT).includes(kw)) {
            freq = peerCertsFreq[kw] || 0;
            category = "Certification";
        }
        
        const pct = Math.round((freq / totalPeers) * 100);
        const hasIt = (targetProfile.skills?.includes(kw) || 
                      targetProfile.software_tools?.includes(kw) || 
                      targetProfile.certifications?.includes(kw)) ? true : false;
        
        gapAnalysis.push({ keyword: kw, category, peerPercentage: pct, targetHasIt: hasIt });
    });
    
    // Sort gap analysis by peer percentage descending
    gapAnalysis.sort((a, b) => b.peerPercentage - a.peerPercentage);
    
    // 5. High-ROI Roadmap
    // Identify top 3 missing items with highest peer percentage (highest demand)
    const missingHighDemand = gapAnalysis.filter(g => !g.targetHasIt);
    const roadmap = [];
    
    const roadmapTemplates = {
        "CAD Design": {
            skills: {
                "GD&T (Geometric Dimensioning & Tolerancing)": { title: "Master GD&T Standards", desc: "Learn ASME Y14.5 dimensioning rules. Focus on feature control frames, datums, and tolerance stack-up analysis.", roi: "High ROI (Featured in 80% of design roles)" },
                "DFM (Design for Manufacturing)": { title: "Study DFM/DFMA Guidelines", desc: "Understand draft angles, wall thickness, and assembly constraints for CNC, sheet metal, and injection molding.", roi: "High ROI" },
                "Sheet Metal Design": { title: "Build Sheet Metal Portfolio", desc: "Design a complex electronics enclosure in SolidWorks. Learn bend allowance, K-factor, and flat pattern exports.", roi: "Medium ROI" }
            },
            software: {
                "SolidWorks": { title: "Learn SolidWorks Advanced Modeling", desc: "Complete surface modeling and structural weldment tutorials. Create a parametric CAD assembly of a machine tool.", roi: "Critical ROI (Standard design tool)" },
                "CATIA": { title: "CATIA Surface Modeling", desc: "Focus on generative shape design, widely used in Automotive and Aerospace structural skin design.", roi: "High ROI" },
                "AutoCAD": { title: "Master 2D AutoCAD Layouts", desc: "Focus on drafting standards, layer management, and plant piping/P&ID layouts.", roi: "High ROI" }
            },
            certs: {
                "Certified SolidWorks Associate (CSWA)": { title: "Obtain SolidWorks CSWA", desc: "Take the official exam to verify core parts, assemblies, and drawing comprehension.", roi: "High ROI (Instant resume validation)" },
                "Certified SolidWorks Professional (CSWP)": { title: "Obtain SolidWorks CSWP", desc: "Pass the professional certification to prove complex multi-stage modeling and configuration management.", roi: "Very High ROI" }
            }
        },
        "CAE/Simulation": {
            skills: {
                "Finite Element Analysis (FEA)": { title: "Learn FEA Fundamentals", desc: "Master meshing techniques, element selection (shell, solid, beam), boundary conditions, and convergence analysis.", roi: "Critical ROI" },
                "Computational Fluid Dynamics (CFD)": { title: "Study CFD Modeling", desc: "Learn turbulence models (k-epsilon, k-omega), boundary layers, wall functions, and mesh independence.", roi: "High ROI" },
                "Structural Analysis": { title: "Perform Static & Dynamic Analyses", desc: "Analyze buckling, modal frequencies, and fatigue life under cyclic loading.", roi: "High ROI" }
            },
            software: {
                "ANSYS": { title: "Master ANSYS Workbench", desc: "Focus on Static Structural, Modal, and Fluent solver setup. Build a thermal-mechanical analysis case study.", roi: "Critical ROI" },
                "MATLAB": { title: "MATLAB for Numerical Analysis", desc: "Write scripts for matrix operations, differential equations, and data optimization loops.", roi: "High ROI" }
            },
            certs: {
                "ANSYS Certified Professional": { title: "Target ANSYS Certification", desc: "Earn official ANSYS certification in Structural Mechanics or Fluid Dynamics to verify simulation rigor.", roi: "Very High ROI" },
                "FEA Specialist Certification": { title: "FEA Specialization", desc: "Complete NAFEMS-aligned or ASME-aligned courses on finite element code validation.", roi: "High ROI" }
            }
        },
        "Robotics/Mechatronics": {
            skills: {
                "Mechatronics": { title: "Integrate Mechanical & Electronic Systems", desc: "Build systems linking microcontrollers, sensors, and motor drivers (H-bridges, stepper drivers).", roi: "Critical ROI" },
                "Control Systems": { title: "Study PID Control Tuning", desc: "Model transfer functions and design close-loop feedback controllers for speed/position systems.", roi: "High ROI" }
            },
            software: {
                "MATLAB": { title: "Learn Control Systems with MATLAB", desc: "Use root locus, Bode plots, and state-space models for robotics system synthesis.", roi: "High ROI" },
                "Simulink": { title: "Model Dynamic Systems in Simulink", desc: "Run block-diagram simulations of vehicle dynamics or robotic arms.", roi: "High ROI" },
                "Python": { title: "Python for Robotics & Automation", desc: "Learn NumPy, SciPy, and OpenCV for robot vision and kinematics computations.", roi: "Very High ROI" }
            },
            certs: {
                "CLAD (Certified LabVIEW Associate Developer)": { title: "Pursue NI CLAD Certification", desc: "Certify your capability in automated testing, DAQ hardware configuration, and virtual instruments.", roi: "High ROI" }
            }
        },
        "Manufacturing/Operations": {
            skills: {
                "Six Sigma": { title: "Learn Six Sigma DMAIC Framework", desc: "Understand Define, Measure, Analyze, Improve, Control phases. Study control charts and Gage R&R.", roi: "Very High ROI" },
                "Lean Manufacturing": { title: "Master Lean Engineering Principles", desc: "Study 5S, Kaizen, Value Stream Mapping (VSM), Kanban, and SMED setups.", roi: "High ROI" }
            },
            software: {
                "Minitab": { title: "Minitab for Statistical QC", desc: "Perform ANOVA, regression, capability analysis (Cp/Cpk), and Hypothesis Testing.", roi: "High ROI" }
            },
            certs: {
                "Lean Six Sigma Green Belt": { title: "Acquire Six Sigma Green Belt", desc: "Provides concrete proof of process improvement and quality control knowledge.", roi: "Critical ROI (Highly requested in ops)" }
            }
        },
        "HVAC/Thermal": {
            skills: {
                "HVAC Design": { title: "Master HVAC Duct & Piping Design", desc: "Learn duct sizing (equal friction method), cooling/heating load calculations, and psychrometrics.", roi: "Critical ROI" },
                "Piping Design": { title: "Study Piping Layout & ASME B31.3", desc: "Learn piping routing, pump head calculations, valve selections, and pipe stress analysis.", roi: "High ROI" }
            },
            software: {
                "Revit": { title: "Learn Revit MEP for HVAC Modeling", desc: "Build 3D BIM models of duct networks, piping, and mechanical equipment rooms.", roi: "Critical ROI" },
                "AutoCAD": { title: "Standardize on 2D HVAC Layouts", desc: "Draft schematic double-line and single-line duct plans and schematic P&IDs.", roi: "High ROI" }
            },
            certs: {
                "HVAC Design Certificate": { title: "Obtain HVAC Professional Certificate", desc: "Verify HVAC engineering core knowledge from industry training centers.", roi: "Very High ROI" },
                "ASHRAE Member Certification": { title: "ASHRAE Credentials", desc: "Join ASHRAE and target certifications like HFDP (HVAC Design) or BEMP (Energy Modeling).", roi: "High ROI" }
            }
        }
    };
    
    // Build specific roadmap items based on top missing items
    let roadmapCount = 0;
    for (let i = 0; i < missingHighDemand.length && roadmapCount < 3; i++) {
        const item = missingHighDemand[i];
        const cat = item.category === "Skill" ? "skills" : (item.category === "Software Tool" ? "software" : "certs");
        const clusterMap = roadmapTemplates[bestCluster] || roadmapTemplates["CAD Design"];
        
        if (clusterMap[cat] && clusterMap[cat][item.keyword]) {
            const detail = clusterMap[cat][item.keyword];
            roadmap.push({
                type: item.category,
                name: item.keyword,
                title: detail.title,
                desc: detail.desc,
                roi: detail.roi,
                priority: roadmapCount === 0 ? "Highest Priority" : (roadmapCount === 1 ? "Medium Priority" : "Recommended")
            });
            roadmapCount++;
        }
    }
    
    // Fallback roadmap items if candidate is already fully matched
    if (roadmap.length === 0) {
        roadmap.push({
            type: "Project / Experience",
            name: "Industrial Project Integration",
            title: "Launch a Complex Multidisciplinary Project",
            desc: "Combine mechanical design, structural FEA simulation, and microcontrollers. Create a portfolio page detailing the design choices and engineering validations.",
            roi: "High ROI",
            priority: "Highest Priority"
        });
    }
    
    // 6. Closest Candidates
    // Find top 5 candidate profiles that are mathematically closest in score and cluster
    const peersSortedBySim = clusterPeers
        .map(p => {
            // Simple distance: academic tier distance + score distance
            let dist = Math.abs(p.score - targetProfile.score);
            if (p.tier !== targetProfile.tier) dist += 15;
            return { peer: p, distance: dist };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
        .map(x => x.peer);

    // Render results on Dashboard
    renderDashboard(ranks, bestCluster, matchStrength, strengths, weaknesses, gapAnalysis, roadmap, peersSortedBySim);
}

// Display results in HTML
function renderDashboard(ranks, cluster, strength, strengths, weaknesses, gaps, roadmap, peers) {
    document.getElementById("setup-panel").classList.add("hidden");
    document.getElementById("dashboard-panel").classList.remove("hidden");
    
    // Update labels
    document.getElementById("db-candidate-id").innerText = `Candidate #${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById("db-college-val").innerText = `${targetProfile.degree} | ${targetProfile.college} (${targetProfile.tier})`;
    
    // Percentile progress rings and absolute ranks
    animateCircle("global-pct-circle", ranks.global.pct);
    animateCircleText("global-pct-text", ranks.global.rank);
    document.getElementById("global-pct-sublabel").innerText = `Rank #${ranks.global.rank.toLocaleString()} of ${ranks.global.total.toLocaleString()} global freshers`;
    
    animateCircle("india-pct-circle", ranks.india.pct);
    animateCircleText("india-pct-text", ranks.india.rank);
    document.getElementById("india-pct-sublabel").innerText = `Rank #${ranks.india.rank.toLocaleString()} of ${ranks.india.total.toLocaleString()} Indian freshers`;

    animateCircle("tier-pct-circle", ranks.tier.pct);
    animateCircleText("tier-pct-text", ranks.tier.rank);
    document.getElementById("tier-pct-sublabel").innerText = `Rank #${ranks.tier.rank.toLocaleString()} of ${ranks.tier.total.toLocaleString()} in your tier group`;

    animateCircle("cluster-pct-circle", ranks.cluster.pct);
    animateCircleText("cluster-pct-text", ranks.cluster.rank);
    document.getElementById("cluster-pct-sublabel").innerText = `Rank #${ranks.cluster.rank.toLocaleString()} of ${ranks.cluster.total.toLocaleString()} in your specialty`;
    
    // Competitiveness level text
    let compLevel = "Developing Candidate";
    let compClass = "badge-purple";
    if (ranks.global.pct >= 90) {
        compLevel = "Highly Competitive (Top 10%)";
        compClass = "badge-green";
    } else if (ranks.global.pct >= 75) {
        compLevel = "Competitive (Top 25%)";
        compClass = "badge-green";
    } else if (ranks.global.pct >= 50) {
        compLevel = "Moderate Competitiveness";
        compClass = "badge";
    }
    
    const compBadge = document.getElementById("competitiveness-badge");
    compBadge.className = `badge ${compClass}`;
    compBadge.innerHTML = `<span class="pulse-dot" style="background-color: currentColor"></span> ${compLevel}`;
    
    // Match Cluster details
    document.getElementById("matched-cluster-icon").innerText = getClusterIcon(cluster);
    document.getElementById("matched-cluster-name").innerText = cluster;
    document.getElementById("matched-cluster-desc").innerText = getClusterDescription(cluster);
    document.getElementById("matched-cluster-strength").innerText = `${strength}% Profile Alignment`;
    
    // Strengths
    const strengthList = document.getElementById("strengths-list");
    strengthList.innerHTML = strengths.map(s => `
        <li>
            <span class="icon-bullet icon-bullet-green">✓</span>
            <div>${s}</div>
        </li>
    `).join("");
    
    // Weaknesses
    const weaknessList = document.getElementById("weaknesses-list");
    weaknessList.innerHTML = weaknesses.map(w => `
        <li>
            <span class="icon-bullet icon-bullet-red">✗</span>
            <div>${w}</div>
        </li>
    `).join("");
    
    // Gap Analysis (Render top 6 gaps)
    const gapChart = document.getElementById("gap-chart-container");
    gapChart.innerHTML = gaps.slice(0, 6).map(g => `
        <div class="bar-row">
            <div class="bar-label">${g.keyword}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${g.peerPercentage}%"></div>
                <div class="bar-fill-target" style="width: ${g.targetHasIt ? '100%' : '0%'}; opacity: 0.8;"></div>
            </div>
            <div class="bar-value">
                <span style="color: ${g.targetHasIt ? 'var(--info)' : 'var(--text-muted)'}">
                    ${g.targetHasIt ? '✓' : 'Gap'}
                </span>
                <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">
                    ${g.peerPercentage}% peers
                </span>
            </div>
        </div>
    `).join("");
    
    // Roadmap
    const roadmapContainer = document.getElementById("roadmap-container");
    roadmapContainer.innerHTML = roadmap.map(r => `
        <div class="roadmap-item">
            <div class="roadmap-dot"></div>
            <div class="roadmap-content">
                <h4>${r.title}</h4>
                <p>${r.desc}</p>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <span class="roadmap-roi">${r.roi}</span>
                    <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">(${r.type})</span>
                </div>
            </div>
        </div>
    `).join("");
    
    // Peer table
    const peerTable = document.getElementById("peer-table-body");
    peerTable.innerHTML = peers.map(p => `
        <tr>
            <td><code style="color: var(--text-secondary)">${p.id}</code></td>
            <td>${p.degree}</td>
            <td>${p.college} <span style="font-size: 0.7rem; color: var(--text-muted);">(${p.tier})</span></td>
            <td><span class="badge" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${p.cluster}</span></td>
            <td>
                <div class="profile-capsule-list">
                    ${p.skills.slice(0, 3).map(s => `<span class="capsule">${s}</span>`).join("")}
                    ${p.software_tools.slice(0, 2).map(t => `<span class="capsule capsule-active">${t}</span>`).join("")}
                    ${p.skills.length + p.software_tools.length > 5 ? `<span class="capsule">+${p.skills.length + p.software_tools.length - 5}</span>` : ''}
                </div>
            </td>
            <td>
                <div class="score-indicator">
                    <span style="font-weight: 600;">${p.score}</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${p.score}%"></div>
                    </div>
                </div>
            </td>
        </tr>
    `).join("");
    
    // Draw the distribution curve
    renderDistributionCurve(targetProfile.score);
    
    // Render employer insights for the matched cluster
    renderEmployerInsights(cluster);
}

// Animate the circular SVG rankings rings
function animateCircle(elementId, targetPct) {
    const circle = document.getElementById(elementId);
    if (!circle) return;
    
    // Formula: stroke-dasharray = (percentage / 100) * circumference
    // Circumference of r=36 is 2 * pi * 36 = 226.2
    const circumference = 226.2;
    const offset = circumference - (targetPct / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // Trigger layout reflow for animation
    circle.getBoundingClientRect();
    
    circle.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    circle.style.strokeDashoffset = offset;
}

// Helper: format and scale text inside progress rings to fit ordinal ranks
function setCircleText(elementId, rank) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const text = "#" + rank.toLocaleString();
    el.textContent = text;
    
    // Dynamically scale font-size based on character length to prevent overflow in the 36x36 SVG
    if (text.length >= 7) {
        el.style.fontSize = "4.2px";
        el.setAttribute("y", "19.5");
    } else if (text.length >= 5) {
        el.style.fontSize = "5.5px";
        el.setAttribute("y", "20.0");
    } else {
        el.style.fontSize = "7.5px";
        el.setAttribute("y", "20.3");
    }
}

// Visual count-down rank animation matching circular progress transitions
function animateCircleText(elementId, targetRank) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const duration = 1200; // 1.2s matching transition duration
    const startTime = performance.now();
    
    // Start from a lower rank (higher rank number)
    const startRank = Math.min(targetRank * 4 + 100, 60000);
    
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quad ease out
        const ease = 1 - Math.pow(1 - progress, 2);
        const currentRank = Math.round(startRank - (startRank - targetRank) * ease);
        
        const text = "#" + currentRank.toLocaleString();
        el.textContent = text;
        
        if (text.length >= 7) {
            el.style.fontSize = "4.2px";
            el.setAttribute("y", "19.5");
        } else if (text.length >= 5) {
            el.style.fontSize = "5.5px";
            el.setAttribute("y", "20.0");
        } else {
            el.style.fontSize = "7.5px";
            el.setAttribute("y", "20.3");
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = "#" + targetRank.toLocaleString();
        }
    }
    requestAnimationFrame(update);
}

// Generate dynamic SVG bell curve and mark user standing
function renderDistributionCurve(userScore) {
    const svg = document.getElementById("distribution-curve-svg");
    if (!svg) return;
    
    svg.innerHTML = "";
    
    const width = 600;
    const height = 120;
    const paddingBottom = 15;
    const graphHeight = height - paddingBottom;
    
    const mean = 50;
    const stdDev = 16;
    
    // Build distribution curve points
    let points = [];
    for (let x = 0; x <= width; x++) {
        const scoreVal = (x / width) * 100;
        const exponent = -Math.pow(scoreVal - mean, 2) / (2 * Math.pow(stdDev, 2));
        const yVal = graphHeight - (Math.exp(exponent) * (graphHeight - 12));
        points.push(`${x},${yVal}`);
    }
    
    const pathD = `M 0,${graphHeight} L ${points.join(" L ")} L ${width},${graphHeight} Z`;
    
    // Fill path
    const pathFill = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathFill.setAttribute("d", pathD);
    pathFill.setAttribute("fill", "url(#curveGrad)");
    pathFill.setAttribute("opacity", "0.15");
    
    // Stroke path
    const pathStroke = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathStroke.setAttribute("d", `M 0,${graphHeight} L ${points.join(" L ")}`);
    pathStroke.setAttribute("fill", "none");
    pathStroke.setAttribute("stroke", "url(#curveGradStroke)");
    pathStroke.setAttribute("stroke-width", "2");
    
    // Gradients definitions
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.8" />
            <stop offset="100%" stop-color="transparent" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="curveGradStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--info)" />
            <stop offset="50%" stop-color="var(--primary)" />
            <stop offset="100%" stop-color="var(--accent)" />
        </linearGradient>
    `;
    
    svg.appendChild(defs);
    svg.appendChild(pathFill);
    svg.appendChild(pathStroke);
    
    // Compute User Coordinates
    const userX = (userScore / 100) * width;
    const userExponent = -Math.pow(userScore - mean, 2) / (2 * Math.pow(stdDev, 2));
    const userY = graphHeight - (Math.exp(userExponent) * (graphHeight - 12));
    
    // Vertical dashed marker line
    const markerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    markerLine.setAttribute("x1", userX);
    markerLine.setAttribute("y1", graphHeight);
    markerLine.setAttribute("x2", userX);
    markerLine.setAttribute("y2", userY);
    markerLine.setAttribute("stroke", "var(--primary)");
    markerLine.setAttribute("stroke-width", "1.5");
    markerLine.setAttribute("stroke-dasharray", "3,3");
    markerLine.className.baseVal = "dist-user-marker";
    
    // Glowing outer circle
    const glowCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    glowCircle.setAttribute("cx", userX);
    glowCircle.setAttribute("cy", userY);
    glowCircle.setAttribute("r", "8");
    glowCircle.setAttribute("fill", "rgba(99, 102, 241, 0.3)");
    glowCircle.setAttribute("stroke", "var(--primary)");
    glowCircle.setAttribute("stroke-width", "1.5");
    glowCircle.className.baseVal = "dist-user-marker";
    
    // Inner solid dot
    const solidCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    solidCircle.setAttribute("cx", userX);
    solidCircle.setAttribute("cy", userY);
    solidCircle.setAttribute("r", "4");
    solidCircle.setAttribute("fill", "#ffffff");
    
    svg.appendChild(markerLine);
    svg.appendChild(glowCircle);
    svg.appendChild(solidCircle);
    
    // Align score label text positioning
    const label = document.getElementById("dist-your-score-label");
    if (label) {
        label.innerText = `Your Standing (Score: ${userScore})`;
        const pctPos = Math.min(Math.max((userScore / 100) * 100 - 15, 2), 78);
        label.style.marginLeft = `${pctPos}%`;
    }
}

// Canvas particle network background creator
function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(99, 102, 241, 0.2)";
            ctx.fill();
        }
    }
    
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 75);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Highlights professional keywords extracted from the pasted text
function renderHighlightedText(text, parsed) {
    const container = document.getElementById("highlighted-resume-container");
    const box = document.getElementById("highlighted-resume-box");
    if (!container || !box) return;
    
    const skillsToHighlight = parsed.skills || [];
    const softwareToHighlight = parsed.software_tools || [];
    const certsToHighlight = parsed.certifications || [];
    
    let replacements = [];
    
    function findMatches(dict, parsedValues, className) {
        for (const [key, normalizedValue] of Object.entries(dict)) {
            if (parsedValues.includes(normalizedValue)) {
                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regexStr = key.match(/^\w/) ? `\\b${escapedKey}\\b` : escapedKey;
                const regex = new RegExp(regexStr, 'gi');
                
                let match;
                while ((match = regex.exec(text)) !== null) {
                    replacements.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        className: className,
                        origText: match[0]
                    });
                }
            }
        }
    }
    
    findMatches(SKILLS_DICT, skillsToHighlight, 'hl-skill');
    findMatches(SOFTWARE_DICT, softwareToHighlight, 'hl-software');
    findMatches(CERTS_DICT, certsToHighlight, 'hl-cert');
    
    // Sort and remove overlaps
    replacements.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    
    let filteredReplacements = [];
    let lastEnd = 0;
    for (const r of replacements) {
        if (r.start >= lastEnd) {
            filteredReplacements.push(r);
            lastEnd = r.end;
        }
    }
    
    let resultHtml = "";
    let lastIndex = 0;
    for (const r of filteredReplacements) {
        resultHtml += escapeHtml(text.slice(lastIndex, r.start));
        resultHtml += `<span class="${r.className}">${escapeHtml(r.origText)}</span>`;
        lastIndex = r.end;
    }
    resultHtml += escapeHtml(text.slice(lastIndex));
    
    box.innerHTML = resultHtml;
    container.classList.remove("hidden");
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Map cluster to visual icon
function getClusterIcon(cluster) {
    switch (cluster) {
        case "CAD Design": return "📐";
        case "CAE/Simulation": return "💻";
        case "Robotics/Mechatronics": return "🤖";
        case "Manufacturing/Operations": return "⚙️";
        case "HVAC/Thermal": return "🔥";
        default: return "🔧";
    }
}

// Map cluster to description
function getClusterDescription(cluster) {
    switch (cluster) {
        case "CAD Design":
            return "Specializes in geometric drafting, 3D modeling, technical tolerances (GD&T), and design blueprints for manufacturing (DFM).";
        case "CAE/Simulation":
            return "Applies computational solvers (FEA/CFD) to analyze stress, thermodynamics, fluid flows, and vibration profiles in assemblies.";
        case "Robotics/Mechatronics":
            return "Integrates mechanical link structures with electrical controllers, microcontrollers (Arduino/STM), and automated programming.";
        case "Manufacturing/Operations":
            return "Focuses on assembly line automation, Lean Six Sigma processes, CNC G-code routing, and quality assurance systems.";
        case "HVAC/Thermal":
            return "Specializes in ductwork, cooling systems load sizing, piping layout compliant with codes, and heat exchanger mechanisms.";
        default:
            return "General mechanical engineering studies and research.";
    }
}

// Update Candidate DB Table with pagination, search, filters
function updateCandidatesTable() {
    const searchVal = document.getElementById("db-search").value.toLowerCase();
    const regionVal = document.getElementById("db-region-filter").value;
    const clusterVal = document.getElementById("db-cluster-filter").value;
    
    filteredCandidates = candidates.filter(c => {
        const matchesSearch = searchVal === "" || 
            c.id.toLowerCase().includes(searchVal) ||
            c.college.toLowerCase().includes(searchVal) ||
            c.degree.toLowerCase().includes(searchVal) ||
            c.skills.some(s => s.toLowerCase().includes(searchVal)) ||
            c.software_tools.some(t => t.toLowerCase().includes(searchVal));
            
        const matchesRegion = regionVal === "All" || c.region === regionVal;
        const matchesCluster = clusterVal === "All" || c.cluster === clusterVal;
        
        return matchesSearch && matchesRegion && matchesCluster;
    });
    
    // Reset page if out of bounds
    const totalPages = Math.ceil(filteredCandidates.length / pageSize);
    if (currentPage > totalPages) currentPage = Math.max(totalPages, 1);
    
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pageCandidates = filteredCandidates.slice(startIdx, endIdx);
    
    // Render count text
    document.getElementById("db-count-text").innerText = 
        `Showing ${filteredCandidates.length === 0 ? 0 : startIdx + 1} - ${Math.min(endIdx, filteredCandidates.length)} of ${filteredCandidates.length} profiles (Dataset seeded with 100,000 records)`;
        
    // Render Table Rows
    const tableBody = document.getElementById("db-table-body");
    if (pageCandidates.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem;">No candidates found matching the filters.</td></tr>`;
    } else {
        tableBody.innerHTML = pageCandidates.map(c => `
            <tr>
                <td><code style="color: var(--text-secondary)">${c.id}</code></td>
                <td>${c.region}</td>
                <td>${c.college} <span style="font-size: 0.75rem; color: var(--text-muted);">(${c.tier})</span></td>
                <td><span class="badge" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${c.cluster}</span></td>
                <td>
                    <div class="profile-capsule-list">
                        ${c.skills.slice(0, 3).map(s => `<span class="capsule">${s}</span>`).join("")}
                        ${c.software_tools.slice(0, 2).map(t => `<span class="capsule capsule-active">${t}</span>`).join("")}
                        ${c.skills.length + c.software_tools.length > 5 ? `<span class="capsule">+${c.skills.length + c.software_tools.length - 5}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="score-indicator">
                        <span style="font-weight: 600;">${c.score}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${c.score}%"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `).join("");
    }
    
    // Enable/Disable Pagination buttons
    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    document.getElementById("next-page-btn").disabled = currentPage >= totalPages;
}

// DOM Setup on load
document.addEventListener("DOMContentLoaded", () => {
    // Initialize particle background
    initParticles();
    // 1. Generate the massive dataset of 100,000 records
    const loaderText = document.createElement("p");
    loaderText.style.color = "var(--text-muted)";
    loaderText.style.fontSize = "0.85rem";
    loaderText.innerText = "Seeding candidate database...";
    
    // Measure generation/load time
    const t0 = performance.now();
    fetch('candidates_100k.json')
        .then(response => {
            if (!response.ok) throw new Error("File not found or CORS block");
            return response.json();
        })
        .then(data => {
            candidates = data;
            const t1 = performance.now();
            console.log(`Loaded ${candidates.length} candidates from candidates_100k.json in ${(t1 - t0).toFixed(2)}ms`);
            
            const statusBadge = document.getElementById("db-status-badge");
            if (statusBadge) {
                statusBadge.innerHTML = `<span class="pulse-dot" style="background-color: var(--success)"></span> Database Loaded: 100,000 Web Extracted`;
            }
            filteredCandidates = [...candidates];
            updateCandidatesTable();
        })
        .catch(err => {
            console.log("Loading candidates_100k.json bypassed (CORS / file absent). Generating dynamic fallback...");
            candidates = generateDataset(100000);
            const t1 = performance.now();
            console.log(`Generated ${candidates.length} candidates in ${(t1 - t0).toFixed(2)}ms`);
            
            const statusBadge = document.getElementById("db-status-badge");
            if (statusBadge) {
                statusBadge.innerHTML = `<span class="pulse-dot"></span> Database Loaded: 100,000 Freshers`;
            }
            filteredCandidates = [...candidates];
            updateCandidatesTable();
        });
    
    // Setup tags inputs
    setupTagsInput("skills-input-wrapper", "skills-text-input");
    setupTagsInput("tools-input-wrapper", "tools-text-input");
    setupTagsInput("certs-input-wrapper", "certs-text-input");
    
    // Event listeners
    document.getElementById("btn-parse-resume").addEventListener("click", () => {
        const text = document.getElementById("resume-paste-box").value;
        if (!text.trim()) {
            alert("Please paste your resume text first.");
            return;
        }
        
        const overlay = document.getElementById("scanner-overlay");
        const steps = [
            document.getElementById("scan-step-1"),
            document.getElementById("scan-step-2"),
            document.getElementById("scan-step-3"),
            document.getElementById("scan-step-4")
        ];
        
        // Reset classes
        steps.forEach(step => {
            step.className = "scanner-step-row";
        });
        
        // Show scan overlay modal
        overlay.classList.add("active");
        
        // Timeline animations
        steps[0].classList.add("active");
        
        setTimeout(() => {
            steps[0].classList.remove("active");
            steps[0].classList.add("completed");
            steps[1].classList.add("active");
            
            setTimeout(() => {
                steps[1].classList.remove("active");
                steps[1].classList.add("completed");
                steps[2].classList.add("active");
                
                setTimeout(() => {
                    steps[2].classList.remove("active");
                    steps[2].classList.add("completed");
                    steps[3].classList.add("active");
                    
                    setTimeout(() => {
                        steps[3].classList.remove("active");
                        steps[3].classList.add("completed");
                        
                        try {
                            const parsed = parseResumeText(text);
                            
                            // Populate form
                            document.getElementById("form-region").value = parsed.region;
                            document.getElementById("form-tier").value = parsed.tier;
                            document.getElementById("form-degree").value = parsed.degree;
                            document.getElementById("form-projects").value = parsed.projects;
                            document.getElementById("form-internships").value = parsed.internships;
                            document.getElementById("form-papers").value = parsed.research_papers;
                            document.getElementById("form-competitions").value = parsed.competitions;
                            
                            // Load tags
                            setTags("skills-input-wrapper", parsed.skills);
                            setTags("tools-input-wrapper", parsed.software_tools);
                            setTags("certs-input-wrapper", parsed.certifications);
                            
                            // Render Highlighter
                            renderHighlightedText(text, parsed);
                        } catch (err) {
                            console.error("Resume parsing error:", err);
                            alert("Error during automatic parsing: " + err.message + "\nPlease try manually entering your details in the form.");
                        } finally {
                            setTimeout(() => {
                                overlay.classList.remove("active");
                            }, 400);
                        }
                    }, 650);
                }, 600);
            }, 700);
        }, 600);
    });
    
    document.getElementById("btn-run-analysis").addEventListener("click", () => {
        const region = document.getElementById("form-region").value;
        const tier = document.getElementById("form-tier").value;
        const degree = document.getElementById("form-degree").value;
        const college = region === "India" ? "National Tech Institute" : "Global Tech University";
        
        const skills = getTags("skills-input-wrapper");
        const software_tools = getTags("tools-input-wrapper");
        const certifications = getTags("certs-input-wrapper");
        
        const projects = parseInt(document.getElementById("form-projects").value) || 0;
        const internships = parseInt(document.getElementById("form-internships").value) || 0;
        const research_papers = parseInt(document.getElementById("form-papers").value) || 0;
        const competitions = parseInt(document.getElementById("form-competitions").value) || 0;
        
        const profile = {
            region,
            college,
            tier,
            degree,
            skills,
            software_tools,
            certifications,
            projects,
            internships,
            research_papers,
            competitions
        };
        
        runAnalysis(profile);
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const target = btn.dataset.tab;
            
            // Hide all tab views
            document.getElementById("tab-dashboard-view").classList.add("hidden");
            document.getElementById("tab-database-view").classList.add("hidden");
            document.getElementById("tab-demand-view").classList.add("hidden");
            
            if (target === "dashboard") {
                document.getElementById("tab-dashboard-view").classList.remove("hidden");
            } else if (target === "database") {
                document.getElementById("tab-database-view").classList.remove("hidden");
                updateCandidatesTable();
            } else if (target === "demand") {
                document.getElementById("tab-demand-view").classList.remove("hidden");
                if (targetProfile) {
                    renderEmployerInsights(targetProfile.cluster || "CAD Design");
                } else {
                    renderEmployerInsights("CAD Design");
                }
            }
        });
    });
    
    // Floating back buttons
    document.getElementById("btn-back-to-input").addEventListener("click", () => {
        document.getElementById("dashboard-panel").classList.add("hidden");
        document.getElementById("setup-panel").classList.remove("hidden");
    });
    
    // Database search/filters
    document.getElementById("db-search").addEventListener("input", () => {
        currentPage = 1;
        updateCandidatesTable();
    });
    document.getElementById("db-region-filter").addEventListener("change", () => {
        currentPage = 1;
        updateCandidatesTable();
    });
    document.getElementById("db-cluster-filter").addEventListener("change", () => {
        currentPage = 1;
        updateCandidatesTable();
    });
    
    // Pagination buttons
    document.getElementById("prev-page-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateCandidatesTable();
            document.querySelector(".table-wrapper").scrollIntoView({ behavior: 'smooth' });
        }
    });
    document.getElementById("next-page-btn").addEventListener("click", () => {
        const totalPages = Math.ceil(filteredCandidates.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            updateCandidatesTable();
            document.querySelector(".table-wrapper").scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Preset profile chips trigger
    const presetChips = document.querySelectorAll(".preset-chip");
    presetChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const presetName = chip.dataset.preset;
            loadPreset(presetName);
        });
    });

    // PDF File upload handler using pdf.js
    const fileInput = document.getElementById("resume-file-input");
    const fileStatus = document.getElementById("pdf-upload-status");
    
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type !== "application/pdf") {
            alert("Please select a PDF file.");
            fileInput.value = "";
            return;
        }
        
        fileStatus.style.display = "block";
        fileStatus.style.color = "var(--info)";
        fileStatus.innerText = "Extracting text from PDF...";
        
        const reader = new FileReader();
        reader.onload = async function() {
            try {
                const pdfjsLib = window['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
                
                let extractedText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    extractedText += pageText + "\n";
                }
                
                if (!extractedText.trim()) {
                    throw new Error("Could not extract any readable text from this PDF (it might be scanned/image-only).");
                }
                
                document.getElementById("resume-paste-box").value = extractedText;
                fileStatus.innerText = "PDF text loaded successfully! Auto-parsing attributes...";
                
                // Automatically trigger parser click
                setTimeout(() => {
                    document.getElementById("btn-parse-resume").click();
                    fileStatus.innerText = "PDF parsed and form populated!";
                    setTimeout(() => {
                        fileStatus.style.display = "none";
                    }, 3000);
                }, 500);
                
            } catch (err) {
                console.error(err);
                fileStatus.style.color = "var(--danger)";
                fileStatus.innerText = `Error: ${err.message || 'Failed to read PDF file'}`;
                alert(err.message || "Failed to parse PDF. Please try copy-pasting the text instead.");
            }
        };
        reader.readAsArrayBuffer(file);
    });
});

// Tags input helper
function setupTagsInput(containerId, inputId) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = input.value.trim();
            if (val) {
                addTag(containerId, val);
                input.value = "";
            }
        }
    });
    
    // Adding click to input container to focus the text field
    container.addEventListener("click", (e) => {
        if (e.target === container) {
            input.focus();
        }
    });
}

function addTag(containerId, tagText) {
    const container = document.getElementById(containerId);
    const input = container.querySelector("input");
    
    // Check duplicates
    const existingTags = getTags(containerId);
    if (existingTags.some(t => t.toLowerCase() === tagText.toLowerCase())) {
        return;
    }
    
    const tagEl = document.createElement("span");
    tagEl.className = "tag-pill";
    tagEl.dataset.tag = tagText; // Store exact value in dataset
    tagEl.innerHTML = `
        ${tagText}
        <button type="button" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.insertBefore(tagEl, input);
}

function setTags(containerId, tagsArray) {
    const container = document.getElementById(containerId);
    const input = container.querySelector("input");
    
    // Remove existing pills
    const pills = container.querySelectorAll(".tag-pill");
    pills.forEach(p => p.remove());
    
    // Add new pills
    tagsArray.forEach(tag => {
        addTag(containerId, tag);
    });
}

function getTags(containerId) {
    const container = document.getElementById(containerId);
    const pills = container.querySelectorAll(".tag-pill");
    const tags = [];
    pills.forEach(p => {
        // Retrieve from data attribute, falling back to text scrubbing if missing
        if (p.dataset.tag) {
            tags.push(p.dataset.tag.trim());
        } else {
            tags.push(p.textContent.replace('×', '').trim());
        }
    });
    return tags;
}

// Preset Loader helper
function loadPreset(presetName) {
    let preset = {};
    if (presetName === "entry-cad") {
        preset = {
            region: "India",
            tier: "Tier 3",
            degree: "B.Tech/B.S.",
            projects: 2,
            internships: 0,
            research_papers: 0,
            competitions: 0,
            skills: ["Product Design", "GD&T (Geometric Dimensioning & Tolerancing)", "Sheet Metal Design"],
            software_tools: ["SolidWorks", "AutoCAD"],
            certifications: ["Certified SolidWorks Associate (CSWA)"]
        };
    } else if (presetName === "cae-mid") {
        preset = {
            region: "India",
            tier: "Tier 2",
            degree: "M.Tech/M.S.",
            projects: 4,
            internships: 1,
            research_papers: 1,
            competitions: 1,
            skills: ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis"],
            software_tools: ["ANSYS", "MATLAB", "Fluent"],
            certifications: ["ANSYS Certified Professional", "FEA Specialist Certification"]
        };
    } else if (presetName === "global-robotics") {
        preset = {
            region: "Global",
            tier: "Tier 1",
            degree: "B.Tech/B.S.",
            projects: 5,
            internships: 2,
            research_papers: 0,
            competitions: 2,
            skills: ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems"],
            software_tools: ["MATLAB", "Simulink", "Python", "C++", "Arduino"],
            certifications: ["ASME Member / Cert"]
        };
    }
    
    // Load to fields
    document.getElementById("form-region").value = preset.region;
    document.getElementById("form-tier").value = preset.tier;
    document.getElementById("form-degree").value = preset.degree;
    document.getElementById("form-projects").value = preset.projects;
    document.getElementById("form-internships").value = preset.internships;
    document.getElementById("form-papers").value = preset.research_papers;
    document.getElementById("form-competitions").value = preset.competitions;
    
    setTags("skills-input-wrapper", preset.skills);
    setTags("tools-input-wrapper", preset.software_tools);
    setTags("certs-input-wrapper", preset.certifications);
}

// Detailed Employer Demands data segmented by Career Specialization
const EMPLOYER_DEMANDS = {
    "CAD Design": {
        role: "Design Engineer / CAD Analyst / Product Developer",
        skills: [
            { name: "Geometric Dimensioning & Tolerancing (GD&T)", desc: "Applying ASME Y14.5 rules for datum definitions, feature control frames, MMC/LMC, and precision component matching.", priority: "Critical" },
            { name: "Design for Manufacturing & Assembly (DFM/DFMA)", desc: "Optimizing CAD models for cost-efficient injection molding (draft angles), sheet metal fabrication (bend reliefs), and CNC machining.", priority: "High" },
            { name: "Tolerance Stack-up Analysis", desc: "Performing linear and statistical (Root Sum Square - RSS) tolerance analyses to prevent assembly failures.", priority: "High" }
        ],
        software: [
            { name: "SolidWorks", desc: "Industry-standard parametric 3D modeling, advanced surfacing, and assembly configuration management.", priority: "Critical" },
            { name: "Autodesk AutoCAD", desc: "Producing precise 2D mechanical drafts, plant piping layouts, and mechanical details.", priority: "High" },
            { name: "CATIA", desc: "Advanced surfacing and structural frame modeling, dominant in aerospace and automotive giants.", priority: "High" },
            { name: "PTC Creo / Siemens NX", desc: "Top-tier CAD systems used in complex high-end automotive assemblies and machinery design.", priority: "Medium" }
        ],
        certs: [
            { name: "Certified SolidWorks Professional (CSWP)", desc: "Validates complex solid modeling, multi-body parts, and coordinate systems setup.", priority: "High" },
            { name: "Certified SolidWorks Associate (CSWA)", desc: "Entry-level credential proving core part drafting and assembly mating competence.", priority: "Medium" },
            { name: "Autodesk Certified Professional", desc: "Verifies AutoCAD/Inventor drafting standards and speed proficiency.", priority: "Medium" }
        ],
        portfolio: [
            { title: "Parametric Gearbox Assembly", desc: "A fully constrained gear system complying with tooth bending calculations and bearing fits." },
            { title: "Sheet Metal Enclosure Design", desc: "Electronics casing detailing precise flat patterns, bend radii, and fastener reliefs." }
        ]
    },
    "CAE/Simulation": {
        role: "Simulation Analyst / FEA Engineer / CFD Specialist",
        skills: [
            { name: "Finite Element Method (FEM) Fundamentals", desc: "Theoretical understanding of element formulations (1D beams, 2D shells, 3D solids), meshing density, and convergence curves.", priority: "Critical" },
            { name: "Computational Fluid Dynamics (CFD)", desc: "Applying turbulence models (SST k-omega, standard k-epsilon), near-wall cell treatment (y+), and mass flow conservation laws.", priority: "Critical" },
            { name: "Structural & Vibration Dynamics", desc: "Setting up modal, harmonic response, fatigue lifecycle, and non-linear contact simulations.", priority: "High" }
        ],
        software: [
            { name: "ANSYS Workbench", desc: "Industry benchmark for Static Structural, Modal, Fluent CFD solvers, and thermal simulations.", priority: "Critical" },
            { name: "Abaqus / Nastran", desc: "Advanced solver software for complex structural fatigue, crash testing, and automotive structural durability.", priority: "High" },
            { name: "Altair HyperMesh", desc: "Primary pre-processor used in automotive/aerospace industries to build structured meshes.", priority: "High" },
            { name: "MATLAB", desc: "Used to build numerical scripts, solve differential matrices, and run optimization loops.", priority: "Medium" }
        ],
        certs: [
            { name: "ANSYS Certified Professional", desc: "Industry-recognized validation of simulation setups, solver settings, and post-processing accuracy.", priority: "High" },
            { name: "NAFEMS Certification", desc: "Structural simulation verification complying with international standards.", priority: "Medium" }
        ],
        portfolio: [
            { title: "NACA Wing Section Aerodynamic CFD", desc: "CFD analysis validating lift/drag coefficients and boundary layer grid independence." },
            { title: "Bike Frame Fatigue FEA", desc: "Structural fatigue FEA analyzing stress concentrations under dynamic cyclist loads." }
        ]
    },
    "Robotics/Mechatronics": {
        role: "Automation Engineer / Mechatronics specialist / Controls Engineer",
        skills: [
            { name: "Control Systems & PID Tuning", desc: "Designing closed-loop feedback controllers, tuning proportional, integral, and derivative constants for speed/position.", priority: "Critical" },
            { name: "Embedded Programming", desc: "Writing C/C++ firmware for microcontrollers (Arduino, STM32, ESP32) to read sensor data (I2C, SPI) and drive actuators.", priority: "Critical" },
            { name: "Robot Kinematics", desc: "Deriving Forward & Inverse kinematics matrices for joint angles and robotic tool positioning.", priority: "High" }
        ],
        software: [
            { name: "MATLAB & Simulink", desc: "Modeling dynamic physical systems, root-locus design, and control loop simulations.", priority: "Critical" },
            { name: "Python", desc: "Standard for robot vision scripting (OpenCV), motion planning algorithms, and machine learning models.", priority: "High" },
            { name: "Arduino IDE / STM32Cube", desc: "Compiling firmware code for hardware execution and debugging hardware interfaces.", priority: "High" },
            { name: "ROS (Robot Operating System)", desc: "Software framework providing hardware abstraction, device drivers, and package messaging.", priority: "Medium" }
        ],
        certs: [
            { name: "CLAD (Certified LabVIEW Associate Developer)", desc: "Validates capability in automated testing, data acquisition, and virtual instrument controls.", priority: "High" },
            { name: "ASME Robotics Specialist", desc: "Validates fundamentals of automation and robotic mechanism designs.", priority: "Medium" }
        ],
        portfolio: [
            { title: "3-Axis Closed-loop Robotic Arm", desc: "Trajectory mapping and servo-driven controller utilizing Simulink & Arduino." },
            { title: "PID Balance Bot", desc: "Self-balancing two-wheeled robot using IMU sensors and real-time PID feedback." }
        ]
    },
    "Manufacturing/Operations": {
        role: "Production Engineer / Quality Analyst / Operations Manager",
        skills: [
            { name: "Lean Six Sigma (DMAIC)", desc: "Process capability evaluation (Cp, Cpk indices), cycle time balancing, and statistical quality audits.", priority: "Critical" },
            { name: "CNC Machining & CAM Fixtures", desc: "Generating precise tool paths (G-code/M-code) and designing mechanical fixtures using the 3-2-1 locating principle.", priority: "High" },
            { name: "FMEA & Process Safety", desc: "Conducting Failure Mode and Effects Analyses to identify risks and establish safety protocols.", priority: "High" }
        ],
        software: [
            { name: "Mastercam / SolidCAM", desc: "Industry-standard software for generating computer-aided manufacturing toolpaths.", priority: "Critical" },
            { name: "Minitab", desc: "Primary statistical tool for analyzing manufacturing variance, Gage R&R, and control charts.", priority: "High" },
            { name: "Autodesk AutoCAD", desc: "Used to draft factory layout designs, assembly floor configurations, and workflow steps.", priority: "Medium" }
        ],
        certs: [
            { name: "Lean Six Sigma Green Belt", desc: "Validates candidate's capability to lead small process improvement and waste reduction projects.", priority: "Critical" },
            { name: "Lean Six Sigma Yellow Belt", desc: "Proves familiarity with Lean terminologies, 5S layouts, and quality tools.", priority: "High" },
            { name: "ASQ Certified Quality Engineer (CQE)", desc: "Verifies statistical evaluation competence and control methods.", priority: "Medium" }
        ],
        portfolio: [
            { title: "Six Sigma DMAIC Yield Audit", desc: "Statistical process improvement study analyzing 500 samples in Minitab to boost yield." },
            { title: "CAM-designed Welding Fixture", desc: "Fixture design utilizing quick-clamp fixtures and Mastercam CNC programming." }
        ]
    },
    "HVAC/Thermal": {
        role: "HVAC Project Engineer / MEP Designer / Building Energy Analyst",
        skills: [
            { name: "Cooling & Heating Load Calculation", desc: "Calculating sensible and latent heat transfer rates using CLTD and psychrometric principles.", priority: "Critical" },
            { name: "Duct & Water Piping Design", desc: "Determining friction losses, pipe sizes, duct paths, and ventilation rates in buildings.", priority: "Critical" },
            { name: "ASHRAE Standard Compliance", desc: "Applying international standards (Standard 55, 62.1, 90.1) for thermal comfort, ventilation, and efficiency.", priority: "High" }
        ],
        software: [
            { name: "Autodesk Revit MEP", desc: "Industry standard for building information modeling (BIM), 3D duct layout, and coordinate checks.", priority: "Critical" },
            { name: "Carrier Hourly Analysis Program (HAP)", desc: "Standard software for office heat load simulations, energy cost checks, and climate analysis.", priority: "High" },
            { name: "Autodesk AutoCAD", desc: "Producing schematic double-line layouts and 2D piping plans.", priority: "High" }
        ],
        certs: [
            { name: "HVAC Design Certificate", desc: "Validates core design knowledge from accredited engineering associations.", priority: "High" },
            { name: "ASHRAE Member Certification", desc: "Demonstrates standard alignment and membership in ASHRAE.", priority: "Medium" }
        ],
        portfolio: [
            { title: "Office Building VRF Design", desc: "Full heat load simulation in HAP, duct routing, and MEP layout in Revit." },
            { title: "Shell-and-Tube Heat Exchanger Design", desc: "Thermal analysis using LMTD and effectiveness-NTU methods." }
        ]
    }
};

function renderEmployerInsights(cluster) {
    const data = EMPLOYER_DEMANDS[cluster] || EMPLOYER_DEMANDS["CAD Design"];
    
    // Update header
    document.getElementById("demand-cluster-icon").innerText = getClusterIcon(cluster);
    document.getElementById("demand-cluster-title").innerText = cluster;
    document.getElementById("demand-cluster-role").innerText = data.role;
    
    // Render Skills
    const skillsList = document.getElementById("demand-skills-list");
    skillsList.innerHTML = data.skills.map(s => {
        let badgeStyle = "background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc;";
        if (s.priority === 'Critical') {
            badgeStyle = "background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171;";
        } else if (s.priority === 'High') {
            badgeStyle = "background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); color: #ddd6fe;";
        }
        return `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">${s.name}</strong>
                    <span class="badge" style="${badgeStyle} font-size: 0.65rem; padding: 0.15rem 0.5rem; text-transform: uppercase;">${s.priority}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${s.desc}</p>
            </div>
        `;
    }).join("");
    
    // Render Software
    const softwareList = document.getElementById("demand-software-list");
    softwareList.innerHTML = data.software.map(sw => {
        let badgeStyle = "background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc;";
        if (sw.priority === 'Critical') {
            badgeStyle = "background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171;";
        } else if (sw.priority === 'High') {
            badgeStyle = "background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); color: #ddd6fe;";
        }
        return `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">${sw.name}</strong>
                    <span class="badge" style="${badgeStyle} font-size: 0.65rem; padding: 0.15rem 0.5rem; text-transform: uppercase;">${sw.priority}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${sw.desc}</p>
            </div>
        `;
    }).join("");
    
    // Render Certifications
    const certsList = document.getElementById("demand-certs-list");
    certsList.innerHTML = data.certs.map(c => {
        let badgeStyle = "background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc;";
        if (c.priority === 'Critical') {
            badgeStyle = "background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171;";
        } else if (c.priority === 'High') {
            badgeStyle = "background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); color: #ddd6fe;";
        }
        return `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">${c.name}</strong>
                    <span class="badge" style="${badgeStyle} font-size: 0.65rem; padding: 0.15rem 0.5rem; text-transform: uppercase;">${c.priority}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${c.desc}</p>
            </div>
        `;
    }).join("");
    
    // Render Portfolio
    const portfolioList = document.getElementById("demand-portfolio-list");
    portfolioList.innerHTML = data.portfolio.map(p => `
        <div style="padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 8px;">
            <strong style="color: var(--info); font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">${p.title}</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${p.desc}</p>
        </div>
    `).join("");
}
