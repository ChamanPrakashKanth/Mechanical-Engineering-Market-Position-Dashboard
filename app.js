// MechIntel AI — Career Analytics Platform Logic Engine

// Seeded LCG Random Generator for deterministic candidate dataset
function createRandom(seed) {
    let currentSeed = seed;
    return function() {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };
}

// Global Variables
let candidates = [];
let targetProfile = null;
let activeTheme = 'dark';
let selectedDomainName = "Design Engineering";

// State persistence structures (local storage fallback)
let userXP = parseInt(localStorage.getItem("userXP")) || 200;
let userStreak = parseInt(localStorage.getItem("userStreak")) || 1;
let completedQuizzes = JSON.parse(localStorage.getItem("completedQuizzes")) || [];
let completedGoals = JSON.parse(localStorage.getItem("completedGoals")) || [];
let softwareProficiency = JSON.parse(localStorage.getItem("softwareProficiency")) || {
    "SolidWorks": 50, "CATIA": 20, "Creo": 20, "AutoCAD": 40, "Fusion 360": 30,
    "Siemens NX": 10, "ANSYS": 30, "Abaqus": 10, "MATLAB": 20, "Python": 20, "Excel": 60
};

// 14 Mechanical Engineering Domain configurations
const DOMAINS_CATALOG = {
    "Design Engineering": {
        skills: ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Tolerance Analysis"],
        software: ["SolidWorks", "AutoCAD", "Creo"],
        certs: ["CSWP (Certified SolidWorks Professional)", "ASME GD&T Professional"],
        salary: "₹6.8 LPA",
        demand: "Critical"
    },
    "Manufacturing Engineering": {
        skills: ["Lean Manufacturing", "CNC Programming", "DFM (Design for Manufacturing)"],
        software: ["AutoCAD", "SolidWorks", "Excel"],
        certs: ["SME Certified Manufacturing Engineer (CMfgE)"],
        salary: "₹6.0 LPA",
        demand: "High"
    },
    "Production Engineering": {
        skills: ["Quality Control & Assurance", "CNC Programming", "Six Sigma"],
        software: ["AutoCAD", "Excel"],
        certs: ["Lean Six Sigma Green Belt"],
        salary: "₹5.5 LPA",
        demand: "Medium"
    },
    "Maintenance Engineering": {
        skills: ["Embedded Systems", "Control Systems", "Lean Manufacturing"],
        software: ["Excel", "MATLAB"],
        certs: ["ASME Maintenance Certificate"],
        salary: "₹5.2 LPA",
        demand: "Medium"
    },
    "Quality Engineering": {
        skills: ["Quality Control & Assurance", "Six Sigma", "Tolerance Analysis"],
        software: ["Excel", "Python"],
        certs: ["ASQ Certified Quality Engineer (CQE)"],
        salary: "₹5.8 LPA",
        demand: "High"
    },
    "HVAC": {
        skills: ["HVAC Design", "Thermodynamics", "Piping Design"],
        software: ["AutoCAD", "Revit"],
        certs: ["HVAC Design Certificate", "ASHRAE Member Certification"],
        salary: "₹5.6 LPA",
        demand: "High"
    },
    "Automotive": {
        skills: ["Kinematics & Dynamics", "Vibration Analysis", "Product Design"],
        software: ["SolidWorks", "CATIA", "ANSYS"],
        certs: ["SAE Automotive Design Certificate"],
        salary: "₹7.2 LPA",
        demand: "High"
    },
    "Aerospace": {
        skills: ["Fluid Mechanics", "Structural Analysis", "Heat Transfer"],
        software: ["CATIA", "ANSYS", "Abaqus"],
        certs: ["NAFEMS Simulation Certification"],
        salary: "₹8.8 LPA",
        demand: "Critical"
    },
    "Robotics": {
        skills: ["Robotics", "Control Systems", "Embedded Systems"],
        software: ["MATLAB", "Python"],
        certs: ["ASME Robotics Specialist"],
        salary: "₹8.2 LPA",
        demand: "Critical"
    },
    "Mechatronics": {
        skills: ["Mechatronics", "Control Systems", "Kinematics & Dynamics"],
        software: ["MATLAB", "Simulink", "Python"],
        certs: ["Certified LabVIEW Associate (CLAD)"],
        salary: "₹7.8 LPA",
        demand: "High"
    },
    "CFD": {
        skills: ["Computational Fluid Dynamics (CFD)", "Fluid Mechanics", "Heat Transfer"],
        software: ["ANSYS", "Fluent", "MATLAB"],
        certs: ["ANSYS Certified Professional"],
        salary: "₹8.0 LPA",
        demand: "Critical"
    },
    "FEA": {
        skills: ["Finite Element Analysis (FEA)", "Structural Analysis", "Vibration Analysis"],
        software: ["ANSYS", "Abaqus", "Siemens NX"],
        certs: ["FEA Specialist Certification"],
        salary: "₹7.6 LPA",
        demand: "High"
    },
    "Thermal Engineering": {
        skills: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics"],
        software: ["ANSYS", "MATLAB", "Excel"],
        certs: ["ASME Thermal Systems Specialist"],
        salary: "₹6.5 LPA",
        demand: "Medium"
    },
    "Industrial Engineering": {
        skills: ["Lean Manufacturing", "Six Sigma", "Quality Control & Assurance"],
        software: ["Excel", "Python"],
        certs: ["Lean Six Sigma Black Belt"],
        salary: "₹6.4 LPA",
        demand: "High"
    }
};

const CLUSTERS = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"];

// Technical QA Bank
const TECHNICAL_QA = [
    { q: "What is the primary benefit of designing parts using Maximum Material Condition (MMC)?", a: "MMC (Ⓜ) defines the state where a feature contains the maximum amount of material within its size limits (smallest hole, largest pin). Using MMC grants additional 'bonus tolerance' as the feature departs from MMC, lowering machining scrap rates." },
    { q: "Under what conditions is Root-Sum-Square (RSS) tolerance stackup preferred over Worst-Case?", a: "RSS assumes components are manufactured in a normal distribution, meaning the probability of all parts being at their extreme limits simultaneously is very low. It is preferred in large assemblies to avoid unnecessarily tight tolerances and higher costs." },
    { q: "Why is a y+ value near 1.0 targeted when setting up boundary layer meshes for CFD?", a: "A y+ value near 1.0 ensures the first inflation layer cell sits directly inside the viscous sublayer of the boundary flow. This allows the solver to resolve viscous forces directly rather than relying on wall functions." },
    { q: "Explain the difference between 1D (Truss) and 2D (Shell) elements in structural FEA.", a: "Truss elements only carry axial tension/compression. Shell elements model thin structures (thickness is small compared to length/width) and support both bending moments and membrane forces." },
    { q: "What is the physical meaning of the Von Mises Yield Criterion?", a: "It is an equivalent stress model used to predict yielding in ductile materials under multi-axial loads. It states yielding occurs when the distortion energy per unit volume exceeds the yield point distortion energy in simple tension." }
];

const HR_QA = [
    { q: "Tell me about a time you had to resolve a major technical failure in a group project.", a: "Guideline: Use the STAR method. S: Situation (Identify the group task), T: Task (Specify the structural failure or design clash), A: Action (Show how you ran FEA/CAD diagnostics), R: Result (Verify that the prototype passed tests)." }
];

// Seeded dataset generator (Generates 100,000 anonymized competitor profiles deterministically)
function generateDataset() {
    const random = createRandom(42);
    const data = [];
    const regions = ["India", "Global"];
    const tiers = ["Tier 1", "Tier 2", "Tier 3"];
    const degrees = ["B.Tech/B.S.", "M.Tech/M.S.", "Ph.D."];
    
    const collegesDb = {
        "India": {
            "Tier 1": ["IIT Bombay", "IIT Madras", "IIT Delhi", "IIT Kharagpur", "NIT Trichy", "BITS Pilani"],
            "Tier 2": ["VIT Vellore", "Manipal MIT", "Anna University", "DTU Delhi", "RVCE Bangalore"],
            "Tier 3": ["Mumbai University", "Pune University", "VTU Belgaum", "GTU Ahmedabad", "Local Engineering College"]
        },
        "Global": {
            "Tier 1": ["MIT", "Stanford University", "UC Berkeley", "Imperial College London", "ETH Zurich"],
            "Tier 2": ["Penn State", "Purdue University", "University of Michigan", "TU Delft", "University of Toronto"],
            "Tier 3": ["State University", "Regional Tech College", "City College of Technology", "International Poly"]
        }
    };

    const domainsKeys = Object.keys(DOMAINS_CATALOG);

    for (let i = 1; i <= 10000; i++) { // Generate 10k for faster in-memory calculations
        const region = random() < 0.60 ? "India" : "Global";
        const tierRoll = random();
        const tier = tierRoll < 0.15 ? "Tier 1" : (tierRoll < 0.60 ? "Tier 2" : "Tier 3");
        
        const collegeList = collegesDb[region][tier];
        const college = collegeList[Math.floor(random() * collegeList.length)];
        
        const degRoll = random();
        const degree = degRoll < 0.80 ? "B.Tech/B.S." : (degRoll < 0.98 ? "M.Tech/M.S." : "Ph.D.");
        
        const domainKey = domainsKeys[Math.floor(random() * domainsKeys.length)];
        const domainConfig = DOMAINS_CATALOG[domainKey];
        
        const internships = random() < 0.35 ? 1 : (random() < 0.10 ? 2 : 0);
        const projects = Math.floor(random() * 4) + 1;
        const publications = degree === "Ph.D." ? Math.floor(random() * 4) + 2 : (random() < 0.15 ? 1 : 0);
        const competitions = random() < 0.15 ? 1 : 0;
        
        // Calculate competitive score
        const acadScore = tier === "Tier 1" ? 100 : (tier === "Tier 2" ? 70 : 40);
        const degScore = degree === "B.Tech/B.S." ? 70 : (degree === "M.Tech/M.S." ? 85 : 100);
        const acadWeighted = (acadScore * 0.6 + degScore * 0.4) * 0.25;
        
        const skillVal = Math.min((domainConfig.skills.length + Math.floor(random() * 2)) * 25, 100);
        const toolVal = Math.min((domainConfig.software.length + Math.floor(random() * 2)) * 25, 100);
        const skillsWeighted = (skillVal * 0.5 + toolVal * 0.5) * 0.35;
        
        const internVal = Math.min(internships * 50, 100);
        const projVal = Math.min(projects * 33, 100);
        const compVal = Math.min(competitions * 50, 100);
        const expWeighted = (internVal * 0.4 + projVal * 0.4 + compVal * 0.2) * 0.30;
        
        const paperVal = Math.min(publications * 50, 100);
        const certVal = Math.min(domainConfig.certs.length * 50, 100);
        const extraWeighted = (paperVal * 0.5 + certVal * 0.5) * 0.10;
        
        const score = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10);
        
        data.push({
            id: `Candidate #ME-${10000 + i}`,
            region: region,
            tier: tier,
            college: college,
            degree: degree,
            cluster: domainKey,
            skills: domainConfig.skills,
            software_tools: domainConfig.software,
            certifications: domainConfig.certs,
            internships: internships,
            projects: projects,
            research_papers: publications,
            competitions: competitions,
            score: score / 10
        });
    }
    return data;
}

// Resume Parsing algorithms
const KEYWORDS_TAXONOMY = ["gd&t", "fea", "cfd", "cad", "ansys", "solidworks", "revit", "hvac", "six sigma", "asme", "dfm", "matlab", "cnc"];

function parseResumeText(text) {
    const textLower = text.toLowerCase();
    
    // Redact email/phone
    let cleaned = text;
    cleaned = cleaned.replace(/\b[\w\.-]+@[\w\.-]+\.\w{2,}\b/g, '[REDACTED_EMAIL]');
    cleaned = cleaned.replace(/\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, '[REDACTED_PHONE]');
    
    const skills = [];
    const software = [];
    const certs = [];
    
    if (textLower.includes("gd&t") || textLower.includes("geometric dimensioning")) skills.push("GD&T (Geometric Dimensioning & Tolerancing)");
    if (textLower.includes("fea") || textLower.includes("finite element")) skills.push("Finite Element Analysis (FEA)");
    if (textLower.includes("cfd") || textLower.includes("computational fluid")) skills.push("Computational Fluid Dynamics (CFD)");
    if (textLower.includes("hvac")) skills.push("HVAC Design");
    if (textLower.includes("mechatronics")) skills.push("Mechatronics");
    
    if (textLower.includes("solidworks")) software.push("SolidWorks");
    if (textLower.includes("autocad")) software.push("AutoCAD");
    if (textLower.includes("ansys")) software.push("ANSYS");
    if (textLower.includes("matlab")) software.push("MATLAB");
    
    if (textLower.includes("cswa")) certs.push("Certified SolidWorks Associate (CSWA)");
    if (textLower.includes("cswp")) certs.push("Certified SolidWorks Professional (CSWP)");
    
    const projects = Math.min(Math.max(Math.round((textLower.match(/project|design/g) || []).length / 2), 1), 5);
    const internships = Math.min((textLower.match(/internship|intern\b|trainee/g) || []).length, 2);
    
    return {
        region: textLower.includes("mit") || textLower.includes("stanford") ? "Global" : "India",
        tier: textLower.includes("iit") || textLower.includes("bits") ? "Tier 1" : "Tier 2",
        degree: textLower.includes("master") || textLower.includes("m.tech") ? "M.Tech/M.S." : "B.Tech/B.S.",
        projects: projects,
        internships: internships,
        research_papers: textLower.includes("publication") ? 1 : 0,
        competitions: textLower.includes("fsae") || textLower.includes("baja") ? 1 : 0,
        skills: skills,
        software_tools: software,
        certifications: certs,
        raw_text: cleaned
    };
}

// Structured Assessment Calculators
function calculateScores(profile, proficiencyValues = softwareProficiency) {
    // 1. Academics
    const acadBase = profile.tier === "Tier 1" ? 100 : (profile.tier === "Tier 2" ? 70 : 40);
    const degBase = profile.degree === "B.Tech/B.S." ? 70 : (profile.degree === "M.Tech/M.S." ? 85 : 100);
    const acadWeighted = (acadBase * 0.6 + degBase * 0.4) * 0.25;
    
    // 2. Software proficiency values mapping
    const swValues = Object.values(proficiencyValues);
    const swAverage = swValues.reduce((a,b) => a+b, 0) / swValues.length;
    const skillsWeighted = (swAverage * 0.6 + Math.min(profile.skills.length * 20, 100) * 0.4) * 0.35;
    
    // 3. Experience
    const internVal = Math.min(profile.internships * 50, 100);
    const projVal = Math.min(profile.projects * 33, 100);
    const compVal = Math.min(profile.competitions * 50, 100);
    const expWeighted = (internVal * 0.4 + projVal * 0.4 + compVal * 0.2) * 0.30;
    
    // 4. Extras
    const paperVal = Math.min(profile.research_papers * 50, 100);
    const certVal = Math.min(profile.certifications.length * 50, 100);
    const extraWeighted = (paperVal * 0.5 + certVal * 0.5) * 0.10;
    
    const courseBonus = typeof userCompletedCourses !== 'undefined' ? Math.min(userCompletedCourses.length * 2.5, 20) : 0;
    const readiness = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10) / 10;
    const marketPosition = Math.round(readiness * 0.9 + (profile.tier === "Tier 1" ? 10 : 0));
    const employability = Math.round((projVal * 0.3 + internVal * 0.5 + swAverage * 0.2));
    const recruiter = Math.round((acadBase * 0.3 + internVal * 0.4 + certVal * 0.3));
    const engineeringCompetency = Math.min(100, Math.round((swAverage * 0.7 + Math.min(profile.skills.length * 20, 100) * 0.3) + courseBonus));
    
    // Calculate profile completeness
    let completion = 20; // default name
    if (profile.projects > 0) completion += 15;
    if (profile.internships > 0) completion += 15;
    if (profile.skills.length > 0) completion += 15;
    if (profile.certifications.length > 0) completion += 15;
    if (profile.research_papers > 0) completion += 10;
    if (profile.competitions > 0) completion += 10;
    
    return {
        readiness: Math.min(readiness, 100),
        marketPosition: Math.min(marketPosition, 100),
        employability: Math.min(employability, 100),
        recruiter: Math.min(recruiter, 100),
        engineeringCompetency: Math.min(engineeringCompetency, 100),
        completion: Math.min(completion, 100)
    };
}

// Plotly renderers
function drawGaugeChart(score) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const trace = {
        type: "indicator",
        mode: "gauge+number",
        value: score,
        title: { text: "Career Readiness Index", font: { color: textTheme, size: 14 } },
        gauge: {
            axis: { range: [0, 100], tickcolor: textTheme },
            bar: { color: "#2563eb" },
            bgcolor: "rgba(0,0,0,0)",
            borderwidth: 2,
            bordercolor: "rgba(255,255,255,0.08)",
            steps: [
                { range: [0, 50], color: "rgba(239, 68, 68, 0.15)" },
                { range: [50, 80], color: "rgba(245, 158, 11, 0.15)" },
                { range: [80, 100], color: "rgba(16, 185, 129, 0.15)" }
            ]
        }
    };
    const layout = {
        width: 250,
        height: 180,
        margin: { t: 30, r: 30, l: 30, b: 30 },
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { color: textTheme }
    };
    Plotly.newPlot("plotly-gauge-chart", [trace], layout, {responsive: true, displayModeBar: false});
}

function drawRadarChart() {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    // Evaluate 6 software tools for display
    const tools = ["SolidWorks", "ANSYS", "AutoCAD", "MATLAB", "Python", "Excel"];
    const userValues = tools.map(t => softwareProficiency[t] || 0);
    const peerValues = [75, 60, 80, 55, 45, 85]; // top 10%

    const data = [
        {
            type: 'scatterpolar',
            r: userValues,
            theta: tools,
            fill: 'toself',
            name: 'Your Level',
            fillcolor: 'rgba(37, 99, 235, 0.25)',
            line: { color: '#2563eb' }
        },
        {
            type: 'scatterpolar',
            r: peerValues,
            theta: tools,
            fill: 'toself',
            name: 'Top 10% Peer Average',
            fillcolor: 'rgba(139, 92, 246, 0.2)',
            line: { color: '#8b5cf6', dash: 'dash' }
        }
    ];

    const layout = {
        polar: {
            radialaxis: { visible: true, range: [0, 100], color: textTheme, gridcolor: gridTheme },
            angularaxis: { color: textTheme, gridcolor: gridTheme },
            bgcolor: 'rgba(0,0,0,0)'
        },
        width: 320,
        height: 250,
        margin: { t: 30, b: 30, l: 40, r: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        font: { color: textTheme, size: 9 }
    };
    Plotly.newPlot("plotly-radar-chart", data, layout, {responsive: true, displayModeBar: false});
}

function drawSalaryChart(score) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    
    const xValues = [];
    const yValues = [];
    for (let x = 3; x <= 22; x += 0.5) {
        xValues.push(x);
        const y = Math.exp(-0.5 * Math.pow((x - 7.5) / 2.5, 2)) / (2.5 * Math.sqrt(2 * Math.PI));
        yValues.push(y);
    }
    
    const estimatedUserSalary = 3.5 + (score / 100) * 16.5; 

    const data = [
        {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            fill: 'tozeroy',
            name: 'Salary Curve',
            fillcolor: 'rgba(37, 99, 235, 0.15)',
            line: { color: '#2563eb', width: 2 }
        },
        {
            x: [estimatedUserSalary],
            y: [Math.exp(-0.5 * Math.pow((estimatedUserSalary - 7.5) / 2.5, 2)) / (2.5 * Math.sqrt(2 * Math.PI))],
            type: 'scatter',
            mode: 'markers+text',
            name: 'Your Range',
            marker: { color: '#8b5cf6', size: 10 },
            text: [`₹${estimatedUserSalary.toFixed(1)} LPA`],
            textposition: 'top center',
            font: { color: textTheme, weight: 'bold' }
        }
    ];

    const layout = {
        width: 250,
        height: 180,
        margin: { t: 40, b: 30, l: 30, r: 30 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme },
        xaxis: { title: "Salary (LPA)", gridcolor: gridTheme, color: textTheme },
        yaxis: { showgrid: false, showline: false, showticklabels: false },
        showlegend: false
    };
    Plotly.newPlot("plotly-salary-chart", data, layout, {responsive: true, displayModeBar: false});
}

function drawHeatmapChart() {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const sectors = ["Automotive", "Aerospace", "Energy/EV", "MEP/HVAC", "Manufacturing"];
    const domains = ["Design", "Manufacturing", "Robotics", "HVAC", "FEA/CFD"];
    
    const values = [
        [90, 75, 60, 40, 95],
        [95, 90, 85, 50, 60],
        [85, 80, 90, 30, 95],
        [70, 60, 65, 30, 98],
        [30, 40, 50, 98, 45]
    ];

    const data = [{
        z: values,
        x: sectors,
        y: domains,
        type: 'heatmap',
        colorscale: 'Blues',
        showscale: false
    }];

    const layout = {
        width: 700,
        height: 220,
        margin: { t: 20, b: 40, l: 100, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 9 },
        xaxis: { gridcolor: 'rgba(0,0,0,0)', tickcolor: textTheme },
        yaxis: { gridcolor: 'rgba(0,0,0,0)', tickcolor: textTheme }
    };
    Plotly.newPlot("plotly-heatmap-chart-jobs", data, layout, {responsive: true, displayModeBar: false});
}

function drawTimelineChart() {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    
    const stages = ["Entry Intern", "Associate Engineer", "Senior Analyst", "Engineering Lead"];
    const timelineYears = [0.5, 2.5, 5.5, 9.0];

    const data = [{
        x: timelineYears,
        y: stages,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
            width: 0.6
        }
    }];

    const layout = {
        width: 320,
        height: 200,
        margin: { t: 10, b: 40, l: 110, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 8 },
        xaxis: { title: "Target Time Frame (Years)", gridcolor: gridTheme, color: textTheme },
        yaxis: { gridcolor: 'rgba(0,0,0,0)', color: textTheme }
    };
    Plotly.newPlot("plotly-timeline-chart", data, layout, {responsive: true, displayModeBar: false});
}

// 14 Domain matrix population
function renderDomainReadinessGrid(profile) {
    const grid = document.getElementById("domains-grid-matrix");
    grid.innerHTML = "";
    
    const userKeywords = profile.skills.concat(profile.certifications);
    
    Object.keys(DOMAINS_CATALOG).forEach(domainName => {
        const config = DOMAINS_CATALOG[domainName];
        
        // Calculate match percentage based on software proficiency average + skills intersection
        const skillsIntersect = config.skills.filter(s => userKeywords.includes(s));
        const swValues = config.software.map(sw => softwareProficiency[sw] || 0);
        const swAvg = swValues.reduce((a,b) => a+b, 0) / swValues.length;
        
        const skillsPct = (skillsIntersect.length / config.skills.length) * 100;
        const matchPct = Math.round((skillsPct * 0.5 + swAvg * 0.5));
        
        const card = document.createElement("div");
        card.className = `domain-matrix-card glass-card ${selectedDomainName === domainName ? 'active' : ''}`;
        card.innerHTML = `
            <div class="domain-matrix-name">${domainName}</div>
            <div class="domain-matrix-match-pct">${matchPct}%</div>
            <div class="domain-matrix-demand" style="color: ${config.demand === 'Critical' ? 'var(--accent)' : 'var(--success)'}">${config.demand} Demand</div>
        `;
        
        card.addEventListener("click", () => {
            selectedDomainName = domainName;
            document.querySelectorAll(".domain-matrix-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            expandDomainDetails(domainName, profile);
        });
        
        grid.appendChild(card);
    });
}

function expandDomainDetails(domainName, profile) {
    const config = DOMAINS_CATALOG[domainName];
    if (!config) return;
    
    document.getElementById("domain-details-expanded-card").classList.remove("hide");
    document.getElementById("expanded-domain-title").innerHTML = `<i data-lucide="info"></i> ${domainName} Technical Requirements`;
    
    document.getElementById("expanded-req-skills").innerHTML = config.skills.map(s => `<li>${s}</li>`).join('');
    document.getElementById("expanded-req-sw").innerHTML = config.software.map(sw => `<li>${sw} (Current: ${softwareProficiency[sw] || 0}%)</li>`).join('');
    
    const userKeywords = profile.skills.concat(profile.certifications);
    const missing = config.skills.filter(s => !userKeywords.includes(s));
    
    document.getElementById("expanded-missing-skills").innerHTML = missing.length > 0 ? 
        missing.map(m => `<span class="missing-pill">${m}</span>`).join('') : 
        `<span class="badge badge-green">Technical Competencies Met!</span>`;
        
    lucide.createIcons();
}

// Software Sliders generator
function buildSoftwareSliders() {
    const container = document.getElementById("sw-sliders-container");
    container.innerHTML = "";
    
    Object.keys(softwareProficiency).forEach(sw => {
        const row = document.createElement("div");
        row.className = "sw-slider-row";
        row.innerHTML = `
            <div class="sw-slider-header">
                <span>${sw}</span>
                <span class="sw-slider-val" id="val-sw-${sw.replace(' ', '-')}">${softwareProficiency[sw]}%</span>
            </div>
            <input type="range" class="sw-slider-input" min="0" max="100" value="${softwareProficiency[sw]}" data-sw="${sw}">
        `;
        
        const slider = row.querySelector("input");
        slider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            softwareProficiency[sw] = val;
            document.getElementById(`val-sw-${sw.replace(' ', '-')}`).innerText = `${val}%`;
            
            // Save state
            localStorage.setItem("softwareProficiency", JSON.stringify(softwareProficiency));
            
            // Re-render dashboard calculations
            if (targetProfile) {
                const scores = calculateScores(targetProfile);
                updateScoresDisplay(scores);
                renderDomainReadinessGrid(targetProfile);
                drawRadarChart();
                drawGaugeChart(scores.readiness);
                drawSalaryChart(scores.readiness);
            }
        });
        
        container.appendChild(row);
    });
}

function updateScoresDisplay(scores) {
    document.getElementById("val-career-readiness").innerText = `${scores.readiness}/100`;
    document.getElementById("val-market-position").innerText = `${scores.marketPosition}/100`;
    document.getElementById("val-employability").innerText = `${scores.employability}/100`;
    document.getElementById("val-recruiter-readiness").innerText = `${scores.recruiter}/100`;
    document.getElementById("val-engineering-competency").innerText = `${scores.engineeringCompetency}/100`;
    document.getElementById("val-profile-completion").innerText = `${scores.completion}%`;
    
    // Update gamification progress
    document.getElementById("sb-xp-progress").style.width = `${userXP % 1000 / 10}%`;
    document.getElementById("sb-xp-val").innerText = userXP;
    document.getElementById("sb-level-val").innerText = Math.floor(userXP / 1000) + 1;
}

// Gamification Badges list
const BADGES = [
    { id: "cad-master", name: "CAD Master", desc: "SolidWorks & AutoCAD both >= 70%", unlockCheck: () => softwareProficiency["SolidWorks"] >= 70 && softwareProficiency["AutoCAD"] >= 70 },
    { id: "sim-scholar", name: "Simulation Scholar", desc: "ANSYS & Abaqus both >= 70%", unlockCheck: () => softwareProficiency["ANSYS"] >= 70 && softwareProficiency["Abaqus"] >= 70 },
    { id: "certified-pro", name: "Certified Pro", desc: "At least 2 verified certifications", unlockCheck: () => targetProfile?.certifications.length >= 2 }
];

function renderBadges() {
    const container = document.getElementById("overview-badges-container");
    container.innerHTML = "";
    
    BADGES.forEach(badge => {
        const unlocked = badge.unlockCheck();
        const row = document.createElement("div");
        row.className = `badge-item-row ${unlocked ? 'unlocked' : ''}`;
        row.innerHTML = `
            <div class="badge-icon-box">
                <i data-lucide="${unlocked ? 'award' : 'lock'}"></i>
            </div>
            <div class="badge-item-details">
                <h5>${badge.name}</h5>
                <p>${badge.desc} (${unlocked ? 'Unlocked' : 'Locked'})</p>
            </div>
        `;
        container.appendChild(row);
    });
    lucide.createIcons();
}

// Resume ATS scorecard
function renderAtsScorecard(profile) {
    const userKeywords = profile.skills.concat(profile.software_tools).map(s => s.toLowerCase());
    let matchCount = 0;
    
    const wrapper = document.getElementById("ats-missing-keywords-wrapper");
    wrapper.innerHTML = "";
    
    KEYWORDS_TAXONOMY.forEach(kw => {
        const present = userKeywords.some(u => u.includes(kw));
        if (present) matchCount++;
        
        const box = document.createElement("div");
        box.className = `keyword-status-box ${present ? 'present' : 'missing'}`;
        box.innerText = kw.toUpperCase();
        wrapper.appendChild(box);
    });
    
    const atsScore = Math.round((matchCount / KEYWORDS_TAXONOMY.length) * 100);
    document.getElementById("ats-score-ring").innerText = `${atsScore}%`;
    document.getElementById("ats-readiness-label").innerText = atsScore >= 70 ? "Excellent ATS Keywords Match!" : "Keywords Optimization Required";
}

// Generate static portfolio template code
function generatePortfolioHtml(profile) {
    const code = `<!DOCTYPE html>
<html>
<head>
    <title>${profile.id} — Mechanical Design Portfolio</title>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 2rem; }
        .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1.5rem; }
        h1 { color: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h1>${profile.id}</h1>
        <p>Matched Specialization: ${profile.cluster}</p>
        <p>Region: ${profile.region} | Institution: ${profile.tier}</p>
        <hr>
        <h3>Mastered Engineering Skills</h3>
        <ul>${profile.skills.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
</body>
</html>`;
    const box = document.getElementById("portfolio-output-code");
    box.value = code;
    box.classList.remove("hidden");
}

// Technical QA population
function populateQuestionBanks() {
    const techAcc = document.getElementById("technical-qa-accordion");
    techAcc.innerHTML = "";
    TECHNICAL_QA.forEach((qa, idx) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = `
            <div class="accordion-trigger">
                <span>Q${idx+1}: ${qa.q}</span>
                <i data-lucide="chevron-down" style="width:14px; height:14px;"></i>
            </div>
            <div class="accordion-content">
                <p>${qa.a}</p>
            </div>
        `;
        item.querySelector(".accordion-trigger").addEventListener("click", () => {
            item.classList.toggle("active");
        });
        techAcc.appendChild(item);
    });

    const hrAcc = document.getElementById("hr-qa-accordion");
    hrAcc.innerHTML = "";
    HR_QA.forEach((qa, idx) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = `
            <div class="accordion-trigger">
                <span>Behavioral Q${idx+1}: ${qa.q}</span>
                <i data-lucide="chevron-down" style="width:14px; height:14px;"></i>
            </div>
            <div class="accordion-content">
                <p>${qa.a}</p>
            </div>
        `;
        item.querySelector(".accordion-trigger").addEventListener("click", () => {
            item.classList.toggle("active");
        });
        hrAcc.appendChild(item);
    });

    // Aptitude Math Question
    const aptWrapper = document.getElementById("aptitude-practice-wrapper");
    aptWrapper.innerHTML = `
        <div class="goal-checklist" style="font-size:0.85rem;">
            <p><strong>Aptitude Question:</strong> A cantilever beam of length L=2m carries a tip load P=3kN. If E=200GPa and I=1e-5 m⁴, what is tip deflection?</p>
            <input type="text" id="apt-answer-input" placeholder="Enter answer in mm..." style="margin-top:0.5rem; padding:0.4rem; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); color:#fff; border-radius:4px;">
            <button class="btn btn-primary btn-sm" id="btn-check-apt" style="margin-top:0.5rem;">Verify Answer</button>
            <div id="apt-feedback" style="margin-top:0.4rem; font-weight:700;"></div>
        </div>
    `;
    
    document.getElementById("btn-check-apt").addEventListener("click", () => {
        const ans = parseFloat(document.getElementById("apt-answer-input").value);
        const fb = document.getElementById("apt-feedback");
        // Tip deflection = P L^3 / (3 E I) = (3000 * 8) / (3 * 200e9 * 1e-5) = 24000 / 6e6 = 0.004 m = 4.0 mm
        if (Math.abs(ans - 4.0) < 0.1) {
            fb.innerText = "🎉 Correct! The tip deflection is exactly 4.0 mm.";
            fb.style.color = "var(--success)";
            
            // Reward XP
            userXP += 100;
            localStorage.setItem("userXP", userXP);
            updateScoresDisplay(calculateScores(targetProfile));
        } else {
            fb.innerText = "❌ Incorrect. Hint: deflection δ = P L³ / (3 E I). Solve carefully.";
            fb.style.color = "var(--danger)";
        }
    });

    lucide.createIcons();
}

// Compile CSV export matrix
function exportCompetencyMatrixCsv() {
    let csv = "Domain,Match Percentage,Required Skills,Required Software,Average Salary,Demand\n";
    
    const userKeywords = targetProfile.skills.concat(targetProfile.certifications);
    
    Object.keys(DOMAINS_CATALOG).forEach(domainName => {
        const config = DOMAINS_CATALOG[domainName];
        
        const skillsIntersect = config.skills.filter(s => userKeywords.includes(s));
        const swValues = config.software.map(sw => softwareProficiency[sw] || 0);
        const swAvg = swValues.reduce((a,b) => a+b, 0) / swValues.length;
        
        const skillsPct = (skillsIntersect.length / config.skills.length) * 100;
        const matchPct = Math.round((skillsPct * 0.5 + swAvg * 0.5));
        
        csv += `"${domainName}",${matchPct}%,${config.skills.length} skills,${config.software.join(' | ')},"${config.salary}",${config.demand}\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MechIntel_Competency_Matrix.csv`;
    link.click();
}

// Main Build and Display Dashboard
function buildDashboard(profile) {
    targetProfile = profile;
    
    // Calculate and display scores
    const scores = calculateScores(profile);
    updateScoresDisplay(scores);
    
    // Generate ranks
    const ranks = getRanks(scores.readiness, profile.cluster || "Design Engineering", profile.region, profile.tier);
    
    document.getElementById("db-global-rank").innerText = `#${ranks.globalRank.toLocaleString()}`;
    document.getElementById("db-global-total").innerText = `of ${ranks.globalTotal.toLocaleString()} Worldwide`;
    document.getElementById("db-global-pct").innerText = `${ordinal(ranks.globalPercentile)} percentile · Top ${ranks.globalTopShare}%`;
    document.getElementById("db-global-progress").style.width = `${ranks.globalPercentile}%`;

    document.getElementById("db-india-rank").innerText = `#${ranks.indiaRank.toLocaleString()}`;
    document.getElementById("db-india-total").innerText = `of ${ranks.indiaTotal.toLocaleString()} ${profile.region}`;
    document.getElementById("db-india-pct").innerText = `${ordinal(ranks.indiaPercentile)} percentile · Top ${ranks.indiaTopShare}%`;
    document.getElementById("db-india-progress").style.width = `${ranks.indiaPercentile}%`;

    document.getElementById("db-tier-rank").innerText = `#${ranks.tierRank.toLocaleString()}`;
    document.getElementById("db-tier-total").innerText = `of ${ranks.tierTotal.toLocaleString()} ${profile.tier} peers`;
    document.getElementById("db-tier-pct").innerText = `${ordinal(ranks.tierPercentile)} percentile · Top ${ranks.tierTopShare}%`;
    document.getElementById("db-tier-progress").style.width = `${ranks.tierPercentile}%`;

    document.getElementById("db-cluster-rank").innerText = `#${ranks.clusterRank.toLocaleString()}`;
    document.getElementById("db-cluster-total").innerText = `of ${ranks.clusterTotal.toLocaleString()} specialty peers`;
    document.getElementById("db-cluster-pct").innerText = `${ordinal(ranks.clusterPercentile)} percentile · Top ${ranks.clusterTopShare}%`;
    document.getElementById("db-cluster-progress").style.width = `${ranks.clusterPercentile}%`;

    document.getElementById("sb-candidate-id").innerText = profile.id || "Candidate #ME-49023";
    document.getElementById("sb-college-val").innerText = `${profile.degree} | ${profile.tier}`;
    document.getElementById("sb-avatar-letter").innerText = profile.degree.charAt(0);
    
    // Diagnostics checklists
    const strengthsUl = document.getElementById("overview-strengths");
    strengthsUl.innerHTML = "";
    if (profile.tier === "Tier 1") strengthsUl.innerHTML += `<li>Elite academic tier provides active baseline placement scores.</li>`;
    if (profile.internships > 0) strengthsUl.innerHTML += `<li>Practical industrial internships increase placement visibility.</li>`;
    if (profile.projects >= 3) strengthsUl.innerHTML += `<li>Robust project counts prove structural assembly design competency.</li>`;
    
    const weaknessesUl = document.getElementById("overview-weaknesses");
    weaknessesUl.innerHTML = "";
    if (profile.tier === "Tier 3") weaknessesUl.innerHTML += `<li>Tier 3 credentials lack active campus hiring. Focus on off-campus portfolio channels.</li>`;
    if (profile.internships === 0) weaknessesUl.innerHTML += `<li>Zero internships reported. Target virtual internships or research assistant roles.</li>`;

    // Render competency matrices
    renderDomainReadinessGrid(profile);
    expandDomainDetails(selectedDomainName, profile);
    
    // Draw Plotly widgets
    drawGaugeChart(scores.readiness);
    drawRadarChart();
    drawHeatmapChart();
    drawSalaryChart(scores.readiness);
    drawBenchmarkDistribution(scores.readiness, profile);
    renderCareerMoveScenario();
    
    // ATS checklist
    renderAtsScorecard(profile);
    
    // Badges
    renderBadges();
    
    // Database render
    renderDatabaseTable();
    
    showPane("dashboard-panel");
    lucide.createIcons();
}

// Database paging & filtering
let dbFiltered = [];
let dbPage = 1;
const dbPageSize = 12;

function renderDatabaseTable() {
    const search = document.getElementById("db-search-input").value.toLowerCase();
    const region = document.getElementById("db-region-filter").value;
    const cluster = document.getElementById("db-cluster-filter").value;
    
    let filtered = candidates;
    if (region !== "All") filtered = filtered.filter(c => c.region === region);
    if (cluster !== "All") filtered = filtered.filter(c => c.cluster === cluster);
    if (search) {
        filtered = filtered.filter(c => 
            c.id.toLowerCase().includes(search) ||
            c.college.toLowerCase().includes(search) ||
            c.degree.toLowerCase().includes(search)
        );
    }
    
    dbFiltered = filtered;
    const totalRecords = dbFiltered.length;
    const startIdx = (dbPage - 1) * dbPageSize;
    const endIdx = Math.min(startIdx + dbPageSize, totalRecords);
    
    const pageRecords = dbFiltered.slice(startIdx, endIdx);
    
    const tbody = document.getElementById("db-table-body");
    tbody.innerHTML = "";
    
    pageRecords.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${c.id}</strong></td>
            <td>${c.region}</td>
            <td>${c.college} (${c.tier})</td>
            <td>${c.cluster}</td>
            <td>${c.skills.slice(0,2).concat(c.software_tools.slice(0,2)).join(', ')}</td>
            <td><strong>${c.score}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("db-count-text").innerText = `Showing ${totalRecords > 0 ? startIdx + 1 : 0}-${endIdx} of ${totalRecords.toLocaleString()} profiles`;
    document.getElementById("prev-page-btn").disabled = (dbPage === 1);
    document.getElementById("next-page-btn").disabled = (endIdx >= totalRecords);
}

// local PDF file reader
async function handlePdfUpload(file) {
    const statusDiv = document.getElementById("hero-upload-status") || document.getElementById("pdf-upload-status");
    if (statusDiv) {
        statusDiv.style.display = "block";
        statusDiv.innerText = "Reading PDF...";
    }
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(" ") + "\n";
        }
        
        if (text.trim()) {
            if (statusDiv) statusDiv.innerText = "PDF successfully extracted!";
            
            // Show parsing overlay modal
            const overlay = document.getElementById("scanner-overlay");
            overlay.classList.add("active");
            
            setTimeout(() => { document.getElementById("scan-step-1").className = "scanner-step-row completed"; }, 600);
            setTimeout(() => { document.getElementById("scan-step-2").className = "scanner-step-row completed"; }, 1200);
            setTimeout(() => { document.getElementById("scan-step-3").className = "scanner-step-row completed"; }, 1800);
            setTimeout(() => { 
                document.getElementById("scan-step-4").className = "scanner-step-row completed"; 
                overlay.classList.remove("active");
                
                const parsed = parseResumeText(text);
                
                // Set manual form refiner fields
                document.getElementById("form-region").value = parsed.region;
                document.getElementById("form-tier").value = parsed.tier;
                document.getElementById("form-degree").value = parsed.degree;
                document.getElementById("form-projects").value = parsed.projects;
                document.getElementById("form-internships").value = parsed.internships;
                document.getElementById("form-papers").value = parsed.research_papers;
                document.getElementById("form-competitions").value = parsed.competitions;
                
                // Clear tags
                document.querySelectorAll(".tag-pill").forEach(tag => tag.remove());
                parsed.skills.forEach(s => addTag("skills-input-wrapper", s, "tag-skill"));
                parsed.software_tools.forEach(sw => addTag("tools-input-wrapper", sw, "tag-sw"));
                parsed.certifications.forEach(c => addTag("certs-input-wrapper", c, "tag-cert"));
                
                // Build Highlight
                const hlBox = document.getElementById("highlighted-resume-box");
                let highlightedText = parsed.raw_text;
                parsed.skills.forEach(s => {
                    highlightedText = highlightedText.replace(new RegExp(s, 'gi'), `<span class="highlight-skill">${s}</span>`);
                });
                parsed.software_tools.forEach(sw => {
                    highlightedText = highlightedText.replace(new RegExp(sw, 'gi'), `<span class="highlight-software">${sw}</span>`);
                });
                parsed.certifications.forEach(c => {
                    highlightedText = highlightedText.replace(new RegExp(c, 'gi'), `<span class="highlight-cert">${c}</span>`);
                });
                hlBox.innerHTML = highlightedText;
                document.getElementById("highlighted-resume-container").classList.remove("hidden");
                
                showPane("manual-setup-panel");
                document.getElementById("resume-paste-box").value = parsed.raw_text;
            }, 2400);

        } else {
            if (statusDiv) statusDiv.innerText = "Error: PDF contains no readable text.";
        }
    } catch(e) {
        if (statusDiv) statusDiv.innerText = `Error: ${e.message}`;
    }
}

// Tag helpers
function addTag(wrapperId, text, className) {
    const wrapper = document.getElementById(wrapperId);
    const input = wrapper.querySelector("input");
    
    const existing = Array.from(wrapper.querySelectorAll(".tag-pill")).map(pill => pill.innerText.trim());
    if (existing.includes(text)) return;
    
    const pill = document.createElement("span");
    pill.className = `tag-pill ${className}`;
    pill.innerHTML = `${text} <i data-lucide="x" class="remove-tag-icon"></i>`;
    
    pill.querySelector("i").addEventListener("click", () => {
        pill.remove();
    });
    
    wrapper.insertBefore(pill, input);
    lucide.createIcons();
}

function setActiveDomainChip(domain) {
    document.querySelectorAll(".domain-chip").forEach(chip => {
        if(chip.getAttribute("data-domain") === domain) chip.classList.add("active");
        else chip.classList.remove("active");
    });
}

function loadPreset(presetName) {
    document.querySelectorAll(".tag-pill").forEach(pill => pill.remove());
    
    if (presetName === "entry-cad") {
        document.getElementById("form-region").value = "India";
        document.getElementById("form-tier").value = "Tier 3";
        document.getElementById("form-degree").value = "B.Tech/B.S.";
        document.getElementById("form-projects").value = 2;
        document.getElementById("form-internships").value = 0;
        document.getElementById("form-papers").value = 0;
        document.getElementById("form-competitions").value = 0;
        
        addTag("skills-input-wrapper", "Product Design", "tag-skill");
        addTag("skills-input-wrapper", "GD&T (Geometric Dimensioning & Tolerancing)", "tag-skill");
        addTag("skills-input-wrapper", "Sheet Metal Design", "tag-skill");
        
        addTag("tools-input-wrapper", "SolidWorks", "tag-sw");
        addTag("tools-input-wrapper", "AutoCAD", "tag-sw");
        addTag("certs-input-wrapper", "Certified SolidWorks Associate (CSWA)", "tag-cert");
        
        setActiveDomainChip("CAD Design");
    } 
    else if (presetName === "cae-mid") {
        document.getElementById("form-region").value = "India";
        document.getElementById("form-tier").value = "Tier 2";
        document.getElementById("form-degree").value = "M.Tech/M.S.";
        document.getElementById("form-projects").value = 4;
        document.getElementById("form-internships").value = 1;
        document.getElementById("form-papers").value = 1;
        document.getElementById("form-competitions").value = 1;
        
        addTag("skills-input-wrapper", "Finite Element Analysis (FEA)", "tag-skill");
        addTag("skills-input-wrapper", "Computational Fluid Dynamics (CFD)", "tag-skill");
        addTag("skills-input-wrapper", "Structural Analysis", "tag-skill");
        
        addTag("tools-input-wrapper", "ANSYS", "tag-sw");
        addTag("tools-input-wrapper", "MATLAB", "tag-sw");
        addTag("tools-input-wrapper", "Fluent", "tag-sw");
        addTag("certs-input-wrapper", "ANSYS Certified Professional", "tag-cert");
        
        setActiveDomainChip("CAE/Simulation");
    } 
    else if (presetName === "global-robotics") {
        document.getElementById("form-region").value = "Global";
        document.getElementById("form-tier").value = "Tier 1";
        document.getElementById("form-degree").value = "B.Tech/B.S.";
        document.getElementById("form-projects").value = 5;
        document.getElementById("form-internships").value = 2;
        document.getElementById("form-papers").value = 0;
        document.getElementById("form-competitions").value = 1;
        
        addTag("skills-input-wrapper", "Mechatronics", "tag-skill");
        addTag("skills-input-wrapper", "Control Systems", "tag-skill");
        addTag("skills-input-wrapper", "Robotics", "tag-skill");
        
        addTag("tools-input-wrapper", "MATLAB", "tag-sw");
        addTag("tools-input-wrapper", "Simulink", "tag-sw");
        addTag("tools-input-wrapper", "Python", "tag-sw");
        addTag("tools-input-wrapper", "Arduino", "tag-sw");
        addTag("certs-input-wrapper", "ASME Member / Cert", "tag-cert");
        
        setActiveDomainChip("Robotics/Mechatronics");
    }
}

// Particle Canvas backgrounds
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = activeTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 60; i++) particles.push(new Particle());
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function showPane(paneId) {
    document.querySelectorAll(".view-panel").forEach(p => p.classList.add("hidden"));
    document.getElementById(paneId).classList.remove("hidden");
    window.scrollTo(0,0);
}

function showDashboardView(viewId) {
    document.querySelectorAll(".dashboard-view-tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".dashboard-view-pane").forEach(pane => pane.classList.remove("active"));
    
    const targetTab = document.getElementById(viewId);
    if (targetTab) targetTab.classList.remove("hidden");
    const targetPane = document.getElementById(`view-${viewId}`);
    if (targetPane) targetPane.classList.add("active");
    
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        if(item.getAttribute("data-view") === viewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    if (viewId === "dashboard-learning") {
        initLearningHub();
        renderCourses();
    } else if (viewId === "dashboard-roadmaps") {
        initLearningHub();
        renderActiveRoadmap();
    } else if (viewId === "dashboard-videos") {
        renderVideoAcademy();
    }
}

function resolveSpecialtyDomains(matchedDomain) {
    const specialtyMap = {
        "CAD Design": ["Design Engineering", "Automotive", "Aerospace"],
        "CAE/Simulation": ["FEA", "CFD", "Thermal Engineering"],
        "Robotics/Mechatronics": ["Robotics", "Mechatronics", "Maintenance Engineering"],
        "Manufacturing/Operations": ["Manufacturing Engineering", "Production Engineering", "Quality Engineering", "Industrial Engineering"],
        "HVAC/Thermal": ["HVAC", "Thermal Engineering", "CFD"]
    };
    return specialtyMap[matchedDomain] || [matchedDomain];
}

function percentileStanding(scores, score, scaleFactor) {
    const countHigher = scores.filter(value => value > score).length;
    const percentile = Math.max(Math.round(((scores.length - countHigher) / scores.length) * 100), 1);
    const total = Math.round(scores.length * scaleFactor);
    return {
        rank: Math.min(total, Math.max(1, Math.round(countHigher * scaleFactor) + 1)),
        total,
        percentile,
        topShare: Math.min(100, Math.max(1, 101 - percentile))
    };
}

function ordinal(value) {
    const remainder100 = value % 100;
    if (remainder100 >= 11 && remainder100 <= 13) return `${value}th`;
    if (value % 10 === 1) return `${value}st`;
    if (value % 10 === 2) return `${value}nd`;
    if (value % 10 === 3) return `${value}rd`;
    return `${value}th`;
}

// Calculate ranks from the representative sample and scale counts to the 100K benchmark.
function getRanks(score, matchedDomain, region, tier) {
    const allScores = candidates.map(c => c.score).sort((a,b) => b-a);
    const nationalScores = candidates.filter(c => c.region === region).map(c => c.score).sort((a,b) => b-a);
    const tierScores = candidates.filter(c => c.region === region && c.tier === tier).map(c => c.score).sort((a,b) => b-a);
    const domains = resolveSpecialtyDomains(matchedDomain);
    const clusterScores = candidates.filter(c => domains.includes(c.cluster)).map(c => c.score).sort((a,b) => b-a);
    const scaleFactor = 100000 / Math.max(allScores.length, 1);
    const global = percentileStanding(allScores, score, scaleFactor);
    const national = percentileStanding(nationalScores, score, scaleFactor);
    const tierGroup = percentileStanding(tierScores, score, scaleFactor);
    const specialty = percentileStanding(clusterScores.length ? clusterScores : allScores, score, scaleFactor);

    return {
        globalRank: global.rank, globalTotal: global.total, globalPercentile: global.percentile, globalTopShare: global.topShare,
        indiaRank: national.rank, indiaTotal: national.total, indiaPercentile: national.percentile, indiaTopShare: national.topShare,
        tierRank: tierGroup.rank, tierTotal: tierGroup.total, tierPercentile: tierGroup.percentile, tierTopShare: tierGroup.topShare,
        clusterRank: specialty.rank, clusterTotal: specialty.total, clusterPercentile: specialty.percentile, clusterTopShare: specialty.topShare
    };
}

function drawBenchmarkDistribution(score, profile) {
    const domains = resolveSpecialtyDomains(profile.cluster);
    const cohort = candidates.filter(candidate => domains.includes(candidate.cluster));
    const effectiveCohort = cohort.length ? cohort : candidates;
    const sorted = effectiveCohort.map(candidate => candidate.score).sort((a, b) => a - b);
    const scaleFactor = 100000 / Math.max(candidates.length, 1);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const top10Index = Math.max(0, Math.floor(sorted.length * 0.9));
    const top10Cutoff = sorted[top10Index] || 0;
    const gap = Math.max(0, Math.round((top10Cutoff - score) * 10) / 10);

    document.getElementById("benchmark-cohort-size").innerText = `${Math.round(effectiveCohort.length * scaleFactor).toLocaleString()} profiles`;
    document.getElementById("benchmark-cohort-median").innerText = `${median.toFixed(1)} score`;
    document.getElementById("benchmark-top10-cutoff").innerText = `${top10Cutoff.toFixed(1)} score`;
    document.getElementById("benchmark-next-move").innerText = gap > 0 ? `+${gap.toFixed(1)} points to top 10%` : "You are inside the top 10%";

    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
    Plotly.newPlot("plotly-benchmark-distribution", [{
        x: sorted, type: "histogram", nbinsx: 24, histnorm: "percent",
        marker: { color: "rgba(56,189,248,0.62)", line: { color: "rgba(56,189,248,0.95)", width: 1 } },
        hovertemplate: "Score %{x}<br>% of cohort %{y:.1f}%<extra></extra>"
    }], {
        margin: { l: 42, r: 16, t: 18, b: 42 },
        paper_bgcolor: "transparent", plot_bgcolor: "transparent", font: { color: textTheme, size: 11 },
        xaxis: { title: "Career readiness score", gridcolor: gridTheme, range: [0, 100] },
        yaxis: { title: "% of cohort", gridcolor: gridTheme },
        shapes: [
            { type: "line", x0: score, x1: score, y0: 0, y1: 1, yref: "paper", line: { color: "#f59e0b", width: 3 } },
            { type: "line", x0: top10Cutoff, x1: top10Cutoff, y0: 0, y1: 1, yref: "paper", line: { color: "#10b981", width: 2, dash: "dot" } }
        ],
        annotations: [
            { x: score, y: 1, yref: "paper", text: "You", showarrow: false, yshift: 10, font: { color: "#f59e0b", size: 11 } },
            { x: top10Cutoff, y: 1, yref: "paper", text: "Top 10%", showarrow: false, yshift: -12, font: { color: "#10b981", size: 10 } }
        ],
        showlegend: false, bargap: 0.08
    }, { responsive: true, displayModeBar: false });
}

function buildScenario(profile, additions) {
    const projectedProfile = {
        ...profile,
        projects: Math.min(10, profile.projects + additions.projects),
        internships: Math.min(5, profile.internships + additions.internships),
        certifications: [...profile.certifications]
    };
    for (let index = 0; index < additions.certs; index++) {
        projectedProfile.certifications.push(`Planned certification ${index + 1}`);
    }
    const projectedProficiency = Object.fromEntries(
        Object.entries(softwareProficiency).map(([tool, value]) => [tool, Math.min(100, value + additions.software)])
    );
    const scores = calculateScores(projectedProfile, projectedProficiency);
    return { profile: projectedProfile, scores };
}

function readScenarioInputs() {
    return {
        projects: parseInt(document.getElementById("scenario-projects")?.value || "0"),
        internships: parseInt(document.getElementById("scenario-internships")?.value || "0"),
        certs: parseInt(document.getElementById("scenario-certs")?.value || "0"),
        software: parseInt(document.getElementById("scenario-software")?.value || "0")
    };
}

function renderCareerMoveScenario() {
    if (!targetProfile || !document.getElementById("scenario-score")) return;
    const additions = readScenarioInputs();
    const baseline = calculateScores(targetProfile);
    const projected = buildScenario(targetProfile, additions);
    const ranks = getRanks(projected.scores.readiness, projected.profile.cluster, projected.profile.region, projected.profile.tier);
    const gain = Math.round((projected.scores.readiness - baseline.readiness) * 10) / 10;

    document.getElementById("scenario-projects-value").textContent = `+${additions.projects}`;
    document.getElementById("scenario-internships-value").textContent = `+${additions.internships}`;
    document.getElementById("scenario-certs-value").textContent = `+${additions.certs}`;
    document.getElementById("scenario-software-value").textContent = `+${additions.software}%`;
    document.getElementById("scenario-score").textContent = projected.scores.readiness.toFixed(1);
    document.getElementById("scenario-score-gain").textContent = gain > 0 ? `+${gain.toFixed(1)} readiness points` : "No change";
    document.getElementById("scenario-global-rank").textContent = `#${ranks.globalRank.toLocaleString()}`;
    document.getElementById("scenario-specialty-rank").textContent = `#${ranks.clusterRank.toLocaleString()}`;

    const singleMoves = [
        { label: "Complete one validated portfolio project", additions: { projects: 1, internships: 0, certs: 0, software: 0 } },
        { label: "Complete one relevant internship", additions: { projects: 0, internships: 1, certs: 0, software: 0 } },
        { label: "Earn one relevant certification", additions: { projects: 0, internships: 0, certs: 1, software: 0 } },
        { label: "Raise software proficiency by 10%", additions: { projects: 0, internships: 0, certs: 0, software: 10 } }
    ].map(move => ({ ...move, gain: buildScenario(targetProfile, move.additions).scores.readiness - baseline.readiness }))
      .sort((a, b) => b.gain - a.gain);
    const best = singleMoves[0];
    document.getElementById("scenario-best-move").textContent = `${best.label} (+${best.gain.toFixed(1)})`;
}

function initCareerMoveSimulator() {
    ["scenario-projects", "scenario-internships", "scenario-certs", "scenario-software"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener("input", renderCareerMoveScenario);
    });
    const reset = document.getElementById("scenario-reset-btn");
    if (reset) {
        reset.addEventListener("click", () => {
            ["scenario-projects", "scenario-internships", "scenario-certs", "scenario-software"].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = 0;
            });
            renderCareerMoveScenario();
        });
    }
}

// App initial setup
document.addEventListener("DOMContentLoaded", () => {
    candidates = generateDataset();
    initParticles();
    lucide.createIcons();
    
    // Sliders build
    buildSoftwareSliders();
    
    // Technical Accordions
    populateQuestionBanks();
    initCareerMoveSimulator();

    // Theme toggle listener
    const themeBtn = document.getElementById("theme-toggle-btn");
    themeBtn.addEventListener("click", () => {
        const html = document.documentElement;
        if (html.getAttribute("data-theme") === "dark") {
            html.setAttribute("data-theme", "light");
            activeTheme = 'light';
            document.getElementById("theme-icon-sun").classList.add("hidden");
            document.getElementById("theme-icon-moon").classList.remove("hidden");
        } else {
            html.setAttribute("data-theme", "dark");
            activeTheme = 'dark';
            document.getElementById("theme-icon-sun").classList.remove("hidden");
            document.getElementById("theme-icon-moon").classList.add("hidden");
        }
        
        if(targetProfile) {
            const scores = calculateScores(targetProfile);
            drawGaugeChart(scores.readiness);
            drawRadarChart();
            drawHeatmapChart();
            drawSalaryChart(scores.readiness);
            drawBenchmarkDistribution(scores.readiness, targetProfile);
        }
    });

    // View Routing
    document.querySelectorAll(".nav-item").forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                showPane("landing-page-container");
                setTimeout(() => {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                    }
                }, 50);
            }
        });
    });

    document.getElementById("nav-cta-btn").addEventListener("click", () => {
        const saved = sessionStorage.getItem("userProfile");
        if(saved) {
            buildDashboard(JSON.parse(saved));
        } else {
            showPane("manual-setup-panel");
        }
    });
    
    document.getElementById("hero-get-started-btn").addEventListener("click", () => {
        showPane("manual-setup-panel");
    });
    document.getElementById("hero-manual-btn").addEventListener("click", () => {
        showPane("manual-setup-panel");
    });
    document.getElementById("setup-back-btn").addEventListener("click", () => {
        showPane("landing-page-container");
    });
    document.querySelectorAll(".launch-app-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            showPane("manual-setup-panel");
        });
    });

    // Preset chips
    document.querySelectorAll(".preset-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            loadPreset(chip.getAttribute("data-preset"));
        });
    });

    // Domain selector chips
    document.querySelectorAll(".domain-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".domain-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
        });
    });

    // PDF parse file upload
    const dropzone = document.getElementById("upload-dropzone");
    const fileInput = document.getElementById("hero-file-input");
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--primary)";
    });
    dropzone.addEventListener("dragleave", () => {
        dropzone.style.borderColor = "var(--border-color)";
    });
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--border-color)";
        if(e.dataTransfer.files.length > 0) {
            handlePdfUpload(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener("change", () => {
        if(fileInput.files.length > 0) {
            handlePdfUpload(fileInput.files[0]);
        }
    });

    // Parse button text
    document.getElementById("btn-parse-resume").addEventListener("click", () => {
        const text = document.getElementById("resume-paste-box").value;
        if (!text.trim()) return;
        const parsed = parseResumeText(text);
        
        document.getElementById("form-region").value = parsed.region;
        document.getElementById("form-tier").value = parsed.tier;
        document.getElementById("form-degree").value = parsed.degree;
        document.getElementById("form-projects").value = parsed.projects;
        document.getElementById("form-internships").value = parsed.internships;
        document.getElementById("form-papers").value = parsed.research_papers;
        document.getElementById("form-competitions").value = parsed.competitions;
        
        document.querySelectorAll(".tag-pill").forEach(pill => pill.remove());
        parsed.skills.forEach(s => addTag("skills-input-wrapper", s, "tag-skill"));
        parsed.software_tools.forEach(sw => addTag("tools-input-wrapper", sw, "tag-sw"));
        parsed.certifications.forEach(c => addTag("certs-input-wrapper", c, "tag-cert"));
    });

    // Tags keys setup
    function setupTagInput(inputId, wrapperId, className) {
        const input = document.getElementById(inputId);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const text = input.value.trim();
                if(text) {
                    addTag(wrapperId, text, className);
                    input.value = "";
                }
            }
        });
    }
    setupTagInput("skills-text-input", "skills-input-wrapper", "tag-skill");
    setupTagInput("tools-text-input", "tools-input-wrapper", "tag-sw");
    setupTagInput("certs-text-input", "certs-input-wrapper", "tag-cert");

    // Run analysis button
    document.getElementById("btn-run-analysis").addEventListener("click", () => {
        const skills = Array.from(document.querySelectorAll("#skills-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        const software = Array.from(document.querySelectorAll("#tools-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        const certs = Array.from(document.querySelectorAll("#certs-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        
        const activeDomainChip = document.querySelector(".domain-chip.active");
        const domain = activeDomainChip ? activeDomainChip.getAttribute("data-domain") : "CAD Design";

        const profile = {
            id: `Candidate #ME-${Math.floor(10000 + Math.random() * 90000)}`,
            region: document.getElementById("form-region").value,
            tier: document.getElementById("form-tier").value,
            degree: document.getElementById("form-degree").value,
            projects: parseInt(document.getElementById("form-projects").value) || 0,
            internships: parseInt(document.getElementById("form-internships").value) || 0,
            research_papers: parseInt(document.getElementById("form-papers").value) || 0,
            competitions: parseInt(document.getElementById("form-competitions").value) || 0,
            skills: skills,
            software_tools: software,
            certifications: certs,
            cluster: domain
        };
        
        buildDashboard(profile);
    });

    // Profile Save details
    document.getElementById("profile-save-btn").addEventListener("click", () => {
        const profile = {
            id: targetProfile?.id || "Candidate #ME-49023",
            region: document.getElementById("profile-region").value,
            tier: document.getElementById("profile-tier").value,
            degree: document.getElementById("profile-degree").value,
            projects: parseInt(document.getElementById("profile-projects").value) || 0,
            internships: parseInt(document.getElementById("profile-internships").value) || 0,
            research_papers: parseInt(document.getElementById("profile-papers").value) || 0,
            competitions: parseInt(document.getElementById("profile-competitions").value) || 0,
            skills: targetProfile?.skills || [],
            software_tools: targetProfile?.software_tools || [],
            certifications: targetProfile?.certifications || [],
            cluster: targetProfile?.cluster || "Design Engineering"
        };
        
        userXP += 150;
        localStorage.setItem("userXP", userXP);
        buildDashboard(profile);
    });

    // Sidebar navigation clicks
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const view = item.getAttribute("data-view");
            if(view) showDashboardView(view);
        });
    });

    document.getElementById("sidebar-logout-btn").addEventListener("click", () => {
        showPane("landing-page-container");
    });

    // PDF Print and CSV Export triggers
    document.getElementById("overview-btn-print").addEventListener("click", () => {
        window.print();
    });
    
    document.getElementById("overview-btn-csv").addEventListener("click", () => {
        exportCompetencyMatrixCsv();
    });

    // Portfolio Generator click
    const genPortfolioBtn = document.getElementById("btn-generate-portfolio-html");
    if (genPortfolioBtn) {
        genPortfolioBtn.addEventListener("click", () => {
            if(targetProfile) generatePortfolioHtml(targetProfile);
        });
    }

    // Database explorer search
    document.getElementById("db-search-input").addEventListener("input", () => {
        dbPage = 1;
        renderDatabaseTable();
    });
    document.getElementById("db-region-filter").addEventListener("change", () => {
        dbPage = 1;
        renderDatabaseTable();
    });
    document.getElementById("db-cluster-filter").addEventListener("change", () => {
        dbPage = 1;
        renderDatabaseTable();
    });
    
    document.getElementById("prev-page-btn").addEventListener("click", () => {
        if(dbPage > 1) {
            dbPage--;
            renderDatabaseTable();
        }
    });
    document.getElementById("next-page-btn").addEventListener("click", () => {
        dbPage++;
        renderDatabaseTable();
    });

    // Learning Hub Filters
    document.getElementById("learn-search-input").addEventListener("input", renderCourses);
    document.getElementById("learn-category-filter").addEventListener("change", renderCourses);
    document.getElementById("learn-difficulty-filter").addEventListener("change", renderCourses);
    document.getElementById("learn-btn-favorites").addEventListener("click", () => {
        const btn = document.getElementById("learn-btn-favorites");
        btn.classList.toggle("active");
        renderCourses();
    });

    // Roadmap selectors
    document.getElementById("roadmap-selector").addEventListener("change", renderActiveRoadmap);

    // Study plan downloader
    document.getElementById("btn-download-study-plan").addEventListener("click", downloadStudyPlan);
});

// ==========================================
// LEARNING HUB & ROADMAPS DATABASE & ENGINE
// ==========================================

// Concept visualization videos attached to specific courses.
// In the single-file builds the compile scripts inline these files as base64 data URIs;
// when served with the repo present, the relative MP4 paths are used instead.
const MP4_VIDEOS = {
    "cad-lewis-gear-bending": "manim_courses/renders/cad-lewis-gear-bending.mp4",
    "cae-stiffness-matrix": "manim_courses/renders/cae-stiffness-matrix.mp4",
    "robotics-pid-control": "manim_courses/renders/robotics-pid-control.mp4",
    "manufacturing-cpk-capability": "manim_courses/renders/manufacturing-cpk-capability.mp4",
    "hvac-sensible-latent-loads": "manim_courses/renders/hvac-sensible-latent-loads.mp4",
    "fluid-bernoulli-conservation": "manim_courses/renders/fluid-bernoulli-conservation.mp4",
    "thermo-carnot-cycle": "manim_courses/renders/thermo-carnot-cycle.mp4",
    "som-mohrs-circle": "manim_courses/renders/som-mohrs-circle.mp4",
    "tom-four-bar-linkage": "manim_courses/renders/tom-four-bar-linkage.mp4",
    "cnc-gcode-toolpath": "manim_courses/renders/cnc-gcode-toolpath.mp4",
    "calculus-derivative-rate": "manim_courses/renders/calculus-derivative-rate.mp4",
    "linear-algebra-eigenvalues": "manim_courses/renders/linear-algebra-eigenvalues.mp4",
    "diff-eq-spring-damper": "manim_courses/renders/diff-eq-spring-damper.mp4",
    "mechanics-truss-equilibrium": "manim_courses/renders/mechanics-truss-equilibrium.mp4",
    "materials-iron-carbon": "manim_courses/renders/materials-iron-carbon.mp4",
    "control-bode-plot": "manim_courses/renders/control-bode-plot.mp4",
    "simulation-von-mises": "manim_courses/renders/simulation-von-mises.mp4",
    "additive-3d-printing": "manim_courses/renders/additive-3d-printing.mp4"
};

const VIDEO_LESSONS = {
    "Machine Design": { src: MP4_VIDEOS["cad-lewis-gear-bending"], label: "Lewis Gear Tooth Bending", caption: "Why face width, module, and form factor control bending stress." },
    "Finite Element Analysis": { src: MP4_VIDEOS["cae-stiffness-matrix"], label: "The Finite Element Balance: K·u = f", caption: "Stiffness, displacement, and applied force in FEA." },
    "Robotics": { src: MP4_VIDEOS["robotics-pid-control"], label: "PID Control Terms", caption: "Proportional, integral, and derivative actions on a step response." },
    "Six Sigma": { src: MP4_VIDEOS["manufacturing-cpk-capability"], label: "Cp and Cpk Process Capability", caption: "Why centered, narrow distributions pass capability." },
    "Heat Transfer": { src: MP4_VIDEOS["hvac-sensible-latent-loads"], label: "Sensible vs Latent Loads", caption: "Temperature and humidity are separate HVAC jobs." },
    "Fluid Mechanics": { src: MP4_VIDEOS["fluid-bernoulli-conservation"], label: "Bernoulli Energy Conservation", caption: "Static pressure drops when flow velocity accelerates through constriction." },
    "Thermodynamics": { src: MP4_VIDEOS["thermo-carnot-cycle"], label: "Carnot Engine Efficiency", caption: "Ideal cycle thermal limit bounded strictly by reservoir temperatures." },
    "Strength of Materials": { src: MP4_VIDEOS["som-mohrs-circle"], label: "Mohr's Circle Stress Transformation", caption: "Visualizing principal stresses sigma_1, sigma_2 and maximum shear radius." },
    "Theory of Machines": { src: MP4_VIDEOS["tom-four-bar-linkage"], label: "Four-Bar Kinematics & Grashof Rule", caption: "Why s + l <= p + q guarantees continuous crank drive motion." },
    "CNC Programming": { src: MP4_VIDEOS["cnc-gcode-toolpath"], label: "G00 Rapid vs G01 Feed Moves", caption: "Comparing non-cutting positioning against controlled cutting toolpaths." },
    "Calculus": { src: MP4_VIDEOS["calculus-derivative-rate"], label: "Derivatives & Velocity v(t)", caption: "Instantaneous rate of change and tangent slope." },
    "Linear Algebra": { src: MP4_VIDEOS["linear-algebra-eigenvalues"], label: "Eigenvalues & Vibration Modes", caption: "Solving natural resonance frequencies |K - w^2 M| = 0." },
    "Differential Equations": { src: MP4_VIDEOS["diff-eq-spring-damper"], label: "Mass-Spring-Damper Dynamics", caption: "Underdamped vs critically damped ODE step response." },
    "Engineering Mechanics": { src: MP4_VIDEOS["mechanics-truss-equilibrium"], label: "Truss Joint Equilibrium", caption: "Concurrent force balancing for member tension and compression." },
    "Materials Science": { src: MP4_VIDEOS["materials-iron-carbon"], label: "Iron-Carbon Phase Diagram", caption: "Austenite, pearlite, and the 727°C eutectoid transformation." },
    "Mechatronics": { src: MP4_VIDEOS["control-bode-plot"], label: "Bode Plot Margins", caption: "Gain crossover frequency and closed-loop phase margin." },
    "ANSYS Mechanical": { src: MP4_VIDEOS["simulation-von-mises"], label: "Von Mises Yield Criterion", caption: "Stress concentration notch risers and equivalent yield limit." },
    "Additive Manufacturing": { src: MP4_VIDEOS["additive-3d-printing"], label: "FDM Extrusion & Layer Fusion", caption: "Nozzle extrusion, layer height, and Z-axis tensile adhesion." }
};

const VIDEO_ACADEMY_REGISTRY = [
    {
        id: "cad-lewis-gear-bending",
        title: "CAD Design: Lewis Gear Tooth Bending",
        category: "CAD & Design",
        src: MP4_VIDEOS["cad-lewis-gear-bending"],
        description: "A Manim lesson explaining tangential load, module, face width, and Lewis form factor for gear tooth bending.",
        takeaway: "Design action: reduce bending stress before the model reaches manufacturing.",
        tags: ["CAD", "gear design", "bending stress"]
    },
    {
        id: "cae-stiffness-matrix",
        title: "CAE Simulation: Stiffness Matrix K·u = f",
        category: "CAE & Simulation",
        src: MP4_VIDEOS["cae-stiffness-matrix"],
        description: "A Manim lesson explaining the K u equals f relationship used in finite element analysis.",
        takeaway: "Simulation action: check loads, constraints, and mesh before trusting colors.",
        tags: ["FEA", "CAE", "stiffness matrix"]
    },
    {
        id: "robotics-pid-control",
        title: "Robotics: PID Control Terms",
        category: "Automation & Robotics",
        src: MP4_VIDEOS["robotics-pid-control"],
        description: "A Manim lesson showing how proportional, integral, and derivative terms shape closed-loop step response.",
        takeaway: "Control action: tune response speed without letting oscillation dominate.",
        tags: ["robotics", "PID", "control systems"]
    },
    {
        id: "manufacturing-cpk-capability",
        title: "Manufacturing: Cp and Cpk Process Capability",
        category: "Manufacturing & Materials",
        src: MP4_VIDEOS["manufacturing-cpk-capability"],
        description: "A Manim lesson explaining specification limits, process spread, centering, Cp, and Cpk.",
        takeaway: "Quality action: reduce spread and recenter before defects reach customers.",
        tags: ["six sigma", "manufacturing", "process capability"]
    },
    {
        id: "hvac-sensible-latent-loads",
        title: "HVAC Thermal: Sensible vs Latent Loads",
        category: "Thermal & Fluids",
        src: MP4_VIDEOS["hvac-sensible-latent-loads"],
        description: "A Manim lesson explaining temperature load, moisture load, and how HVAC engineers separate the two.",
        takeaway: "HVAC action: size for heat and humidity, not temperature alone.",
        tags: ["HVAC", "thermal", "heat transfer"]
    },
    {
        id: "fluid-bernoulli-conservation",
        title: "Fluid Mechanics: Bernoulli Energy Conservation",
        category: "Thermal & Fluids",
        src: MP4_VIDEOS["fluid-bernoulli-conservation"],
        description: "A Manim lesson explaining pressure head, velocity head, and constriction flow physics.",
        takeaway: "Fluid action: high velocity creates low static pressure region.",
        tags: ["fluid mechanics", "Bernoulli", "pipe flow"]
    },
    {
        id: "thermo-carnot-cycle",
        title: "Thermodynamics: Carnot Heat Engine Efficiency",
        category: "Thermal & Fluids",
        src: MP4_VIDEOS["thermo-carnot-cycle"],
        description: "A Manim lesson explaining isothermal and adiabatic processes on P-V coordinates.",
        takeaway: "Thermal action: reduce rejection temperature TL to maximize engine output.",
        tags: ["thermodynamics", "Carnot", "power cycles"]
    },
    {
        id: "som-mohrs-circle",
        title: "Strength of Materials: Mohr's Circle Stress Transformation",
        category: "Core Mechanical Engineering",
        src: MP4_VIDEOS["som-mohrs-circle"],
        description: "A Manim lesson showing principal stresses sigma_1, sigma_2 and maximum shear stress tau_max.",
        takeaway: "Stress action: evaluate principal angles before yielding occurs.",
        tags: ["strength of materials", "Mohr's circle", "stress analysis"]
    },
    {
        id: "tom-four-bar-linkage",
        title: "Theory of Machines: Four-Bar Linkage Kinematics",
        category: "Core Mechanical Engineering",
        src: MP4_VIDEOS["tom-four-bar-linkage"],
        description: "A Manim lesson illustrating Grashof's rule s + l <= p + q and crank-rocker motion.",
        takeaway: "Kinematic action: select link ratios for continuous motor drive input.",
        tags: ["theory of machines", "kinematics", "linkages"]
    },
    {
        id: "cnc-gcode-toolpath",
        title: "CNC Programming: G00 vs G01 Cutting Toolpaths",
        category: "Manufacturing & Materials",
        src: MP4_VIDEOS["cnc-gcode-toolpath"],
        description: "A Manim lesson comparing G00 rapid positioning with G01 linear interpolation cutting feeds.",
        takeaway: "CNC action: clear workpiece boundaries with G00 before engaging G01.",
        tags: ["CNC", "manufacturing", "G-code"]
    },
    {
        id: "calculus-derivative-rate",
        title: "Calculus: Derivatives & Instantaneous Velocity",
        category: "Mathematics",
        src: MP4_VIDEOS["calculus-derivative-rate"],
        description: "A Manim lesson explaining how the slope of position curves yields velocity v(t) = dx/dt.",
        takeaway: "Calculus action: differentiate position functions to predict peak velocity.",
        tags: ["calculus", "mathematics", "derivatives"]
    },
    {
        id: "linear-algebra-eigenvalues",
        title: "Linear Algebra: Eigenvalues & Vibration Modes",
        category: "Mathematics",
        src: MP4_VIDEOS["linear-algebra-eigenvalues"],
        description: "A Manim lesson connecting matrix eigenvalue decomposition to natural resonance frequencies.",
        takeaway: "Linear algebra action: check det(K - w^2 M) = 0 to avoid resonant destruction.",
        tags: ["linear algebra", "eigenvalues", "vibrations"]
    },
    {
        id: "diff-eq-spring-damper",
        title: "Differential Equations: Mass-Spring-Damper Dynamics",
        category: "Mathematics",
        src: MP4_VIDEOS["diff-eq-spring-damper"],
        description: "A Manim lesson showing 2nd order ODE responses for underdamped and critically damped systems.",
        takeaway: "ODE action: tune damping c to return to equilibrium rapidly without ringing.",
        tags: ["differential equations", "dynamics", "damping"]
    },
    {
        id: "mechanics-truss-equilibrium",
        title: "Engineering Mechanics: Truss Joint Static Equilibrium",
        category: "Core Mechanical Engineering",
        src: MP4_VIDEOS["mechanics-truss-equilibrium"],
        description: "A Manim lesson demonstrating vector resolution and member force balancing at concurrent pin joints.",
        takeaway: "Mechanics action: balance pin joint vectors to size structural member cross-sections.",
        tags: ["statics", "trusses", "equilibrium"]
    },
    {
        id: "materials-iron-carbon",
        title: "Materials Science: Iron-Carbon Phase Diagram",
        category: "Manufacturing & Materials",
        src: MP4_VIDEOS["materials-iron-carbon"],
        description: "A Manim lesson illustrating austenite, pearlite, ferrite, and the 727 deg C eutectoid transition.",
        takeaway: "Materials action: heat treat above 727 C to control hardness and grain growth.",
        tags: ["materials science", "heat treatment", "phase diagram"]
    },
    {
        id: "control-bode-plot",
        title: "Control Systems: Bode Plot Gain & Phase Margins",
        category: "Automation & Robotics",
        src: MP4_VIDEOS["control-bode-plot"],
        description: "A Manim lesson showing frequency magnitude response, gain crossover, and closed-loop phase margins.",
        takeaway: "Control action: maintain PM > 45 deg to prevent loop instability.",
        tags: ["control systems", "bode plot", "mechatronics"]
    },
    {
        id: "simulation-von-mises",
        title: "ANSYS / Simulation: Von Mises Yield Criterion",
        category: "CAE & Simulation",
        src: MP4_VIDEOS["simulation-von-mises"],
        description: "A Manim lesson explaining stress concentration risers and equivalent von Mises yield limits.",
        takeaway: "FEA action: add fillets at geometric notches to relieve von Mises stress spikes.",
        tags: ["FEA", "simulation", "von Mises"]
    },
    {
        id: "additive-3d-printing",
        title: "Additive Manufacturing: FDM Extrusion & Layer Fusion",
        category: "Manufacturing & Materials",
        src: MP4_VIDEOS["additive-3d-printing"],
        description: "A Manim lesson demonstrating layer height, nozzle extrusion, and Z-axis interlayer bonding.",
        takeaway: "3D printing action: align functional load directions perpendicular to print layer lines.",
        tags: ["3D printing", "additive manufacturing", "FDM"]
    }
];

const VIDEO_COURSE_TRACKS = [
    {
        id: "design-foundations", title: "Mechanical Design Foundations", level: "Beginner → Intermediate", duration: "45 min",
        description: "Statics, stress transformation, mechanisms, and gear design in one coherent visual sequence.",
        lessons: ["mechanics-truss-equilibrium", "som-mohrs-circle", "tom-four-bar-linkage", "cad-lewis-gear-bending"]
    },
    {
        id: "simulation-engineer", title: "Simulation Engineer Starter", level: "Intermediate", duration: "50 min",
        description: "Build the mathematics and physical judgment required to interpret FEA results responsibly.",
        lessons: ["linear-algebra-eigenvalues", "diff-eq-spring-damper", "cae-stiffness-matrix", "simulation-von-mises"]
    },
    {
        id: "thermal-fluids", title: "Thermal & Fluids Essentials", level: "Beginner → Intermediate", duration: "40 min",
        description: "Connect thermodynamic limits, fluid energy conservation, and practical HVAC load behavior.",
        lessons: ["thermo-carnot-cycle", "fluid-bernoulli-conservation", "hvac-sensible-latent-loads"]
    },
    {
        id: "smart-manufacturing", title: "Smart Manufacturing Core", level: "Intermediate", duration: "50 min",
        description: "Understand materials, toolpaths, additive processes, and capability-driven quality control.",
        lessons: ["materials-iron-carbon", "cnc-gcode-toolpath", "additive-3d-printing", "manufacturing-cpk-capability"]
    },
    {
        id: "controls-robotics", title: "Controls & Robotics Visual Track", level: "Intermediate", duration: "45 min",
        description: "Move from dynamic-system behavior to PID tuning and frequency-domain stability.",
        lessons: ["diff-eq-spring-damper", "robotics-pid-control", "control-bode-plot", "tom-four-bar-linkage"]
    }
];

let completedVideoLessons = JSON.parse(localStorage.getItem("completedVideoLessons") || "[]");
let activeVideoCourseId = localStorage.getItem("activeVideoCourseId") || null;
let currentVideoLessonId = "cad-lewis-gear-bending";

function videoCourseProgress(track) {
    const completed = track.lessons.filter(id => completedVideoLessons.includes(id)).length;
    return { completed, total: track.lessons.length, percent: Math.round(completed / track.lessons.length * 100) };
}

function renderVideoCourseTracks() {
    const grid = document.getElementById("video-course-track-grid");
    const queue = document.getElementById("video-course-queue");
    if (!grid || !queue) return;

    const uniqueCompleted = VIDEO_ACADEMY_REGISTRY.filter(item => completedVideoLessons.includes(item.id)).length;
    const academyPercent = Math.round(uniqueCompleted / VIDEO_ACADEMY_REGISTRY.length * 100);
    document.getElementById("video-academy-progress-label").textContent = `${uniqueCompleted} / ${VIDEO_ACADEMY_REGISTRY.length} lessons`;
    document.getElementById("video-academy-progress-bar").style.width = `${academyPercent}%`;

    grid.innerHTML = VIDEO_COURSE_TRACKS.map(track => {
        const progress = videoCourseProgress(track);
        const isActive = activeVideoCourseId === track.id;
        return `
            <article class="video-course-track ${isActive ? 'active' : ''}">
                <div class="video-course-track-top">
                    <span class="video-course-level">${track.level}</span>
                    <span>${track.duration}</span>
                </div>
                <h4>${track.title}</h4>
                <p>${track.description}</p>
                <div class="video-course-meta"><span>${progress.completed}/${progress.total} modules</span><strong>${progress.percent}%</strong></div>
                <div class="video-course-progress"><div style="width:${progress.percent}%"></div></div>
                <button class="btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="startVideoCourse('${track.id}')">
                    <i data-lucide="${progress.completed ? 'play-circle' : 'book-open'}"></i>
                    ${progress.completed === progress.total ? 'Review course' : progress.completed ? 'Continue course' : 'Start course'}
                </button>
            </article>`;
    }).join("");

    const activeTrack = VIDEO_COURSE_TRACKS.find(track => track.id === activeVideoCourseId);
    if (!activeTrack) {
        queue.classList.add("hidden");
        queue.innerHTML = "";
    } else {
        queue.classList.remove("hidden");
        queue.innerHTML = `
            <div class="video-course-queue-heading">
                <div><span>Active course</span><h4>${activeTrack.title}</h4></div>
                <strong>${videoCourseProgress(activeTrack).percent}% complete</strong>
            </div>
            <div class="video-course-modules">
                ${activeTrack.lessons.map((lessonId, index) => {
                    const lesson = VIDEO_ACADEMY_REGISTRY.find(item => item.id === lessonId);
                    const complete = completedVideoLessons.includes(lessonId);
                    return `<button class="video-course-module ${complete ? 'complete' : ''} ${currentVideoLessonId === lessonId ? 'current' : ''}" onclick="selectTheaterVideo('${lessonId}')">
                        <span class="module-index">${complete ? '✓' : index + 1}</span>
                        <span><b>${lesson.title}</b><small>${lesson.category} · Manim HD</small></span>
                        <i data-lucide="play"></i>
                    </button>`;
                }).join("")}
            </div>`;
    }

    updateVideoCompleteButton();
    if (window.lucide) lucide.createIcons();
}

function startVideoCourse(trackId) {
    const track = VIDEO_COURSE_TRACKS.find(item => item.id === trackId);
    if (!track) return;
    activeVideoCourseId = trackId;
    localStorage.setItem("activeVideoCourseId", trackId);
    const nextLesson = track.lessons.find(id => !completedVideoLessons.includes(id)) || track.lessons[0];
    renderVideoCourseTracks();
    selectTheaterVideo(nextLesson);
}

function toggleVideoLessonComplete(lessonId) {
    const existingIndex = completedVideoLessons.indexOf(lessonId);
    if (existingIndex >= 0) completedVideoLessons.splice(existingIndex, 1);
    else completedVideoLessons.push(lessonId);
    localStorage.setItem("completedVideoLessons", JSON.stringify(completedVideoLessons));
    renderVideoCourseTracks();
}

function updateVideoCompleteButton() {
    const button = document.getElementById("video-complete-btn");
    if (!button) return;
    const complete = completedVideoLessons.includes(currentVideoLessonId);
    button.classList.toggle("btn-success", !complete);
    button.classList.toggle("btn-secondary", complete);
    button.innerHTML = `<i data-lucide="${complete ? 'check-circle-2' : 'check-circle'}"></i> ${complete ? 'Lesson Completed' : 'Mark Lesson Complete'}`;
    button.onclick = () => toggleVideoLessonComplete(currentVideoLessonId);
}

// -------------------------------------------------------------------------
// 1,000 Mathematics Shorts — deterministic 20-second visual micro-videos
// -------------------------------------------------------------------------
const MATH_SHORT_TOPICS = [
    ["ratios", "Arithmetic & Ratios"], ["percent", "Percentages"], ["linear", "Linear Equations"],
    ["quadratic", "Quadratic Equations"], ["sequence", "Sequences"], ["coordinate", "Coordinate Geometry"],
    ["geometry", "Plane Geometry"], ["trigonometry", "Trigonometry"], ["vectors", "Vectors"],
    ["matrices", "Matrices"], ["determinants", "Determinants"], ["derivatives", "Differential Calculus"],
    ["integrals", "Integral Calculus"], ["diffeq", "Differential Equations"], ["complex", "Complex Numbers"],
    ["probability", "Probability"], ["statistics", "Statistics"], ["numerical", "Numerical Methods"],
    ["laplace", "Laplace Transforms"], ["units", "Engineering Units"]
];

function fixedNumber(value, digits = 2) {
    return Number(value.toFixed(digits)).toString();
}

function buildMathShort(topicId, topicName, index, catalogIndex) {
    const number = index + 1;
    const difficulty = index < 17 ? "Foundation" : index < 34 ? "Intermediate" : "Advanced";
    let title = "", objective = "", problem = "", step1 = "", step2 = "", answer = "", formula = "";
    const a = 2 + (index % 8), b = 3 + ((index * 3) % 9), c = 2 + ((index * 5) % 7);

    switch (topicId) {
        case "ratios": {
            const scale = 2 + (index % 7);
            title = `Reduce a ratio — Example ${number}`; objective = "Cancel a common scale factor.";
            problem = `Simplify ${a * scale} : ${b * scale}`; step1 = `Common factor = ${scale}`;
            step2 = `${a * scale} ÷ ${scale} : ${b * scale} ÷ ${scale}`; answer = `${a} : ${b}`; formula = "a·k : b·k = a : b"; break;
        }
        case "percent": {
            const percent = 5 * (1 + index % 15), base = 20 * (2 + index % 18), result = base * percent / 100;
            title = `Percentage of a quantity — Example ${number}`; objective = "Convert percent to a multiplier.";
            problem = `Find ${percent}% of ${base}`; step1 = `${percent}% = ${percent}/100`;
            step2 = `${percent}/100 × ${base}`; answer = fixedNumber(result); formula = "part = percent × whole"; break;
        }
        case "linear": {
            const solution = 1 + index % 14, rhs = a * solution + b;
            title = `Solve a linear equation — Example ${number}`; objective = "Isolate the unknown with inverse operations.";
            problem = `${a}x + ${b} = ${rhs}`; step1 = `${a}x = ${rhs} − ${b} = ${rhs - b}`;
            step2 = `x = ${rhs - b} ÷ ${a}`; answer = `x = ${solution}`; formula = "ax + b = c"; break;
        }
        case "quadratic": {
            const r1 = 1 + index % 8, r2 = 2 + (index * 2) % 9, sum = r1 + r2, product = r1 * r2;
            title = `Factor a quadratic — Example ${number}`; objective = "Recover roots from their sum and product.";
            problem = `x² − ${sum}x + ${product} = 0`; step1 = `Numbers with sum ${sum}, product ${product}`;
            step2 = `(x − ${r1})(x − ${r2}) = 0`; answer = `x = ${r1} or ${r2}`; formula = "(x−r₁)(x−r₂)=0"; break;
        }
        case "sequence": {
            const first = 2 + index % 10, difference = 1 + index % 7, term = 5 + index % 12, result = first + (term - 1) * difference;
            title = `Arithmetic sequence — Example ${number}`; objective = "Find any term from the first value and common difference.";
            problem = `a₁=${first}, d=${difference}. Find a${term}`; step1 = `aₙ = a₁ + (n−1)d`;
            step2 = `${first} + (${term}−1)×${difference}`; answer = `a${term} = ${result}`; formula = "aₙ=a₁+(n−1)d"; break;
        }
        case "coordinate": {
            const x1 = index % 6, y1 = (index * 2) % 5, scale = 1 + index % 5, x2 = x1 + 3 * scale, y2 = y1 + 4 * scale;
            title = `Distance between points — Example ${number}`; objective = "Apply the Pythagorean distance formula.";
            problem = `A(${x1},${y1}), B(${x2},${y2})`; step1 = `Δx=${3 * scale}, Δy=${4 * scale}`;
            step2 = `d=√(${3 * scale}²+${4 * scale}²)`; answer = `d = ${5 * scale}`; formula = "d=√(Δx²+Δy²)"; break;
        }
        case "geometry": {
            const width = 3 + index % 12, height = 4 + (index * 2) % 10;
            title = `Rectangle geometry — Example ${number}`; objective = "Connect dimensions to area and perimeter.";
            problem = `Width=${width}, height=${height}`; step1 = `Area = ${width}×${height} = ${width * height}`;
            step2 = `Perimeter = 2(${width}+${height})`; answer = `A=${width * height}, P=${2 * (width + height)}`; formula = "A=wh, P=2(w+h)"; break;
        }
        case "trigonometry": {
            const angles = [0, 30, 45, 60, 90], sinValues = ["0", "1/2", "√2/2", "√3/2", "1"];
            const position = index % angles.length, angle = angles[position];
            title = `Exact sine value — Example ${number}`; objective = "Recall the unit-circle special angles.";
            problem = `Evaluate sin(${angle}°)`; step1 = `Locate ${angle}° on the unit circle`;
            step2 = "Sine is the y-coordinate"; answer = `sin(${angle}°) = ${sinValues[position]}`; formula = "sin θ = opposite/hypotenuse"; break;
        }
        case "vectors": {
            const u1 = a, u2 = b, v1 = c, v2 = 1 + index % 6, dot = u1 * v1 + u2 * v2;
            title = `Vector dot product — Example ${number}`; objective = "Measure directional alignment.";
            problem = `u=⟨${u1},${u2}⟩, v=⟨${v1},${v2}⟩`; step1 = `u·v = ${u1}×${v1} + ${u2}×${v2}`;
            step2 = `${u1 * v1} + ${u2 * v2}`; answer = `u·v = ${dot}`; formula = "u·v=u₁v₁+u₂v₂"; break;
        }
        case "matrices": {
            const d = 1 + index % 9;
            title = `Add two matrices — Example ${number}`; objective = "Combine corresponding matrix entries.";
            problem = `[${a} ${b}; ${c} ${d}] + [${d} ${c}; ${b} ${a}]`; step1 = "Add entry by entry";
            step2 = `[${a}+${d}  ${b}+${c}; ${c}+${b}  ${d}+${a}]`; answer = `[${a + d} ${b + c}; ${b + c} ${a + d}]`; formula = "(A+B)ᵢⱼ=Aᵢⱼ+Bᵢⱼ"; break;
        }
        case "determinants": {
            const d = 2 + index % 8, determinant = a * d - b * c;
            title = `2×2 determinant — Example ${number}`; objective = "Compute signed area scaling.";
            problem = `det [${a} ${b}; ${c} ${d}]`; step1 = `ad − bc = ${a}×${d} − ${b}×${c}`;
            step2 = `${a * d} − ${b * c}`; answer = `det = ${determinant}`; formula = "det(A)=ad−bc"; break;
        }
        case "derivatives": {
            const power = 2 + index % 7, coefficient = 1 + index % 9;
            title = `Power-rule derivative — Example ${number}`; objective = "Differentiate polynomial powers.";
            problem = `d/dx (${coefficient}x^${power})`; step1 = `Bring down exponent ${power}`;
            step2 = `${coefficient}×${power} x^${power - 1}`; answer = `${coefficient * power}x^${power - 1}`; formula = "d(xⁿ)/dx = nxⁿ⁻¹"; break;
        }
        case "integrals": {
            const power = 1 + index % 6, coefficient = (power + 1) * (1 + index % 5);
            title = `Power-rule integral — Example ${number}`; objective = "Reverse polynomial differentiation.";
            problem = `∫ ${coefficient}x^${power} dx`; step1 = `Increase exponent: ${power}→${power + 1}`;
            step2 = `${coefficient}/(${power + 1}) x^${power + 1}`; answer = `${coefficient / (power + 1)}x^${power + 1} + C`; formula = "∫xⁿdx=xⁿ⁺¹/(n+1)+C"; break;
        }
        case "diffeq": {
            const rate = 1 + index % 5, initial = 1 + index % 8;
            title = `Exponential differential equation — Example ${number}`; objective = "Recognize proportional growth or decay.";
            problem = `dy/dt=${rate}y, y(0)=${initial}`; step1 = `General form y=Ce^(${rate}t)`;
            step2 = `Initial value gives C=${initial}`; answer = `y=${initial}e^(${rate}t)`; formula = "y′=ky ⇒ y=Ceᵏᵗ"; break;
        }
        case "complex": {
            const real = a * c - b, imag = a + b * c;
            title = `Multiply complex numbers — Example ${number}`; objective = "Use i² = −1 when expanding.";
            problem = `(${a}+${b}i)(${c}+i)`; step1 = `${a * c}+${a}i+${b * c}i+${b}i²`;
            step2 = `${a * c}−${b} + (${a}+${b * c})i`; answer = `${real} + ${imag}i`; formula = "i²=−1"; break;
        }
        case "probability": {
            const favorable = 1 + index % 5, total = favorable + 2 + index % 8;
            title = `Simple probability — Example ${number}`; objective = "Compare favorable and total equally likely outcomes.";
            problem = `${favorable} favorable outcomes among ${total}`; step1 = "P = favorable / total";
            step2 = `${favorable}/${total}`; answer = `P = ${fixedNumber(favorable / total, 3)}`; formula = "P(A)=n(A)/n(S)"; break;
        }
        case "statistics": {
            const values = [a, b, c, a + b, c + 2], sum = values.reduce((total, value) => total + value, 0);
            title = `Arithmetic mean — Example ${number}`; objective = "Summarize a dataset with its average.";
            problem = `Mean of ${values.join(", ")}`; step1 = `Sum = ${sum}`;
            step2 = `${sum} ÷ ${values.length}`; answer = `Mean = ${fixedNumber(sum / values.length)}`; formula = "x̄=Σx/n"; break;
        }
        case "numerical": {
            const target = 2 + index % 15, guess = 1 + index % 6, next = .5 * (guess + target / guess);
            title = `Newton step for √${target} — Example ${number}`; objective = "Improve a square-root estimate iteratively.";
            problem = `Start x₀=${guess}`; step1 = `x₁=½(x₀+${target}/x₀)`;
            step2 = `½(${guess}+${fixedNumber(target / guess, 3)})`; answer = `x₁ = ${fixedNumber(next, 3)}`; formula = "xₙ₊₁=½(xₙ+N/xₙ)"; break;
        }
        case "laplace": {
            const power = index % 6, factorial = [1, 1, 2, 6, 24, 120][power];
            title = `Laplace transform of t^${power} — Example ${number}`; objective = "Apply the standard power transform.";
            problem = `L{t^${power}}`; step1 = `L{tⁿ}=n!/sⁿ⁺¹`;
            step2 = `${power}! / s^${power + 1}`; answer = `${factorial}/s^${power + 1}`; formula = "L{tⁿ}=n!/sⁿ⁺¹"; break;
        }
        case "units": {
            const meters = 1 + index % 25, millimeters = meters * 1000;
            title = `Engineering unit conversion — Example ${number}`; objective = "Convert SI length scales without losing magnitude.";
            problem = `Convert ${meters} m to mm`; step1 = "1 m = 1000 mm";
            step2 = `${meters} × 1000`; answer = `${millimeters} mm`; formula = "m × 10³ = mm"; break;
        }
    }

    return {
        id: `math-${String(catalogIndex + 1).padStart(4, "0")}`, topicId, topic: topicName,
        title, objective, problem, step1, step2, answer, formula, difficulty, duration: 20
    };
}

function generateMathShortCatalog() {
    const catalog = [];
    MATH_SHORT_TOPICS.forEach(([topicId, topicName]) => {
        for (let index = 0; index < 50; index++) catalog.push(buildMathShort(topicId, topicName, index, catalog.length));
    });
    return catalog;
}

const MATH_SHORTS_CATALOG = generateMathShortCatalog();
let completedMathShorts = JSON.parse(localStorage.getItem("completedMathShorts") || "[]");
let currentMathShort = MATH_SHORTS_CATALOG[0];
let mathShortPage = 1;
let mathShortFiltered = MATH_SHORTS_CATALOG;
let mathShortPlaying = false;
let mathShortElapsed = 0;
let mathShortLastFrame = 0;
let mathShortAnimationFrame = null;
const MATH_SHORT_PAGE_SIZE = 20;

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text).split(" ");
    const lines = [];
    let line = "";
    words.forEach(word => {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; }
        else line = candidate;
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
}

function drawMathShortFrame(elapsedSeconds = mathShortElapsed) {
    const canvas = document.getElementById("math-short-canvas");
    if (!canvas || !currentMathShort) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width, height = canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0c3434"); gradient.addColorStop(.58, "#102f30"); gradient.addColorStop(1, "#07534f");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(117,207,183,.12)"; ctx.lineWidth = 2;
    for (let x = -height; x < width; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + height, height); ctx.stroke(); }

    ctx.fillStyle = "#75cfb7"; ctx.font = "700 26px DM Sans";
    ctx.fillText(`${currentMathShort.topic}  •  ${currentMathShort.difficulty}`, 62, 64);
    ctx.textAlign = "right"; ctx.fillStyle = "#aebfbb"; ctx.font = "600 24px DM Sans";
    ctx.fillText(`${currentMathShort.id.toUpperCase()}  •  20 SEC`, width - 62, 64); ctx.textAlign = "left";

    let label, main, supporting;
    if (elapsedSeconds < 4) { label = "TODAY'S MICRO-LESSON"; main = currentMathShort.title; supporting = currentMathShort.objective; }
    else if (elapsedSeconds < 9) { label = "PROBLEM"; main = currentMathShort.problem; supporting = currentMathShort.formula; }
    else if (elapsedSeconds < 14) { label = "STEP 1"; main = currentMathShort.step1; supporting = currentMathShort.problem; }
    else if (elapsedSeconds < 18) { label = "STEP 2"; main = currentMathShort.step2; supporting = "Follow the units and signs carefully."; }
    else { label = "ANSWER"; main = currentMathShort.answer; supporting = "Replay once, then solve a similar example without looking."; }

    const pulse = .96 + .04 * Math.sin(elapsedSeconds * 3);
    ctx.fillStyle = label === "ANSWER" ? "#f4b183" : "#75cfb7"; ctx.font = "800 30px DM Sans";
    ctx.fillText(label, 84, 184);
    ctx.save(); ctx.translate(width / 2, 350); ctx.scale(pulse, pulse); ctx.translate(-width / 2, -350);
    ctx.fillStyle = "#ffffff"; ctx.font = "800 58px Manrope"; ctx.textAlign = "center";
    wrapCanvasText(ctx, main, width / 2, 330, 1040, 74, 3); ctx.restore();
    ctx.fillStyle = "#b9cbc6"; ctx.font = "500 28px DM Sans"; ctx.textAlign = "center";
    wrapCanvasText(ctx, supporting, width / 2, 520, 1000, 38, 2); ctx.textAlign = "left";

    const progress = Math.min(1, elapsedSeconds / 20);
    ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fillRect(62, height - 48, width - 124, 8);
    ctx.fillStyle = "#75cfb7"; ctx.fillRect(62, height - 48, (width - 124) * progress, 8);
    document.getElementById("math-short-timeline-bar").style.width = `${progress * 100}%`;
    document.getElementById("math-short-time").textContent = `0:${String(Math.min(20, Math.floor(elapsedSeconds))).padStart(2, "0")} / 0:20`;
}

function mathShortLoop(timestamp) {
    if (!mathShortPlaying) return;
    if (!mathShortLastFrame) mathShortLastFrame = timestamp;
    mathShortElapsed += (timestamp - mathShortLastFrame) / 1000;
    mathShortLastFrame = timestamp;
    if (mathShortElapsed >= 20) {
        mathShortElapsed = 20; mathShortPlaying = false; drawMathShortFrame(20);
        if (!completedMathShorts.includes(currentMathShort.id)) toggleMathShortComplete(currentMathShort.id, true);
        updateMathShortPlayButtons(); return;
    }
    drawMathShortFrame();
    mathShortAnimationFrame = requestAnimationFrame(mathShortLoop);
}

function updateMathShortPlayButtons() {
    const icon = mathShortPlaying ? "pause" : "play";
    const play = document.getElementById("math-short-play-btn");
    const big = document.getElementById("math-short-big-play");
    if (play) play.innerHTML = `<i data-lucide="${icon}"></i>`;
    if (big) { big.innerHTML = `<i data-lucide="${icon}"></i>`; big.classList.toggle("playing", mathShortPlaying); }
    if (window.lucide) lucide.createIcons();
}

function toggleMathShortPlayback() {
    if (mathShortElapsed >= 20) mathShortElapsed = 0;
    mathShortPlaying = !mathShortPlaying; mathShortLastFrame = 0;
    updateMathShortPlayButtons();
    if (mathShortPlaying) mathShortAnimationFrame = requestAnimationFrame(mathShortLoop);
    else if (mathShortAnimationFrame) cancelAnimationFrame(mathShortAnimationFrame);
}

function replayMathShort() {
    mathShortElapsed = 0; mathShortPlaying = true; mathShortLastFrame = 0;
    updateMathShortPlayButtons(); mathShortAnimationFrame = requestAnimationFrame(mathShortLoop);
}

function selectMathShort(id) {
    const lesson = MATH_SHORTS_CATALOG.find(item => item.id === id);
    if (!lesson) return;
    currentMathShort = lesson; mathShortElapsed = 0; mathShortPlaying = false; mathShortLastFrame = 0;
    document.getElementById("math-short-topic").textContent = `${lesson.topic} · ${lesson.difficulty}`;
    document.getElementById("math-short-title").textContent = lesson.title;
    document.getElementById("math-short-objective").textContent = lesson.objective;
    drawMathShortFrame(0); updateMathShortPlayButtons(); updateMathShortCompleteButton(); renderMathShortGrid();
    document.querySelector(".math-short-theater")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleMathShortComplete(id = currentMathShort.id, forceComplete = false) {
    const index = completedMathShorts.indexOf(id);
    if (index >= 0 && !forceComplete) completedMathShorts.splice(index, 1);
    else if (index < 0) completedMathShorts.push(id);
    localStorage.setItem("completedMathShorts", JSON.stringify(completedMathShorts));
    updateMathShortCompleteButton(); applyMathShortFilters();
}

function updateMathShortCompleteButton() {
    const button = document.getElementById("math-short-complete-btn");
    if (!button || !currentMathShort) return;
    const complete = completedMathShorts.includes(currentMathShort.id);
    button.innerHTML = `<i data-lucide="${complete ? 'check-circle-2' : 'check-circle'}"></i> ${complete ? 'Completed' : 'Mark complete'}`;
    button.classList.toggle("btn-success", complete);
    if (window.lucide) lucide.createIcons();
}

function renderMathShortGrid() {
    const grid = document.getElementById("math-shorts-grid");
    if (!grid) return;
    const totalPages = Math.max(1, Math.ceil(mathShortFiltered.length / MATH_SHORT_PAGE_SIZE));
    mathShortPage = Math.min(mathShortPage, totalPages);
    const start = (mathShortPage - 1) * MATH_SHORT_PAGE_SIZE;
    const pageItems = mathShortFiltered.slice(start, start + MATH_SHORT_PAGE_SIZE);
    grid.innerHTML = pageItems.map(item => {
        const complete = completedMathShorts.includes(item.id), current = currentMathShort?.id === item.id;
        return `<article class="math-short-card ${complete ? 'complete' : ''} ${current ? 'current' : ''}">
            <button class="math-short-card-preview" onclick="selectMathShort('${item.id}')">
                <span>${item.topic}</span><strong>${item.formula}</strong><i data-lucide="play"></i><em>20 sec</em>
            </button>
            <div class="math-short-card-body"><span>${item.id.toUpperCase()} · ${item.difficulty}</span><h4>${item.title}</h4><p>${item.objective}</p>
                <button class="btn btn-outline btn-sm" onclick="selectMathShort('${item.id}')">${complete ? '<i data-lucide="check-circle-2"></i> Review' : '<i data-lucide="play"></i> Watch'}</button>
            </div></article>`;
    }).join("");
    document.getElementById("math-shorts-result-count").textContent = `Showing ${pageItems.length} of ${mathShortFiltered.length.toLocaleString()} videos`;
    document.getElementById("math-shorts-page-label").textContent = `Page ${mathShortPage} of ${totalPages}`;
    document.getElementById("math-shorts-prev").disabled = mathShortPage <= 1;
    document.getElementById("math-shorts-next").disabled = mathShortPage >= totalPages;
    document.getElementById("math-shorts-completed-count").textContent = completedMathShorts.length.toLocaleString();
    if (window.lucide) lucide.createIcons();
}

function applyMathShortFilters() {
    const query = document.getElementById("math-shorts-search")?.value.toLowerCase().trim() || "";
    const topic = document.getElementById("math-shorts-topic")?.value || "All";
    const difficulty = document.getElementById("math-shorts-difficulty")?.value || "All";
    const status = document.getElementById("math-shorts-status")?.value || "All";
    mathShortFiltered = MATH_SHORTS_CATALOG.filter(item => {
        if (topic !== "All" && item.topicId !== topic) return false;
        if (difficulty !== "All" && item.difficulty !== difficulty) return false;
        if (status === "Completed" && !completedMathShorts.includes(item.id)) return false;
        if (status === "Incomplete" && completedMathShorts.includes(item.id)) return false;
        if (query && !`${item.title} ${item.topic} ${item.objective} ${item.problem} ${item.formula}`.toLowerCase().includes(query)) return false;
        return true;
    });
    mathShortPage = 1; renderMathShortGrid();
}

function initMathShortsLibrary() {
    const grid = document.getElementById("math-shorts-grid");
    if (!grid || grid.dataset.initialized) return;
    grid.dataset.initialized = "true";
    const topicSelect = document.getElementById("math-shorts-topic");
    topicSelect.innerHTML = `<option value="All">All 20 topics</option>` + MATH_SHORT_TOPICS.map(([id, name]) => `<option value="${id}">${name} (50)</option>`).join("");
    document.getElementById("math-shorts-search").addEventListener("input", applyMathShortFilters);
    [topicSelect, document.getElementById("math-shorts-difficulty"), document.getElementById("math-shorts-status")].forEach(input => input.addEventListener("change", applyMathShortFilters));
    document.getElementById("math-shorts-prev").addEventListener("click", () => { mathShortPage--; renderMathShortGrid(); });
    document.getElementById("math-shorts-next").addEventListener("click", () => { mathShortPage++; renderMathShortGrid(); });
    document.getElementById("math-short-play-btn").addEventListener("click", toggleMathShortPlayback);
    document.getElementById("math-short-big-play").addEventListener("click", toggleMathShortPlayback);
    document.getElementById("math-short-replay-btn").addEventListener("click", replayMathShort);
    document.getElementById("math-short-complete-btn").addEventListener("click", () => toggleMathShortComplete());
    selectMathShort(MATH_SHORTS_CATALOG[0].id); applyMathShortFilters();
}

function renderVideoAcademy() {
    const grid = document.getElementById("video-academy-grid");
    if (!grid) return;

    renderVideoCourseTracks();
    initMathShortsLibrary();
    const categoryFilters = document.getElementById("video-category-filters");
    const searchInput = document.getElementById("video-search-input");
    const countLabel = document.getElementById("video-count-label");

    let activeCategory = "All";
    let searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";

    function filterAndRender() {
        const filtered = VIDEO_ACADEMY_REGISTRY.filter(item => {
            if (activeCategory !== "All") {
                if (activeCategory === "Mathematics" && item.category !== "Mathematics") return false;
                if (activeCategory === "Core Mechanical Engineering" && item.category !== "Core Mechanical Engineering") return false;
                if (activeCategory === "CAD & Design" && item.category !== "CAD & Design") return false;
                if (activeCategory === "CAE & Simulation" && item.category !== "CAE & Simulation") return false;
                if (activeCategory === "Automation & Robotics" && item.category !== "Automation & Robotics") return false;
                if (activeCategory === "Manufacturing & Materials" && item.category !== "Manufacturing & Materials") return false;
                if (activeCategory === "Thermal & Fluids" && item.category !== "Thermal & Fluids") return false;
            }
            if (searchVal) {
                const matches = item.title.toLowerCase().includes(searchVal) ||
                                item.description.toLowerCase().includes(searchVal) ||
                                item.tags.some(t => t.toLowerCase().includes(searchVal));
                if (!matches) return false;
            }
            return true;
        });

        if (countLabel) {
            countLabel.textContent = `Showing ${filtered.length} of ${VIDEO_ACADEMY_REGISTRY.length} lessons`;
        }

        grid.innerHTML = filtered.map(item => `
            <div class="video-card">
                <div class="video-card-thumb">
                    <video preload="metadata" playsinline muted style="width:100%; height:100%; object-fit:cover;">
                        <source src="${item.src}" type="video/mp4">
                    </video>
                    <div class="video-play-overlay" onclick="selectTheaterVideo('${item.id}')">
                        <div class="play-btn-circle">
                            <i data-lucide="play" style="width:24px; height:24px; fill:#fff; margin-left:3px;"></i>
                        </div>
                    </div>
                </div>
                <div class="video-card-body">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                        <span class="course-badge beginner" style="font-size:0.7rem;">${item.category}</span>
                        <span style="font-size:0.72rem; color:var(--text-muted);"><i data-lucide="play-circle" style="width:12px; height:12px; display:inline-block; vertical-align:middle;"></i> Manim HD</span>
                    </div>
                    <h4 style="font-size:0.95rem; margin-bottom:0.4rem; color:#fff;">${item.title}</h4>
                    <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.35; margin-bottom:0.75rem; flex:1;">${item.description}</p>
                    <button class="btn btn-outline btn-sm" onclick="selectTheaterVideo('${item.id}')" style="width:100%; font-size:0.78rem;">
                        <i data-lucide="play" style="width:14px; height:14px;"></i> Play in Theater
                    </button>
                </div>
            </div>
        `).join("");

        if (window.lucide) lucide.createIcons();
    }

    if (categoryFilters) {
        categoryFilters.querySelectorAll(".pill-btn").forEach(btn => {
            btn.onclick = () => {
                categoryFilters.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                activeCategory = btn.getAttribute("data-category");
                filterAndRender();
            };
        });
    }

    if (searchInput) {
        searchInput.oninput = (e) => {
            searchVal = e.target.value.toLowerCase().trim();
            filterAndRender();
        };
    }

    filterAndRender();
}

function selectTheaterVideo(id) {
    const item = VIDEO_ACADEMY_REGISTRY.find(v => v.id === id);
    if (!item) return;
    currentVideoLessonId = id;

    const titleEl = document.getElementById("theater-video-title");
    const badgeEl = document.getElementById("theater-video-badge");
    const descEl = document.getElementById("theater-video-desc");
    const takeawayEl = document.getElementById("theater-video-takeaway");
    const tagsEl = document.getElementById("theater-video-tags");
    const playerEl = document.getElementById("theater-video-player");
    const sourceEl = document.getElementById("theater-video-source");

    if (titleEl) titleEl.innerHTML = `<i data-lucide="play-circle" style="color: var(--accent-primary);"></i> Lesson: ${item.title}`;
    if (badgeEl) badgeEl.textContent = item.category;
    if (descEl) descEl.textContent = item.description;
    if (takeawayEl) takeawayEl.textContent = item.takeaway;
    if (tagsEl) {
        tagsEl.innerHTML = item.tags.map(t => `<span class="skill-tag">${t}</span>`).join("");
    }
    if (playerEl && sourceEl) {
        sourceEl.src = item.src;
        playerEl.load();
        playerEl.play().catch(() => {});
        playerEl.onended = () => {
            if (!completedVideoLessons.includes(id)) toggleVideoLessonComplete(id);
        };
    }

    const theaterCard = document.getElementById("featured-video-theater");
    if (theaterCard) {
        theaterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    renderVideoCourseTracks();
    if (window.lucide) lucide.createIcons();
}

const COURSES_DATABASE = [
    // Mathematics
    {
        title: "Calculus",
        category: "Mathematics",
        description: "Master limits, derivatives, integration, and their applications to mechanical engineering rates and optimizations.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "High School Algebra",
        skills: ["Limits & Convergence", "Differentiation", "Integration Theorems"],
        order: 1,
        links: [
            { name: "MIT OpenCourseWare Single Variable", url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" },
            { name: "NPTEL Calculus Series", url: "https://nptel.ac.in/courses/111104085" }
        ]
    },
    {
        title: "Linear Algebra",
        category: "Mathematics",
        description: "Develop matrix computations, vector spaces, and eigenvalue analysis essential for finite element solvers.",
        difficulty: "Intermediate",
        time: "25 Hours",
        prereq: "Calculus",
        skills: ["Matrix Operations", "Vector Spaces", "Eigenvalues & Eigenvectors"],
        order: 2,
        links: [
            { name: "MIT OCW Linear Algebra (Strang)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
            { name: "NPTEL Matrix Methods", url: "https://nptel.ac.in/courses/111108066" }
        ]
    },
    {
        title: "Differential Equations",
        category: "Mathematics",
        description: "Understand ordinary and partial differential equations modeling vibration dynamics and heat flow.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Calculus",
        skills: ["First/Second Order ODEs", "Fourier Series", "Laplace Transforms"],
        order: 3,
        links: [
            { name: "MIT OCW Differential Equations", url: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/" },
            { name: "NPTEL ODE Course", url: "https://nptel.ac.in/courses/111105038" }
        ]
    },
    {
        title: "Probability & Statistics",
        category: "Mathematics",
        description: "Apply probability theory, hypothesis tests, and statistical process controls for manufacturing systems.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "None",
        skills: ["Probability Distributions", "Hypothesis Testing", "Regression Analysis"],
        order: 4,
        links: [
            { name: "MIT OCW Prob & Stats", url: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2014/" },
            { name: "NPTEL Applied Statistics", url: "https://nptel.ac.in/courses/111105090" }
        ]
    },
    {
        title: "Numerical Methods",
        category: "Mathematics",
        description: "Formulate computational algorithms to solve non-linear equations, boundary problems, and numerical integrals.",
        difficulty: "Advanced",
        time: "25 Hours",
        prereq: "Linear Algebra",
        skills: ["Root Finding Algorithms", "Finite Difference Approximations", "Numerical Quadrature"],
        order: 5,
        links: [
            { name: "MIT OCW Numerical Analysis", url: "https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/" },
            { name: "NPTEL Numerical Methods", url: "https://nptel.ac.in/courses/111107105" }
        ]
    },
    {
        title: "Engineering Mathematics",
        category: "Mathematics",
        description: "Comprehensive vector calculus, complex variables, and boundary value solutions for solid/fluid solvers.",
        difficulty: "Intermediate",
        time: "35 Hours",
        prereq: "Linear Algebra",
        skills: ["Vector Fields", "Complex Analysis", "Bessel Functions"],
        order: 6,
        links: [
            { name: "NPTEL Advanced Eng Math", url: "https://nptel.ac.in/courses/111107119" }
        ]
    },

    // Core Mechanical Engineering
    {
        title: "Engineering Mechanics",
        category: "Core Mechanical Engineering",
        description: "Define static equilibrium, force systems, moments, trusses, centroids, friction, and kinematic acceleration.",
        difficulty: "Beginner",
        time: "30 Hours",
        prereq: "None",
        skills: ["Force System Analysis", "Static Equilibrium", "Truss & Frame Analysis"],
        order: 7,
        links: [
            { name: "NPTEL Applied Mechanics", url: "https://nptel.ac.in/courses/112103109" }
        ]
    },
    {
        title: "Strength of Materials",
        category: "Core Mechanical Engineering",
        description: "Analyze uniaxial stress-strain states, beam bending moments, shear forces, torsion of shafts, and column buckling.",
        difficulty: "Intermediate",
        time: "35 Hours",
        prereq: "Engineering Mechanics",
        skills: ["Stress-Strain Tensor", "Bending & Shear Diagrams", "Torsional Deflection"],
        order: 8,
        links: [
            { name: "NPTEL Strength of Materials", url: "https://nptel.ac.in/courses/112105124" }
        ]
    },
    {
        title: "Fluid Mechanics",
        category: "Core Mechanical Engineering",
        description: "Study fluid statics, kinematics, control volume analysis, Navier-Stokes formulation, and boundary layer behavior.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Calculus",
        skills: ["Navier-Stokes Equations", "Control Volume Analysis", "Boundary Layer Theory"],
        order: 9,
        links: [
            { name: "MIT OCW Fluid Dynamics", url: "https://ocw.mit.edu/courses/2-06-fluid-dynamics-spring-2013/" },
            { name: "NPTEL Fluid Mechanics", url: "https://nptel.ac.in/courses/112105171" }
        ]
    },
    {
        title: "Thermodynamics",
        category: "Core Mechanical Engineering",
        description: "Understand the laws of thermodynamics, energy transfers, cycle optimization (Rankine, Brayton, Diesel, Otto).",
        difficulty: "Beginner",
        time: "25 Hours",
        prereq: "None",
        skills: ["First & Second Laws", "Entropy & Exergy", "Thermodynamic Power Cycles"],
        order: 10,
        links: [
            { name: "MIT OCW Thermal Fluids", url: "https://ocw.mit.edu/courses/2-005-thermal-fluids-engineering-i-fall-2015/" },
            { name: "NPTEL Basic Thermo", url: "https://nptel.ac.in/courses/112105123" }
        ]
    },
    {
        title: "Heat Transfer",
        category: "Core Mechanical Engineering",
        description: "Formulate physical heat transfer systems: steady-state conduction, convective flow, and graybody radiation.",
        difficulty: "Advanced",
        time: "30 Hours",
        prereq: "Differential Equations",
        skills: ["Transient Conduction", "Convective heat coefficients", "Radiative heat exchange"],
        order: 11,
        links: [
            { name: "NPTEL Heat & Mass Transfer", url: "https://nptel.ac.in/courses/112108149" }
        ]
    },
    {
        title: "Theory of Machines",
        category: "Core Mechanical Engineering",
        description: "Analyze kinematic constraints in linkages, slider-cranks, gear trains, gyroscopic couples, and rotor balance.",
        difficulty: "Intermediate",
        time: "40 Hours",
        prereq: "Engineering Mechanics",
        skills: ["Kinematic Linkage Design", "Gear Train Velocity Ratios", "Rotor Balancing"],
        order: 12,
        links: [
            { name: "NPTEL Kinematics of Machines", url: "https://nptel.ac.in/courses/112104114" }
        ]
    },
    {
        title: "Machine Design",
        category: "Core Mechanical Engineering",
        description: "Design load-bearing components: bolted joints, shafts, journal bearings, springs, gears, and wear parameters.",
        difficulty: "Advanced",
        time: "45 Hours",
        prereq: "Strength of Materials",
        skills: ["Failure Theories (Von Mises)", "Shaft Fatigue Analysis", "Bearing Selection"],
        order: 13,
        links: [
            { name: "NPTEL Design of Machine Elements", url: "https://nptel.ac.in/courses/112105125" }
        ]
    },
    {
        title: "Manufacturing Processes",
        category: "Core Mechanical Engineering",
        description: "Master conventional metal casting, forging, metal forming, plastic deformation, and standard welding processes.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "None",
        skills: ["Metal Casting Physics", "Metal Forming Operations", "Welding Joints"],
        order: 14,
        links: [
            { name: "NPTEL Manufacturing Processes", url: "https://nptel.ac.in/courses/112105126" }
        ]
    },
    {
        title: "Materials Science",
        category: "Core Mechanical Engineering",
        description: "Analyze atomic lattices, phase diagrams (Iron-Carbon), heat treatments, tensile testing, and grain structures.",
        difficulty: "Beginner",
        time: "25 Hours",
        prereq: "None",
        skills: ["Iron-Carbon Diagram", "Heat Treatment Profiles", "Alloying Mechanics"],
        order: 15,
        links: [
            { name: "MIT OCW Solid State Chem", url: "https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/" },
            { name: "NPTEL Materials Science", url: "https://nptel.ac.in/courses/113105081" }
        ]
    },
    {
        title: "Engineering Drawing",
        category: "Core Mechanical Engineering",
        description: "Draft orthographic projections, auxiliary planes, section views, dimensions, and ASME standard conventions.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "None",
        skills: ["Orthographic Projection", "Isometric Drawings", "ASME Dimensioning Standards"],
        order: 16,
        links: [
            { name: "NPTEL Engineering Drawing", url: "https://nptel.ac.in/courses/112103019" }
        ]
    },
    {
        title: "Industrial Engineering",
        category: "Core Mechanical Engineering",
        description: "Optimize operations planning: linear programming, inventory logistics, forecasting, queuing systems, and ERP workflows.",
        difficulty: "Intermediate",
        time: "20 Hours",
        prereq: "Probability & Statistics",
        skills: ["Linear Programming", "MRP & Inventory Control", "Queuing Line Models"],
        order: 17,
        links: [
            { name: "NPTEL Industrial Engineering", url: "https://nptel.ac.in/courses/112107142" }
        ]
    },
    {
        title: "Metrology",
        category: "Core Mechanical Engineering",
        description: "Calibrate and implement dial gauges, micrometer tools, limit gauges, surface finish profilometry, and CMM checks.",
        difficulty: "Intermediate",
        time: "20 Hours",
        prereq: "None",
        skills: ["Limit Gauges & Fits", "Surface Roughness Metrics", "Coordinate Measuring Machines"],
        order: 18,
        links: [
            { name: "NPTEL Metrology & Measurements", url: "https://nptel.ac.in/courses/112106179" }
        ]
    },
    {
        title: "Tribology",
        category: "Core Mechanical Engineering",
        description: "Study lubrication states (hydrodynamic, boundary), friction theories, adhesive wear, and contact mechanics.",
        difficulty: "Advanced",
        time: "20 Hours",
        prereq: "Fluid Mechanics",
        skills: ["Hydrodynamic Reynolds Solver", "Wear Rate Estimation", "Lubricant Chemistry"],
        order: 19,
        links: [
            { name: "NPTEL Tribology Series", url: "https://nptel.ac.in/courses/112102015" }
        ]
    },

    // CAD & Design
    {
        title: "AutoCAD",
        category: "CAD & Design",
        description: "Standard 2D layout planning, orthographic drafting, layer schemes, and parametric drawing files.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "Engineering Drawing",
        skills: ["2D Vector Layouts", "Layer Mapping", "Paper Space Plotting"],
        order: 20,
        links: [
            { name: "Autodesk Design Academy", url: "https://learn.autodesk.com/" }
        ]
    },
    {
        title: "SolidWorks",
        category: "CAD & Design",
        description: "3D parametric modeling, assembly configurations, mating constraints, drawing files, and basic simulation tools.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "Engineering Drawing",
        skills: ["3D Part Parametrics", "Assembly Configurations", "CSWA Exam Prep"],
        order: 21,
        links: [
            { name: "SolidWorks Student Tutorials", url: "https://www.solidworks.com/support/free-student-downloads" }
        ]
    },
    {
        title: "CATIA",
        category: "CAD & Design",
        description: "Advanced generative shape design, sheet metal, aerospace routing, and complex product configuration trees.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "SolidWorks",
        skills: ["Generative Surface Modeling", "Sheet Metal Tooling", "Aerospace Rib Design"],
        order: 22,
        links: [
            { name: "Dassault Academy Center", url: "https://academy.3ds.com/en" }
        ]
    },
    {
        title: "Creo",
        category: "CAD & Design",
        description: "Parametric robust model assembly, skeletal modeling, dynamic kinematic checks, and sheet metal parts.",
        difficulty: "Intermediate",
        time: "25 Hours",
        prereq: "SolidWorks",
        skills: ["Skeletal Assembly Control", "Creo Parametric Tables", "Flexible Component Mates"],
        order: 23,
        links: [
            { name: "Creo Student Learning Center", url: "https://freecad-academy.org/" }
        ]
    },
    {
        title: "Siemens NX",
        category: "CAD & Design",
        description: "Synchronous engineering modifications, large assembly loading, surface modeling, and integrated CAM configurations.",
        difficulty: "Advanced",
        time: "30 Hours",
        prereq: "CATIA",
        skills: ["Synchronous Face Modifiers", "Large Assembly Load Profiles", "CAD-to-CAM Bridging"],
        order: 24,
        links: [
            { name: "Siemens PLM Academy Platform", url: "https://training.plm.automation.siemens.com/" }
        ]
    },
    {
        title: "Fusion 360",
        category: "CAD & Design",
        description: "Cloud-collaborative layout drawing, integrated milling toolpaths, additive slicers, and generative shape generators.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "None",
        skills: ["Collaborative Modeling", "Generative Constraint Setup", "Milling Toolpaths"],
        order: 25,
        links: [
            { name: "Autodesk Fusion Learning Catalog", url: "https://www.autodesk.com/campaigns/education/fusion-360" }
        ]
    },

    // Simulation
    {
        title: "CFD Fundamentals",
        category: "Simulation",
        description: "Discretize flow equations: finite volume cells, SIMPLE solvers, numerical stability grid independent limits.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Fluid Mechanics",
        skills: ["Finite Volume Method", "SIMPLE Flow Solver", "Grid Convergence Index"],
        order: 26,
        links: [
            { name: "NPTEL Intro to CFD", url: "https://nptel.ac.in/courses/112105045" }
        ]
    },
    {
        title: "Finite Element Analysis",
        category: "Simulation",
        description: "Derive element stiffness matrices, formulate 1D/2D elements, shape profiles, and structural convergence curves.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Strength of Materials",
        skills: ["Stiffness Matrix Assembly", "Shape Function Derivation", "Energy Minimization"],
        order: 27,
        links: [
            { name: "NPTEL Finite Element Method", url: "https://nptel.ac.in/courses/112104115" }
        ]
    },
    {
        title: "ANSYS Mechanical",
        category: "Simulation",
        description: "Set up structural simulation blocks: meshes, boundary constraints, static loading, dynamic vibration modes.",
        difficulty: "Advanced",
        time: "25 Hours",
        prereq: "Finite Element Analysis",
        skills: ["Static Structural FEA", "Modal Harmonic Analysis", "Mesh Quality Checks"],
        order: 28,
        links: [
            { name: "ANSYS Innovation Course Portal", url: "https://www.ansys.com/academic/free-courses" }
        ]
    },
    {
        title: "ANSYS Fluent",
        category: "Simulation",
        description: "Execute flow simulations: mesh setup, turbulence boundaries (k-epsilon, SST), thermal gradients.",
        difficulty: "Advanced",
        time: "30 Hours",
        prereq: "CFD Fundamentals",
        skills: ["Turbulence Boundary Mapping", "Conjugate Heat Transfer", "Fluent Post-Processing"],
        order: 29,
        links: [
            { name: "ANSYS Innovation CFD Academy", url: "https://www.ansys.com/academic/free-courses" }
        ]
    },
    {
        title: "Abaqus",
        category: "Simulation",
        description: "Model complex structural solvers: material yielding, contact friction interfaces, crash impacts.",
        difficulty: "Advanced",
        time: "35 Hours",
        prereq: "Finite Element Analysis",
        skills: ["Non-Linear Material Yielding", "Contact Interaction FEA", "Explicit Impact Solver"],
        order: 30,
        links: [
            { name: "Dassault Abaqus Student Center", url: "https://academy.3ds.com/en/software/abaqus-student-edition" }
        ]
    },
    {
        title: "OpenFOAM",
        category: "Simulation",
        description: "Master open-source CFD mesh generation, case directory setups, boundary dictionaries, and terminal execution.",
        difficulty: "Advanced",
        time: "40 Hours",
        prereq: "CFD Fundamentals",
        skills: ["Terminal Solver Setup", "BlockMesh Configuration", "Custom Solver Compiling"],
        order: 31,
        links: [
            { name: "OpenFOAM User Guide Guides", url: "https://www.openfoam.com/documentation/" }
        ]
    },
    {
        title: "COMSOL",
        category: "Simulation",
        description: "Solve multiphysics equations: coupled thermal-structural, piezo-electric parameters, and electrostatic fields.",
        difficulty: "Advanced",
        time: "30 Hours",
        prereq: "Finite Element Analysis",
        skills: ["Coupled Field FEA", "Piezoelectric Parameters", "Custom PDE Integration"],
        order: 32,
        links: [
            { name: "NPTEL Multiphysics Modeling", url: "https://nptel.ac.in/courses/112108150" }
        ]
    },

    // Manufacturing
    {
        title: "CNC Programming",
        category: "Manufacturing",
        description: "Generate milling and turning toolpaths manually using standard G-code, tool offsets, and canned cycles.",
        difficulty: "Intermediate",
        time: "20 Hours",
        prereq: "Machining",
        skills: ["G-code & M-code Drafting", "Tool Radius Compensation", "Milling Cycle Blocks"],
        order: 33,
        links: [
            { name: "NPTEL Modern Machining", url: "https://nptel.ac.in/courses/112105211" }
        ]
    },
    {
        title: "Welding",
        category: "Manufacturing",
        description: "Classify arc welding, resistance, friction welding processes, solid state joining, and weld metallurgy.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "Materials Science",
        skills: ["Weld Joint Design", "Arc Physics Parameters", "Weld Inspection Checks"],
        order: 34,
        links: [
            { name: "NPTEL Welding Metallurgy", url: "https://nptel.ac.in/courses/112105126" }
        ]
    },
    {
        title: "Casting",
        category: "Manufacturing",
        description: "Study sand mold casting, pattern design, gating systems, solidification rate variables, and casting defects.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "Materials Science",
        skills: ["Gating System Design", "Solidification Heat Laws", "Casting Quality Testing"],
        order: 35,
        links: [
            { name: "NPTEL Casting Technology", url: "https://nptel.ac.in/courses/112105126" }
        ]
    },
    {
        title: "Machining",
        category: "Manufacturing",
        description: "Formulate mechanics of orthogonal cutting, shear angle, merchant circle model, tool life curves.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "None",
        skills: ["Merchant Circle Model", "Taylor Tool Life Curve", "Cutting Fluid Chemistry"],
        order: 36,
        links: [
            { name: "NPTEL Machining Science", url: "https://nptel.ac.in/courses/112105126" }
        ]
    },
    {
        title: "Additive Manufacturing",
        category: "Manufacturing",
        description: "Study plastic and metal 3D printing technologies (FDM, SLA, SLS, DMLS) and support generation strategies.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "None",
        skills: ["3D Printing Slicing Settings", "SLA Support Structures", "Metal DMLS Sintering"],
        order: 37,
        links: [
            { name: "NPTEL Additive Manufacturing", url: "https://nptel.ac.in/courses/112105249" }
        ]
    },
    {
        title: "Lean Manufacturing",
        category: "Manufacturing",
        description: "Apply production principles: Toyota production system, inventory waste, Kanban, Kaizen, SMED setup blocks.",
        difficulty: "Intermediate",
        time: "15 Hours",
        prereq: "None",
        skills: ["Waste Identification (Muda)", "Value Stream Mapping", "Single Minute Exchange (SMED)"],
        order: 38,
        links: [
            { name: "NPTEL Lean Manufacturing", url: "https://nptel.ac.in/courses/112107143" }
        ]
    },
    {
        title: "Six Sigma",
        category: "Manufacturing",
        description: "Formulate process controls: DMAIC steps, statistical charts, Gage R&R, ANOVA variance models.",
        difficulty: "Intermediate",
        time: "20 Hours",
        prereq: "Probability & Statistics",
        skills: ["DMAIC Implementation", "Control Chart Drafting", "ANOVA Analysis Tables"],
        order: 39,
        links: [
            { name: "NPTEL Quality Control", url: "https://nptel.ac.in/courses/110105039" }
        ]
    },

    // Automation
    {
        title: "PLC",
        category: "Automation",
        description: "Write ladder logic diagrams, register memory mapping, analog input channels, timer counters.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "None",
        skills: ["Ladder Logic Diagrams", "Analog I/O Processing", "Counter Time Operations"],
        order: 40,
        links: [
            { name: "NPTEL Industrial Automation", url: "https://nptel.ac.in/courses/108105063" }
        ]
    },
    {
        title: "SCADA",
        category: "Automation",
        description: "Map human machine interfaces (HMI), tag databases, alarm configurations, industrial networks.",
        difficulty: "Intermediate",
        time: "20 Hours",
        prereq: "PLC",
        skills: ["HMI Visual Layouts", "Tag Memory Mapping", "Modbus Communication Setup"],
        order: 41,
        links: [
            { name: "NPTEL SCADA Course", url: "https://nptel.ac.in/courses/108105063" }
        ]
    },
    {
        title: "Robotics",
        category: "Automation",
        description: "Derive Denavit-Hartenberg kinematic matrices, inverse coordinates, jacobian matrices, joint trajectories.",
        difficulty: "Advanced",
        time: "30 Hours",
        prereq: "Linear Algebra",
        skills: ["Denavit-Hartenberg Setup", "Inverse Jacobian Models", "Joint Trajectory Splines"],
        order: 42,
        links: [
            { name: "MIT OCW Intro to Robotics", url: "https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/" },
            { name: "NPTEL Robotics Series", url: "https://nptel.ac.in/courses/112105249" }
        ]
    },
    {
        title: "Mechatronics",
        category: "Automation",
        description: "Interface microcontroller boards, rotary encoders, servo actuators, PID feedback loop calculations.",
        difficulty: "Intermediate",
        time: "25 Hours",
        prereq: "PLC",
        skills: ["Rotary Encoder Interfaces", "PID Coefficient Tuning", "Actuator Driver Wiring"],
        order: 43,
        links: [
            { name: "NPTEL Mechatronics", url: "https://nptel.ac.in/courses/112103174" }
        ]
    },
    {
        title: "Industrial Automation",
        category: "Automation",
        description: "Design pneumatic cylinder circuits, hydraulic valves, solenoid maps, fieldbus communications.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Mechatronics",
        skills: ["Pneumatic Valve Circuitry", "Hydraulic Sizing Calculus", "Solenoid Output Tables"],
        order: 44,
        links: [
            { name: "NPTEL Automation Circuits", url: "https://nptel.ac.in/courses/112102011" }
        ]
    },
    {
        title: "Industry 4.0",
        category: "Automation",
        description: "Deploy factory sensor clusters: OPC-UA servers, edge device aggregators, cloud dashboards.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "None",
        skills: ["IoT Industrial Sensors", "OPC-UA Server Mapping", "Smart Factory Analytics"],
        order: 45,
        links: [
            { name: "NPTEL Industry 4.0 Series", url: "https://nptel.ac.in/courses/106105195" }
        ]
    },
    {
        title: "Digital Twin",
        category: "Automation",
        description: "Build physical simulation twins: real-time telemetry inputs, predictive maintenance alerts.",
        difficulty: "Advanced",
        time: "20 Hours",
        prereq: "Industry 4.0",
        skills: ["Physics-based FEA Twins", "Predictive Analytics", "Real-Time Telemetry Mapping"],
        order: 46,
        links: [
            { name: "Siemens Digital Enterprise Catalog", url: "https://learn.sw.siemens.com/" }
        ]
    },

    // Programming
    {
        title: "Python",
        category: "Programming",
        description: "Learn Python script architecture: lists, dicts, math functions, matplotlib, numpy, scipy matrices.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "None",
        skills: ["Script syntax controls", "Numpy Array operations", "Matplotlib plots"],
        order: 47,
        links: [
            { name: "Python Docs Tutorial", url: "https://docs.python.org/3/" },
            { name: "NumPy Official Guides", url: "https://numpy.org/doc/stable/" }
        ]
    },
    {
        title: "MATLAB",
        category: "Programming",
        description: "Code matrix calculations, script routines, ode45 solvers, Simulink block models.",
        difficulty: "Beginner",
        time: "20 Hours",
        prereq: "Calculus",
        skills: ["Matrix Compute Syntax", "ODE45 Solver Functions", "Simulink Control Blocks"],
        order: 48,
        links: [
            { name: "MathWorks Academy Onramps", url: "https://matlabacademy.mathworks.com/" }
        ]
    },
    {
        title: "C++",
        category: "Programming",
        description: "Study structural C++: memory variables, pointers, object-oriented solvers, compilation links.",
        difficulty: "Intermediate",
        time: "30 Hours",
        prereq: "Python",
        skills: ["Memory Pointer Management", "OOP Class Formulations", "Compilation Setup"],
        order: 49,
        links: [
            { name: "NPTEL C++ Course", url: "https://nptel.ac.in/courses/106105151" }
        ]
    },
    {
        title: "SQL",
        category: "Programming",
        description: "Draft database operations: table indexing, SELECT queries, database schema files.",
        difficulty: "Beginner",
        time: "15 Hours",
        prereq: "None",
        skills: ["Relational Database Indexing", "SQL Query Joins", "Schema Structures"],
        order: 50,
        links: [
            { name: "NPTEL Database Management", url: "https://nptel.ac.in/courses/106106093" }
        ]
    },
    {
        title: "Git & GitHub",
        category: "Programming",
        description: "Commit project code, branch features, resolve merge conflicts, track history.",
        difficulty: "Beginner",
        time: "10 Hours",
        prereq: "None",
        skills: ["Git Commit History", "Feature Branch Toggles", "Pull Request Approvals"],
        order: 51,
        links: [
            { name: "GitHub Official Guides", url: "https://docs.github.com/en/get-started" }
        ]
    }
];

const ROADMAPS_DATABASE = {
    "Mechanical Engineer": {
        time: "185 Hours",
        software: ["SolidWorks", "AutoCAD"],
        certs: ["ASME Member / Cert"],
        project: "Design of a multi-stage gear reduction gearbox with shaft sizing",
        courses: ["Engineering Drawing", "Engineering Mechanics", "Strength of Materials", "Fluid Mechanics", "Thermodynamics", "Materials Science", "SolidWorks"]
    },
    "Design Engineer": {
        time: "190 Hours",
        software: ["SolidWorks", "CATIA", "ANSYS"],
        certs: ["CSWP (Certified SolidWorks Professional)", "ASME GD&T Professional"],
        project: "3D CAD modeling and GD&T tolerancing of a steering knuckle",
        courses: ["Engineering Drawing", "Calculus", "SolidWorks", "CATIA", "Strength of Materials", "Machine Design", "Finite Element Analysis"]
    },
    "Manufacturing Engineer": {
        time: "110 Hours",
        software: ["Fusion 360", "AutoCAD"],
        certs: ["Six Sigma Green Belt", "SME Certified Manufacturing Engineer"],
        project: "G-code CNC programming and toolpath optimization for an aluminum impeller",
        courses: ["Manufacturing Processes", "Metrology", "CNC Programming", "Machining", "Lean Manufacturing", "Six Sigma"]
    },
    "Production Engineer": {
        time: "115 Hours",
        software: ["AutoCAD", "Excel Solver"],
        certs: ["APICS CPIM Logistics Cert", "Lean Bronze"],
        project: "Plant layout optimization and value stream mapping for assembly line",
        courses: ["Manufacturing Processes", "Lean Manufacturing", "Industrial Engineering", "Six Sigma", "SCADA", "Industry 4.0"]
    },
    "Quality Engineer": {
        time: "95 Hours",
        software: ["Minitab", "SQL"],
        certs: ["ASQ Certified Quality Engineer (CQE)", "Six Sigma Green Belt"],
        project: "Statistical Process Control (SPC) implementation for machining line",
        courses: ["Probability & Statistics", "Metrology", "Six Sigma", "Lean Manufacturing", "Industrial Engineering"]
    },
    "Maintenance Engineer": {
        time: "120 Hours",
        software: ["SAP PM", "MATLAB"],
        certs: ["Certified Maintenance & Reliability Professional (CMRP)"],
        project: "Predictive maintenance scheduling model based on vibration data analysis",
        courses: ["Theory of Machines", "Mechatronics", "Tribology", "Industrial Automation", "Digital Twin"]
    },
    "HVAC Engineer": {
        time: "120 Hours",
        software: ["HAP (Hourly Analysis Program)", "ANSYS Fluent"],
        certs: ["ASHRAE Certified HVAC Designer (CHD)"],
        project: "Heat load calculation and duct routing design for a commercial office building",
        courses: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer", "CFD Fundamentals", "AutoCAD"]
    },
    "Automotive Engineer": {
        time: "170 Hours",
        software: ["SolidWorks", "ANSYS", "MATLAB"],
        certs: ["SAE Member / Certification"],
        project: "Design and stress analysis of a Formula SAE chassis space frame",
        courses: ["Engineering Mechanics", "Theory of Machines", "Machine Design", "SolidWorks", "ANSYS Mechanical", "Python"]
    },
    "Aerospace Engineer": {
        time: "200 Hours",
        software: ["ANSYS Fluent", "OpenFOAM", "MATLAB"],
        certs: ["AIAA Professional Member"],
        project: "Aerodynamic lift and drag simulation of a supercritical wing section",
        courses: ["Calculus", "Differential Equations", "Fluid Mechanics", "CFD Fundamentals", "ANSYS Fluent", "OpenFOAM"]
    },
    "Robotics Engineer": {
        time: "185 Hours",
        software: ["MATLAB", "ROS (Robot Operating System)"],
        certs: ["IEEE Robotics Certification"],
        project: "Forward kinematics simulation and trajectory planning for a 6-axis manipulator",
        courses: ["Linear Algebra", "C++", "Python", "PLC", "Robotics", "Mechatronics", "Industrial Automation"]
    },
    "CFD Engineer": {
        time: "215 Hours",
        software: ["ANSYS Fluent", "OpenFOAM", "MATLAB"],
        certs: ["ANSYS Certified Professional"],
        project: "CFD analysis of conjugate heat transfer in an electronics cooling block",
        courses: ["Differential Equations", "Fluid Mechanics", "Heat Transfer", "CFD Fundamentals", "ANSYS Fluent", "OpenFOAM", "Python"]
    },
    "FEA Engineer": {
        time: "185 Hours",
        software: ["ANSYS Mechanical", "Abaqus", "MATLAB"],
        certs: ["ANSYS Certified Professional (FEA)"],
        project: "Non-linear crashworthiness simulation of an automotive impact crash box",
        courses: ["Linear Algebra", "Strength of Materials", "Finite Element Analysis", "ANSYS Mechanical", "Abaqus", "C++"]
    }
};

let userCompletedCourses = [];
let userBookmarkedCourses = [];
let userCourseNotes = {};

function initLearningHub() {
    const completed = localStorage.getItem("userCompletedCourses");
    userCompletedCourses = completed ? JSON.parse(completed) : [];

    const bookmarked = localStorage.getItem("userBookmarkedCourses");
    userBookmarkedCourses = bookmarked ? JSON.parse(bookmarked) : [];

    const notes = localStorage.getItem("userCourseNotes");
    userCourseNotes = notes ? JSON.parse(notes) : {};

    updateLearningStats();
}

function updateLearningStats() {
    const completedCount = userCompletedCourses.length;
    document.getElementById("learn-stat-completed").innerText = completedCount;
    document.getElementById("learn-stat-completed-pct").innerText = `${Math.round((completedCount / COURSES_DATABASE.length) * 100)}% Complete`;
    
    // Each completed course represents study hours
    const totalHours = userCompletedCourses.reduce((sum, title) => {
        const course = COURSES_DATABASE.find(c => c.title === title);
        if (course) {
            return sum + parseInt(course.time);
        }
        return sum + 20;
    }, 0);
    document.getElementById("learn-stat-hours").innerText = `${totalHours} hrs`;

    // Streak and XP rewards
    const streak = Math.max(1, Math.floor(completedCount / 3) + 1);
    document.getElementById("learn-stat-streak").innerText = `${streak} Day${streak > 1 ? 's' : ''}`;
}

function renderCourses() {
    const searchVal = document.getElementById("learn-search-input").value.toLowerCase();
    const categoryVal = document.getElementById("learn-category-filter").value;
    const difficultyVal = document.getElementById("learn-difficulty-filter").value;
    const favoritesOnly = document.getElementById("learn-btn-favorites").classList.contains("active");

    const grid = document.getElementById("learning-course-grid");
    grid.innerHTML = "";

    const filtered = COURSES_DATABASE.filter(course => {
        // Search filter
        if (searchVal) {
            const matchesSearch = 
                course.title.toLowerCase().includes(searchVal) ||
                course.description.toLowerCase().includes(searchVal) ||
                course.prereq.toLowerCase().includes(searchVal) ||
                course.skills.some(s => s.toLowerCase().includes(searchVal));
            if (!matchesSearch) return false;
        }

        // Category filter
        if (categoryVal !== "All" && course.category !== categoryVal) return false;

        // Difficulty filter
        if (difficultyVal !== "All" && course.difficulty !== difficultyVal) return false;

        // Favorites filter
        if (favoritesOnly && !userBookmarkedCourses.includes(course.title)) return false;

        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i data-lucide="search" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
                <p>No matching subjects found in our mechanical curriculum. Try adjusting your filters.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach(course => {
        const isCompleted = userCompletedCourses.includes(course.title);
        const isBookmarked = userBookmarkedCourses.includes(course.title);
        const savedNote = userCourseNotes[course.title] || "";
        const videoLesson = VIDEO_LESSONS[course.title] || null;

        const videoBlock = videoLesson ? `
            <div class="course-video-wrap" style="margin-bottom: 0.9rem;">
                <video controls preload="metadata" playsinline style="width:100%; display:block; border-radius:12px; background:#000; aspect-ratio:16/9;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                    <source src="${videoLesson.src}" type="video/mp4">
                    Your browser does not support embedded video.
                </video>
                <div style="display:none; padding:0.7rem 0.8rem; background:rgba(255,255,255,0.04); border:1px solid var(--border-color); border-radius:12px; color:var(--text-muted); font-size:0.75rem;">
                    <i data-lucide="video-off" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                    Visualization video is not bundled in this build. Use the free resources below to continue.
                </div>
                <div style="padding:0.45rem 0.1rem 0; font-size:0.75rem; color:var(--text-secondary);">
                    <span style="color:var(--primary); font-weight:600;">&#9654; ${videoLesson.label}</span> &mdash; ${videoLesson.caption}
                </div>
            </div>
        ` : '';

        const card = document.createElement("div");
        card.className = `glass-card course-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div>
                <div class="course-card-meta">
                    <span class="course-badge ${course.difficulty.toLowerCase()}">${course.difficulty}</span>
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <span style="color: var(--text-muted); font-size: 0.75rem;"><i data-lucide="clock" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:2px;"></i> ${course.time}</span>
                        <button class="course-btn-bookmark ${isBookmarked ? 'active' : ''}" onclick="toggleCourseBookmark('${course.title.replace(/'/g, "\\'")}')">
                            <i data-lucide="star" style="width: 16px; height: 16px; fill: ${isBookmarked ? '#f59e0b' : 'none'};"></i>
                        </button>
                    </div>
                </div>
                
                ${videoBlock}
                
                <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    ${course.title}
                    ${isCompleted ? ' <i data-lucide="check-circle-2" style="color: var(--success); width: 16px; height: 16px;"></i>' : ''}
                </h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.75rem;">${course.description}</p>
                
                <div style="font-size: 0.75rem; margin-bottom: 0.5rem;">
                    <strong>Prerequisites:</strong> <span style="color: var(--text-secondary);">${course.prereq}</span>
                </div>
                <div style="font-size: 0.75rem; margin-bottom: 0.75rem;">
                    <strong>Skills Gained:</strong> 
                    <div style="display:flex; flex-wrap:wrap; gap:0.25rem; margin-top:0.25rem;">
                        ${course.skills.map(s => `<span class="badge badge-medium" style="background: rgba(255,255,255,0.04); font-size:0.7rem;">${s}</span>`).join('')}
                    </div>
                </div>

                <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
                    <strong style="font-size: 0.75rem; display:block; margin-bottom:0.25rem;">Free Resources:</strong>
                    <div style="display:flex; flex-direction:column; gap:0.25rem;">
                        ${course.links.map(l => `
                            <a href="${l.url}" target="_blank" style="font-size:0.75rem; color: var(--primary); display:flex; align-items:center; gap:0.25rem; text-decoration:none;">
                                <i data-lucide="external-link" style="width:12px; height:12px;"></i> ${l.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                <textarea class="course-notes-area" placeholder="Take study notes here (auto-saved)..." oninput="saveCourseNote('${course.title.replace(/'/g, "\\'")}', this.value)">${savedNote}</textarea>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
                    <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
                        <input type="checkbox" style="cursor:pointer;" ${isCompleted ? 'checked' : ''} onchange="toggleCourseCompletion('${course.title.replace(/'/g, "\\'")}', this.checked)">
                        Mark as Completed
                    </label>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Recommended Order: #${course.order}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function toggleCourseBookmark(title) {
    const idx = userBookmarkedCourses.indexOf(title);
    if (idx === -1) {
        userBookmarkedCourses.push(title);
    } else {
        userBookmarkedCourses.splice(idx, 1);
    }
    localStorage.setItem("userBookmarkedCourses", JSON.stringify(userBookmarkedCourses));
    renderCourses();
}

function saveCourseNote(title, text) {
    userCourseNotes[title] = text;
    localStorage.setItem("userCourseNotes", JSON.stringify(userCourseNotes));
}

function toggleCourseCompletion(title, isChecked) {
    const idx = userCompletedCourses.indexOf(title);
    if (isChecked && idx === -1) {
        userCompletedCourses.push(title);
        userXP += 100;
        localStorage.setItem("userXP", userXP);
    } else if (!isChecked && idx !== -1) {
        userCompletedCourses.splice(idx, 1);
        userXP = Math.max(0, userXP - 100);
        localStorage.setItem("userXP", userXP);
    }
    
    localStorage.setItem("userCompletedCourses", JSON.stringify(userCompletedCourses));
    updateLearningStats();
    renderCourses();
    
    if (targetProfile) {
        buildDashboard(targetProfile);
    }
}

// Learning Roadmaps Logic
function renderActiveRoadmap() {
    const selector = document.getElementById("roadmap-selector");
    const role = selector.value;
    const data = ROADMAPS_DATABASE[role];

    if (!data) return;

    // Render specifications
    document.getElementById("roadmap-est-time").innerText = data.time;
    
    const swWrapper = document.getElementById("roadmap-req-sw-wrapper");
    swWrapper.innerHTML = data.software.map(sw => `<span class="badge badge-accent">${sw}</span>`).join('');
    
    const certsWrapper = document.getElementById("roadmap-certs-wrapper");
    certsWrapper.innerHTML = data.certs.map(c => `<span class="badge badge-medium">${c}</span>`).join('');
    
    document.getElementById("roadmap-project-desc").innerText = data.project;

    // Render timeline steps
    const stepsContainer = document.getElementById("roadmap-steps-container");
    stepsContainer.innerHTML = "";

    let completedRequiredCount = 0;
    
    data.courses.forEach((courseTitle, idx) => {
        const course = COURSES_DATABASE.find(c => c.title === courseTitle);
        if (!course) return;

        const isCompleted = userCompletedCourses.includes(courseTitle);
        if (isCompleted) completedRequiredCount++;

        const stepDiv = document.createElement("div");
        const isPrevCompleted = idx === 0 || userCompletedCourses.includes(data.courses[idx - 1]);
        const isActive = !isCompleted && isPrevCompleted;

        stepDiv.className = `roadmap-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
        stepDiv.innerHTML = `
            <div class="roadmap-node-indicator">
                ${isCompleted ? '✓' : idx + 1}
            </div>
            <div class="roadmap-node-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                    <strong style="font-size:0.9rem;">Step ${idx + 1}: ${courseTitle}</strong>
                    <span class="course-badge ${course.difficulty.toLowerCase()}" style="font-size:0.65rem;">${course.difficulty}</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">${course.description}</p>
                <div style="margin-top:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.7rem; color:var(--text-muted);"><i data-lucide="clock" style="width:10px; height:10px; display:inline-block;"></i> ${course.time}</span>
                    <label style="font-size:0.75rem; display:flex; align-items:center; gap:0.25rem; cursor:pointer;">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleRoadmapCourseCompletion('${courseTitle.replace(/'/g, "\\'")}', this.checked)">
                        Complete
                    </label>
                </div>
            </div>
        `;
        stepsContainer.appendChild(stepDiv);
    });

    const progressPct = Math.round((completedRequiredCount / data.courses.length) * 100);
    document.getElementById("roadmap-progress-val").innerText = `${progressPct}%`;

    // Draw Plotly Bar Chart
    drawRoadmapBarChart(data.courses);
    lucide.createIcons();
}

function toggleRoadmapCourseCompletion(title, isChecked) {
    toggleCourseCompletion(title, isChecked);
    renderActiveRoadmap();
}

function drawRoadmapBarChart(roadmapCourses) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    
    const categories = {};
    roadmapCourses.forEach(title => {
        const course = COURSES_DATABASE.find(c => c.title === title);
        if (course) {
            categories[course.category] = (categories[course.category] || 0) + 1;
        }
    });

    const labels = Object.keys(categories);
    const totals = labels.map(l => categories[l]);
    const completed = labels.map(l => {
        return roadmapCourses.filter(title => {
            const course = COURSES_DATABASE.find(c => c.title === title);
            return course && course.category === l && userCompletedCourses.includes(title);
        }).length;
    });

    const traceCompleted = {
        x: labels,
        y: completed,
        name: 'Completed',
        type: 'bar',
        marker: { color: '#10b981' }
    };

    const traceTotal = {
        x: labels,
        y: totals.map((val, idx) => val - completed[idx]),
        name: 'Remaining',
        type: 'bar',
        marker: { color: 'rgba(255,255,255,0.06)' }
    };

    const data = [traceCompleted, traceTotal];
    const layout = {
        barmode: 'stack',
        margin: { t: 10, b: 30, l: 30, r: 10 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 8 },
        xaxis: { color: textTheme },
        yaxis: { color: textTheme, tickformat: ',d' },
        showlegend: false
    };

    Plotly.newPlot("plotly-roadmap-bar-chart", data, layout, {responsive:true, displayModeBar:false});
}

function downloadStudyPlan() {
    const role = document.getElementById("roadmap-selector").value;
    const data = ROADMAPS_DATABASE[role];

    if (!data) return;

    let text = `====================================================\n`;
    text += `MECHINTEL LEARNING HUB - STUDY PLAN\n`;
    text += `Target Specialization: ${role}\n`;
    text += `Generated At: ${new Date().toLocaleDateString()}\n`;
    text += `====================================================\n\n`;

    text += `ESTIMATED COMPLETION DURATION: ${data.time}\n`;
    text += `REQUIRED SOFTWARE TOOLS: ${data.software.join(', ')}\n`;
    text += `RECOMMENDED CERTIFICATIONS: ${data.certs.join(', ')}\n\n`;

    text += `BENCHMARK PORTFOLIO PROJECT:\n`;
    text += `-> ${data.project}\n\n`;

    text += `SEQUENTIAL LEARNING ORDER & STEPS:\n`;
    data.courses.forEach((courseTitle, idx) => {
        const isCompleted = userCompletedCourses.includes(courseTitle) ? "[COMPLETED]" : "[ ]";
        const notes = userCourseNotes[courseTitle] || "No notes entered.";
        text += `${idx + 1}. ${isCompleted} ${courseTitle}\n`;
        text += `   - Personal Study Notes: ${notes.replace(/\n/g, '\n     ')}\n\n`;
    });

    text += `====================================================\n`;
    text += `Keep learning! The platform is 100% free and open to all.\n`;

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MechIntel_Study_Plan_${role.replace(/ /g, '_')}.txt`;
    link.click();
}

// ========================================================
// MECHINTEL AI — INTERACTIVE FEATURES IMPLEMENTATION
// ========================================================

// 1. MOCK INTERVIEW SIMULATOR DATABASE & LOGIC
const SIMULATOR_QUESTIONS = {
    "CAD Design": [
        { q: "Explain the concept of 'Bonus Tolerance' in GD&T and when it applies.", keywords: ["maximum material condition", "mmc", "departure", "size limits", "bonus"] },
        { q: "What is the difference between DFM (Design for Manufacturing) and DFA (Design for Assembly)?", keywords: ["part count", "manufacturing cost", "ease of assembly", "fasteners", "handling"] },
        { q: "How do you select the appropriate safety factor for a mechanical component under dynamic loading?", keywords: ["fatigue", "yield strength", "stress concentration", "uncertainty", "load factor"] },
        { q: "Describe a time you faced a design clash or interference in CAD and how you resolved it.", keywords: ["clash analysis", "clearance", "tolerance", "adjust", "interference"] }
    ],
    "CAE/Simulation": [
        { q: "What is the physical meaning of the Jacobian matrix check in FEA element quality checks?", keywords: ["mapping", "distortion", "coordinate system", "mesh quality", "elements"] },
        { q: "Under what circumstances would you select a dynamic transient thermal solver over a steady-state one?", keywords: ["time dependent", "heat capacity", "thermal lag", "transient", "cycles"] },
        { q: "How do you verify if your CFD simulation results are mesh-independent?", keywords: ["mesh refinement", "grid convergence", "refine", "mesh study", "error"] },
        { q: "Describe a time when a structural simulation failed to converge and how you fixed the boundary conditions.", keywords: ["singularity", "constraints", "loads", "convergence", "stiffness"] }
    ],
    "Robotics/Mechatronics": [
        { q: "Explain the difference between forward kinematics and inverse kinematics in a robotic manipulator.", keywords: ["joint angles", "end effector", "position", "dh parameters", "coordinates"] },
        { q: "How do you prevent actuator saturation when tuning PID feedback controller parameters?", keywords: ["windup", "integral limit", "saturation", "clamping", "anti-windup"] },
        { q: "What is the purpose of using a hardware-in-the-loop (HIL) testing setup in robotics control deployment?", keywords: ["simulation", "real hardware", "controller", "safety", "verification"] },
        { q: "Tell me about a mechatronic project where you had to interface sensors with a microcontroller.", keywords: ["adc", "i2c", "spi", "noise", "filtering", "calibration"] }
    ],
    "Manufacturing/Operations": [
        { q: "Explain the difference between the Cp and Cpk capability indices in statistical process control.", keywords: ["centered", "specification limits", "mean", "deviation", "capability"] },
        { q: "What are the five phases of the DMAIC process in Lean Six Sigma?", keywords: ["define", "measure", "analyze", "improve", "control"] },
        { q: "How does CNC high-speed machining (HSM) affect tool wear and surface finish compared to conventional machining?", keywords: ["chip load", "thermal", "surface roughness", "feed rate", "spindle"] },
        { q: "Explain a scenario where you had to reduce cycle times on a production line.", keywords: ["bottleneck", "value stream", "automation", "idle time", "throughput"] }
    ],
    "HVAC/Thermal": [
        { q: "What is the Sensible Heat Factor (SHF) in psychrometric calculations and why is it important for cooling coil sizing?", keywords: ["sensible heat", "total heat", "moisture removal", "latent", "coil"] },
        { q: "Explain the working principle of a Variable Refrigerant Flow (VRF) heat pump system.", keywords: ["compressor speed", "inverter", "refrigerant", "zoning", "loads"] },
        { q: "How do you size HVAC duct networks using the equal friction method?", keywords: ["pressure drop", "velocity limit", "aspect ratio", "duct sizer", "friction"] },
        { q: "Tell me about a thermal load calculation problem you solved for an office layout.", keywords: ["solar gain", "occupants", "lighting load", "ventilation", "envelope"] }
    ]
};

const HR_SIM_QUESTION = { q: "Describe a major group project conflict or failure you resolved. Apply the STAR format in your response.", keywords: ["situation", "task", "action", "result"] };

let interviewQuestions = [];
let interviewQuestionIndex = 0;
let interviewAnswersScores = [];
let isInterviewOngoing = false;

function initInterviewSimulator() {
    const startBtn = document.getElementById("btn-start-interview-session");
    const submitBtn = document.getElementById("btn-submit-interview-ans");
    
    if (startBtn) {
        startBtn.addEventListener("click", startMockInterviewSession);
    }
    if (submitBtn) {
        submitBtn.addEventListener("click", submitMockInterviewResponse);
    }
}

function startMockInterviewSession() {
    const cluster = targetProfile?.cluster || "CAD Design";
    let list = SIMULATOR_QUESTIONS[cluster];
    if (!list) list = SIMULATOR_QUESTIONS["CAD Design"];
    
    // Choose 3 random tech questions + 1 HR question
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    interviewQuestions = shuffled.slice(0, 3);
    interviewQuestions.push(HR_SIM_QUESTION);
    
    interviewQuestionIndex = 0;
    interviewAnswersScores = [];
    isInterviewOngoing = true;
    
    document.getElementById("interview-target-domain").innerText = cluster;
    document.getElementById("interview-question-num").innerText = `1 / 4`;
    document.getElementById("interview-input-container").style.display = "flex";
    document.getElementById("interview-control-buttons").style.display = "none";
    
    const chatLog = document.getElementById("interview-chat-log-box");
    chatLog.innerHTML = `
        <div class="interview-message interviewer">
            <strong>Interviewer:</strong> Hello! Welcome to your technical alignment session. I'll be auditing your competencies in <strong>${cluster}</strong>. Let's start with the first question:
        </div>
        <div class="interview-message interviewer">
            <strong>Interviewer:</strong> ${interviewQuestions[0].q}
        </div>
    `;
    chatLog.scrollTop = chatLog.scrollHeight;
}

function submitMockInterviewResponse() {
    const input = document.getElementById("interview-user-response");
    const response = input.value.trim();
    if (response.length < 10) {
        alert("Please provide a detailed response (at least 10 characters).");
        return;
    }
    
    const chatLog = document.getElementById("interview-chat-log-box");
    
    // Append user answer
    chatLog.innerHTML += `
        <div class="interview-message user">
            <strong>You:</strong> ${response}
        </div>
    `;
    
    // Score answer
    const currentQ = interviewQuestions[interviewQuestionIndex];
    const userLower = response.toLowerCase();
    const matched = currentQ.keywords.filter(kw => userLower.includes(kw));
    const score = Math.round((matched.length / currentQ.keywords.length) * 100);
    interviewAnswersScores.push(score);
    
    // Append feedback
    let feedback = "";
    if (score >= 70) {
        feedback = `Excellent response! You correctly highlighted core technical concepts like <strong>${matched.join(', ')}</strong>.`;
    } else if (score >= 40) {
        feedback = `Good attempt, but could be more robust. You mentioned <strong>${matched.join(', ')}</strong>. Try to also incorporate concepts like: <strong>${currentQ.keywords.filter(k => !matched.includes(k)).join(', ')}</strong>.`;
    } else {
        feedback = `Your answer is lacking key industry terms. To boost ATS and technical rating, incorporate terminology like: <strong>${currentQ.keywords.join(', ')}</strong>.`;
    }
    
    chatLog.innerHTML += `
        <div class="interview-message interviewer">
            <strong>Interviewer:</strong> [Score: ${score}/100] ${feedback}
        </div>
    `;
    
    input.value = "";
    interviewQuestionIndex++;
    
    if (interviewQuestionIndex < 4) {
        document.getElementById("interview-question-num").innerText = `${interviewQuestionIndex + 1} / 4`;
        setTimeout(() => {
            chatLog.innerHTML += `
                <div class="interview-message interviewer">
                    <strong>Interviewer:</strong> Next question: ${interviewQuestions[interviewQuestionIndex].q}
                </div>
            `;
            chatLog.scrollTop = chatLog.scrollHeight;
        }, 1000);
    } else {
        // Complete interview session
        isInterviewOngoing = false;
        const avgScore = Math.round(interviewAnswersScores.reduce((a, b) => a + b, 0) / 4);
        const xpEarned = avgScore * 2;
        
        userXP += xpEarned;
        localStorage.setItem("userXP", userXP);
        
        // Boost interview readiness index in header
        document.getElementById("val-interview-readiness-badge").innerText = `Readiness: ${Math.max(40, avgScore)}%`;
        
        chatLog.innerHTML += `
            <div class="interview-message system">
                🎉 Session Completed! Average Score: ${avgScore}% | XP Awarded: +${xpEarned} XP.<br>
                Your profile readiness stands updated. Return here anytime to practice new cases.
            </div>
        `;
        
        document.getElementById("interview-input-container").style.display = "none";
        document.getElementById("interview-control-buttons").style.display = "flex";
        document.getElementById("btn-start-interview-session").innerText = "Restart Mock Interview";
        
        // Re-draw dashboard metrics
        if (targetProfile) {
            updateScoresDisplay(calculateScores(targetProfile));
        }
    }
    chatLog.scrollTop = chatLog.scrollHeight;
}


// 2. INTERACTIVE CAD TOLERANCE STACKUP & FEA WIDGET
function initToleranceSimulator() {
    const sliderHoleNom = document.getElementById("slider-hole-nom");
    const sliderHoleTol = document.getElementById("slider-hole-tol");
    const sliderShaftNom = document.getElementById("slider-shaft-nom");
    const sliderShaftTol = document.getElementById("slider-shaft-tol");
    const btnCheckQuiz = document.getElementById("btn-check-tol-challenge");
    
    if (sliderHoleNom) {
        const updateAll = () => {
            updateToleranceResults();
        };
        sliderHoleNom.addEventListener("input", updateAll);
        sliderHoleTol.addEventListener("input", updateAll);
        sliderShaftNom.addEventListener("input", updateAll);
        sliderShaftTol.addEventListener("input", updateAll);
        
        document.querySelectorAll("input[name='tol-method']").forEach(radio => {
            radio.addEventListener("change", updateAll);
        });
    }
    
    if (btnCheckQuiz) {
        btnCheckQuiz.addEventListener("click", checkToleranceQuiz);
    }
    
    updateToleranceResults();
}

function updateToleranceResults() {
    const holeNom = parseFloat(document.getElementById("slider-hole-nom").value);
    const holeTol = parseFloat(document.getElementById("slider-hole-tol").value);
    const shaftNom = parseFloat(document.getElementById("slider-shaft-nom").value);
    const shaftTol = parseFloat(document.getElementById("slider-shaft-tol").value);
    
    document.getElementById("label-hole-nom").innerText = `${holeNom.toFixed(2)} mm`;
    document.getElementById("label-hole-tol").innerText = `${holeTol.toFixed(2)} mm`;
    document.getElementById("label-shaft-nom").innerText = `${shaftNom.toFixed(2)} mm`;
    document.getElementById("label-shaft-tol").innerText = `${shaftTol.toFixed(2)} mm`;
    
    const method = document.querySelector("input[name='tol-method']:checked").value;
    
    let minClearance = 0;
    let maxClearance = 0;
    let desc = "";
    let isClash = false;
    let rssTol = Math.sqrt(holeTol * holeTol + shaftTol * shaftTol);
    
    if (method === "worst-case") {
        minClearance = (holeNom - holeTol) - (shaftNom + shaftTol);
        maxClearance = (holeNom + holeTol) - (shaftNom - shaftTol);
    } else {
        // RSS statistical tolerance clearance bounds (3-sigma limits)
        const meanClearance = holeNom - shaftNom;
        minClearance = meanClearance - rssTol;
        maxClearance = meanClearance + rssTol;
    }
    
    if (minClearance < 0) {
        isClash = true;
        desc = `Interference Fit Detected! Possible Assembly Seizure Risk. Min Clearance: ${minClearance.toFixed(3)} mm.`;
    } else {
        desc = `Clearance Fit Guaranteed (Safe Assembly). Min Clearance: ${minClearance.toFixed(3)} mm | Max Clearance: ${maxClearance.toFixed(3)} mm.`;
    }
    
    const resultsBox = document.getElementById("tolerance-results-card");
    resultsBox.className = `fit-alert ${isClash ? 'warning' : 'safe'}`;
    resultsBox.innerHTML = `<strong>Method: ${method === 'worst-case' ? 'Worst-Case' : 'RSS Statistical (3σ)'}</strong><br>${desc}`;
    
    drawToleranceSvg(holeNom, holeTol, shaftNom, shaftTol, minClearance);
}

function drawToleranceSvg(holeNom, holeTol, shaftNom, shaftTol, minClearance) {
    const svg = document.getElementById("tolerance-svg");
    if (!svg) return;
    
    // Nominal width models (scaled mapping: 50mm -> 120px)
    const scale = 30; // pixels per mm
    const refHole = 50.00;
    
    const holeWidth = 140 + (holeNom - refHole) * scale;
    const holeMinY = 25 - holeTol * scale;
    const holeMaxY = 95 + holeTol * scale;
    
    const shaftWidth = 120 + (shaftNom - refHole) * scale;
    const shaftTolOffset = shaftTol * scale;
    
    // Draw SVG components
    svg.innerHTML = `
        <!-- Housing Block Top -->
        <rect x="50" y="5" width="${holeWidth}" height="25" fill="#334155" rx="2" />
        <!-- Housing Block Bottom -->
        <rect x="50" y="90" width="${holeWidth}" height="25" fill="#334155" rx="2" />
        <!-- Housing ID markers -->
        <line x1="${50 + holeWidth}" y1="30" x2="${50 + holeWidth}" y2="90" stroke="#475569" stroke-dasharray="2,2" />
        
        <!-- Shaft Cylinder Pin -->
        <rect x="10" y="35" width="${shaftWidth}" height="50" fill="${minClearance < 0 ? '#ef4444' : '#3b82f6'}" opacity="0.85" rx="3" />
        <!-- Shaft OD Limit -->
        <line x1="${10 + shaftWidth}" y1="35" x2="${10 + shaftWidth}" y2="85" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,1" />
        
        <!-- Clearance visual indicators -->
        <rect x="${10 + shaftWidth}" y="30" width="${Math.max(0, (50 + holeWidth) - (10 + shaftWidth))}" height="60" fill="#10b981" opacity="${minClearance < 0 ? '0' : '0.2'}" />
        
        <!-- Dimension Line Labels -->
        <line x1="10" y1="110" x2="${10 + shaftWidth}" y2="110" stroke="#64748b" stroke-width="1" marker-end="url(#arrow)" />
        <text x="${10 + shaftWidth / 2}" y="105" fill="#94a3b8" font-size="8" text-anchor="middle">Shaft (d = ${shaftNom.toFixed(2)})</text>
        
        <line x1="50" y1="18" x2="${50 + holeWidth}" y2="18" stroke="#94a3b8" stroke-width="1" />
        <text x="${50 + holeWidth / 2}" y="13" fill="#cbd5e1" font-size="8" text-anchor="middle">Hole (D = ${holeNom.toFixed(2)})</text>
    `;
}

function checkToleranceQuiz() {
    const input = document.getElementById("tol-challenge-input").value.trim();
    const fb = document.getElementById("tol-challenge-feedback");
    
    // Hole tol = 0.03, Shaft tol = 0.02. RSS stacked tolerance = sqrt(0.03^2 + 0.02^2) = sqrt(0.0009 + 0.0004) = sqrt(0.0013) = 0.036 mm
    const ansVal = parseFloat(input);
    if (Math.abs(ansVal - 0.036) <= 0.005) {
        fb.innerText = "🎉 Correct! RSS tolerance stackup limit is exactly ±0.036 mm.";
        fb.style.color = "var(--success)";
        
        userXP += 100;
        localStorage.setItem("userXP", userXP);
        if (targetProfile) {
            updateScoresDisplay(calculateScores(targetProfile));
        }
    } else {
        fb.innerText = "❌ Incorrect. Hint: standard formula T_rss = √(T_hole² + T_shaft²).";
        fb.style.color = "var(--danger)";
    }
}


// 3. SMART RESUME OPTIMIZER & SCORE BOOSTER LOGIC
function renderResumeScoreBoosters() {
    const listContainer = document.getElementById("booster-recommendations-list");
    if (!listContainer || !targetProfile) return;
    
    listContainer.innerHTML = "";
    
    const userKeywords = targetProfile.skills.concat(targetProfile.software_tools).map(s => s.toLowerCase());
    
    const optimizationItems = [
        { key: "gd&t", label: "Include 'GD&T' or 'ASME Y14.5' keywords", pts: "+12% ATS Match", check: () => userKeywords.some(k => k.includes("gd&t") || k.includes("y14.5")), action: () => { document.getElementById("skills-text-input").focus(); } },
        { key: "solidworks", label: "Add 'SolidWorks' software certification profile", pts: "+10% Score", check: () => userKeywords.some(k => k.includes("solidworks")), action: () => { document.getElementById("tools-text-input").focus(); } },
        { key: "ansys", label: "Add FEA keywords ('ANSYS' or 'Abaqus')", pts: "+8% Match", check: () => userKeywords.some(k => k.includes("ansys") || k.includes("abaqus")), action: () => { document.getElementById("tools-text-input").focus(); } },
        { key: "portfolio", label: "Provide a verified GrabCAD or GitHub portfolio URL", pts: "+10% Recruiter Rating", check: () => targetProfile.portfolio && targetProfile.portfolio.includes("http"), action: () => { showDashboardView("dashboard-profile"); } },
        { key: "publications", label: "Add academic research publication counts", pts: "+5% Employability", check: () => targetProfile.research_papers > 0, action: () => { showDashboardView("dashboard-profile"); } }
    ];
    
    optimizationItems.forEach(item => {
        const met = item.check();
        const row = document.createElement("div");
        row.className = `booster-row ${met ? 'completed' : ''}`;
        row.innerHTML = `
            <div class="booster-details">
                <i data-lucide="${met ? 'check-circle' : 'circle'}" style="color:${met ? 'var(--success)' : 'var(--text-muted)'}; width:16px; height:16px;"></i>
                <span>${item.label}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <span class="booster-points">${item.pts}</span>
                ${!met ? `<button class="btn btn-outline btn-xs" style="padding:0.2rem 0.4rem; font-size:0.7rem;" id="btn-fix-${item.key}">Fix</button>` : ''}
            </div>
        `;
        
        listContainer.appendChild(row);
        
        if (!met) {
            document.getElementById(`btn-fix-${item.key}`).addEventListener("click", item.action);
        }
    });
    
    lucide.createIcons();
}

function runResumeOptimizer() {
    const statusText = document.getElementById("optimizer-status-text");
    statusText.innerText = "Analyzing document nodes & running local ATS cleaner...";
    
    setTimeout(() => {
        // Upgrade targetProfile directly
        if (targetProfile) {
            const extraSkills = ["GD&T (Geometric Dimensioning & Tolerancing)", "Tolerance Stackup Analysis"];
            const extraSoftware = ["SolidWorks", "ANSYS"];
            const extraCerts = ["CSWP (Certified SolidWorks Professional)"];
            
            extraSkills.forEach(s => { if (!targetProfile.skills.includes(s)) targetProfile.skills.push(s); });
            extraSoftware.forEach(sw => { if (!targetProfile.software_tools.includes(sw)) targetProfile.software_tools.push(sw); });
            extraCerts.forEach(c => { if (!targetProfile.certifications.includes(c)) targetProfile.certifications.push(c); });
            
            // Recalculate and display scores
            userXP += 100;
            localStorage.setItem("userXP", userXP);
            buildDashboard(targetProfile);
            
            statusText.innerText = "✅ Resume cleaned and standardized! Recruiter match rating boosted.";
            renderResumeScoreBoosters();
        } else {
            statusText.innerText = "No profile active. Please paste resume first.";
        }
    }, 1500);
}


// 4. DAY-IN-THE-LIFE OPERATIONS SIMULATOR CASES & LOGIC
const SIMULATION_CASES = {
    "EV battery heat crisis": {
        steps: [
            {
                story: "The battery pack of a new electric SUV prototype is thermal throttling during 150kW fast charging. Tests show cells are exceeding 55°C (131°F). The lead battery systems engineer asks for your immediate sizing recommendation. What do you do first?",
                choices: [
                    { text: "Increase coolant flow velocity through the liquid cooling plate.", cost: { stability: +10, budget: -15, timeline: -5 } },
                    { text: "Swap coolant from pure water to a 50/50 water-glycol mix.", cost: { stability: +15, budget: -5, timeline: -10 } },
                    { text: "Add high-conductivity Thermal Interface Material (TIM) between cells and plate.", cost: { stability: +25, budget: -10, timeline: -5 } }
                ]
            },
            {
                story: "You applied the thermal interface materials. Cell temperatures dropped, but coolant pump cavitation is now reported due to increased pressure drop in the microchannels. The timeline is slipping. How do you resolve this?",
                choices: [
                    { text: "Increase cooling channel width to reduce hydraulic resistance.", cost: { stability: -10, budget: -10, timeline: +10 } },
                    { text: "Replace the coolant pump with a high-head industrial pump.", cost: { stability: +15, budget: -20, timeline: +5 } },
                    { text: "Optimize microchannel geometry using CFD boundary layer refinements.", cost: { stability: +20, budget: -5, timeline: -15 } }
                ]
            },
            {
                story: "CFD optimization succeeded. During manufacturing review, the toolmaker reports that the variable-width channels cannot be machined using conventional extrusion. How do you adjust the design for manufacturing (DFM)?",
                choices: [
                    { text: "Use additive manufacturing (3D printing) for the cooling plates.", cost: { stability: +25, budget: -30, timeline: +10 } },
                    { text: "Simplify variable-width channels to flat constant-width slots.", cost: { stability: +10, budget: +10, timeline: +15 } },
                    { text: "Deploy vacuum brazing of stamped sheet-metal plates.", cost: { stability: +20, budget: -15, timeline: +5 } }
                ]
            }
        ]
    },
    "Compressor shaft seizure": {
        steps: [
            {
                story: "A high-speed rotating compressor shaft is seizing up on the assembly line during prototype run tests. Quality reports show tolerances are clashing. What is your first action?",
                choices: [
                    { text: "Tighten shaft machining tolerances on the lathe specifications.", cost: { stability: +15, budget: -20, timeline: -5 } },
                    { text: "Implement statistical RSS limits to identify out-of-spec batches.", cost: { stability: +25, budget: -5, timeline: -10 } },
                    { text: "Increase nominal hole diameter of the housing block.", cost: { stability: +10, budget: -15, timeline: -5 } }
                ]
            },
            {
                story: "RSS limits isolated the bad batches. However, shafts from standard suppliers are still yielding under dynamic vibration. Fatigue calculations show microcracks. How do you reinforce the shaft?",
                choices: [
                    { text: "Apply shot-peening to introduce compressive residual stress.", cost: { stability: +25, budget: -10, timeline: -5 } },
                    { text: "Increase shaft radius by 10% (adjust machine blueprints).", cost: { stability: +20, budget: -15, timeline: -15 } },
                    { text: "Switch material specification from structural steel to titanium.", cost: { stability: +30, budget: -35, timeline: -5 } }
                ]
            },
            {
                story: "The reinforced shaft resolved yield risks. But dynamic bearing noise now exceeds 75dB regulatory limits. Recruiter validation requires a silencer checklist. How do you solve the noise?",
                choices: [
                    { text: "Apply high-viscosity lubricating synthetic grease.", cost: { stability: +10, budget: -5, timeline: +10 } },
                    { text: "Switch the ball bearings to low-noise ceramic hybrid bearings.", cost: { stability: +25, budget: -25, timeline: +5 } },
                    { text: "Install elastomer dampening mounts to decouple compressor housing.", cost: { stability: +20, budget: -15, timeline: +10 } }
                ]
            }
        ]
    }
};

let simActiveCase = "EV battery heat crisis";
let simActiveStep = 0;
let simStability = 100;
let simTimeline = 100;
let simBudget = 100;
let simOngoing = false;

function initSimulationEngine() {
    const resetBtn = document.getElementById("btn-reset-sim");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => { startSimulationCase(simActiveCase); });
    }
    startSimulationCase("EV battery heat crisis");
}

function startSimulationCase(caseId) {
    simActiveCase = caseId;
    simActiveStep = 0;
    simStability = 100;
    simTimeline = 100;
    simBudget = 100;
    simOngoing = true;
    
    document.getElementById("sim-case-title").innerText = caseId;
    document.getElementById("btn-reset-sim").style.display = "none";
    
    updateSimulationMeters();
    renderSimulationStep();
}

function renderSimulationStep() {
    const scenario = SIMULATION_CASES[simActiveCase];
    const step = scenario.steps[simActiveStep];
    
    document.getElementById("sim-step-num").innerText = `Step: ${simActiveStep + 1} / 3`;
    document.getElementById("sim-story-text-box").innerText = step.story;
    
    const choicesBox = document.getElementById("sim-choices-box");
    choicesBox.innerHTML = "";
    
    step.choices.forEach((choice, idx) => {
        const btn = document.createElement("button");
        btn.className = "sim-choice-btn";
        btn.innerText = `${String.fromCharCode(65 + idx)}. ${choice.text}`;
        btn.addEventListener("click", () => { handleSimulationChoice(choice); });
        choicesBox.appendChild(btn);
    });
}

function handleSimulationChoice(choice) {
    if (!simOngoing) return;
    
    // Apply costs
    simStability = Math.min(100, Math.max(0, simStability + choice.cost.stability));
    simTimeline = Math.min(100, Math.max(0, simTimeline + choice.cost.timeline));
    simBudget = Math.min(100, Math.max(0, simBudget + choice.cost.budget));
    
    updateSimulationMeters();
    
    // Check failure conditions
    if (simStability <= 10 || simTimeline <= 10 || simBudget <= 10) {
        simOngoing = false;
        document.getElementById("sim-story-text-box").innerHTML = `
            💥 <strong>Mission Failure!</strong> your resources have bottomed out. 
            Stability: ${simStability}%, Timeline: ${simTimeline}%, Budget: ${simBudget}%. 
            Mechanical systems designs require balanced parameters. Click below to try again.
        `;
        document.getElementById("sim-choices-box").innerHTML = "";
        document.getElementById("btn-reset-sim").style.display = "block";
        return;
    }
    
    simActiveStep++;
    if (simActiveStep < 3) {
        renderSimulationStep();
    } else {
        // Completed Case
        simOngoing = false;
        const rewardXP = Math.round((simStability + simTimeline + simBudget) / 3) * 2;
        userXP += rewardXP;
        localStorage.setItem("userXP", userXP);
        
        document.getElementById("sim-story-text-box").innerHTML = `
            🏆 <strong>Simulation Successfully Resolved!</strong><br>
            You balanced parameters and resolved the engineering crisis. <br>
            Final Scores - Stability: ${simStability}%, Timeline: ${simTimeline}%, Budget: ${simBudget}%.<br>
            Reward Unlocked: <strong>+${rewardXP} XP</strong>.
        `;
        document.getElementById("sim-choices-box").innerHTML = "";
        
        // Add select next scenario buttons
        const choicesBox = document.getElementById("sim-choices-box");
        const nextCase = simActiveCase === "EV battery heat crisis" ? "Compressor shaft seizure" : "EV battery heat crisis";
        
        const nextBtn = document.createElement("button");
        nextBtn.className = "btn btn-primary";
        nextBtn.innerText = `Load Case: ${nextCase}`;
        nextBtn.addEventListener("click", () => { startSimulationCase(nextCase); });
        choicesBox.appendChild(nextBtn);
        
        if (targetProfile) {
            updateScoresDisplay(calculateScores(targetProfile));
        }
    }
}

function updateSimulationMeters() {
    const setMeter = (id, labelId, val) => {
        const fill = document.getElementById(id);
        const label = document.getElementById(labelId);
        fill.style.width = `${val}%`;
        label.innerText = `${val}%`;
        
        if (val < 30) fill.style.background = "var(--danger)";
        else if (val < 65) fill.style.background = "var(--warning)";
        else fill.style.background = "var(--success)";
    };
    
    setMeter("sim-meter-stability", "label-sim-stability", simStability);
    setMeter("sim-meter-timeline", "label-sim-timeline", simTimeline);
    setMeter("sim-meter-budget", "label-sim-budget", simBudget);
}


// 5. VISUAL PORTFOLIO GENERATOR & THEMES
function generateVisualPortfolioCode(profile, theme, bioText) {
    const bio = bioText || `Competent ${profile.cluster || 'Design'} Engineer focused on structural design, analysis, and optimization.`;
    
    const skillsList = profile.skills.map(s => `<li>${s}</li>`).join('\n            ');
    const softwareList = Object.keys(softwareProficiency).map(sw => {
        const val = softwareProficiency[sw];
        return `
        <div class="sw-row">
            <span>${sw}</span>
            <div class="sw-bar"><div class="sw-fill" style="width:${val}%"></div></div>
        </div>`;
    }).join('\n        ');
    
    const certsList = profile.certifications.length > 0 ? 
        profile.certifications.map(c => `<li>${c}</li>`).join('\n            ') :
        `<li>ASME Engineering Design Certification</li>`;
        
    let styles = "";
    if (theme === "glass") {
        styles = `
        body { font-family: sans-serif; background: radial-gradient(circle, #0f172a, #030712); color: #fff; padding: 2rem; }
        .portfolio-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 2rem; backdrop-filter: blur(10px); max-width: 800px; margin: 0 auto; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37); }
        h1 { color: #8b5cf6; margin-bottom: 0.5rem; }
        .sw-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; }
        .sw-bar { width: 60%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow:hidden; }
        .sw-fill { height: 100%; background: #2563eb; }
        ul { padding-left: 1.25rem; }
        li { margin-bottom: 0.4rem; font-size: 0.9rem; color: #cbd5e1; }
        `;
    } else if (theme === "terminal") {
        styles = `
        body { font-family: 'Courier New', monospace; background: #05070c; color: #00ff00; padding: 2rem; }
        .portfolio-card { border: 2px solid #00ff00; border-radius: 6px; padding: 2rem; max-width: 800px; margin: 0 auto; }
        h1 { color: #00ff00; text-transform: uppercase; border-bottom: 2px solid #00ff00; padding-bottom: 0.5rem; }
        .sw-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .sw-bar { width: 50%; border: 1px solid #00ff00; height: 10px; }
        .sw-fill { height: 100%; background: #00ff00; }
        ul { list-style-type: square; }
        li { margin-bottom: 0.4rem; }
        `;
    } else {
        styles = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 2rem; }
        .portfolio-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2.5rem; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        h1 { color: #1e3a8a; margin-bottom: 0.25rem; border-left: 4px solid #1e3a8a; padding-left: 0.75rem; }
        .sw-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; }
        .sw-bar { width: 60%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow:hidden; }
        .sw-fill { height: 100%; background: #1e3a8a; }
        ul { padding-left: 1.25rem; }
        li { margin-bottom: 0.4rem; font-size: 0.9rem; color: #475569; }
        `;
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.id || 'Candidate'} — Engineering Competency Portfolio</title>
    <style>${styles}</style>
</head>
<body>
    <div class="portfolio-card">
        <h1>${profile.id || 'Mechanical Engineer Candidate'}</h1>
        <p style="font-weight:700; margin-bottom:1.5rem;">Specialization: ${profile.cluster || 'Mechanical Engineering'} (${profile.region})</p>
        
        <h3>Professional Synopsis</h3>
        <p style="line-height:1.5; font-size:0.95rem; margin-bottom:1.5rem;">${bio}</p>
        
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:1.5rem 0;">
        
        <h3>Mastered Engineering Skills</h3>
        <ul>
            ${skillsList}
        </ul>
        
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:1.5rem 0;">
        
        <h3>CAD/CAE Software Competency</h3>
        <div style="margin-bottom:1.5rem;">
            ${softwareList}
        </div>
        
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:1.5rem 0;">
        
        <h3>Professional Certifications</h3>
        <ul style="margin-bottom:1.5rem;">
            ${certsList}
        </ul>
    </div>
</body>
</html>`;
}

function initPortfolioGenerator() {
    const previewBtn = document.getElementById("btn-preview-portfolio");
    const downloadBtn = document.getElementById("btn-download-portfolio-file");
    const closeBtn = document.getElementById("btn-close-portfolio-preview");
    
    if (previewBtn) {
        previewBtn.addEventListener("click", previewVisualPortfolio);
    }
    if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadVisualPortfolioFile);
    }
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("portfolio-preview-modal").style.display = "none";
        });
    }
    
    // Theme selection toggles
    document.querySelectorAll(".theme-pill-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".theme-pill-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
        });
    });
}

function previewVisualPortfolio() {
    if (!targetProfile) {
        alert("Please parse a resume or select a preset profile first.");
        return;
    }
    
    const activeThemeChip = document.querySelector(".theme-pill-chip.active");
    const theme = activeThemeChip ? activeThemeChip.getAttribute("data-theme-id") : "glass";
    const bioText = document.getElementById("portfolio-custom-bio").value;
    
    const code = generateVisualPortfolioCode(targetProfile, theme, bioText);
    
    const modal = document.getElementById("portfolio-preview-modal");
    const iframe = document.getElementById("portfolio-preview-iframe");
    
    modal.style.display = "flex";
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
}

function downloadVisualPortfolioFile() {
    if (!targetProfile) {
        alert("Please parse a resume or select a preset profile first.");
        return;
    }
    
    const activeThemeChip = document.querySelector(".theme-pill-chip.active");
    const theme = activeThemeChip ? activeThemeChip.getAttribute("data-theme-id") : "glass";
    const bioText = document.getElementById("portfolio-custom-bio").value;
    
    const code = generateVisualPortfolioCode(targetProfile, theme, bioText);
    
    const blob = new Blob([code], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MechIntel_Visual_Portfolio_${theme}.html`;
    link.click();
}


// 6. INDUSTRIAL ENGINEERING FORMULA CALCULATORS
function initFormulaCalculators() {
    const inputs = [
        "calc-tol-h", "calc-tol-s",
        "calc-beam-p", "calc-beam-l", "calc-beam-e", "calc-beam-i",
        "calc-gear-wt", "calc-gear-f", "calc-gear-m", "calc-gear-y",
        "calc-hvac-cfm", "calc-hvac-dt", "calc-hvac-dw"
    ];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", runAllCalculators);
        }
    });
    
    runAllCalculators();
}

function runAllCalculators() {
    // 1. Worst-Case vs RSS
    const th = parseFloat(document.getElementById("calc-tol-h").value) || 0;
    const ts = parseFloat(document.getElementById("calc-tol-s").value) || 0;
    const wc = th + ts;
    const rss = Math.sqrt(th * th + ts * ts);
    document.getElementById("calc-tol-result").innerHTML = `Worst-Case: ±${wc.toFixed(3)} mm<br>RSS Statistical: ±${rss.toFixed(3)} mm`;
    
    // 2. Cantilever Beam Deflection
    const p = parseFloat(document.getElementById("calc-beam-p").value) || 0;
    const l = parseFloat(document.getElementById("calc-beam-l").value) || 0;
    const e = parseFloat(document.getElementById("calc-beam-e").value) || 0;
    const i = parseFloat(document.getElementById("calc-beam-i").value) || 0;
    if (e > 0 && i > 0) {
        const def = (p * Math.pow(l, 3) * 100) / (3 * e * i);
        document.getElementById("calc-beam-result").innerText = `Max Deflection: ${def.toFixed(3)} mm`;
    } else {
        document.getElementById("calc-beam-result").innerText = `Error: invalid inputs`;
    }
    
    // 3. Lewis Gear Stress
    const wt = parseFloat(document.getElementById("calc-gear-wt").value) || 0;
    const f = parseFloat(document.getElementById("calc-gear-f").value) || 0;
    const m = parseFloat(document.getElementById("calc-gear-m").value) || 0;
    const y = parseFloat(document.getElementById("calc-gear-y").value) || 0;
    if (f > 0 && m > 0 && y > 0) {
        const stress = wt / (f * m * y);
        document.getElementById("calc-gear-result").innerText = `Bending Stress: ${stress.toFixed(2)} MPa`;
    } else {
        document.getElementById("calc-gear-result").innerText = `Error: invalid inputs`;
    }
    
    // 4. HVAC Sizing
    const cfm = parseFloat(document.getElementById("calc-hvac-cfm").value) || 0;
    const dt = parseFloat(document.getElementById("calc-hvac-dt").value) || 0;
    const dw = parseFloat(document.getElementById("calc-hvac-dw").value) || 0;
    const qs = 1.08 * cfm * dt;
    const ql = 4840 * cfm * dw;
    document.getElementById("calc-hvac-result").innerHTML = `Sensible: ${qs.toLocaleString(undefined, {maximumFractionDigits:0})} Btu/h<br>Latent: ${ql.toLocaleString(undefined, {maximumFractionDigits:0})} Btu/h`;
}


// MAIN HOOK TO EXTEND THE showDashboardView WITH CUSTOM INITIALIZERS
const originalShowDashboardView = showDashboardView;
showDashboardView = function(viewId) {
    originalShowDashboardView(viewId);
    
    if (viewId === "view-dashboard-simulation" || viewId === "dashboard-simulation") {
        initSimulationEngine();
    } else if (viewId === "view-dashboard-calculators" || viewId === "dashboard-calculators") {
        initFormulaCalculators();
    } else if (viewId === "view-dashboard-assessments" || viewId === "dashboard-assessments") {
        initToleranceSimulator();
    } else if (viewId === "view-dashboard-resume" || viewId === "dashboard-resume") {
        renderResumeScoreBoosters();
    }
};

// INITIALIZE CUSTOM INTERACTIVE CHANNELS ON DOM LOAD
document.addEventListener("DOMContentLoaded", () => {
    initInterviewSimulator();
    initPortfolioGenerator();
    
    // Bind Optimize Resume Button
    const optResumeBtn = document.getElementById("btn-optimize-resume-doc");
    if (optResumeBtn) {
        optResumeBtn.addEventListener("click", runResumeOptimizer);
    }
    
    // Bind challenge checks
    const btnCheckTol = document.getElementById("btn-check-tol-challenge");
    if (btnCheckTol) {
        btnCheckTol.addEventListener("click", checkToleranceQuiz);
    }
});



/* RESTORED INTERACTIVE FEATURES */
const QUIZ_QUESTIONS = {
    cad: [
        {
            q: "A part model has a mass density of 0.0078 g/mm³. If the volume is 100,000 mm³, what is the total mass in grams?",
            o: ["7.8 g", "78 g", "780 g", "7800 g"],
            a: 2,
            e: "Mass = Volume * Density = 100,000 * 0.0078 = 780 grams."
        },
        {
            q: "Which SolidWorks feature is best suited for modeling sheet metal bends?",
            o: ["Extruded Boss/Base", "Base Flange/Tab", "Swept Boss/Base", "Lofted Bend"],
            a: 1,
            e: "The Base Flange/Tab feature initializes sheet metal properties like K-factor and bend allowance."
        }
    ],
    gdt: [
        {
            q: "What does the GD&T symbol for 'Position' represent?",
            o: ["Concentricity", "Runout", "Location of a feature of size", "Profile of a line"],
            a: 2,
            e: "The Position tolerance (crosshair symbol) controls the location of features of size (like holes/pins) relative to datums."
        },
        {
            q: "Which letter represents Maximum Material Condition?",
            o: ["L", "M", "S", "P"],
            a: 1,
            e: "'M' inside a circle represents Maximum Material Condition (MMC)."
        }
    ],
    fea: [
        {
            q: "Which mesh type is generally preferred for resolving high stress concentrations in critical aerospace joints?",
            o: ["Coarse Tetrahedral", "Fine Hexahedral", "Linear Triangular", "Standard Shell"],
            a: 1,
            e: "Hexahedral elements provide better convergence and accuracy in high-stress gradients compared to tetrahedral elements."
        },
        {
            q: "In CFD, what does the Prandtl number relate?",
            o: ["Inertial forces to viscous forces", "Momentum diffusivity to thermal diffusivity", "Buoyant forces to viscous forces", "Velocity boundary layer to thermal boundary layer thickness"],
            a: 1,
            e: "The Prandtl number is the ratio of momentum diffusivity (kinematic viscosity) to thermal diffusivity."
        }
    ]
};
let activeQuiz = "cad";
let activeQuestionIdx = 0;
let quizScore = 0;
let quizCompletedCount = 0;

function renderActiveQuiz() {
    const container = document.getElementById("quiz-question-container");
    const questions = QUIZ_QUESTIONS[activeQuiz];
    
    if(!questions || activeQuestionIdx >= questions.length) {
        // Complete state
        container.innerHTML = `
            <div style="text-align:center; padding: 2rem;">
                <i data-lucide="check-circle" style="width:48px; height:48px; color:var(--success); margin-bottom:1rem;"></i>
                <h3>Quiz Completed Successfully!</h3>
                <p style="margin-top:0.5rem; color:var(--text-secondary);">You scored ${quizScore}/${questions.length} correct answers.</p>
                <button class="btn btn-primary" onclick="resetActiveQuiz()" style="margin-top:1.5rem;">Restart Quiz</button>
            </div>
        `;
        
        quizCompletedCount = Math.min(quizCompletedCount + 1, 3);
        userXP += 150;
        localStorage.setItem("userXP", userXP);
        
        updateQuizStatsDisplay();
        updateScoresDisplay(calculateScores(targetProfile));
        lucide.createIcons();
        return;
    }
    
    const qa = questions[activeQuestionIdx];
    container.innerHTML = `
        <div class="quiz-question-block">
            <div class="quiz-question-text">Q${activeQuestionIdx+1}: ${qa.q}</div>
            <ul class="quiz-options-list">
                ${qa.o.map((opt, idx) => `
                    <li class="quiz-option-item" onclick="submitQuizChoice(${idx})">${opt}</li>
                `).join('')}
            </ul>
            <div id="quiz-explanation" class="quiz-explanation-box hidden"></div>
            <button class="btn btn-secondary btn-sm hidden" id="quiz-next-btn" onclick="nextQuizQuestion()" style="margin-top:1rem; align-self:flex-start;">Next Question <i data-lucide="arrow-right"></i></button>
        </div>
    `;
    lucide.createIcons();
}

function submitQuizChoice(idx) {
    const questions = QUIZ_QUESTIONS[activeQuiz];
    const qa = questions[activeQuestionIdx];
    
    const items = document.querySelectorAll(".quiz-option-item");
    items.forEach(item => item.onclick = null); // disable further clicking
    
    const expBox = document.getElementById("quiz-explanation");
    expBox.innerText = qa.e;
    expBox.classList.remove("hidden");
    
    if (idx === qa.a) {
        items[idx].classList.add("correct");
        quizScore++;
    } else {
        items[idx].classList.add("incorrect");
        items[qa.a].classList.add("correct");
    }
    
    document.getElementById("quiz-next-btn").classList.remove("hidden");
}

function nextQuizQuestion() {
    activeQuestionIdx++;
    renderActiveQuiz();
}

function resetActiveQuiz() {
    activeQuestionIdx = 0;
    quizScore = 0;
    renderActiveQuiz();
}

function updateQuizStatsDisplay() {
    document.getElementById("quiz-stat-completed").innerText = `${quizCompletedCount} / 3`;
    document.getElementById("quiz-stat-score").innerText = `${Math.round((quizScore / 2) * 100)}%`;
    document.getElementById("quiz-stat-xp").innerText = `${quizCompletedCount * 150} XP`;
}

function renderRecruiterSandboxTable() {
    const minScore = parseInt(document.getElementById("recruiter-score-slider").value);
    const region = document.getElementById("recruiter-region-filter").value;
    const cluster = document.getElementById("recruiter-cluster-filter").value;
    
    let filtered = candidates.filter(c => c.score >= minScore);
    if (region !== "All") filtered = filtered.filter(c => c.region === region);
    if (cluster !== "All") filtered = filtered.filter(c => c.cluster === cluster);
    
    const tbody = document.getElementById("recruiter-table-body");
    tbody.innerHTML = "";
    
    filtered.slice(0, 10).forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${c.id}</strong></td>
            <td>${c.degree} (${c.tier})</td>
            <td>${c.cluster}</td>
            <td><strong>${c.score}</strong></td>
            <td><button class="btn btn-secondary btn-sm" onclick="sendSimulatedContact('${c.id}')"><i data-lucide="mail"></i> Request Contact</button></td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

function sendSimulatedContact(candidateId) {
    alert(`Simulated Recruiter Action Success!\nAn automated email request has been sent to ${candidateId} requesting verified GrabCAD and certification logs.`);
}

function drawAcademicSandboxCharts() {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    
    // Bar chart averages
    const specialties = ["CAD Design", "CAE/Simulation", "Robotics", "HVAC/Thermal", "Manufacturing"];
    const scores = [65, 74, 78, 62, 58];
    
    const barData = [{
        x: specialties,
        y: scores,
        type: 'bar',
        marker: { color: '#2563eb' }
    }];
    
    const barLayout = {
        margin: { t: 20, b: 40, l: 40, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 9 },
        xaxis: { color: textTheme },
        yaxis: { color: textTheme, range: [0, 100] }
    };
    
    Plotly.newPlot("plotly-academic-bar-chart", barData, barLayout, {responsive:true, displayModeBar:false});
    
    // Pie chart distributions
    const pieData = [{
        values: [35, 25, 15, 15, 10],
        labels: specialties,
        type: 'pie',
        hole: 0.4,
        marker: { colors: ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'] }
    }];
    
    const pieLayout = {
        margin: { t: 20, b: 20, l: 20, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 9 },
        showlegend: false
    };
    
    Plotly.newPlot("plotly-academic-pie-chart", pieData, pieLayout, {responsive:true, displayModeBar:false});
}

function drawLocalPlotly3dModel() {
    const container = document.getElementById("cad-viewer-container");
    container.innerHTML = "";
    
    const div = document.createElement("div");
    div.id = "plotly-3d-cad-node";
    div.style.width = "100%";
    div.style.height = "100%";
    container.appendChild(div);
    
    const x = [];
    const y = [];
    const z = [];
    const i = [];
    const j = [];
    const k = [];
    
    const segments = 30;
    const height = 1.6;
    const radius = 1.0;
    
    for (let h = 0; h <= 10; h++) {
        const hz = (h / 10) * height - (height / 2);
        for (let s = 0; s < segments; s++) {
            const theta = (s / segments) * 2 * Math.PI;
            x.push(radius * Math.cos(theta));
            y.push(radius * Math.sin(theta));
            z.push(hz);
        }
    }
    
    const bladeCount = 6;
    for (let b = 0; b < bladeCount; b++) {
        const baseTheta = (b / bladeCount) * 2 * Math.PI;
        for (let r_val = 1.0; r_val <= 3.2; r_val += 0.2) {
            const twist = (r_val - 1.0) * 0.4;
            const theta1 = baseTheta + twist;
            const theta2 = baseTheta + twist + 0.15;
            
            for (let hz = -0.15; hz <= 0.15; hz += 0.1) {
                x.push(r_val * Math.cos(theta1));
                y.push(r_val * Math.sin(theta1));
                z.push(hz);
                
                x.push(r_val * Math.cos(theta2));
                y.push(r_val * Math.sin(theta2));
                z.push(hz);
            }
        }
    }
    
    const totalPoints = x.length;
    for (let p = 0; p < totalPoints - 3; p += 3) {
        i.push(p);
        j.push(p + 1);
        k.push(p + 2);
    }
    
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    
    const data = [{
        type: 'mesh3d',
        x: x,
        y: y,
        z: z,
        i: i,
        j: j,
        k: k,
        opacity: 0.85,
        color: '#2563eb',
        intensity: z,
        colorscale: 'Blues',
        showscale: false
    }];
    
    const layout = {
        margin: { t: 0, b: 0, l: 0, r: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false },
            camera: {
                eye: { x: 1.4, y: 1.4, z: 1.2 }
            }
        }
    };
    
    Plotly.newPlot("plotly-3d-cad-node", data, layout, {responsive: true, displayModeBar: false});
}

function load3dCadModel(type) {
    const container = document.getElementById("cad-viewer-container");
    
    if(type === "plotly-impeller") {
        drawLocalPlotly3dModel();
    }
    else if(type === "pump") {
        container.innerHTML = `
            <iframe title="Centrifugal Pump" style="width:100%; height:100%; border:none; border-radius:8px;" src="https://sketchfab.com/models/2f925b4121e74a88bc3b2eccefb30c1c/embed?autostart=1"></iframe>
        `;
    } 
    else if(type === "upright") {
        container.innerHTML = `
            <iframe title="Formula SAE Upright" style="width:100%; height:100%; border:none; border-radius:8px;" src="https://sketchfab.com/models/8601c34a2e8140dbb5a9316d258b6883/embed?autostart=1"></iframe>
        `;
    } 
    else if(type === "battery") {
        container.innerHTML = `
            <iframe title="EV Battery Module" style="width:100%; height:100%; border:none; border-radius:8px;" src="https://sketchfab.com/models/b712c9b68a864d42b9181bb53d5a498b/embed?autostart=1"></iframe>
        `;
    }
}
// RESTORED LINKEDIN & RECRUITER SIMULATOR LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    const liModalBtn = document.getElementById("btn-linkedin-sim-modal");
    if (liModalBtn) {
        liModalBtn.addEventListener("click", () => {
            const overlay = document.getElementById("linkedin-overlay");
            if (overlay) overlay.classList.add("active");
        });
    }

    const runLiSimBtn = document.getElementById("btn-run-linkedin-sim");
    if (runLiSimBtn) {
        runLiSimBtn.addEventListener("click", () => {
            const statusDiv = document.getElementById("linkedin-sim-status");
            if (statusDiv) statusDiv.style.display = "flex";
            const steps = [1, 2, 3, 4];
            steps.forEach((step, idx) => {
                setTimeout(() => {
                    const row = document.getElementById(`li-step-${step}`);
                    if (row) {
                        row.classList.add("active");
                        if (idx > 0) {
                            const prev = document.getElementById(`li-step-${steps[idx-1]}`);
                            if (prev) {
                                prev.classList.remove("active");
                                prev.classList.add("done");
                            }
                        }
                    }
                }, (idx + 1) * 800);
            });
            setTimeout(() => {
                const overlay = document.getElementById("linkedin-overlay");
                if (overlay) overlay.classList.remove("active");
                if (typeof showNotification === 'function') {
                    showNotification("LinkedIn profile imported successfully! Skills updated.", "success");
                } else {
                    alert("LinkedIn profile imported successfully!");
                }
            }, 4000);
        });
    }

    const recruiterSlider = document.getElementById("recruiter-score-slider");
    if (recruiterSlider) {
        recruiterSlider.addEventListener("input", (e) => {
            const valLabel = document.getElementById("val-recruiter-score-slider");
            if (valLabel) valLabel.innerText = `${e.target.value}+ Score`;
            if (typeof renderRecruiterSandboxTable === 'function') renderRecruiterSandboxTable();
        });
    }
});



/* ==========================================================================
   ADVANCED ENGINEERING ENGINES, WEB AUDIO FX & CANVAS CERTIFICATE EXPORTER
   ========================================================================== */

// 1. Web Audio Micro-Interaction Synthesizer
let audioEnabled = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playAudioTone(type) { /* Audio disabled */ }

// 2. Ambient Particle Canvas Animation Loop
function initParticleBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const count = Math.min(50, Math.floor(width / 30));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// 3. Beam Bending Calculator & Dynamic SVG Diagram Engine
function initBeamCalculator() {
    const pSlider = document.getElementById('slider-beam-load');
    const lSlider = document.getElementById('slider-beam-length');
    const eSlider = document.getElementById('slider-beam-e');
    const iSlider = document.getElementById('slider-beam-i');
    
    if (!pSlider || !lSlider || !eSlider || !iSlider) return;
    
    function calculateBeam() {
        const P = parseFloat(pSlider.value) * 1000; // N
        const L = parseFloat(lSlider.value); // m
        const E = parseFloat(eSlider.value) * 1e9; // Pa
        const I = parseFloat(iSlider.value) * 1e-8; // m^4
        
        // Update labels
        document.getElementById('val-beam-load').innerText = pSlider.value;
        document.getElementById('val-beam-length').innerText = lSlider.value;
        document.getElementById('val-beam-e').innerText = eSlider.value;
        document.getElementById('val-beam-i').innerText = iSlider.value;
        
        // Max Deflection at center delta = (P * L^3) / (48 * E * I)
        const maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I) * 1000; // mm
        // Max Moment at center M_max = P * L / 4
        const maxMoment = (P * L / 4) / 1000; // kN·m
        // Max Stress sigma = M * y / I (approx c = 0.1m)
        const c = 0.1;
        const maxStress = ((maxMoment * 1000) * c / I) / 1e6; // MPa
        
        document.getElementById('calc-beam-deflection').innerText = `${maxDeflection.toFixed(2)} mm`;
        document.getElementById('calc-beam-moment').innerText = `${maxMoment.toFixed(2)} kN·m`;
        document.getElementById('calc-beam-stress').innerText = `${maxStress.toFixed(1)} MPa`;
        
        renderBeamSvgDiagram(maxDeflection, maxMoment);
    }
    
    [pSlider, lSlider, eSlider, iSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            calculateBeam();
            playAudioTone('click');
        });
    });
    
    calculateBeam();
}

function renderBeamSvgDiagram(deflection, moment) {
    const container = document.getElementById('svg-beam-diagram-container');
    if (!container) return;
    
    const svg = `
    <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Beam centerline -->
        <line x1="40" y1="50" x2="360" y2="50" stroke="rgba(255,255,255,0.3)" stroke-width="4" stroke-dasharray="4"/>
        
        <!-- Deflected Beam Curve -->
        <path d="M 40 50 Q 200 ${50 + Math.min(35, deflection * 5)} 360 50" fill="none" stroke="#00f2fe" stroke-width="4"/>
        
        <!-- Supports -->
        <polygon points="40,52 30,70 50,70" fill="#3b82f6"/>
        <polygon points="360,52 350,70 370,70" fill="#3b82f6"/>
        <circle cx="360" cy="74" r="4" fill="#3b82f6"/>
        
        <!-- Load Arrow -->
        <line x1="200" y1="10" x2="200" y2="45" stroke="#ef4444" stroke-width="3"/>
        <polygon points="200,48 194,36 206,36" fill="#ef4444"/>
        <text x="200" y="8" fill="#ef4444" font-size="11" text-anchor="middle" font-weight="bold">P (Load)</text>
        
        <!-- Moment Diagram Curve -->
        <path d="M 40 120 L 200 ${120 - Math.min(45, moment * 0.7)} L 360 120 Z" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2"/>
        <text x="200" y="145" fill="#10b981" font-size="10" text-anchor="middle">Bending Moment Diagram (M)</text>
    </svg>`;
    
    container.innerHTML = svg;
}

// 4. Fluid Dynamics Reynolds Calculator & Pipe Streamline Flow Visualizer
function initFluidCalculator() {
    const typeSelect = document.getElementById('select-fluid-type');
    const velSlider = document.getElementById('slider-fluid-vel');
    const diaSlider = document.getElementById('slider-fluid-dia');
    
    if (!typeSelect || !velSlider || !diaSlider) return;
    
    const props = {
        water: { density: 1000, viscosity: 0.001 },
        oil: { density: 890, viscosity: 0.29 },
        air: { density: 1.2, viscosity: 1.8e-5 },
        hydraulic: { density: 870, viscosity: 0.04 }
    };
    
    function calculateFluid() {
        const fluid = props[typeSelect.value] || props.water;
        const v = parseFloat(velSlider.value);
        const D = parseFloat(diaSlider.value);
        
        document.getElementById('val-fluid-vel').innerText = v.toFixed(1);
        document.getElementById('val-fluid-dia').innerText = D.toFixed(2);
        
        // Re = (rho * v * D) / mu
        const Re = Math.round((fluid.density * v * D) / fluid.viscosity);
        document.getElementById('calc-reynolds-num').innerText = Re.toLocaleString();
        
        const badge = document.getElementById('badge-flow-regime');
        if (Re < 2300) {
            badge.innerText = 'LAMINAR FLOW';
            badge.style.background = '#10b981';
        } else if (Re <= 4000) {
            badge.innerText = 'TRANSITION FLOW';
            badge.style.background = '#f59e0b';
        } else {
            badge.innerText = 'TURBULENT FLOW';
            badge.style.background = '#ef4444';
        }
        
        renderPipeFlowCanvas(Re);
    }
    
    [typeSelect, velSlider, diaSlider].forEach(elem => {
        elem.addEventListener('input', () => {
            calculateFluid();
            playAudioTone('click');
        });
    });
    
    calculateFluid();
}

function renderPipeFlowCanvas(Re) {
    const canvas = document.getElementById('pipe-flow-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.5;
    
    const isTurbulent = Re > 4000;
    const isTransition = Re >= 2300 && Re <= 4000;
    
    for (let y = 15; y < h; y += 15) {
        ctx.beginPath();
        ctx.strokeStyle = isTurbulent ? 'rgba(239, 68, 68, 0.6)' : (isTransition ? 'rgba(245, 158, 11, 0.6)' : 'rgba(16, 185, 129, 0.6)');
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 10) {
            let offset = 0;
            if (isTurbulent) {
                offset = (Math.random() - 0.5) * 12;
            } else if (isTransition) {
                offset = Math.sin(x * 0.05) * 4;
            }
            ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
    }
}

// 5. 6-Axis Skills Radar Chart SVG Engine
function initSkillsRadarEngine() {
    const container = document.getElementById('skills-radar-container');
    if (!container) return;
    
    const skills = {
        cad: 85,
        fea: 70,
        cfd: 65,
        gdt: 80,
        robotics: 60,
        mfg: 75
    };
    
    const sliders = document.querySelectorAll('.radar-skill-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const key = e.target.getAttribute('data-skill');
            skills[key] = parseInt(e.target.value);
            document.getElementById(`val-skill-${key}`).innerText = `${skills[key]}%`;
            renderSkillsRadar(skills);
            playAudioTone('click');
        });
    });
    
    renderSkillsRadar(skills);
}

function renderSkillsRadar(skills) {
    const container = document.getElementById('skills-radar-container');
    if (!container) return;
    
    const size = 280;
    const center = size / 2;
    const radius = size * 0.38;
    const keys = ['cad', 'fea', 'cfd', 'gdt', 'robotics', 'mfg'];
    const labels = ['CAD', 'FEA', 'CFD', 'GD&T', 'Robotics', 'DFM'];
    const count = keys.length;
    
    let gridPolygons = '';
    for (let r = 0.25; r <= 1.0; r += 0.25) {
        let pts = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
            const x = center + radius * r * Math.cos(angle);
            const y = center + radius * r * Math.sin(angle);
            pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        gridPolygons += `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }
    
    let axisLines = '';
    let skillPts = [];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        axisLines += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
        
        const labelX = center + (radius + 20) * Math.cos(angle);
        const labelY = center + (radius + 15) * Math.sin(angle);
        axisLines += `<text x="${labelX}" y="${labelY}" fill="var(--text-muted)" font-size="11" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
        
        const valRatio = (skills[keys[i]] || 50) / 100;
        const px = center + radius * valRatio * Math.cos(angle);
        const py = center + radius * valRatio * Math.sin(angle);
        skillPts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${gridPolygons}
        ${axisLines}
        <polygon points="${skillPts.join(' ')}" fill="rgba(0, 242, 254, 0.25)" stroke="#00f2fe" stroke-width="2.5"/>
        ${skillPts.map(pt => `<circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="4" fill="#00f2fe"/>`).join('')}
    </svg>`;
    
    container.innerHTML = svg;
}

// 6. Canvas Certificate Generator Engine
function initCertificateGenerator() {
    const certModal = document.getElementById('certificate-modal');
    const openBtn = document.getElementById('btn-cert-modal');
    const closeBtn = document.getElementById('btn-close-cert-modal');
    const renderBtn = document.getElementById('btn-render-cert-preview');
    const downloadBtn = document.getElementById('btn-download-cert-png');
    
    if (openBtn && certModal) {
        openBtn.addEventListener('click', () => {
            certModal.classList.add('active');
            renderCertificateCanvas();
            playAudioTone('success');
        });
    }
    
    if (closeBtn && certModal) {
        closeBtn.addEventListener('click', () => certModal.classList.remove('active'));
    }
    
    if (renderBtn) {
        renderBtn.addEventListener('click', () => {
            renderCertificateCanvas();
            playAudioTone('click');
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadCertificatePNG();
            playAudioTone('success');
        });
    }
}

function renderCertificateCanvas() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const userName = document.getElementById('cert-user-name').value || 'Chaman Prakash Kanth';
    const trackTitle = document.getElementById('cert-track-title').value || 'Senior Mechanical Design & CAD Architect';
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#030712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);
    
    // Cyber Border
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 740);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 710);
    
    // Title
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 32px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MECHINTEL CAREER INTELLIGENCE PLATFORM', 600, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Outfit", sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 210);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('THIS IS OFFICIALLY PRESENTED TO', 600, 300);
    
    // Recipient Name
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'extrabold 56px "Outfit", sans-serif';
    ctx.fillText(userName.toUpperCase(), 600, 390);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FOR SUCCESSFUL MASTERY OF THE VERIFIED COMPETENCY TRACK', 600, 470);
    
    // Track Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText(trackTitle, 600, 540);
    
    // Footer / Verification Hash
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillText(`Issued: ${dateStr}  |  Verification ID: MECH-INTEL-${Math.floor(100000 + Math.random() * 900000)}`, 600, 680);
}

function downloadCertificatePNG() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'MechIntel_Engineering_Certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Global Init Hook
document.addEventListener('DOMContentLoaded', () => {
    initParticleBackground();
    initBeamCalculator();
    initFluidCalculator();
    initSkillsRadarEngine();
    initCertificateGenerator();
});
