// MechIntel AI — Application Logic Engine

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
let activeDomain = 'CAD Design';
let completedCourses = [];

// Mechanical Engineering Taxonomy definitions
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
    "six sigma green": "Lean Six Sigma Green Belt",
    "six sigma yellow": "Lean Six Sigma Yellow Belt",
    "six sigma black": "Lean Six Sigma Black Belt",
    "ashrae": "ASHRAE Member Certification",
    "hvac design": "HVAC Design Certificate",
    "asme": "ASME Member / Cert",
    "ansys": "ANSYS Certified Professional"
};

// Domain Specialties & Keywords mapping
const CLUSTERS = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"];

const CLUSTER_KEYWORDS = {
    "CAD Design": [
        "GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Sheet Metal Design", 
        "DFM (Design for Manufacturing)", "Tolerance Analysis", "Injection Molding Design", 
        "SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "PTC Creo", "Autodesk Inventor", 
        "Certified SolidWorks Associate (CSWA)", "Certified SolidWorks Professional (CSWP)"
    ],
    "CAE/Simulation": [
        "Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", 
        "Thermal Analysis", "Vibration Analysis", "ANSYS", "Abaqus", "MATLAB", "Fluent", 
        "COMSOL", "HyperMesh", "Nastran", "ANSYS Certified Professional"
    ],
    "Robotics/Mechatronics": [
        "Mechatronics", "Control Systems", "Robotics", "Embedded Systems", "Kinematics & Dynamics", 
        "MATLAB", "Simulink", "Python", "C++", "LabVIEW", "Arduino"
    ],
    "Manufacturing/Operations": [
        "Lean Manufacturing", "Six Sigma", "Quality Control & Assurance", "CNC Programming", 
        "AutoCAD", "SolidCAM", "Minitab", "Mastercam", "Lean Six Sigma Yellow Belt", 
        "Lean Six Sigma Green Belt", "Lean Six Sigma Black Belt"
    ],
    "HVAC/Thermal": [
        "HVAC Design", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Piping Design", 
        "AutoCAD", "Revit", "HVAC Design Certificate", "ASHRAE Member Certification"
    ]
};

// Employer demand benchmarks
const EMPLOYER_DEMANDS = {
    "CAD Design": {
        role: "Design Engineer / CAD Analyst",
        skills: [
            { name: "Geometric Dimensioning & Tolerancing (GD&T)", desc: "Applying ASME Y14.5 rules for datum definitions and tolerance zones.", priority: "Critical" },
            { name: "Design for Manufacturing & Assembly (DFM/DFMA)", desc: "Optimizing models for injection molding, casting, and sheet metal.", priority: "High" }
        ],
        software: [
            { name: "SolidWorks", desc: "Industry-standard parametric 3D modeling and sheet metal design.", priority: "Critical" },
            { name: "CATIA", desc: "Surface frame modeling dominant in automotive and aerospace.", priority: "High" }
        ],
        certs: [
            { name: "Certified SolidWorks Professional (CSWP)", desc: "Validates complex solid modeling competencies.", priority: "High" }
        ],
        portfolio: [
            { title: "Parametric Gearbox Assembly", desc: "Constrained gear system showing tooth bending calculations." }
        ]
    },
    "CAE/Simulation": {
        role: "Simulation Analyst / FEA Specialist / CFD Engineer",
        skills: [
            { name: "Finite Element Method (FEM) Fundamentals", desc: "Understanding formulations, convergence, and element shapes.", priority: "Critical" },
            { name: "Computational Fluid Dynamics (CFD)", desc: "Applying turbulence models (SST k-omega) and viscous wall cell mesh treatment.", priority: "Critical" }
        ],
        software: [
            { name: "ANSYS Workbench", desc: "Static structural, thermal, and Fluent CFD solver suites.", priority: "Critical" },
            { name: "Abaqus / Nastran", desc: "Solver standard for non-linear dynamic crashes and stress fatigue.", priority: "High" }
        ],
        certs: [
            { name: "ANSYS Certified Professional", desc: "Validates simulation setup, solver configurations, and precision boundary conditions.", priority: "High" }
        ],
        portfolio: [
            { title: "Aerodynamic NACA Wing CFD", desc: "Boundary layer grids independence validating lift/drag coefficient maps." }
        ]
    },
    "Robotics/Mechatronics": {
        role: "Robotics & Automation Engineer",
        skills: [
            { name: "Control Systems & PID Tuning", desc: "Designing closed-loop feedback controllers for speed/position tracking.", priority: "Critical" },
            { name: "Embedded Firmware Programming", desc: "Writing C/C++ scripts for I2C, SPI hardware sensor loops.", priority: "High" }
        ],
        software: [
            { name: "MATLAB & Simulink", desc: "Dynamic physical models simulation and root-locus controller design.", priority: "Critical" },
            { name: "ROS (Robot Operating System)", desc: "Messaging framework for hardware abstraction and path planners.", priority: "High" }
        ],
        certs: [
            { name: "ASME Robotics Specialist", desc: "Verifies automation safety standards and mechanism design rules.", priority: "Medium" }
        ],
        portfolio: [
            { title: "PID Self-Balancing Bot", desc: "Two-wheeled balancing robot using IMU feedback loops." }
        ]
    },
    "Manufacturing/Operations": {
        role: "Production Engineer / Quality Manager",
        skills: [
            { name: "Lean Six Sigma (DMAIC)", desc: "Statistical process control, Cp/Cpk indices, and waste removal audits.", priority: "Critical" },
            { name: "CNC Machining & CAM Fixtures", desc: "Generating coordinate paths (G-code) and designing locating fixtures.", priority: "High" }
        ],
        software: [
            { name: "SolidCAM / Mastercam", desc: "CNC milling/turning toolpath simulation programs.", priority: "Critical" },
            { name: "Minitab", desc: "Process variance analysis and statistical quality control graphing.", priority: "High" }
        ],
        certs: [
            { name: "Lean Six Sigma Green Belt", desc: "Validates process capability variance reduction methodologies.", priority: "Critical" }
        ],
        portfolio: [
            { title: "Six Sigma DMAIC Yield Audit", desc: "Process improvement study analyzing parts variation limits." }
        ]
    },
    "HVAC/Thermal": {
        role: "HVAC Project / MEP Design Engineer",
        skills: [
            { name: "Cooling & Heating Load Sizing", desc: "Conducting heat transfer rates sizing using psychrometrics.", priority: "Critical" },
            { name: "Duct & Piping Static Sizing", desc: "Determining friction head losses in building networks.", priority: "Critical" }
        ],
        software: [
            { name: "Autodesk Revit MEP", desc: "3D duct routing, plumbing coordination layouts, and BIM checklists.", priority: "Critical" },
            { name: "Carrier HAP", desc: "Hourly cooling thermal load simulator for commercial projects.", priority: "High" }
        ],
        certs: [
            { name: "HVAC Design Certificate", desc: "Accredited validation of ventilation compliance standards.", priority: "High" }
        ],
        portfolio: [
            { title: "Office Building VRF Design", desc: "Full thermal layout in Revit detailing duct pressure sizing." }
        ]
    }
};

// Course catalog
const COURSE_CATALOG = {
    "CAD Design": {
        title: "ASME Y14.5 GD&T & Mechanical Design Essentials",
        slug: "cad-lewis-gear-bending",
        skill_tags: ["GD&T", "Product Design", "SolidWorks"],
        score_boost: 5.0,
        description: "Learn dimensioning standards, DFM rules, and tolerance stackup analyses.",
        written_content: `
            <h4>1. Geometric Dimensioning & Tolerancing (GD&T) - ASME Y14.5</h4>
            <p>GD&T restricts the 6 degrees of freedom of a component relative to a Datum Reference Frame (DRF). Rather than linear tolerances which form square zones, GD&T defines cylindrical zones to decrease costs and increase assembly success rates.</p>
            <ul>
                <li><strong>MMC (Maximum Material Condition - Ⓜ):</strong> The feature size representing the maximum volume of material (smallest hole, largest pin). Departures from MMC grant bonus tolerance.</li>
                <li><strong>LMC (Least Material Condition - Ⓛ):</strong> The state containing the minimum volume of material.</li>
            </ul>

            <h4>2. Worst-Case vs. RSS Tolerance Stackup</h4>
            <p>To compute the gap limits in a stack of mechanical components:</p>
            <pre>Worst-Case: T_wc = Σ T_i&#10;Statistical (Root-Sum-Square): T_rss = √(Σ T_i²)</pre>
            <p>Statistical stackups assume parts follow a normal distribution, preventing over-tolerancing and lowering manufacturing costs.</p>
        `,
        quiz_question: "Which modifier grants additional 'bonus tolerance' as the feature size departs from its limit?",
        quiz_options: ["Maximum Material Condition (MMC)", "Least Material Condition (LMC)", "Regardless of Feature Size (RFS)"],
        quiz_answer: "Maximum Material Condition (MMC)"
    },
    "CAE/Simulation": {
        title: "Practical FEM, Meshing & Fluid Solver Mechanics",
        slug: "cae-stiffness-matrix",
        skill_tags: ["FEA", "CFD", "ANSYS"],
        score_boost: 5.0,
        description: "Study element formulations, mesh quality, and turbulence near-wall boundary layers.",
        written_content: `
            <h4>1. Finite Element Stiffness Matrix</h4>
            <p>Solid structures are discretized into element matrices combined into a global solver formula:</p>
            <pre>K u = f</pre>
            <p>Where <strong>K</strong> is structural stiffness, <strong>u</strong> is displacement vectors, and <strong>f</strong> represents loads. Cantilever deflection is solved via tip displacement:</p>
            <pre>δ = P L³ / (3 E I)</pre>

            <h4>2. Near-Wall y+ Cell Sizing in CFD</h4>
            <p>Fluid boundary layer meshes require a dimensionless wall distance (y+) target near <strong>1.0</strong> to resolve the viscous sublayer directly using k-omega SST solvers without relying on log-law wall calculations.</p>
        `,
        quiz_question: "What dimensionless wall distance y+ is targeted to resolve the viscous sublayer directly?",
        quiz_options: ["y+ ≈ 1.0", "y+ ≈ 30.0", "y+ ≈ 100.0"],
        quiz_answer: "y+ ≈ 1.0"
    },
    "Robotics/Mechatronics": {
        title: "Closed-loop Feedbacks & PID Microcontroller Programming",
        slug: "robotics-pid-control",
        skill_tags: ["Control Systems", "Robotics", "MATLAB"],
        score_boost: 5.0,
        description: "Solve closed-loop Laplace controller matrices and ADC voltage resolutions.",
        written_content: `
            <h4>1. PID Control Formulation</h4>
            <p>A controller regulates joints by minimizing tracking error e(t):</p>
            <pre>u(t) = Kp e(t) + Ki ∫ e(τ)dτ + Kd de(t)/dt</pre>
            <p>Kp reduces rise time but increases overshoot, Ki eliminates steady-state offset, and Kd stabilizes oscillation settling bounds.</p>

            <h4>2. ADC Step Voltage Resolution</h4>
            <p>An N-bit analog converter reference voltage V_ref defines the step resolution:</p>
            <pre>ΔV = V_ref / (2^N - 1)</pre>
            <p>For a 10-bit converter at 5V reference: 5.0V / 1023 ≈ 4.88 mV.</p>
        `,
        quiz_question: "For a 10-bit ADC operating at 5.0V, what is the step voltage resolution?",
        quiz_options: ["4.88 mV", "5.00 mV", "9.77 mV"],
        quiz_answer: "4.88 mV"
    },
    "Manufacturing/Operations": {
        title: "Statistical Quality & Process Capability (Cp/Cpk)",
        slug: "manufacturing-cpk-capability",
        skill_tags: ["Six Sigma", "Quality", "Operations"],
        score_boost: 5.0,
        description: "Calculate standard process deviation margins and Six Sigma thresholds.",
        written_content: `
            <h4>1. Process Capability Indices (Cp/Cpk)</h4>
            <p>Cp measures process potential, while Cpk accounts for centered mean offset relative to specification limits:</p>
            <pre>Cp = (USL - LSL) / (6σ)&#10;Cpk = min((USL - μ)/(3σ), (μ - LSL)/(3σ))</pre>
            <ul>
                <li><strong>Cpk < 1.0:</strong> Process is incapable (defective parts are produced).</li>
                <li><strong>Cpk ≥ 1.33:</strong> Standard industrial capability boundary.</li>
                <li><strong>Cpk ≥ 2.0:</strong> Six Sigma quality levels (3.4 defects per million).</li>
            </ul>
        `,
        quiz_question: "If a centered process has spec limits 9.5 to 10.5 mm and standard deviation 0.1 mm, what is Cp?",
        quiz_options: ["Cp = 1.67", "Cp = 1.33", "Cp = 0.83"],
        quiz_answer: "Cp = 1.67"
    },
    "HVAC/Thermal": {
        title: "Psychrometric Heat Load Sizing & Darcy Head Loss Sizing",
        slug: "hvac-sensible-latent-loads",
        skill_tags: ["HVAC Design", "Thermodynamics", "Revit"],
        score_boost: 5.0,
        description: "Conduct sensible/latent building heat loads calculations and friction loss curves.",
        written_content: `
            <h4>1. Sensible vs. Latent Cooling Sizing</h4>
            <p>Sensible loads change temperature, while latent loads remove air moisture:</p>
            <pre>Sensible: qs = m · Cp · ΔT&#10;Latent: ql = m · h_fg · Δw</pre>
            <p>Where h_fg is the latent heat of vaporization of water (≈2501 kJ/kg).</p>
            
            <h4>2. Darcy-Weisbach Friction Sizing</h4>
            <pre>hf = f · (L/D) · (v² / 2g)</pre>
            <p>Determines pump static pressures required to overcome system pipe friction.</p>
        `,
        quiz_question: "Which load represents the heat energy required to condense water vapor out of ventilation air?",
        quiz_options: ["Latent cooling load", "Sensible cooling load", "Radiation thermal gain"],
        quiz_answer: "Latent cooling load"
    }
};

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

    for (let i = 1; i <= 100000; i++) {
        const region = random() < 0.60 ? "India" : "Global";
        const tierRoll = random();
        const tier = tierRoll < 0.15 ? "Tier 1" : (tierRoll < 0.60 ? "Tier 2" : "Tier 3");
        
        const collegeList = collegesDb[region][tier];
        const college = collegeList[Math.floor(random() * collegeList.length)];
        
        const degRoll = random();
        const degree = degRoll < 0.80 ? "B.Tech/B.S." : (degRoll < 0.98 ? "M.Tech/M.S." : "Ph.D.");
        
        const cluster = CLUSTERS[Math.floor(random() * CLUSTERS.length)];
        
        // Generate skill intersections
        const skillsPool = CLUSTER_KEYWORDS[cluster].filter(k => SKILLS_DICT[k.toLowerCase()] || false);
        const toolsPool = CLUSTER_KEYWORDS[cluster].filter(k => SOFTWARE_DICT[k.toLowerCase()] || false);
        const certsPool = CLUSTER_KEYWORDS[cluster].filter(k => CERTS_DICT[k.toLowerCase()] || false);
        
        const skillsCount = Math.floor(random() * 4) + 1;
        const toolsCount = Math.floor(random() * 3) + 1;
        const certsCount = random() < 0.20 ? 1 : 0;
        
        const skills = [];
        for(let s=0; s<skillsCount; s++) {
            const item = skillsPool[Math.floor(random() * skillsPool.length)];
            if(item && !skills.includes(item)) skills.push(item);
        }
        
        const tools = [];
        for(let t=0; t<toolsCount; t++) {
            const item = toolsPool[Math.floor(random() * toolsPool.length)];
            if(item && !tools.includes(item)) tools.push(item);
        }

        const certs = [];
        if (certsCount > 0) {
            const item = certsPool[Math.floor(random() * certsPool.length)];
            if(item) certs.push(item);
        }

        const internships = random() < 0.35 ? 1 : (random() < 0.10 ? 2 : 0);
        const projects = Math.floor(random() * 4) + 1;
        const publications = degree === "Ph.D." ? Math.floor(random() * 4) + 2 : (random() < 0.15 ? 1 : 0);
        const competitions = random() < 0.15 ? 1 : 0;
        
        // Calculate competitive score
        const acadScore = tier === "Tier 1" ? 100 : (tier === "Tier 2" ? 70 : 40);
        const degScore = degree === "B.Tech/B.S." ? 70 : (degree === "M.Tech/M.S." ? 85 : 100);
        const acadWeighted = (acadScore * 0.6 + degScore * 0.4) * 0.25;
        
        const skillVal = Math.min(skills.length * 20, 100);
        const toolVal = Math.min(tools.length * 25, 100);
        const skillsWeighted = (skillVal * 0.5 + toolVal * 0.5) * 0.35;
        
        const internVal = Math.min(internships * 50, 100);
        const projVal = Math.min(projects * 33, 100);
        const compVal = Math.min(competitions * 50, 100);
        const expWeighted = (internVal * 0.4 + projVal * 0.4 + compVal * 0.2) * 0.30;
        
        const paperVal = Math.min(publications * 50, 100);
        const certVal = Math.min(certs.length * 50, 100);
        const extraWeighted = (paperVal * 0.5 + certVal * 0.5) * 0.10;
        
        const score = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10);
        
        data.push({
            id: `Candidate #ME-${10000 + i}`,
            region: region,
            tier: tier,
            college: college,
            degree: degree,
            cluster: cluster,
            skills: skills,
            software_tools: tools,
            certifications: certs,
            internships: internships,
            projects: projects,
            research_papers: publications,
            competitions: competitions,
            score: score / 10
        });
    }
    return data;
}

// Strip PII and parse attributes
function parseResumeText(text) {
    const textLower = text.toLowerCase();
    
    // Remove PII
    let cleaned = text;
    cleaned = cleaned.replace(/\b[\w\.-]+@[\w\.-]+\.\w{2,}\b/g, '[REDACTED_EMAIL]');
    cleaned = cleaned.replace(/\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, '[REDACTED_PHONE]');
    cleaned = cleaned.replace(/\b(?:linkedin\.com/in|github\.com)/[a-zA-Z0-9_-]+\b/g, '[REDACTED_SOCIAL]');
    
    // Skills extraction
    const skills = [];
    for (let key in SKILLS_DICT) {
        if (textLower.includes(key)) {
            const skillName = SKILLS_DICT[key];
            if (!skills.includes(skillName)) skills.push(skillName);
        }
    }
    
    // Software extraction
    const software = [];
    for (let key in SOFTWARE_DICT) {
        if (textLower.includes(key)) {
            const swName = SOFTWARE_DICT[key];
            if (!software.includes(swName)) software.push(swName);
        }
    }

    // Certs extraction
    const certs = [];
    for (let key in CERTS_DICT) {
        if (textLower.includes(key)) {
            const certName = CERTS_DICT[key];
            if (!certs.includes(certName)) certs.push(certName);
        }
    }
    
    // Heuristic counts
    const projects = Math.min(Math.max(Math.round((textLower.match(/project|design/g) || []).length / 2), 1), 5);
    const internships = Math.min((textLower.match(/internship|intern\b|trainee/g) || []).length, 2);
    const research_papers = (textLower.includes("publication") || textLower.includes("published") || textLower.includes("ieee")) ? 1 : 0;
    const competitions = (textLower.includes("baja") || textLower.includes("fsae") || textLower.includes("formula sae") || textLower.includes("robocon")) ? 1 : 0;
    
    let parsedRegion = "India";
    if (textLower.includes("mit") || textLower.includes("stanford") || textLower.includes("berkeley") || textLower.includes("purdue") || textLower.includes("california") || textLower.includes("london")) {
        parsedRegion = "Global";
    }

    let parsedTier = "Tier 3";
    if (textLower.includes("iit") || textLower.includes("bits pilani") || textLower.includes("nit trichy") || textLower.includes("mit") || textLower.includes("stanford")) {
        parsedTier = "Tier 1";
    } else if (textLower.includes("vit") || textLower.includes("manipal") || textLower.includes("dtu") || textLower.includes("purdue")) {
        parsedTier = "Tier 2";
    }
    
    let parsedDegree = "B.Tech/B.S.";
    if (textLower.includes("m.tech") || textLower.includes("m.s.") || textLower.includes("master")) {
        parsedDegree = "M.Tech/M.S.";
    } else if (textLower.includes("ph.d") || textLower.includes("doctor")) {
        parsedDegree = "Ph.D.";
    }

    return {
        region: parsedRegion,
        tier: parsedTier,
        degree: parsedDegree,
        projects: projects,
        internships: internships,
        research_papers: research_papers,
        competitions: competitions,
        skills: skills,
        software_tools: software,
        certifications: certs,
        raw_text: cleaned
    };
}

// Calculate score values
function calculateCompetitivenessScore(profile) {
    const acadScore = profile.tier === "Tier 1" ? 100 : (profile.tier === "Tier 2" ? 70 : 40);
    const degScore = profile.degree === "B.Tech/B.S." ? 70 : (profile.degree === "M.Tech/M.S." ? 85 : 100);
    const acadWeighted = (acadScore * 0.6 + degScore * 0.4) * 0.25;
    
    const skillVal = Math.min(profile.skills.length * 15, 100);
    const toolVal = Math.min(profile.software_tools.length * 20, 100);
    const skillsWeighted = (skillVal * 0.5 + toolVal * 0.5) * 0.35;
    
    const internVal = Math.min(profile.internships * 50, 100);
    const projVal = Math.min(profile.projects * 33, 100);
    const compVal = Math.min(profile.competitions * 50, 100);
    const expWeighted = (internVal * 0.4 + projVal * 0.4 + compVal * 0.2) * 0.30;
    
    const paperVal = Math.min(profile.research_papers * 50, 100);
    const certVal = Math.min(profile.certifications.length * 50, 100);
    const extraWeighted = (paperVal * 0.5 + certVal * 0.5) * 0.10;
    
    let baseScore = Math.round((acadWeighted + skillsWeighted + expWeighted + extraWeighted) * 10) / 10;
    
    // Add quiz active boost
    if (completedCourses.includes(activeDomain)) {
        baseScore = Math.min(baseScore + 5.0, 100.0);
    }
    
    return baseScore;
}

function calculateResumeStrength(profile) {
    let score = 0;
    if (profile.projects > 0) score += Math.min(profile.projects * 15, 45);
    if (profile.internships > 0) score += Math.min(profile.internships * 20, 30);
    if (profile.skills.length > 2) score += 10;
    if (profile.software_tools.length > 2) score += 10;
    if (profile.certifications.length > 0) score += 5;
    return Math.min(score, 100);
}

function calculateRecruiterVisibility(profile) {
    let visibility = 20; // baseline
    if (profile.tier === "Tier 1") visibility += 30;
    else if (profile.tier === "Tier 2") visibility += 15;
    
    if (profile.internships > 0) visibility += 20;
    if (profile.certifications.length > 0) visibility += 15;
    if (profile.projects > 1) visibility += 15;
    
    return Math.min(visibility, 100);
}

// Calculate percentiles and ordinal ranks
function getRanks(score, matchedDomain, region, tier) {
    const allScores = candidates.map(c => c.score).sort((a,b) => b-a);
    const nationalScores = candidates.filter(c => c.region === region).map(c => c.score).sort((a,b) => b-a);
    const tierScores = candidates.filter(c => c.region === region && c.tier === tier).map(c => c.score).sort((a,b) => b-a);
    const clusterScores = candidates.filter(c => c.cluster === matchedDomain).map(c => c.score).sort((a,b) => b-a);
    
    const globalCountHigher = allScores.filter(s => s > score).length;
    const nationalCountHigher = nationalScores.filter(s => s > score).length;
    const tierCountHigher = tierScores.filter(s => s > score).length;
    const clusterCountHigher = clusterScores.filter(s => s > score).length;
    
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
        
        clusterRank: clusterCountHigher + 1,
        clusterTotal: clusterScores.length,
        clusterPercentile: Math.max(Math.round(((clusterScores.length - clusterCountHigher) / clusterScores.length) * 100), 1)
    };
}

// Plotly visualization functions
function drawGaugeChart(score) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const trace = {
        type: "indicator",
        mode: "gauge+number",
        value: score,
        title: { text: "Employability Rating", font: { color: textTheme, size: 14 } },
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
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: score
            }
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

function drawRadarChart(profile, matchedDomain) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const keywords = CLUSTER_KEYWORDS[matchedDomain].slice(0, 6);
    
    // User profile status mapping
    const userValues = keywords.map(kw => {
        const hasIt = profile.skills.includes(kw) || profile.software_tools.includes(kw) || profile.certifications.includes(kw);
        return hasIt ? 100 : 20;
    });

    // Top 10% benchmark peer statistics
    const peerValues = keywords.map((kw, i) => {
        // Average benchmark weights for top-tier freshers
        return [90, 85, 80, 95, 75, 70][i];
    });

    const data = [
        {
            type: 'scatterpolar',
            r: userValues,
            theta: keywords,
            fill: 'toself',
            name: 'Your Profile',
            fillcolor: 'rgba(37, 99, 235, 0.25)',
            line: { color: '#2563eb' }
        },
        {
            type: 'scatterpolar',
            r: peerValues,
            theta: keywords,
            fill: 'toself',
            name: 'Top 10% Peers',
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
        font: { color: textTheme, size: 8 }
    };

    Plotly.newPlot("plotly-radar-chart", data, layout, {responsive: true, displayModeBar: false});
}

function drawHeatmapChart(matchedDomain) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const sectors = ["Automotive", "Aerospace", "Energy/EV", "MEP/HVAC", "Manufacturing"];
    const domains = CLUSTERS;
    
    // Core demand distribution matrix
    // rows: domains, cols: sectors
    const values = [
        [90, 75, 60, 40, 95], // CAD Design
        [95, 90, 85, 50, 60], // CAE/Simulation
        [85, 80, 90, 30, 95], // Robotics
        [70, 60, 65, 30, 98], // Manufacturing
        [30, 40, 50, 98, 45]  // HVAC/Thermal
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
        margin: { t: 20, b: 40, l: 150, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: textTheme, size: 9 },
        xaxis: { gridcolor: 'rgba(0,0,0,0)', tickcolor: textTheme },
        yaxis: { gridcolor: 'rgba(0,0,0,0)', tickcolor: textTheme }
    };

    Plotly.newPlot("plotly-heatmap-chart", data, layout, {responsive: true, displayModeBar: false});
}

function drawSalaryChart(score) {
    const textTheme = activeTheme === 'dark' ? '#f8fafc' : '#0f172a';
    const gridTheme = activeTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    
    const xValues = [];
    const yValues = [];
    
    // Generate salary bell curve coordinates
    for (let x = 3; x <= 22; x += 0.5) {
        xValues.push(x);
        // Bell distribution centering around 7.5 LPA
        const y = Math.exp(-0.5 * Math.pow((x - 7.5) / 2.5, 2)) / (2.5 * Math.sqrt(2 * Math.PI));
        yValues.push(y);
    }
    
    // Estimate user salary based on readiness score
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

// 11 Core Job Roles recommendations data model
const ROLES_LIST = [
    { name: "Design Engineer", domain: "CAD Design", baseSalary: "₹6.2 LPA", demand: "Critical", reqs: ["GD&T (Geometric Dimensioning & Tolerancing)", "SolidWorks", "Tolerance Analysis"] },
    { name: "CFD Engineer", domain: "CAE/Simulation", baseSalary: "₹8.0 LPA", demand: "Critical", reqs: ["Computational Fluid Dynamics (CFD)", "Fluent", "Heat Transfer"] },
    { name: "Robotics Engineer", domain: "Robotics/Mechatronics", baseSalary: "₹8.5 LPA", demand: "Critical", reqs: ["Robotics", "Control Systems", "Python"] },
    { name: "HVAC Engineer", domain: "HVAC/Thermal", baseSalary: "₹5.8 LPA", demand: "High", reqs: ["HVAC Design", "Revit", "Thermodynamics"] },
    { name: "Manufacturing Engineer", domain: "Manufacturing/Operations", baseSalary: "₹6.0 LPA", demand: "High", reqs: ["Lean Manufacturing", "SolidCAM", "CNC Programming"] },
    { name: "Aerospace Engineer", domain: "CAE/Simulation", baseSalary: "₹9.2 LPA", demand: "High", reqs: ["Finite Element Analysis (FEA)", "CATIA", "Structural Analysis"] },
    { name: "Automotive Engineer", domain: "CAD Design", baseSalary: "₹7.5 LPA", demand: "High", reqs: ["DFM (Design for Manufacturing)", "SolidWorks", "Vibration Analysis"] },
    { name: "Production Engineer", domain: "Manufacturing/Operations", baseSalary: "₹5.5 LPA", demand: "Medium", reqs: ["Quality Control & Assurance", "Six Sigma", "CNC Programming"] },
    { name: "Maintenance Engineer", domain: "Manufacturing/Operations", baseSalary: "₹5.2 LPA", demand: "Medium", reqs: ["Quality Control & Assurance", "Embedded Systems", "Lean Manufacturing"] },
    { name: "Quality Engineer", domain: "Manufacturing/Operations", baseSalary: "₹5.8 LPA", demand: "Medium", reqs: ["Six Sigma", "Minitab", "Quality Control & Assurance"] },
    { name: "Project Engineer", domain: "CAD Design", baseSalary: "₹7.0 LPA", demand: "Medium", reqs: ["Product Design", "ASME Member / Cert", "Tolerance Analysis"] }
];

function generateRoleRecommendations(profile) {
    const container = document.getElementById("roles-recommendations-list");
    container.innerHTML = "";

    const userKeywords = profile.skills.concat(profile.software_tools).concat(profile.certifications);

    ROLES_LIST.forEach(role => {
        const intersection = role.reqs.filter(r => userKeywords.includes(r));
        const missing = role.reqs.filter(r => !userKeywords.includes(r));
        const matchPct = Math.round((intersection.length / role.reqs.length) * 100);
        
        let demandClass = 'badge-green';
        if (role.demand === 'Medium') demandClass = 'badge-medium';
        else if (role.demand === 'Critical') demandClass = 'badge-purple';

        const card = document.createElement("div");
        card.className = "role-recommendation-card glass-card";
        card.innerHTML = `
            <div class="role-card-header">
                <div class="role-name-wrapper">
                    <h2>${role.name}</h2>
                    <p>Core Domain Cluster: <strong>${role.domain}</strong></p>
                </div>
                <div class="role-stats-badge-row">
                    <span class="badge ${demandClass}">${role.demand} Demand</span>
                    <span class="badge badge-purple">${matchPct}% Match</span>
                </div>
            </div>
            
            <div class="role-card-body-grid">
                <div class="role-body-col">
                    <h4><i data-lucide="info" style="width:14px; height:14px;"></i> Salary & Economics</h4>
                    <p>Average Fresher Package: <strong>${role.baseSalary}</strong></p>
                    <p style="margin-top:0.4rem;">Market Hiring Index: <strong>Robust growth trends in Tier-1 aerospace and EV sectors.</strong></p>
                </div>
                <div class="role-body-col">
                    <h4><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> Skills Gap</h4>
                    ${missing.length > 0 ? `
                        <p>Missing requirements to close profile gap:</p>
                        <div class="missing-skills-pills">
                            ${missing.map(m => `<span class="missing-pill">${m}</span>`).join('')}
                        </div>
                    ` : `<p class="badge-green" style="padding:0.25rem; border-radius:4px; font-weight:700; color:var(--success);"><i data-lucide="check" style="width:14px; height:14px;"></i> Technical Requirements Met!</p>`}
                </div>
                <div class="role-body-col">
                    <h4><i data-lucide="map" style="width:14px; height:14px;"></i> Quick Learning Path</h4>
                    <p>${missing.length > 0 ? `Complete MechIntel course academy checks for <strong>${role.domain}</strong> to master <strong>${missing[0]}</strong>.` : `Maintain certifications and apply for senior roles.`}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

// UI Event Handlers and view switching
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

// Simulated Intelligent AI Chat Coach responses
function handleCoachChat(message) {
    const msgLower = message.toLowerCase();
    const chatBox = document.getElementById("coach-chat-messages");
    
    // User bubble
    const userBubble = document.createElement("div");
    userBubble.className = "chat-msg user-msg";
    userBubble.innerText = message;
    chatBox.appendChild(userBubble);
    
    // Scroll
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Formulate intelligent advice based on active profile gaps
    let coachReply = "";
    const activeCluster = targetProfile.cluster || activeDomain;
    const userCerts = targetProfile.certifications || [];
    
    if (msgLower.includes("cfd") || msgLower.includes("gap")) {
        coachReply = `Based on your profile matching **${activeCluster}**, you show key technical competencies in CAD design. However, CFD roles require mastery of Navier-Stokes boundary layers (y+ wall distance ≈ 1.0) and turbulence formulations. 
        \nI recommend:
        \n1. Enrolling in the CAE/Simulation Academy lecture on near-wall meshes.
        \n2. Completing a CFD wing section lift/drag Fluent model.
        \n3. Targeting the **ANSYS Certified Professional** credential.`;
    } else if (msgLower.includes("interview") || msgLower.includes("question")) {
        coachReply = `Here are 3 tough technical interview questions matching your **${activeCluster}** focus:
        \n1. *Explain the difference between Worst-Case and Root-Sum-Square (RSS) tolerance stackup methods. Under what manufacturing conditions is RSS preferred?*
        \n2. *For an injection-molded plastic cover, why is uniform wall thickness critical, and what draft angle range do you specify to ensure clean core ejection?*
        \n3. *Explain the physical meaning of the Von Mises yield criterion and its calculation under multi-axial principal stresses.*`;
    } else if (msgLower.includes("tier 3") || msgLower.includes("college") || msgLower.includes("placement")) {
        coachReply = `As a Tier 3 college graduate, on-campus placements are limited. You need to leverage **proof of skills**:
        \n1. **Build a GrabCAD Portfolio:** Upload parametric, fully-constrained designs like gearboxes or sheet-metal assemblies. Include calculations (e.g. Lewis formula stress limits).
        \n2. **Network with Engineering Managers:** Search LinkedIn for Lead Engineers (not HR) in design companies. Send a short note showcasing a model you ran, asking for technical critique.
        \n3. **Certificates:** Proving CSWP or Lean Six Sigma credentials instantly validates your profile past HR automated keyword filters.`;
    } else if (msgLower.includes("score") || msgLower.includes("readiness")) {
        const score = calculateCompetitivenessScore(targetProfile);
        coachReply = `Your Career Readiness Score is currently **${score}/100**. This score is parsed from:
        \n- **Academics:** Tier ${targetProfile.tier === "Tier 1" ? "1" : (targetProfile.tier === "Tier 2" ? "2" : "3")} College brand and degree impact.
        \n- **Skills & Software:** Breadth of CAD/CAE tools parsed.
        \n- **Experience:** Completed internships (${targetProfile.internships}) and project count (${targetProfile.projects}).
        \n*Tip:* Complete our mini-quizzes in the Course Academy to earn an immediate **+5.0 boost**!`;
    } else {
        coachReply = `I have logged your request. Regarding mechanical engineering development within **${activeCluster}**, acquiring certified credentials like **ASME** or **CSWP**, publishing process improvement papers, and designing structural assemblies represents the highest ROI strategy to boost your standing. Let me know if you need specific interview question sheets or resume optimization checklists!`;
    }
    
    // Simulate AI response delay
    setTimeout(() => {
        const coachBubble = document.createElement("div");
        coachBubble.className = "chat-msg coach-msg";
        coachBubble.innerText = coachReply;
        chatBox.appendChild(coachBubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}

// Generate beautiful formatted TXT report for download
function downloadCareerReport() {
    const score = calculateCompetitivenessScore(targetProfile);
    const ranks = getRanks(score, targetProfile.cluster || activeDomain, targetProfile.region, targetProfile.tier);
    
    const content = `===========================================================
MECHINTEL AI CAREER INTELLIGENCE PLATFORM REPORT
===========================================================
Calculated Standings: June 2026
Candidate ID: ${targetProfile.id || "Candidate #ME-49023"}
Region: ${targetProfile.region} | Institution Tier: ${targetProfile.tier}
Matched Specialization: ${targetProfile.cluster || activeDomain}

-----------------------------------------------------------
BENCHMARKED RANKINGS (100,000 Cohort)
-----------------------------------------------------------
- Career Readiness Score: ${score}/100
- Worldwide Rank: #${ranks.globalRank.toLocaleString()} (Top ${ranks.globalPercentile}%)
- National Rank (${targetProfile.region}): #${ranks.indiaRank.toLocaleString()} (Top ${ranks.indiaPercentile}%)
- Peer Institution Tier Rank: #${ranks.tierRank.toLocaleString()} (Top ${ranks.tierPercentile}%)
- Specialty Cluster Rank: #${ranks.clusterRank.toLocaleString()} (Top ${ranks.clusterPercentile}%)

-----------------------------------------------------------
DIAGNOSTICS & RECOMMENDATIONS
-----------------------------------------------------------
- Technical Skills Breadth: ${targetProfile.skills.join(', ') || "None"}
- Software Packages mastered: ${targetProfile.software_tools.join(', ') || "None"}
- Verified Certifications: ${targetProfile.certifications.join(', ') || "None"}

AI COACH DEVELOPMENT ACTION PATH:
1. Target professional certifications matching your domain (e.g. CSWP or ANSYS Certified Professional) to bypass automated screening filters.
2. Formulate dedicated portfolio blueprints showing mechanical calculations.
3. Network via GrabCAD and LinkedIn directly targeting design leads.

===========================================================
End of MechIntel AI Evaluation Report
===========================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MechIntel_Career_Report_${targetProfile.id || "ME-49023"}.txt`;
    link.click();
}

// Populate Course Lecture details based on dropdown selection
function loadCourseAcademy(domainName) {
    const course = COURSE_CATALOG[domainName];
    if (!course) return;

    document.getElementById("course-lesson-name").innerText = course.title;
    document.getElementById("course-lesson-desc").innerText = course.description;
    document.getElementById("course-lecture-notes").innerHTML = course.written_content;
    document.getElementById("course-quiz-question").innerText = course.quiz_question;

    // Reset status badge
    const badge = document.getElementById("course-academy-completion-badge");
    if (completedCourses.includes(domainName)) {
        badge.innerText = "✨ Completed (+5 Boost Active)";
        badge.className = "badge badge-green";
        document.getElementById("quiz-feedback-message").innerText = "🎉 Quiz completed! Score boosted.";
    } else {
        badge.innerText = "⏳ Status: Incomplete";
        badge.className = "badge badge-medium";
        document.getElementById("quiz-feedback-message").innerText = "";
    }

    // Load quiz options
    const form = document.getElementById("course-quiz-form");
    form.innerHTML = "";
    course.quiz_options.forEach((opt, idx) => {
        const row = document.createElement("div");
        row.className = "quiz-opt-row";
        row.innerHTML = `
            <input type="radio" name="academy_quiz_opt" id="quiz_opt_${idx}" value="${opt}">
            <label for="quiz_opt_${idx}">${opt}</label>
        `;
        form.appendChild(row);
    });

    // Populate recommendation list
    const recsList = document.getElementById("course-recommendations-list");
    recsList.innerHTML = `
        <p>Recommended certificates to acquire:</p>
        <p style="margin-top:0.4rem; font-size:0.8rem;"><strong>${domainName === 'CAD Design' ? 'SolidWorks CSWP / CSWA' : (domainName === 'CAE/Simulation' ? 'ANSYS Certified Specialist' : 'ASME Robotics / Lean Six Sigma')}</strong></p>
    `;
    
    // Draw timeline chart
    drawTimelineChart();
}

// Competitor Database paging & filtering
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
            c.degree.toLowerCase().includes(search) ||
            c.skills.some(s => s.toLowerCase().includes(search)) ||
            c.software_tools.some(s => s.toLowerCase().includes(search))
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

// Initialize Particle Canvas
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const colorTheme = activeTheme === 'dark' ? 'rgba(37, 99, 235, 0.05)' : 'rgba(37, 99, 235, 0.03)';
    
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
    
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Simulator computations
function updateSimulatorImpact() {
    if (!targetProfile) return;
    
    let simScore = calculateCompetitivenessScore(targetProfile);
    
    // Toggle impact metrics
    const addIntern = document.getElementById("sim-cb-intern").checked;
    const addProj = document.getElementById("sim-cb-proj").checked;
    const addComp = document.getElementById("sim-cb-comp").checked;
    const addPaper = document.getElementById("sim-cb-paper").checked;
    const addSkill = document.getElementById("sim-cb-skill").checked;
    const addCert = document.getElementById("sim-cb-cert").checked;
    
    if (addIntern) simScore = Math.min(simScore + 15, 100);
    if (addProj) simScore = Math.min(simScore + 10, 100);
    if (addComp) simScore = Math.min(simScore + 6, 100);
    if (addPaper) simScore = Math.min(simScore + 5, 100);
    if (addSkill) simScore = Math.min(simScore + 5, 100);
    if (addCert) simScore = Math.min(simScore + 5, 100);
    
    simScore = Math.round(simScore * 10) / 10;
    
    const ranks = getRanks(simScore, targetProfile.cluster || activeDomain, targetProfile.region, targetProfile.tier);
    
    document.getElementById("sim-score-val").innerText = `${simScore}/100`;
    document.getElementById("sim-global-rank-val").innerText = `#${ranks.globalRank.toLocaleString()}`;
    document.getElementById("sim-india-rank-val").innerText = `#${ranks.indiaRank.toLocaleString()}`;
}

// Build and show the high-fidelity SaaS dashboard
function buildDashboard(profile) {
    targetProfile = profile;
    
    // Save to session state
    sessionStorage.setItem("userProfile", JSON.stringify(profile));
    
    const score = calculateCompetitivenessScore(profile);
    const resumeStrength = calculateResumeStrength(profile);
    const recruiterVisibility = calculateRecruiterVisibility(profile);
    
    // Update overview metrics
    document.getElementById("val-career-readiness").innerText = `${score}/100`;
    document.getElementById("val-resume-strength").innerText = `${resumeStrength}/100`;
    document.getElementById("val-recruiter-readiness").innerText = `${recruiterVisibility}%`;
    
    activeDomain = profile.cluster || "CAD Design";
    document.getElementById("val-matched-domain").innerText = activeDomain;
    
    // Load ranks
    const ranks = getRanks(score, activeDomain, profile.region, profile.tier);
    
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
    
    // Populate user profile info in sidebar
    document.getElementById("sb-candidate-id").innerText = profile.id || "Candidate #ME-49023";
    document.getElementById("sb-college-val").innerText = `${profile.degree} | ${profile.tier}`;
    document.getElementById("sb-avatar-letter").innerText = profile.degree.charAt(0);
    
    // Render Diagnostics checklists
    const strengthsUl = document.getElementById("overview-strengths");
    strengthsUl.innerHTML = "";
    if (profile.tier === "Tier 1") {
        strengthsUl.innerHTML += `<li>Premium tier institution background unlocks competitive baseline listings.</li>`;
    }
    if (profile.internships > 0) {
        strengthsUl.innerHTML += `<li>Industrial exposure (${profile.internships} internships) signals workplace readiness.</li>`;
    }
    if (profile.projects >= 3) {
        strengthsUl.innerHTML += `<li>Robust project counts demonstrate design implementation capability.</li>`;
    }
    if (profile.certifications.length > 0) {
        strengthsUl.innerHTML += `<li>Verified software certifications increase technical trust.</li>`;
    }
    if (strengthsUl.innerHTML === "") {
        strengthsUl.innerHTML = `<li>Basic credentials loaded. Target micro-projects to establish portfolio strengths.</li>`;
    }

    const weaknessesUl = document.getElementById("overview-weaknesses");
    weaknessesUl.innerHTML = "";
    if (profile.tier === "Tier 3") {
        weaknessesUl.innerHTML += `<li>Tier 3 credentials lack active campus hiring. Focus on off-campus portfolio channels.</li>`;
    }
    if (profile.internships === 0) {
        weaknessesUl.innerHTML += `<li>Zero internships reported. Target virtual internships or research assistant roles.</li>`;
    }
    if (profile.projects <= 1) {
        weaknessesUl.innerHTML += `<li>Insufficient capstone designs. Recruiters evaluate freshers based on design portfolios.</li>`;
    }
    if (profile.certifications.length === 0) {
        weaknessesUl.innerHTML += `<li>Missing verified CAD/CAE certifications (e.g. CSWA, CSWP).</li>`;
    }
    if (weaknessesUl.innerHTML === "") {
        weaknessesUl.innerHTML = `<li>No critical technical gaps detected compared to benchmark peers!</li>`;
    }

    // Set simulator label targets
    const missingSkills = CLUSTER_KEYWORDS[activeDomain].filter(k => SKILLS_DICT[k.toLowerCase()] && !profile.skills.includes(k));
    const missingCerts = CLUSTER_KEYWORDS[activeDomain].filter(k => CERTS_DICT[k.toLowerCase()] && !profile.certifications.includes(k));
    
    document.getElementById("sim-cb-skill-label").innerText = missingSkills.length > 0 ? `Master missing Skill: "${missingSkills[0]}" (+5)` : "All core skills acquired!";
    document.getElementById("sim-cb-cert-label").innerText = missingCerts.length > 0 ? `Obtain missing Cert: "${missingCerts[0]}" (+5)` : "All core certs verified!";
    
    // Draw Plotly charts
    drawGaugeChart(score);
    drawRadarChart(profile, activeDomain);
    drawHeatmapChart(activeDomain);
    drawSalaryChart(score);
    
    // Populate role recommendations
    generateRoleRecommendations(profile);
    
    // Setup Employer demands
    document.getElementById("demand-cluster-icon").innerText = activeDomain === "CAD Design" ? "📐" : (activeDomain === "CAE/Simulation" ? "💻" : (activeDomain === "Robotics/Mechatronics" ? "🤖" : (activeDomain === "Manufacturing/Operations" ? "⚙️" : "🔥")));
    document.getElementById("demand-cluster-title").innerText = activeDomain;
    
    const demands = EMPLOYER_DEMANDS[activeDomain];
    document.getElementById("demand-cluster-role").innerText = demands.role;
    
    document.getElementById("demand-skills-list").innerHTML = demands.skills.map(s => `
        <div class="demand-list-item">
            <h5>${s.name} <span class="badge badge-low">${s.priority}</span></h5>
            <p>${s.desc}</p>
        </div>
    `).join('');
    
    document.getElementById("demand-software-list").innerHTML = demands.software.map(sw => `
        <div class="demand-list-item">
            <h5>${sw.name} <span class="badge badge-medium">${sw.priority}</span></h5>
            <p>${sw.desc}</p>
        </div>
    `).join('');

    document.getElementById("demand-certs-list").innerHTML = demands.certs.map(c => `
        <div class="demand-list-item">
            <h5>${c.name} <span class="badge badge-purple">${c.priority}</span></h5>
            <p>${c.desc}</p>
        </div>
    `).join('');

    document.getElementById("demand-portfolio-list").innerHTML = demands.portfolio.map(p => `
        <div class="demand-list-item">
            <h5>${p.title}</h5>
            <p>${p.desc}</p>
        </div>
    `).join('');
    
    // Setup Course Academy dropdown and contents
    document.getElementById("course-domain-selector").value = activeDomain;
    loadCourseAcademy(activeDomain);

    // Initial table render
    renderDatabaseTable();
    
    // AI Optimizer recommendations block
    document.getElementById("coach-resume-suggestions").innerHTML = `
        <li>Acquire verified <strong>${activeDomain === 'CAD Design' ? 'ASME GD&T positioning constraints' : 'ANSYS structural mesh criteria'}</strong>.</li>
        <li>Format your capstone portfolio detailing mechanical load calculations (e.g. Lewis gear bending forces).</li>
    `;

    // Final dashboard transition
    showPane("dashboard-panel");
    lucide.createIcons();
    updateSimulatorImpact();
}

// Local PDF reader text extractor
async function handlePdfUpload(file) {
    const statusDiv = document.getElementById("hero-upload-status") || document.getElementById("pdf-upload-status");
    if (statusDiv) {
        statusDiv.style.display = "block";
        statusDiv.innerText = "Initializing PDF reader...";
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
            if (statusDiv) statusDiv.innerText = "PDF successfully extracted! Initializing parser overlay...";
            
            // Show scanning overlay modal
            const overlay = document.getElementById("scanner-overlay");
            overlay.classList.add("active");
            
            setTimeout(() => { document.getElementById("scan-step-1").className = "scanner-step-row completed"; }, 600);
            setTimeout(() => { document.getElementById("scan-step-2").className = "scanner-step-row completed"; }, 1200);
            setTimeout(() => { document.getElementById("scan-step-3").className = "scanner-step-row completed"; }, 1800);
            setTimeout(() => { 
                document.getElementById("scan-step-4").className = "scanner-step-row completed"; 
                overlay.classList.remove("active");
                
                // Parse attributes
                const parsed = parseResumeText(text);
                
                // Refine Manual Form values
                document.getElementById("form-region").value = parsed.region;
                document.getElementById("form-tier").value = parsed.tier;
                document.getElementById("form-degree").value = parsed.degree;
                document.getElementById("form-projects").value = parsed.projects;
                document.getElementById("form-internships").value = parsed.internships;
                document.getElementById("form-papers").value = parsed.research_papers;
                document.getElementById("form-competitions").value = parsed.competitions;
                
                // Set chips
                const matchedCluster = getBestMatchedCluster(parsed.skills.concat(parsed.software_tools));
                document.querySelectorAll(".domain-chip").forEach(chip => {
                    if (chip.getAttribute("data-domain") === matchedCluster) chip.classList.add("active");
                    else chip.classList.remove("active");
                });

                // Clear tags
                document.querySelectorAll(".tag-pill").forEach(tag => tag.remove());
                
                // Add extracted skills/sw tags to input fields
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
                
                // Build profile model
                const profile = {
                    id: `Candidate #ME-${Math.floor(10000 + Math.random() * 90000)}`,
                    region: parsed.region,
                    tier: parsed.tier,
                    degree: parsed.degree,
                    projects: parsed.projects,
                    internships: parsed.internships,
                    research_papers: parsed.research_papers,
                    competitions: parsed.competitions,
                    skills: parsed.skills,
                    software_tools: parsed.software_tools,
                    certifications: parsed.certifications,
                    cluster: matchedCluster
                };
                
                // Redirect to Setup panel first to let user refine
                showPane("manual-setup-panel");
                document.getElementById("resume-paste-box").value = parsed.raw_text;
            }, 2400);

        } else {
            if (statusDiv) statusDiv.innerText = "Error: PDF seems to be scanned/image-only.";
        }
    } catch(e) {
        if (statusDiv) statusDiv.innerText = `Error: ${e.message}`;
    }
}

// Find matched specialty based on keyword intersections
function getBestMatchedCluster(attrs) {
    let bestCluster = "CAD Design";
    let maxIntersect = 0;
    
    CLUSTERS.forEach(c => {
        const intersection = attrs.filter(a => CLUSTER_KEYWORDS[c].includes(a));
        if (intersection.length > maxIntersect) {
            maxIntersect = intersection.length;
            bestCluster = c;
        }
    });
    return bestCluster;
}

// Tag helpers
function addTag(wrapperId, text, className) {
    const wrapper = document.getElementById(wrapperId);
    const input = wrapper.querySelector("input");
    
    // Check if tag already exists
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

// Presets loader
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

function setActiveDomainChip(domain) {
    document.querySelectorAll(".domain-chip").forEach(chip => {
        if(chip.getAttribute("data-domain") === domain) chip.classList.add("active");
        else chip.classList.remove("active");
    });
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Generate cohort DB
    candidates = generateDataset();
    
    // Init canvas particles
    initParticles();
    
    // Setup Lucide icons
    lucide.createIcons();

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
        
        // Redraw charts with new colors
        if(targetProfile) {
            drawGaugeChart(calculateCompetitivenessScore(targetProfile));
            drawRadarChart(targetProfile, activeDomain);
            drawHeatmapChart(activeDomain);
            drawSalaryChart(calculateCompetitivenessScore(targetProfile));
        }
    });

    // View Routing triggers
    document.getElementById("nav-cta-btn").addEventListener("click", () => {
        // Retrieve session profile if exists, else manual entry
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

    // Preset chips listeners
    document.querySelectorAll(".preset-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            loadPreset(chip.getAttribute("data-preset"));
        });
    });

    // Domain chips selector
    document.querySelectorAll(".domain-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".domain-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
        });
    });

    // File upload PDF parse triggers
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

    // Paste resume text parse button
    document.getElementById("btn-parse-resume").addEventListener("click", () => {
        const text = document.getElementById("resume-paste-box").value;
        if (!text.trim()) return;
        
        const parsed = parseResumeText(text);
        
        // Populate inputs
        document.getElementById("form-region").value = parsed.region;
        document.getElementById("form-tier").value = parsed.tier;
        document.getElementById("form-degree").value = parsed.degree;
        document.getElementById("form-projects").value = parsed.projects;
        document.getElementById("form-internships").value = parsed.internships;
        document.getElementById("form-papers").value = parsed.research_papers;
        document.getElementById("form-competitions").value = parsed.competitions;
        
        const matched = getBestMatchedCluster(parsed.skills.concat(parsed.software_tools));
        setActiveDomainChip(matched);
        
        document.querySelectorAll(".tag-pill").forEach(pill => pill.remove());
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
    });

    // Custom tags input key listener
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

    // Build and compile standings trigger
    document.getElementById("btn-run-analysis").addEventListener("click", () => {
        // Collect tags
        const skills = Array.from(document.querySelectorAll("#skills-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        const software = Array.from(document.querySelectorAll("#tools-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        const certs = Array.from(document.querySelectorAll("#certs-input-wrapper .tag-pill")).map(pill => pill.innerText.trim());
        
        const activeDomainChip = document.querySelector(".domain-chip.active");
        const domain = activeDomainChip ? activeDomainChip.getAttribute("data-domain") : "CAD Design";

        const profile = {
            id: targetProfile?.id || `Candidate #ME-${Math.floor(10000 + Math.random() * 90000)}`,
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

    // Sidebar navigation clicks
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const view = item.getAttribute("data-view");
            if(view) {
                showDashboardView(view);
            }
        });
    });

    document.getElementById("sidebar-logout-btn").addEventListener("click", () => {
        showPane("landing-page-container");
    });
    
    document.getElementById("dashboard-refine-profile-btn").addEventListener("click", () => {
        showPane("manual-setup-panel");
    });

    // AI Coach message send triggers
    document.getElementById("coach-chat-send-btn").addEventListener("click", () => {
        const input = document.getElementById("coach-chat-input");
        const message = input.value.trim();
        if(message) {
            handleCoachChat(message);
            input.value = "";
        }
    });
    
    document.getElementById("coach-chat-input").addEventListener("keydown", (e) => {
        if(e.key === 'Enter') {
            const input = document.getElementById("coach-chat-input");
            const message = input.value.trim();
            if(message) {
                handleCoachChat(message);
                input.value = "";
            }
        }
    });

    // Chat preset clicks
    document.querySelectorAll(".chat-preset-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            handleCoachChat(chip.getAttribute("data-prompt"));
        });
    });

    // Interview simulator questions click
    document.getElementById("coach-gen-interview-btn").addEventListener("click", () => {
        const activeCluster = targetProfile?.cluster || activeDomain;
        const box = document.getElementById("coach-questions-box");
        box.innerHTML = `
            <p style="color:var(--text-primary); font-weight:700; margin-bottom:0.5rem;">Simulating custom interview questions for "${activeCluster}":</p>
            <ol style="margin-left:1.2rem; font-size:0.8rem; line-height:1.4; color:var(--text-secondary);">
                <li>How do you define the primary datum to control perpendicularity?</li>
                <li>What criteria do you use to evaluate if an FEA mesh is converged?</li>
                <li>Explain the role of the integral term (Ki) in PID automation systems.</li>
            </ol>
        `;
    });

    // Download Report trigger
    document.getElementById("coach-download-report-btn").addEventListener("click", () => {
        downloadCareerReport();
    });

    // FAQ Accordion click
    document.querySelectorAll(".faq-question").forEach(q => {
        q.addEventListener("click", () => {
            const item = q.parentElement;
            item.classList.toggle("active");
        });
    });

    // Course selector dropdown
    document.getElementById("course-domain-selector").addEventListener("change", (e) => {
        loadCourseAcademy(e.target.value);
    });

    // Submit Academy quiz trigger
    document.getElementById("btn-submit-quiz").addEventListener("click", () => {
        const domain = document.getElementById("course-domain-selector").value;
        const selected = document.querySelector('input[name="academy_quiz_opt"]:checked');
        const feedback = document.getElementById("quiz-feedback-message");
        
        if(!selected) {
            feedback.innerText = "❌ Please select an option.";
            feedback.style.color = "var(--danger)";
            return;
        }
        
        const course = COURSE_CATALOG[domain];
        if (selected.value === course.quiz_answer) {
            feedback.innerText = "🎉 Correct answer! Score boosted by +5.";
            feedback.style.color = "var(--success)";
            
            if(!completedCourses.includes(domain)) {
                completedCourses.push(domain);
            }
            
            // Re-render
            if (targetProfile) {
                buildDashboard(targetProfile);
            }
        } else {
            feedback.innerText = "❌ Incorrect answer. Please try again.";
            feedback.style.color = "var(--danger)";
        }
    });

    // Simulator checkboxes
    document.querySelectorAll(".sim-checkbox").forEach(cb => {
        cb.addEventListener("change", () => {
            updateSimulatorImpact();
        });
    });

    // Database search & filters
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
    
    // Pagination buttons
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
