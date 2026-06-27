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
function calculateScores(profile) {
    // 1. Academics
    const acadBase = profile.tier === "Tier 1" ? 100 : (profile.tier === "Tier 2" ? 70 : 40);
    const degBase = profile.degree === "B.Tech/B.S." ? 70 : (profile.degree === "M.Tech/M.S." ? 85 : 100);
    const acadWeighted = (acadBase * 0.6 + degBase * 0.4) * 0.25;
    
    // 2. Software proficiency values mapping
    const swValues = Object.values(softwareProficiency);
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
    
    const readiness = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10) / 10;
    const marketPosition = Math.round(readiness * 0.9 + (profile.tier === "Tier 1" ? 10 : 0));
    const employability = Math.round((projVal * 0.3 + internVal * 0.5 + swAverage * 0.2));
    const recruiter = Math.round((acadBase * 0.3 + internVal * 0.4 + certVal * 0.3));
    const engineeringCompetency = Math.round((swAverage * 0.7 + Math.min(profile.skills.length * 20, 100) * 0.3));
    
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
    document.getElementById("db-global-pct").innerText = `Top ${ranks.globalPercentile}% Globally`;
    document.getElementById("db-global-progress").style.width = `${100 - ranks.globalPercentile}%`;

    document.getElementById("db-india-rank").innerText = `#${ranks.indiaRank.toLocaleString()}`;
    document.getElementById("db-india-pct").innerText = `Top ${ranks.indiaPercentile}% Nationally`;
    document.getElementById("db-india-progress").style.width = `${100 - ranks.indiaPercentile}%`;

    document.getElementById("db-tier-rank").innerText = `#${ranks.tierRank.toLocaleString()}`;
    document.getElementById("db-tier-pct").innerText = `Top ${ranks.tierPercentile}% in Tier`;
    document.getElementById("db-tier-progress").style.width = `${100 - ranks.tierPercentile}%`;

    document.getElementById("db-cluster-rank").innerText = `#${ranks.clusterRank.toLocaleString()}`;
    document.getElementById("db-cluster-pct").innerText = `Top ${ranks.clusterPercentile}% in Specialty`;
    document.getElementById("db-cluster-progress").style.width = `${100 - ranks.clusterPercentile}%`;

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
    document.querySelectorAll(".dashboard-view-pane").forEach(pane => pane.classList.remove("active"));
    document.getElementById(`view-${viewId}`).classList.add("active");
    
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        if(item.getAttribute("data-view") === viewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

// Calculate ranks in database
function getRanks(score, matchedDomain, region, tier) {
    const allScores = candidates.map(c => c.score).sort((a,b) => b-a);
    const nationalScores = candidates.filter(c => c.region === region).map(c => c.score).sort((a,b) => b-a);
    const tierScores = candidates.filter(c => c.region === region && c.tier === tier).map(c => c.score).sort((a,b) => b-a);
    
    const globalCountHigher = allScores.filter(s => s > score).length;
    const nationalCountHigher = nationalScores.filter(s => s > score).length;
    const tierCountHigher = tierScores.filter(s => s > score).length;
    
    return {
        globalRank: globalCountHigher + 1,
        globalTotal: allScores.length,
        globalPercentile: Math.max(Math.round(((allScores.length - globalCountHigher) / allScores.length) * 100), 1),
        
        indiaRank: nationalCountHigher + 1,
        indiaTotal: nationalScores.length,
        indiaPercentile: Math.max(Math.round(((nationalScores.length - nationalCountHigher) / nationalScores.length) * 100), 1),
        
        tierRank: tierCountHigher + 1,
        tierTotal: tierScores.length,
        tierPercentile: Math.max(Math.round(((tierScores.length - tierCountHigher) / tierScores.length) * 100), 1),
        
        clusterRank: Math.round(globalCountHigher * 0.1) + 1,
        clusterTotal: Math.round(allScores.length * 0.1),
        clusterPercentile: Math.max(Math.round(((allScores.length - globalCountHigher) / allScores.length) * 100), 1)
    };
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
        }
    });

    // View Routing
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
    document.getElementById("btn-generate-portfolio-html").addEventListener("click", () => {
        if(targetProfile) generatePortfolioHtml(targetProfile);
    });

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
});
