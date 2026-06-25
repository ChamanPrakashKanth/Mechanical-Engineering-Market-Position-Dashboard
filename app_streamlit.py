import streamlit as st
import pandas as pd
import numpy as np
import json
import re
import os
from pypdf import PdfReader

# Page Configuration
st.set_page_config(
    page_title="ME Market Position Pathfinder",
    page_icon="⚛",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Dark-mode styled elements via custom CSS injection
st.markdown("""
<style>
    .main {
        background-color: #0b0f19;
        color: #f8fafc;
    }
    .stButton>button {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    div[data-testid="stMetricValue"] {
        font-size: 2.2rem;
        font-weight: 700;
        color: #6366f1;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 1rem;
        color: #94a3b8;
    }
    .recommendation-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }
    .recommendation-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        background: rgba(255, 255, 255, 0.05);
    }
    .recommendation-title {
        font-family: 'Outfit', sans-serif;
        font-size: 1.15rem;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .roadmap-badge {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .badge-high {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .badge-medium {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .badge-low {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
</style>
""", unsafe_allow_html=True)

# ---------------- TAXONOMY & CONFIGURATION ----------------
SKILLS_DICT = {
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
    "thermal analysis": "Thermal Analysis",
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
}

SOFTWARE_DICT = {
    "solidworks": "SolidWorks",
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
    "arduino": "Arduino"
}

CERTS_DICT = {
    "cswa": "Certified SolidWorks Associate (CSWA)",
    "cswp": "Certified SolidWorks Professional (CSWP)",
    "six sigma green": "Lean Six Sigma Green Belt",
    "six sigma yellow": "Lean Six Sigma Yellow Belt",
    "six sigma black": "Lean Six Sigma Black Belt",
    "ashrae": "ASHRAE Member Certification",
    "hvac design": "HVAC Design Certificate",
    "asme": "ASME Member / Cert",
    "ansys": "ANSYS Certified Professional"
}

CLUSTERS = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"]

CLUSTER_KEYWORDS = {
    "CAD Design": ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Sheet Metal Design", "DFM (Design for Manufacturing)", "Tolerance Analysis", "Injection Molding Design", "SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "PTC Creo", "Autodesk Inventor", "Certified SolidWorks Associate (CSWA)", "Certified SolidWorks Professional (CSWP)"],
    "CAE/Simulation": ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis", "Vibration Analysis", "ANSYS", "Abaqus", "MATLAB", "Fluent", "COMSOL", "HyperMesh", "Nastran"],
    "Robotics/Mechatronics": ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems", "Kinematics & Dynamics", "MATLAB", "Simulink", "Python", "C++", "LabVIEW", "Arduino"],
    "Manufacturing/Operations": ["Lean Manufacturing", "Six Sigma", "Quality Control & Assurance", "CNC Programming", "AutoCAD", "SolidCAM", "Minitab", "Mastercam", "Lean Six Sigma Yellow Belt", "Lean Six Sigma Green Belt", "Lean Six Sigma Black Belt"],
    "HVAC/Thermal": ["HVAC Design", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Piping Design", "AutoCAD", "Revit", "HVAC Design Certificate", "ASHRAE Member Certification"]
}

EMPLOYER_DEMANDS = {
    "CAD Design": {
        "role": "Design Engineer / CAD Analyst / Product Developer",
        "skills": [
            { "name": "Geometric Dimensioning & Tolerancing (GD&T)", "desc": "Applying ASME Y14.5 rules for datum definitions, feature control frames, MMC/LMC, and precision component matching.", "priority": "Critical" },
            { "name": "Design for Manufacturing & Assembly (DFM/DFMA)", "desc": "Optimizing CAD models for cost-efficient injection molding (draft angles), sheet metal fabrication (bend reliefs), and CNC machining.", "priority": "High" },
            { "name": "Tolerance Stack-up Analysis", "desc": "Performing linear and statistical (Root Sum Square - RSS) tolerance analyses to prevent assembly failures.", "priority": "High" }
        ],
        "software": [
            { "name": "SolidWorks", "desc": "Industry-standard parametric 3D modeling, advanced surfacing, and assembly configuration management.", "priority": "Critical" },
            { "name": "Autodesk AutoCAD", "desc": "Producing precise 2D mechanical drafts, plant piping layouts, and mechanical details.", "priority": "High" },
            { "name": "CATIA", "desc": "Advanced surfacing and structural frame modeling, dominant in aerospace and automotive giants.", "priority": "High" },
            { "name": "PTC Creo / Siemens NX", "desc": "Top-tier CAD systems used in complex high-end automotive assemblies and machinery design.", "priority": "Medium" }
        ],
        "certs": [
            { "name": "Certified SolidWorks Professional (CSWP)", "desc": "Validates complex solid modeling, multi-body parts, and coordinate systems setup.", "priority": "High" },
            { "name": "Certified SolidWorks Associate (CSWA)", "desc": "Entry-level credential proving core part drafting and assembly mating competence.", "priority": "Medium" },
            { "name": "Autodesk Certified Professional", "desc": "Verifies AutoCAD/Inventor drafting standards and speed proficiency.", "priority": "Medium" }
        ],
        "portfolio": [
            { "title": "Parametric Gearbox Assembly", "desc": "A fully constrained gear system complying with tooth bending calculations and bearing fits." },
            { "title": "Sheet Metal Enclosure Design", "desc": "Electronics casing detailing precise flat patterns, bend radii, and fastener reliefs." }
        ]
    },
    "CAE/Simulation": {
        "role": "Simulation Analyst / FEA Engineer / CFD Specialist",
        "skills": [
            { "name": "Finite Element Method (FEM) Fundamentals", "desc": "Theoretical understanding of element formulations (1D beams, 2D shells, 3D solids), meshing density, and convergence curves.", "priority": "Critical" },
            { "name": "Computational Fluid Dynamics (CFD)", "desc": "Applying turbulence models (SST k-omega, standard k-epsilon), near-wall cell treatment (y+), and mass flow conservation laws.", "priority": "Critical" },
            { "name": "Structural & Vibration Dynamics", "desc": "Setting up modal, harmonic response, fatigue lifecycle, and non-linear contact simulations.", "priority": "High" }
        ],
        "software": [
            { "name": "ANSYS Workbench", "desc": "Industry benchmark for Static Structural, Modal, Fluent CFD solvers, and thermal simulations.", "priority": "Critical" },
            { "name": "Abaqus / Nastran", "desc": "Advanced solver software for complex structural fatigue, crash testing, and automotive structural durability.", "priority": "High" },
            { "name": "Altair HyperMesh", "desc": "Primary pre-processor used in automotive/aerospace industries to build structured meshes.", "priority": "High" },
            { "name": "MATLAB", "desc": "Used to build numerical scripts, solve differential matrices, and run optimization loops.", "priority": "Medium" }
        ],
        "certs": [
            { "name": "ANSYS Certified Professional", "desc": "Industry-recognized validation of simulation setups, solver settings, and post-processing accuracy.", "priority": "High" },
            { "name": "NAFEMS Certification", "desc": "Structural simulation verification complying with international standards.", "priority": "Medium" }
        ],
        "portfolio": [
            { "title": "NACA Wing Section Aerodynamic CFD", "desc": "CFD analysis validating lift/drag coefficients and boundary layer grid independence." },
            { "title": "Bike Frame Fatigue FEA", "desc": "Structural fatigue FEA analyzing stress concentrations under dynamic cyclist loads." }
        ]
    },
    "Robotics/Mechatronics": {
        "role": "Automation Engineer / Mechatronics specialist / Controls Engineer",
        "skills": [
            { "name": "Control Systems & PID Tuning", "desc": "Designing closed-loop feedback controllers, tuning proportional, integral, and derivative constants for speed/position.", "priority": "Critical" },
            { "name": "Embedded Programming", "desc": "Writing C/C++ firmware for microcontrollers (Arduino, STM32, ESP32) to read sensor data (I2C, SPI) and drive actuators.", "priority": "Critical" },
            { "name": "Robot Kinematics", "desc": "Deriving Forward & Inverse kinematics matrices for joint angles and robotic tool positioning.", "priority": "High" }
        ],
        "software": [
            { "name": "MATLAB & Simulink", "desc": "Modeling dynamic physical systems, root-locus design, and control loop simulations.", "priority": "Critical" },
            { "name": "Python", "desc": "Standard for robot vision scripting (OpenCV), motion planning algorithms, and machine learning models.", "priority": "High" },
            { "name": "Arduino IDE / STM32Cube", "desc": "Compiling firmware code for hardware execution and debugging hardware interfaces.", "priority": "High" },
            { "name": "ROS (Robot Operating System)", "desc": "Software framework providing hardware abstraction, device drivers, and package messaging.", "priority": "Medium" }
        ],
        "certs": [
            { "name": "CLAD (Certified LabVIEW Associate Developer)", "desc": "Validates capability in automated testing, data acquisition, and virtual instrument controls.", "priority": "High" },
            { "name": "ASME Robotics Specialist", "desc": "Validates fundamentals of automation and robotic mechanism designs.", "priority": "Medium" }
        ],
        "portfolio": [
            { "title": "3-Axis Closed-loop Robotic Arm", "desc": "Trajectory mapping and servo-driven controller utilizing Simulink & Arduino." },
            { "title": "PID Balance Bot", "desc": "Self-balancing two-wheeled robot using IMU sensors and real-time PID feedback." }
        ]
    },
    "Manufacturing/Operations": {
        "role": "Production Engineer / Quality Analyst / Operations Manager",
        "skills": [
            { "name": "Lean Six Sigma (DMAIC)", "desc": "Process capability evaluation (Cp, Cpk indices), cycle time balancing, and statistical quality audits.", "priority": "Critical" },
            { "name": "CNC Machining & CAM Fixtures", "desc": "Generating precise tool paths (G-code/M-code) and designing mechanical fixtures using the 3-2-1 locating principle.", "priority": "High" },
            { "name": "FMEA & Process Safety", "desc": "Conducting Failure Mode and Effects Analyses to identify risks and establish safety protocols.", "priority": "High" }
        ],
        "software": [
            { "name": "Mastercam / SolidCAM", "desc": "Industry-standard software for generating computer-aided manufacturing toolpaths.", "priority": "Critical" },
            { "name": "Minitab", "desc": "Primary statistical tool for analyzing manufacturing variance, Gage R&R, and control charts.", "priority": "High" },
            { "name": "Autodesk AutoCAD", "desc": "Used to draft factory layout designs, assembly floor configurations, and workflow steps.", "priority": "Medium" }
        ],
        "certs": [
            { "name": "Lean Six Sigma Green Belt", "desc": "Validates candidate's capability to lead small process improvement and waste reduction projects.", "priority": "Critical" },
            { "name": "Lean Six Sigma Yellow Belt", "desc": "Proves familiarity with Lean terminologies, 5S layouts, and quality tools.", "priority": "High" },
            { "name": "ASQ Certified Quality Engineer (CQE)", "desc": "Verifies statistical evaluation competence and control methods.", "priority": "Medium" }
        ],
        "portfolio": [
            { "title": "Six Sigma DMAIC Yield Audit", "desc": "Statistical process improvement study analyzing 500 samples in Minitab to boost yield." },
            { "title": "CAM-designed Welding Fixture", "desc": "Fixture design utilizing quick-clamp fixtures and Mastercam CNC programming." }
        ]
    },
    "HVAC/Thermal": {
        "role": "HVAC Project Engineer / MEP Designer / Building Energy Analyst",
        "skills": [
            { "name": "Cooling & Heating Load Calculation", "desc": "Calculating sensible and latent heat transfer rates using CLTD and psychrometric principles.", "priority": "Critical" },
            { "name": "Duct & Water Piping Design", "desc": "Determining friction losses, pipe sizes, duct paths, and ventilation rates in buildings.", "priority": "Critical" },
            { "name": "ASHRAE Standard Compliance", "desc": "Applying international standards (Standard 55, 62.1, 90.1) for thermal comfort, ventilation, and efficiency.", "priority": "High" }
        ],
        "software": [
            { "name": "Autodesk Revit MEP", "desc": "Industry standard for building information modeling (BIM), 3D duct layout, and coordinate checks.", "priority": "Critical" },
            { "name": "Carrier Hourly Analysis Program (HAP)", "desc": "Standard software for office heat load simulations, energy cost checks, and climate analysis.", "priority": "High" },
            { "name": "Autodesk AutoCAD", "desc": "Producing schematic double-line layouts and 2D piping plans.", "priority": "High" }
        ],
        "certs": [
            { "name": "HVAC Design Certificate", "desc": "Validates core design knowledge from accredited engineering associations.", "priority": "High" },
            { "name": "ASHRAE Member Certification", "desc": "Demonstrates standard alignment and membership in ASHRAE.", "priority": "Medium" }
        ],
        "portfolio": [
            { "title": "Office Building VRF Design", "desc": "Full heat load simulation in HAP, duct routing, and MEP layout in Revit." },
            { "title": "Shell-and-Tube Heat Exchanger Design", "desc": "Thermal analysis using LMTD and effectiveness-NTU methods." }
        ]
    }
}

PROJECTS_RECOMMENDATIONS = {
    "CAD Design": [
        {
            "title": "Industrial Gearbox Parametric Assembly",
            "desc": "Design a multi-stage spur/helical gearbox according to ASME standards. Utilize parametric constraints to dynamically scale design based on input torque/speed.",
            "steps": ["Calculate tooth bending stress using Lewis Formula.", "Create fully constrained 3D parts with keyways, shafts, and bearings.", "Run tolerance stack-up analysis on the shaft assembly.", "Export complete drawing sheet with GD&T notations (fits, runouts)."],
            "difficulty": "Intermediate",
            "roi": "High"
        },
        {
            "title": "Automotive Sheet Metal Chassis Bracket",
            "desc": "Design a structural automotive bracket optimized for stamping. Incorporate bends, reliefs, hem, and embosses.",
            "steps": ["Create bracket geometry considering K-factor and minimum bend radius.", "Generate flat pattern layouts for manufacturing.", "Establish datum reference frames and define GD&T specifications for inspection."],
            "difficulty": "Beginner",
            "roi": "Medium"
        }
    ],
    "CAE/Simulation": [
        {
            "title": "Aerodynamic Optimization of a Wing Section",
            "desc": "Perform 2D/3D CFD analysis of a wing profile (NACA 4-digit) using ANSYS Fluent to optimize lift-to-drag ratio.",
            "steps": ["Generate high-quality structured C-grid mesh with appropriate y+ boundary layer cells.", "Set up k-omega SST turbulence model with velocity inlets.", "Perform grid independence study to validate results.", "Export lift/drag coefficients and static pressure contour diagrams."],
            "difficulty": "Advanced",
            "roi": "High"
        },
        {
            "title": "Structural Fatigue Analysis of a Bike Frame",
            "desc": "Conduct FEA on a structural bicycle frame assembly subjected to dynamic impact loading in ANSYS Workbench.",
            "steps": ["Import geometry and assign materials (AISI 4130 vs Al 6061).", "Model weld connections and apply boundary conditions mimicking cyclist weight and curb strike.", "Analyze stress concentrations, deformation, and estimate fatigue cycle life."],
            "difficulty": "Intermediate",
            "roi": "High"
        }
    ],
    "Robotics/Mechatronics": [
        {
            "title": "3-Axis Robotic Arm Control System",
            "desc": "Develop a simulated or physical closed-loop PID control system for a 3-DOF robot arm utilizing MATLAB/Simulink and Arduino/STM32.",
            "steps": ["Derive Forward and Inverse Kinematics equations.", "Model joint dynamics in Simulink.", "Implement PID controllers to achieve target position feedback.", "Build prototype using servo motors and microcontrollers with Python GUI control."],
            "difficulty": "Advanced",
            "roi": "High"
        },
        {
            "title": "Automated Material Sorter Conveyor System",
            "desc": "Design a mechatronic sorting conveyor using color/inductive sensors, stepper motors, and microcontrollers.",
            "steps": ["Design structural conveyor bed in CAD.", "Write sensor interrupt handling scripts in C++ / Python.", "Integrate state-machine logic for product routing and pneumatic rejection cycles."],
            "difficulty": "Intermediate",
            "roi": "Medium"
        }
    ],
    "Manufacturing/Operations": [
        {
            "title": "DMAIC Process Capability (Cp/Cpk) Optimization",
            "desc": "Conduct a mock Lean Six Sigma quality assurance audit using statistical data in Minitab to improve production yield.",
            "steps": ["Measure initial part variation and compile a dataset of 500 samples.", "Analyze data using ANOVA and Gage R&R studies.", "Formulate control charts (X-bar & R) and calculate Cp/Cpk metrics.", "Propose corrective tooling actions to reach Six Sigma thresholds."],
            "difficulty": "Intermediate",
            "roi": "High"
        },
        {
            "title": "Modular Quick-Change Welding Fixture",
            "desc": "Design a high-precision modular welding fixture complying with DFM/DFA guidelines to reduce setup time.",
            "steps": ["Define coordinate locating scheme (3-2-1 principle).", "Incorporate toggle clamps, wear pads, and dowels for parts locating.", "Produce CNC G-Code programs for critical fixture plates using Mastercam."],
            "difficulty": "Intermediate",
            "roi": "Medium"
        }
    ],
    "HVAC/Thermal": [
        {
            "title": "Commercial Office VRF HVAC System Design",
            "desc": "Model and size a multi-zone Variable Refrigerant Flow HVAC system for a commercial office layout using Revit MEP.",
            "steps": ["Perform hourly heat load calculations (CLTD method).", "Determine indoor and outdoor unit sizing and coordinate duct layouts.", "Establish piping routing, pipe sizing, and refrigerant charge calculations.", "Verify compliance with ASHRAE standards."],
            "difficulty": "Advanced",
            "roi": "High"
        },
        {
            "title": "High-Performance Heat Exchanger Analysis",
            "desc": "Analyze and optimize a shell-and-tube heat exchanger utilizing LMTD and effectiveness-NTU methods.",
            "steps": ["Formulate thermal design equations for fluid properties.", "Calculate overall heat transfer coefficient and pressure drop bounds.", "Validate design using solid/fluid conjugate heat transfer simulation in CAE."],
            "difficulty": "Intermediate",
            "roi": "Medium"
        }
    ]
}

COURSES_RECOMMENDATIONS = {
    "CAD Design": [
        {"name": "ASME Y14.5 Geometric Dimensioning & Tolerancing (GD&T)", "source": "ASME / Udemy", "duration": "4 weeks"},
        {"name": "Advanced Solid Modeling & Surface Design", "source": "SolidWorks Tutorial / Coursera", "duration": "6 weeks"}
    ],
    "CAE/Simulation": [
        {"name": "Practical Finite Element Analysis (FEA)", "source": "NAFEMS / NPTEL", "duration": "8 weeks"},
        {"name": "Fluid Dynamics & Mesh Generation for CFD Solvers", "source": "SimScale / Udemy", "duration": "6 weeks"}
    ],
    "Robotics/Mechatronics": [
        {"name": "Control Systems Engineering & State-Space Simulation", "source": "MATLAB Academy / edX", "duration": "8 weeks"},
        {"name": "Microcontroller Programming & RTOS Basics", "source": "Udemy / Coursera", "duration": "6 weeks"}
    ],
    "Manufacturing/Operations": [
        {"name": "Lean Production & Value Stream Mapping", "source": "MIT OpenCourseWare / Coursera", "duration": "4 weeks"},
        {"name": "Statistical Process Control & Minitab Essentials", "source": "Quality Council / Udemy", "duration": "5 weeks"}
    ],
    "HVAC/Thermal": [
        {"name": "Commercial Building Energy Modeling & Loads Sizing", "source": "ASHRAE Learning / edX", "duration": "6 weeks"},
        {"name": "Revit MEP for HVAC & Plumbing Systems Layouts", "source": "Autodesk Academy / Udemy", "duration": "6 weeks"}
    ]
}

COURSE_CATALOG = {
    "CAD Design": {
        "title": "ASME Y14.5 Geometric Dimensioning & Tolerancing (GD&T) & Mechanical Design",
        "slug": "cad-lewis-gear-bending",
        "skill_tags": ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "SolidWorks"],
        "youtube_video_id": "",
        "local_video_path": "manim_courses/renders/cad-lewis-gear-bending.mp4",
        "score_boost": 5.0,
        "description": "Learn standard dimensioning constraints, DFM rules, and tolerance stack-up analysis for mechanical systems.",
        "written_content": """
### 1. Geometric Dimensioning & Tolerancing (GD&T) - ASME Y14.5
GD&T is a system of symbols used to specify the exact allowable variation of geometric features. Instead of relying solely on linear dimensions (which create square tolerance zones), GD&T uses circular or cylindrical tolerance zones.
- **Datum Reference Frame (DRF)**: A coordinate system that restricts the 6 degrees of freedom of a part during machining and inspection. Datums are established in order of priority: Primary (constrains 3 DOF), Secondary (constrains 2 DOF), and Tertiary (constrains 1 DOF).
- **Geometric Controls**:
  - *Position*: Defines the allowable deviation of a feature's center, axis, or center plane from its 'True Position'.
  - *Profile of a Surface*: Controls the size, shape, orientation, and location of a surface relative to datums.
  - *Runout*: Controls coaxiality and circularity of rotating features (Circular vs. Total Runout).
- **Material Modifiers**:
  - *Maximum Material Condition (MMC - Ⓜ)*: The state where a feature contains the maximum amount of material within its size limit (e.g., smallest hole diameter, largest pin diameter). Selecting MMC grants additional 'bonus tolerance' as the feature departs from MMC.
  - *Least Material Condition (LMC - Ⓛ)*: The state containing the minimum amount of material.

### 2. Design for Manufacturing (DFM) Guidelines
Designing components without considering manufacturing constraints leads to high production rejection rates.
- **Plastic Injection Molding**:
  - Wall thickness must be kept uniform ($2.0 - 3.0 \\text{ mm}$) to prevent sink marks and warpage during cooling.
  - Draft angles of $1.0^{\\circ} - 2.0^{\\circ}$ must be added to all vertical faces to allow easy part ejection from the mold core/cavity.
- **Sheet Metal Design**:
  - The minimum bend radius should be greater than or equal to the sheet thickness ($R \\ge t$).
  - Bend reliefs of width $w \\ge 1.5t$ and depth $d \\ge 1.5t$ must be designed at corners to prevent tearing during stamping.
- **Machined Fits (ASME B4.1)**:
  - *Clearance Fits (RC)*: The shaft is always smaller than the hole, allowing free rotation (e.g., sleeve bearings).
  - *Transition Fits (LT)*: The tolerance zones overlap; parts may fit with clearance or interference.
  - *Interference/Press Fits (LN)*: The shaft is always larger than the hole, requiring force to assemble (e.g., gears on shafts).

### 3. Step-by-Step Tolerance Stack-Up Calculation
In a linear shaft assembly with components stacked end-to-end, we must calculate the minimum and maximum clearance to ensure fitment:
- **Worst-Case Method**: Sums the absolute limits of tolerances.
  $$ T_c = \\sum_{i=1}^{n} T_i $$
- **Statistical (Root-Sum-Square - RSS) Method**: Assumes components are manufactured within a normal distribution.
  $$ T_{RSS} = \\sqrt{\\sum_{i=1}^{n} T_i^2} $$
- **Lewis Bending Equation**: Gear teeth are modeled as cantilever beams under tangential load $W_t$. The root bending stress is given by:
  $$ \\sigma = \\frac{W_t}{F \\cdot m \\cdot Y} \\le [\\sigma]_{all} $$
  Where $F$ is face width, $m$ is module, and $Y$ is the dimensionless Lewis Form Factor.
""",
        "quiz_question": "What is the primary benefit of designing parts using the Maximum Material Condition (MMC) modifier?",
        "quiz_options": [
            "It eliminates the need for any datum reference frames",
            "It grants additional 'bonus tolerance' as the feature size departs from MMC",
            "It guarantees zero friction in rotating shaft bearings"
        ],
        "quiz_answer": "It grants additional 'bonus tolerance' as the feature size departs from MMC"
    },
    "CAE/Simulation": {
        "title": "Computational Finite Element Analysis (FEA) & Fluid Solvers",
        "slug": "cae-stiffness-matrix",
        "skill_tags": ["Finite Element Analysis (FEA)", "Structural Analysis", "ANSYS"],
        "youtube_video_id": "",
        "local_video_path": "manim_courses/renders/cae-stiffness-matrix.mp4",
        "score_boost": 5.0,
        "description": "Understand element stiffness formulations, boundary conditions, meshing metrics, and Navier-Stokes equations.",
        "written_content": """
### 1. Element Types & Formulations in FEA
FEA discretizes solid continuous structures into discrete finite elements.
- **1D Elements (Truss/Beam)**: Used for slender structural members where length is much greater than width/height. Beam elements support bending and torsional loads, while truss elements only support axial tension/compression.
- **2D Elements (Shell)**: Used for thin-walled parts (e.g., sheet metal, pressure vessels) where thickness is small compared to other dimensions. Mid-surfaces are extracted to solve elements.
- **3D Elements (Solid/Tetrahedral/Hexahedral)**: Used for bulky, complex 3D geometries. Hexahedral (brick) elements provide higher accuracy and faster convergence than tetrahedral elements for structured grids.

### 2. Stiffness Matrices & Deflection Mechanics
For a discretized system under loading, the nodal displacement vector $\\mathbf{u}$ is solved using the system stiffness matrix $\\mathbf{K}$ and force vector $\\mathbf{f}$:
$$ \\mathbf{K} \\mathbf{u} = \\mathbf{f} $$
- **Cantilever Deflection Formula**: The maximum tip deflection $\\delta_{max}$ under a point load $P$ at the free end is:
  $$ \\delta_{max} = \\frac{P L^3}{3 E I} $$
  Where $E$ is Young's Modulus, and $I$ is the Area Moment of Inertia.
- **Von Mises Yield Criterion**: In multi-axial stress states, the equivalent Von Mises stress $\\sigma_v$ is calculated to predict ductile failure:
  $$ \\sigma_v = \\sqrt{\\frac{1}{2} \\left[ (\\sigma_1 - \\sigma_2)^2 + (\\sigma_2 - \\sigma_3)^2 + (\\sigma_3 - \\sigma_1)^2 \\right]} \\le S_y $$
  Where $\\sigma_1, \\sigma_2, \\sigma_3$ are principal stresses and $S_y$ is the yield strength.

### 3. Mesh Quality & CFD Boundary Layer Modeling
In Computational Fluid Dynamics (CFD), fluid flow is solved using the discretized Navier-Stokes momentum equations:
$$ \\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f} $$
- **Mesh Quality Metrics**:
  - *Aspect Ratio*: Ratio of maximum element edge length to minimum edge length. Should be close to $1.0$.
  - *Skewness*: Deviation from equilateral shape. High skewness degrades solver accuracy.
  - *Jacobian*: Measures element distortion. Must be positive.
- **Turbulence Models & y+ Calculation**:
  - *Standard k-epsilon ($k-\\epsilon$)*: Best for high-Reynolds number flows away from boundary walls.
  - *SST k-omega ($k-\\omega \\text{ SST}$)*: Integrates near-wall $k-\\omega$ and free-stream $k-\\epsilon$, making it the industry standard for boundary layers.
  - *$y^+$ Dimensionless Wall Distance*: Measures mesh resolution near the wall:
    $$ y^+ = \\frac{u_* y}{\\nu} $$
    For wall-resolved flows, we target $y^+ \\approx 1.0$ to resolve the viscous sublayer directly.
""",
        "quiz_question": "Why is a y+ value near 1.0 targeted when setting up boundary layer meshes for aerodynamic simulations?",
        "quiz_options": [
            "It allows the solver to bypass Navier-Stokes computations completely",
            "It resolves the viscous sublayer directly without relying on wall functions",
            "It automatically increases the material's structural yield strength"
        ],
        "quiz_answer": "It resolves the viscous sublayer directly without relying on wall functions"
    },
    "Robotics/Mechatronics": {
        "title": "Closed-Loop Feedforward Control Systems & PID Tuning",
        "slug": "robotics-pid-control",
        "skill_tags": ["Control Systems", "Robotics", "MATLAB", "Simulink"],
        "youtube_video_id": "",
        "local_video_path": "manim_courses/renders/robotics-pid-control.mp4",
        "score_boost": 5.0,
        "description": "Explore the mathematics behind closed-loop PID control tuning, microcontrollers, and kinematics.",
        "written_content": """
### 1. Proportional-Integral-Derivative (PID) Control Theory
PID controllers regulate the error $e(t) = r(t) - y(t)$ between a desired setpoint $r(t)$ and measured process output $y(t)$:
$$ u(t) = K_p e(t) + K_i \\int_{0}^{t} e(\\tau) d\\tau + K_d \\frac{de(t)}{dt} $$
Where:
- $K_p$ (Proportional Gain): Corrects current error; higher gain speeds up response but causes overshoot.
- $K_i$ (Integral Gain): Corrects past accumulated errors; eliminates steady-state offset but can lead to windup.
- $K_d$ (Derivative Gain): Predicts future error; dampens oscillations and stabilizes settling time.
- **Laplace domain transfer function representation**:
  $$ G_c(s) = K_p + \\frac{K_i}{s} + K_d s = \\frac{K_d s^2 + K_p s + K_i}{s} $$

### 2. Embedded Controller Interfaces & Filtering
Microcontrollers interface with analog engineering sensors (thermistors, strain gages) through Analog-to-Digital Converters (ADCs).
- **ADC Resolution Step Voltage**: The smallest change in input voltage that can be resolved by an $N$-bit ADC with reference voltage $V_{ref}$:
  $$ \\Delta V = \\frac{V_{ref}}{2^N - 1} $$
- **Active RC Low-Pass Filter**: Used to filter out high-frequency noise from sensors:
  $$ f_c = \\frac{1}{2\\pi R C} $$
  Where $f_c$ is the cutoff frequency (-3dB point) in Hertz.

### 3. Robotic Kinematics Equations
- **Homogeneous Transformation Matrix ($T$)**: Links a robot joint coordinate frame to the next frame:
  $$ T = \\begin{bmatrix} R_{3\\times3} & \\mathbf{d}_{3\\times1} \\\\ 0_{1\\times3} & 1 \\end{bmatrix} $$
  Where $R$ is rotation and $\\mathbf{d}$ is translation.
- **Denavit-Hartenberg (D-H) Parameters**: Standard convention utilizing four parameters (link length $a$, link twist $\\alpha$, link offset $d$, joint angle $\\theta$) to define joints coordinates relative to adjacent joints.
""",
        "quiz_question": "For a 10-bit Analog-to-Digital Converter (ADC) operating with a 5.0V reference, what is the smallest step voltage resolution?",
        "quiz_options": [
            "Approximately 4.88 mV",
            "Exactly 5.00 mV",
            "Approximately 9.77 mV"
        ],
        "quiz_answer": "Approximately 4.88 mV"
    },
    "Manufacturing/Operations": {
        "title": "Statistical Quality Control & Six Sigma Process Capability",
        "slug": "manufacturing-cpk-capability",
        "skill_tags": ["Six Sigma", "Quality Control & Assurance", "Lean Manufacturing"],
        "youtube_video_id": "",
        "local_video_path": "manim_courses/renders/manufacturing-cpk-capability.mp4",
        "score_boost": 5.0,
        "description": "Learn to calculate quality capability indices and analyze production deviation from specification limits.",
        "written_content": """
### 1. Process Capability Indices ($C_p$ and $C_{pk}$)
In manufacturing, components must stay within Upper ($USL$) and Lower ($LSL$) Specification Limits.
- **$C_p$ (Potential Capability)**: Represents potential performance assuming a centered mean:
  $$ C_p = \\frac{USL - LSL}{6\\sigma} $$
  Where $\\sigma$ is the standard deviation.
- **$C_{pk}$ (Actual Capability)**: Accounts for shifts in the process mean $\\mu$:
  $$ C_{pk} = \\min \\left( \\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma} \\right) $$
- **Capability Thresholds**:
  - $C_{pk} < 1.0$: Process is incapable (defective parts are produced).
  - $C_{pk} = 1.0$: Process is barely capable (3-sigma overlap).
  - $C_{pk} \\ge 1.33$: Industry standard capability threshold.
  - $C_{pk} \\ge 2.0$: Six Sigma level (less than 3.4 defects per million opportunities).

### 2. Step-by-Step Cp/Cpk Calculation Example
**Scenario**: A shafts production line targets a diameter of $10.0 \\text{ mm}$ with specification limits between $9.5 \\text{ mm}$ ($LSL$) and $10.5 \\text{ mm}$ ($USL$).
Measurements show the sample mean $\\mu = 10.1 \\text{ mm}$ and standard deviation $\\sigma = 0.1 \\text{ mm}$.
1. **Calculate $C_p$**:
   $$ C_p = \\frac{10.5 - 9.5}{6(0.1)} = \\frac{1.0}{0.6} \\approx 1.67 $$
2. **Calculate $C_{pk}$**:
   - Upper side: $\\frac{10.5 - 10.1}{3(0.1)} = \\frac{0.4}{0.3} \\approx 1.33$
   - Lower side: $\\frac{10.1 - 9.5}{3(0.1)} = \\frac{0.6}{0.3} = 2.0$
   - $C_{pk} = \\min(1.33, 2.0) = 1.33$
   *Conclusion*: The line is statistically capable ($C_{pk} \\ge 1.33$), but off-center.

### 3. Machining Calculations (CNC Parameters)
- **Cutting Speed ($V_c$)**: Linear surface speed of workpiece/cutter in m/min:
  $$ V_c = \\frac{\\pi \\cdot D \\cdot N}{1000} $$
  Where $D$ is diameter (mm) and $N$ is spindle speed (RPM).
- **Feed Rate ($V_f$)**: Cutting tool feed speed in mm/min:
  $$ V_f = f_z \\cdot z \\cdot N $$
  Where $f_z$ is feed per tooth (mm/tooth) and $z$ is number of teeth.
- **Material Removal Rate ($MRR$)**: In mm$^3$/min:
  $$ MRR = a_p \\cdot a_e \\cdot V_f $$
  Where $a_p$ is axial depth of cut (mm) and $a_e$ is radial width of cut (mm).
""",
        "quiz_question": "If a process has a mean of 10.0, standard deviation of 0.1, and specification limits of 9.5 to 10.5, what is the process capability Cp?",
        "quiz_options": [
            "Cp = 0.83",
            "Cp = 1.67",
            "Cp = 1.33"
        ],
        "quiz_answer": "Cp = 1.67"
    },
    "HVAC/Thermal": {
        "title": "Thermodynamics & Psychrometric HVAC Heat Load Calculation",
        "slug": "hvac-sensible-latent-loads",
        "skill_tags": ["HVAC Design", "Thermodynamics", "Heat Transfer"],
        "youtube_video_id": "",
        "local_video_path": "manim_courses/renders/hvac-sensible-latent-loads.mp4",
        "score_boost": 5.0,
        "description": "Study energy transfer boundaries, refrigeration cycles, and sensible vs. latent load sizing.",
        "written_content": """
### 1. Sensible Heat Transfer Rate
In HVAC systems, cooling load calculations depend on sensible heat (temperature change) and latent heat (humidity/phase change):
$$ q_s = \\dot{m} \\cdot C_p \\cdot \\Delta T $$
Where:
- $q_s$ is the sensible heat rate (kW)
- $\\dot{m}$ is the air mass flow rate ($kg/s$)
- $C_p$ is the specific heat capacity of dry air ($C_p \\approx 1.005 \\text{ kJ/kg}\\cdot\\text{K}$)
- $\\Delta T$ is the air temperature difference across the cooling coil ($K$).

### 2. Latent Heat Transfer Rate
Latent heat exchange accounts for water vapor density change (dehumidification):
$$ q_l = \\dot{m} \\cdot h_{fg} \\cdot \\Delta w $$
Where $h_{fg}$ is the latent heat of vaporization of water (approx. $2501 \\text{ kJ/kg}$) and $\\Delta w$ is the humidity ratio difference ($kg \\text{ water} / kg \\text{ dry air}$).

### 3. Piping & Duct Friction Head Loss (Fluid Flow)
Determining pump and fan static pressures depends on head loss:
- **Darcy-Weisbach Equation**: Head loss $h_f$ in meters of fluid:
  $$ h_f = f \\cdot \\frac{L}{D} \\cdot \\frac{v^2}{2g} $$
  Where $f$ is Darcy friction factor, $L$ is length (m), $D$ is pipe internal diameter (m), $v$ is velocity (m/s), and $g$ is acceleration of gravity.
- **Equivalent Duct Diameter ($D_e$)**: For rectangular ducts of width $a$ and height $b$ (Huebscher formula):
  $$ D_e = 1.30 \\cdot \\frac{(a \\cdot b)^{0.625}}{(a + b)^{0.25}} $$
""",
        "quiz_question": "Which cooling load component accounts for the heat required to condense moisture out of the air?",
        "quiz_options": [
            "Sensible cooling load",
            "Latent cooling load",
            "Radiation heat gain"
        ],
        "quiz_answer": "Latent cooling load"
    }
}

# ---------------- HELPER FUNCTIONS ----------------

def get_course_video_source(course_data):
    youtube_video_id = course_data.get("youtube_video_id", "").strip()
    if youtube_video_id:
        return f"https://www.youtube.com/watch?v={youtube_video_id}", "youtube"

    local_video_path = course_data.get("local_video_path", "").strip()
    if local_video_path and os.path.exists(local_video_path):
        return local_video_path, "local"

    return None, None

# Cache the dataset load
@st.cache_data
def load_or_generate_dataset():
    # Attempt to load candidates_100k.json if it exists
    try:
        if os.path.exists("candidates_100k.json"):
            with open("candidates_100k.json", "r") as f:
                data = json.load(f)
                df = pd.DataFrame(data)
                return df
    except Exception as e:
         pass
         
    # Fallback/dynamic generation in python
    print("Generating seeded 100k dataset in Python...")
    random_state = np.random.RandomState(42)
    records = []
    
    colleges_db = {
        "India": {
            "Tier 1": ["IIT Bombay", "IIT Madras", "IIT Delhi", "IIT Kharagpur", "NIT Trichy", "BITS Pilani"],
            "Tier 2": ["VIT Vellore", "Manipal MIT", "Anna University", "DTU Delhi", "RVCE Bangalore", "PSG Tech"],
            "Tier 3": ["Mumbai University", "Pune University", "VTU Belgaum", "GTU Ahmedabad", "Local Engineering College"]
        },
        "Global": {
            "Tier 1": ["MIT", "Stanford University", "UC Berkeley", "Imperial College London", "ETH Zurich", "TU Munich"],
            "Tier 2": ["Penn State", "Purdue University", "University of Michigan", "TU Delft", "University of Toronto"],
            "Tier 3": ["State University", "Regional Tech College", "City College of Technology", "International Poly"]
        }
    }
    
    for i in range(100000):
        region = "India" if random_state.rand() < 0.60 else "Global"
        tier_roll = random_state.rand()
        tier = "Tier 1" if tier_roll < 0.15 else ("Tier 2" if tier_roll < 0.60 else "Tier 3")
        college = random_state.choice(colleges_db[region][tier])
        
        deg_roll = random_state.rand()
        degree = "B.Tech/B.S." if deg_roll < 0.80 else ("M.Tech/M.S." if deg_roll < 0.98 else "Ph.D.")
        grad_year = random_state.randint(2022, 2027)
        
        cluster = random_state.choice(CLUSTERS)
        
        skills = [s for s in CLUSTER_KEYWORDS[cluster] if s in SKILLS_DICT.values() and random_state.rand() < 0.75]
        software_tools = [s for s in CLUSTER_KEYWORDS[cluster] if s in SOFTWARE_DICT.values() and random_state.rand() < 0.70]
        certifications = [s for s in CLUSTER_KEYWORDS[cluster] if s in CERTS_DICT.values() and random_state.rand() < 0.25]
        
        projects = random_state.randint(1, 4)
        if tier == "Tier 1": projects += random_state.randint(0, 3)
        elif tier == "Tier 2": projects += random_state.randint(0, 2)
        
        internships = 0
        intern_roll = random_state.rand()
        if tier == "Tier 1": internships = 0 if intern_roll < 0.2 else (1 if intern_roll < 0.7 else 2)
        elif tier == "Tier 2": internships = 0 if intern_roll < 0.4 else (1 if intern_roll < 0.9 else 2)
        else: internships = 0 if intern_roll < 0.7 else 1
        
        papers = 0
        if degree == "Ph.D.": papers = random_state.randint(2, 6)
        elif degree == "M.Tech/M.S.": papers = 1 if random_state.rand() < 0.4 else 0
        
        competitions = 1 if (tier in ["Tier 1", "Tier 2"] and random_state.rand() < 0.25) else 0
        
        # Scoring logic
        acad = 100 if tier == "Tier 1" else (70 if tier == "Tier 2" else 40)
        deg_val = 70 if degree == "B.Tech/B.S." else (85 if degree == "M.Tech/M.S." else 100)
        acad_weighted = (acad * 0.6 + deg_val * 0.4) * 0.25
        
        skills_score = min(len(skills) * 12, 100)
        tools_score = min(len(software_tools) * 15, 100)
        skills_weighted = (skills_score * 0.5 + tools_score * 0.5) * 0.35
        
        intern_score = min(internships * 50, 100)
        proj_score = min(projects * 33, 100)
        comp_score = min(competitions * 50, 100)
        exp_weighted = (intern_score * 0.4 + proj_score * 0.4 + comp_score * 0.2) * 0.30
        
        paper_score = min(papers * 50, 100)
        cert_score = min(len(certifications) * 50, 100)
        extra_weighted = (paper_score * 0.5 + cert_score * 0.5) * 0.10
        
        score = round((acad_weighted + skills_weighted + exp_weighted + extra_weighted) * 10) / 10
        
        records.append({
            "id": f"ME-{i+10000}",
            "region": region,
            "college": college,
            "tier": tier,
            "degree": degree,
            "gradYear": grad_year,
            "cluster": cluster,
            "skills": skills,
            "software_tools": software_tools,
            "certifications": certifications,
            "projects": projects,
            "internships": internships,
            "research_papers": papers,
            "competitions": competitions,
            "score": score
        })
        
    return pd.DataFrame(records)

# Extract resume text parameters
def extract_attributes(text):
    text_lower = text.lower()
    skills = set()
    software = set()
    certs = set()
    
    # 1. Parse Skills
    for key, val in SKILLS_DICT.items():
        if key in text_lower:
            skills.add(val)
            
    # 2. Parse Software
    for key, val in SOFTWARE_DICT.items():
        escaped = re.escape(key)
        if re.search(r'\b' + escaped + r'\b', text_lower):
            software.add(val)
            
    # 3. Parse Certifications
    for key, val in CERTS_DICT.items():
        if key in text_lower:
            certs.add(val)
            
    # Counts
    proj_matches = len(re.findall(r'project|capstone|design challenge', text_lower))
    projects = min(max(proj_matches // 2, 1), 6)
    
    intern_matches = len(re.findall(r'internship|intern\b|trainee', text_lower))
    internships = min(max(intern_matches // 2, 0), 3)
    
    papers = 0
    if any(x in text_lower for x in ["publication", "published", "journal", "conference paper"]):
        pub_matches = len(re.findall(r'journal|conference|ieee|asme', text_lower))
        papers = min(pub_matches // 2 + 1, 4)
        
    competitions = 0
    if any(x in text_lower for x in ["formula sae", "fsae", "baja", "robocon", "go-kart", "competition"]):
        competitions = 1
        
    # Heuristics for region and tier
    region = "India"
    if any(x in text_lower for x in ["mit", "stanford", "berkeley", "university of"]):
        if not any(x in text_lower for x in ["iit", "nit", "pune", "mumbai", "india"]):
            region = "Global"
            
    tier = "Tier 3"
    if any(x in text_lower for x in ["iit ", "indian institute of technology", "bits pilani", "mit ", "stanford"]):
        tier = "Tier 1"
    elif any(x in text_lower for x in ["nit ", "vit ", "vellore", "delhi technological", "dtu", "purdue"]):
        tier = "Tier 2"
        
    degree = "B.Tech/B.S."
    if any(x in text_lower for x in ["m.tech", "master of technology", "master of science", "m.s."]):
        degree = "M.Tech/M.S."
    elif any(x in text_lower for x in ["ph.d", "doctor of philosophy"]):
        degree = "Ph.D."
        
    return {
        "region": region,
        "tier": tier,
        "degree": degree,
        "skills": list(skills),
        "software_tools": list(software),
        "certifications": list(certs),
        "projects": projects,
        "internships": internships,
        "research_papers": papers,
        "competitions": competitions
    }

if "completed_courses" not in st.session_state:
    st.session_state.completed_courses = []

st.title("⚛ MECH-ENG PATHFINDER")
st.caption("Anonymized Market-Position & Career Intelligence Dashboard for Mechanical Engineering Freshers")

df_candidates = load_or_generate_dataset()

# Sidebar: Resume Ingestion
st.sidebar.header("📝 Step 1: Ingest Resume")
upload_mode = st.sidebar.radio("Ingestion Method", ["Upload PDF Resume", "Copy-Paste Resume Text", "Manual Entry Only"])

parsed_data = {}

if upload_mode == "Upload PDF Resume":
    pdf_file = st.sidebar.file_uploader("Upload local PDF file", type=["pdf"])
    if pdf_file is not None:
        try:
            reader = PdfReader(pdf_file)
            extracted_text = ""
            for page in reader.pages:
                extracted_text += page.extract_text() + "\n"
                
            if extracted_text.strip():
                st.sidebar.success("PDF loaded and parsed!")
                parsed_data = extract_attributes(extracted_text)
            else:
                st.sidebar.error("Could not extract text. PDF might be scanned/image-only.")
        except Exception as e:
            st.sidebar.error(f"Error reading PDF: {e}")
            
elif upload_mode == "Copy-Paste Resume Text":
    text_input = st.sidebar.text_area("Paste raw resume text here", height=250)
    if st.sidebar.button("Auto-Parse Resume Text") and text_input.strip():
        parsed_data = extract_attributes(text_input)
        st.sidebar.success("Attributes parsed and loaded!")

# Step 2: Form Builders
st.sidebar.header("🛠 Step 2: Refine Profile")

default_region = parsed_data.get("region", "India")
default_tier = parsed_data.get("tier", "Tier 2")
default_degree = parsed_data.get("degree", "B.Tech/B.S.")
default_projects = parsed_data.get("projects", 2)
default_interns = parsed_data.get("internships", 0)
default_papers = parsed_data.get("research_papers", 0)
default_comps = parsed_data.get("competitions", 0)
default_skills = parsed_data.get("skills", ["Product Design"])
default_tools = parsed_data.get("software_tools", ["SolidWorks", "AutoCAD"])
default_certs = parsed_data.get("certifications", [])

# Let user load presets quickly
preset = st.sidebar.selectbox("Load Test Profile Preset", ["None", "Entry Design (India)", "CAE Specialist (M.Tech)", "Global Mechatronics (Tier 1)"])
if preset == "Entry Design (India)":
    default_region, default_tier, default_degree = "India", "Tier 3", "B.Tech/B.S."
    default_projects, default_interns, default_papers, default_comps = 2, 0, 0, 0
    default_skills = ["Product Design", "GD&T (Geometric Dimensioning & Tolerancing)", "Sheet Metal Design"]
    default_tools = ["SolidWorks", "AutoCAD"]
    default_certs = ["Certified SolidWorks Associate (CSWA)"]
elif preset == "CAE Specialist (M.Tech)":
    default_region, default_tier, default_degree = "India", "Tier 2", "M.Tech/M.S."
    default_projects, default_interns, default_papers, default_comps = 4, 1, 1, 1
    default_skills = ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis"]
    default_tools = ["ANSYS", "MATLAB", "Fluent"]
    default_certs = ["ANSYS Certified Professional"]
elif preset == "Global Mechatronics (Tier 1)":
    default_region, default_tier, default_degree = "Global", "Tier 1", "B.Tech/B.S."
    default_projects, default_interns, default_papers, default_comps = 5, 2, 0, 1
    default_skills = ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems"]
    default_tools = ["MATLAB", "Simulink", "Python", "C++", "Arduino"]
    default_certs = ["ASME Member / Cert"]

with st.sidebar.form("profile_form"):
    region = st.selectbox("Benchmark Region", ["India", "Global"], index=0 if default_region == "India" else 1)
    tier = st.selectbox("College Tier", ["Tier 1", "Tier 2", "Tier 3"], index=["Tier 1", "Tier 2", "Tier 3"].index(default_tier))
    degree = st.selectbox("Degree Type", ["B.Tech/B.S.", "M.Tech/M.S.", "Ph.D."], index=["B.Tech/B.S.", "M.Tech/M.S.", "Ph.D."].index(default_degree))
    
    projects = st.number_input("Projects Count", min_value=0, max_value=10, value=default_projects)
    internships = st.number_input("Internships Completed", min_value=0, max_value=5, value=default_interns)
    papers = st.number_input("Publications", min_value=0, max_value=10, value=default_papers)
    competitions = st.number_input("Competition Participation", min_value=0, max_value=5, value=default_comps)
    
    skills = st.multiselect("Professional Skills", list(SKILLS_DICT.values()), default=default_skills)
    software_tools = st.multiselect("Software Packages", list(SOFTWARE_DICT.values()), default=default_tools)
    certifications = st.multiselect("Certifications", list(CERTS_DICT.values()), default=default_certs)
    
    submit_btn = st.form_submit_button("Compute Rankings & Ranks")

# ---------------- CORE ANALYTICAL COMPUTATION ----------------
if submit_btn or parsed_data or preset != "None":
    
    # Calculate target score
    acad_score = 100 if tier == "Tier 1" else (70 if tier == "Tier 2" else 40)
    deg_score = 70 if degree == "B.Tech/B.S." else (85 if degree == "M.Tech/M.S." else 100)
    acad_weighted = (acad_score * 0.6 + deg_score * 0.4) * 0.25
    
    skills_s = min(len(skills) * 12, 100)
    tools_s = min(len(software_tools) * 15, 100)
    skills_weighted = (skills_s * 0.5 + tools_s * 0.5) * 0.35
    
    intern_s = min(internships * 50, 100)
    proj_s = min(projects * 33, 100)
    comp_s = min(competitions * 50, 100)
    exp_weighted = (intern_s * 0.4 + proj_s * 0.4 + comp_s * 0.2) * 0.30
    
    paper_s = min(papers * 50, 100)
    cert_s = min(len(certifications) * 50, 100)
    extra_weighted = (paper_s * 0.5 + cert_s * 0.5) * 0.10
    
    target_score = round((acad_weighted + skills_weighted + exp_weighted + extra_weighted) * 10) / 10
    
    # Specialty cluster alignment
    target_attrs = skills + software_tools + certifications
    best_cluster = "CAD Design"
    max_intersection = 0
    
    for c in CLUSTERS:
        intersect = len(set(target_attrs).intersection(CLUSTER_KEYWORDS[c]))
        if intersect > max_intersection:
            max_intersection = intersect
            best_cluster = c
            
    match_pct = min(round((max_intersection / max(len(target_attrs), 3)) * 100), 100)
    
    # Gamification: check if the user completed the mini-course quiz for this cluster.
    course_data_for_score = COURSE_CATALOG.get(best_cluster, {})
    if best_cluster in st.session_state.completed_courses:
        target_score = min(target_score + course_data_for_score.get("score_boost", 5.0), 100.0)
    
    # Calculate Ranks
    def get_rank_and_total(scores):
        scores_desc = sorted(scores, reverse=True)
        count_higher = sum(1 for s in scores_desc if s > target_score)
        rank = count_higher + 1
        return rank, len(scores_desc)
        
    global_rank, global_total = get_rank_and_total(df_candidates["score"].tolist())
    india_rank, india_total = get_rank_and_total(df_candidates[df_candidates["region"] == "India"]["score"].tolist())
    tier_rank, tier_total = get_rank_and_total(df_candidates[(df_candidates["region"] == region) & (df_candidates["tier"] == tier)]["score"].tolist())
    cluster_rank, cluster_total = get_rank_and_total(df_candidates[df_candidates["cluster"] == best_cluster]["score"].tolist())
    
    # Specialty cluster gaps calculation (precompute)
    peer_candidates = df_candidates[df_candidates["cluster"] == best_cluster]
    gap_data = []
    
    for kw in CLUSTER_KEYWORDS[best_cluster]:
        # Count peer frequency
        has_count = 0
        for idx, r in peer_candidates.iterrows():
            if kw in r["skills"] or kw in r["software_tools"] or kw in r["certifications"]:
                has_count += 1
        freq = round((has_count / len(peer_candidates)) * 100)
        target_has = kw in target_attrs
        gap_data.append({"Requirement": kw, "Peer Frequency %": freq, "You Have It": "Yes" if target_has else "No/Gap"})
        
    df_gap = pd.DataFrame(gap_data).sort_values(by="Peer Frequency %", ascending=False)

    # ---------------- VIEW LAYOUT: MAIN PANEL ----------------
    
    # Header summary block
    st.success(f"⚛ Compiled Profile: {degree} | College Tier: {tier} | Matched Specialization: {best_cluster} (Score: {target_score}/100)")
    
    # Initialize tabs
    tab_dashboard, tab_demand, tab_courses, tab_database = st.tabs([
        "📊 Analytics Dashboard", 
        "💼 Employer Insights",
        "📖 Written Courses", 
        "📁 Anonymized Candidate DB"
    ])
    
    with tab_dashboard:
        # Columns for Ranks
        r_col1, r_col2, r_col3, r_col4 = st.columns(4)
        with r_col1:
            st.metric(label="Worldwide Rank", value=f"#{global_rank:,}", delta=f"of {global_total:,} freshers", delta_color="off")
        with r_col2:
            st.metric(label="National Rank (India)", value=f"#{india_rank:,}", delta=f"of {india_total:,} freshers", delta_color="off")
        with r_col3:
            st.metric(label="Institution Tier Rank", value=f"#{tier_rank:,}", delta=f"of {tier_total:,} peers", delta_color="off")
        with r_col4:
            st.metric(label="Specialty Specialty Rank", value=f"#{cluster_rank:,}", delta=f"of {cluster_total:,} in {best_cluster}", delta_color="off")
            
        # Details layout
        col_left, col_right = st.columns(2)
        
        with col_left:
            st.subheader("✓ Profile Strengths Diagnostic")
            strengths = []
            if tier == "Tier 1":
                strengths.append("Elite academic background (Tier 1) unlocks premium recruiters and high baseline ranking.")
            if internships >= 2:
                strengths.append(f"Excellent practical exposure with {internships} internships, positioning you in the top 15% for hands-on experience.")
            if projects >= 4:
                strengths.append(f"Solid project repository ({projects} builds), proving execution of CAD, manufacturing, or design validations.")
            if len(certifications) >= 2:
                strengths.append("Professional software certifications indicate verified competency to engineering managers.")
                
            if not strengths:
                strengths.append("Basic engineering credentials established. Focus on building projects and certificates to differentiate.")
                
            for s in strengths:
                st.markdown(f"✅ {s}")
                
            if papers >= 1:
                st.markdown(f"✅ Research contribution ({papers} publications) signals deep analytical skill suitable for R&D roles.")
                
            st.subheader("✗ Profile Gaps & Disadvantages")
            weaknesses = []
            if tier == "Tier 3":
                weaknesses.append("Tier 3 college background lacks active placement drives. Offline applications require stronger project portfolios.")
            if internships == 0:
                weaknesses.append("Zero internships listed. Highly recommended to pursue industrial training to prove industry-readiness.")
            if projects <= 1:
                weaknesses.append("Minimal design projects portfolio. Freshers depend heavily on design portfolios to stand out.")
            if len(certifications) == 0:
                weaknesses.append("Missing software certifications (e.g. CSWA/CSWP or Six Sigma), which are cheap and high impact.")
                
            if not weaknesses:
                weaknesses.append("No critical profile disadvantages detected! Highly competitive fresher standing.")
                
            for w in weaknesses:
                st.markdown(f"⚠️ {w}")
                
        with col_right:
            st.subheader("📊 Skill Frequency Gap Chart")
            st.caption(f"Peer frequency in matching cluster ({best_cluster}) compared to your profile")
            st.dataframe(df_gap, use_container_width=True, hide_index=True)
            
        # High ROI Roadmap
        st.subheader("🚀 High-ROI Fresher Improvement Roadmap")
        missing_items = df_gap[df_gap["You Have It"] == "No/Gap"].head(3)
        
        if not missing_items.empty:
            cols_road = st.columns(len(missing_items))
            for idx, (index, row) in enumerate(missing_items.iterrows()):
                with cols_road[idx]:
                    st.info(f"**Action Item {idx+1}: Acquire '{row['Requirement']}'**")
                    st.write(f"Demand among matched specialty peers: **{row['Peer Frequency %']}%**")
                    st.write("Target this skill/tool next to close the gap. Build a dedicated portfolio project centered on it or prepare for its entry certification.")
        else:
            st.success("Perfect alignment! No critical technical gaps found relative to matched specialty peers.")
            
        st.divider()
        
        # 1. Rank Booster Simulator (Interactive Checkbox Widget)
        st.subheader("⚡ Employability Booster Simulator")
        st.write("Toggle the action items below to simulate how they would boost your score and standing:")
        
        # Determine missing skills/certs/etc. for simulation
        missing_skills = [s for s in CLUSTER_KEYWORDS[best_cluster] if s in SKILLS_DICT.values() and s not in skills]
        missing_software = [s for s in CLUSTER_KEYWORDS[best_cluster] if s in SOFTWARE_DICT.values() and s not in software_tools]
        missing_certs = [s for s in CLUSTER_KEYWORDS[best_cluster] if s in CERTS_DICT.values() and s not in certifications]
        
        # Display checkboxes
        col_c1, col_c2 = st.columns(2)
        
        sim_projects = projects
        sim_internships = internships
        sim_competitions = competitions
        sim_papers = papers
        sim_skills = list(skills)
        sim_software = list(software_tools)
        sim_certs = list(certifications)
        
        with col_c1:
            st.markdown("**Core Experience & Projects**")
            if st.checkbox("Complete 1 Industry Internship", value=False, key="sim_intern"):
                sim_internships = min(internships + 1, 5)
            if st.checkbox("Build 1 Advanced Capstone Project", value=False, key="sim_proj"):
                sim_projects = min(projects + 1, 10)
            if st.checkbox("Participate in an Engineering Competition (e.g., FSAE/Baja)", value=False, key="sim_comp"):
                sim_competitions = min(competitions + 1, 5)
            if st.checkbox("Publish 1 Research Paper", value=False, key="sim_paper"):
                sim_papers = min(papers + 1, 10)
                
        with col_c2:
            st.markdown("**Skills & Certifications**")
            top_missing_skill = missing_skills[0] if missing_skills else None
            top_missing_sw = missing_software[0] if missing_software else None
            top_missing_cert = missing_certs[0] if missing_certs else None
            
            check_skill = False
            check_sw = False
            check_cert = False
            
            if top_missing_skill:
                check_skill = st.checkbox(f"Master Top Skill: '{top_missing_skill}'", value=False, key="sim_skill")
                if check_skill:
                    sim_skills.append(top_missing_skill)
            else:
                st.write("✅ All core skills acquired!")
                
            if top_missing_sw:
                check_sw = st.checkbox(f"Learn Core Software: '{top_missing_sw}'", value=False, key="sim_sw")
                if check_sw:
                    sim_software.append(top_missing_sw)
            else:
                st.write("✅ All core software tools acquired!")
                
            if top_missing_cert:
                check_cert = st.checkbox(f"Obtain Credential: '{top_missing_cert}'", value=False, key="sim_cert")
                if check_cert:
                    sim_certs.append(top_missing_cert)
            else:
                st.write("✅ All cluster certifications acquired!")
                
        # Recalculate simulated score
        sim_acad_score = 100 if tier == "Tier 1" else (70 if tier == "Tier 2" else 40)
        sim_deg_score = 70 if degree == "B.Tech/B.S." else (85 if degree == "M.Tech/M.S." else 100)
        sim_acad_weighted = (sim_acad_score * 0.6 + sim_deg_score * 0.4) * 0.25
        
        sim_skills_val = min(len(sim_skills) * 12, 100)
        sim_tools_val = min(len(sim_software) * 15, 100)
        sim_skills_weighted = (sim_skills_val * 0.5 + sim_tools_val * 0.5) * 0.35
        
        sim_intern_val = min(sim_internships * 50, 100)
        sim_proj_val = min(sim_projects * 33, 100)
        sim_comp_val = min(sim_competitions * 50, 100)
        sim_exp_weighted = (sim_intern_val * 0.4 + sim_proj_val * 0.4 + sim_comp_val * 0.2) * 0.30
        
        sim_paper_val = min(sim_papers * 50, 100)
        sim_cert_val = min(len(sim_certs) * 50, 100)
        sim_extra_weighted = (sim_paper_val * 0.5 + sim_cert_val * 0.5) * 0.10
        
        sim_score = round((sim_acad_weighted + sim_skills_weighted + sim_exp_weighted + sim_extra_weighted) * 10) / 10
        
        score_diff = round(sim_score - target_score, 1)
        
        # Calculate simulated ranks
        sim_global_rank = sum(1 for s in df_candidates["score"].tolist() if s > sim_score) + 1
        sim_india_rank = sum(1 for s in df_candidates[df_candidates["region"] == "India"]["score"].tolist() if s > sim_score) + 1
        
        global_rank_diff = global_rank - sim_global_rank
        india_rank_diff = india_rank - sim_india_rank
        
        # Display simulated metrics
        m_col1, m_col2, m_col3 = st.columns(3)
        with m_col1:
            st.metric(
                label="Simulated Employability Score", 
                value=f"{sim_score}/100", 
                delta=f"+{score_diff}" if score_diff > 0 else None
            )
        with m_col2:
            st.metric(
                label="Simulated Worldwide Rank", 
                value=f"#{sim_global_rank:,}", 
                delta=f"-{global_rank_diff:,} spots" if global_rank_diff > 0 else None,
                delta_color="normal"
            )
        with m_col3:
            st.metric(
                label="Simulated National Rank (India)", 
                value=f"#{sim_india_rank:,}", 
                delta=f"-{india_rank_diff:,} spots" if india_rank_diff > 0 else None,
                delta_color="normal"
            )
            
        st.divider()
        
        # 2. Targeted Capstone Project Blueprints
        st.subheader(f"📂 Specialized Capstone Project Blueprints ({best_cluster})")
        st.write("Build one of these projects from scratch to address your portfolio gaps and showcase deep specialty competency:")
        
        cluster_projects = PROJECTS_RECOMMENDATIONS.get(best_cluster, [])
        for p_idx, proj in enumerate(cluster_projects):
            with st.expander(f"Project Draft {p_idx+1}: {proj['title']} (ROI: {proj['roi']} | Difficulty: {proj['difficulty']})"):
                st.write(f"**Objective:** {proj['desc']}")
                st.markdown("**Step-by-Step Implementation Guide:**")
                for s_step, step_text in enumerate(proj["steps"]):
                    st.markdown(f"{s_step+1}. {step_text}")
                    
        st.divider()
        
        # 3. Offline Networking Strategy (Highly tailored for Tier 3 / zero internship profiles)
        st.subheader("🤝 Strategic Job Hunting & Placement Guidance")
        if tier == "Tier 3":
            st.warning("⚠️ **Tier 3 College Strategy:** Standard campus hiring channels are thin. To gain traction: \n"
                       "1. **Upload designs to GrabCAD / GitHub**: Create visual case studies with design reports. Recruiters value proof of skills over college brand.\n"
                       "2. **Target SME Manufacturing Units**: Cold call local HVAC contractors or sheet metal fabricators. Offering structured 3-month co-ops is the easiest way to break in.\n"
                       "3. **LinkedIn Outreach**: Reach out to design leads (not HR) and share a specific model/analysis you ran on their product. Ask for structural feedback rather than a job.")
        elif internships == 0:
            st.info("💡 **No-Internship Strategy:** \n"
                    "1. Focus heavily on virtual internships or corporate micro-credentials (e.g. Forage design modules).\n"
                    "2. Partner with a professor on an industrial consultancy project. This counts as project/experience on a resume.")
        else:
            st.success("✨ **Advanced Strategy:** Leverage your existing internships. Turn them into case studies on your resume, clearly highlighting metrics (e.g., 'reduced weight by 12%', 'saved 15 hours of machining time').")

    with tab_demand:
        st.subheader("💼 Employer Demands & Hiring Benchmarks")
        cluster_icons = {
            "CAD Design": "📐",
            "CAE/Simulation": "💻",
            "Robotics/Mechatronics": "🤖",
            "Manufacturing/Operations": "⚙️",
            "HVAC/Thermal": "🔥"
        }
        cluster_icon = cluster_icons.get(best_cluster, "🔧")
        st.markdown(f"### {cluster_icon} Specialization: **{best_cluster}**")
        
        demands = EMPLOYER_DEMANDS.get(best_cluster, EMPLOYER_DEMANDS["CAD Design"])
        st.markdown(f"**Target Professional Role:** `{demands['role']}`")
        st.write("Employers look for these key competencies and credentials when evaluating freshers:")
        
        col_d1, col_d2 = st.columns(2)
        with col_d1:
            st.markdown("#### 🎯 In-Demand Core Skills")
            for s in demands["skills"]:
                p_color = "red" if s["priority"] == "Critical" else ("orange" if s["priority"] == "High" else "blue")
                st.markdown(f"- **{s['name']}** :{p_color}[({s['priority']})]")
                st.write(f"  *{s['desc']}*")
            
            st.markdown("#### 📜 Valued Certifications")
            for c in demands["certs"]:
                p_color = "red" if c["priority"] == "Critical" else ("orange" if c["priority"] == "High" else "blue")
                st.markdown(f"- **{c['name']}** :{p_color}[({c['priority']})]")
                st.write(f"  *{c['desc']}*")
                
        with col_d2:
            st.markdown("#### 💻 Essential Software Packages")
            for sw in demands["software"]:
                p_color = "red" if sw["priority"] == "Critical" else ("orange" if sw["priority"] == "High" else "blue")
                st.markdown(f"- **{sw['name']}** :{p_color}[({sw['priority']})]")
                st.write(f"  *{sw['desc']}*")
                
            st.markdown("#### 📂 Portfolio & Project Expectations")
            for p in demands["portfolio"]:
                st.markdown(f"- **{p['title']}**")
                st.write(f"  *{p['desc']}*")
                
        st.info("💡 **Ready to learn these?** Switch to the **Written Courses** tab to complete the mini-course lectures and test your knowledge!")

    with tab_courses:
        st.subheader("📖 Written Skill Courses & Interactive Quizzes")
        st.caption("Read high-quality written lessons for key mechanical engineering specialties and pass quizzes to boost your Employability Score by +5!")
        
        # Dropdown to select course to browse
        selected_cluster = st.selectbox(
            "Select Specialization Course to Browse:",
            CLUSTERS,
            index=CLUSTERS.index(best_cluster)
        )
        
        course_data = COURSE_CATALOG.get(selected_cluster)
        if course_data:
            boost_value = course_data.get("score_boost", 5.0)
            is_completed = selected_cluster in st.session_state.completed_courses
            
            # Completion Badge
            if is_completed:
                st.success(f"✨ **Status: Completed (+{boost_value:g} Boost Active)**")
            else:
                st.info("⏳ **Status: Incomplete** (Complete the lecture below and answer the quiz to earn points)")
            
            col_l1, col_l2 = st.columns([3, 2])
            
            with col_l1:
                st.markdown(f"## Lesson: {course_data['title']}")
                st.caption(course_data["description"])
                st.markdown("**Skill tags:** " + ", ".join(course_data.get("skill_tags", [])))
                
                # Render written content directly in a beautiful card-like format
                st.markdown("### 📝 Lecture Notes & Formula Sheet")
                st.markdown(course_data["written_content"])
                
                st.divider()
                
                st.markdown("### ⚡ Quick Knowledge Check")
                if is_completed:
                    st.success(f"🎉 Quiz passed successfully! +{boost_value:g} employability points are active for this specialization.")
                    st.info(f"**Quiz Question:** {course_data['quiz_question']}\n\n*Correct Answer:* `{course_data['quiz_answer']}`")
                else:
                    st.write(course_data['quiz_question'])
                    quiz_key = f"quiz_{course_data['slug']}"
                    user_answer = st.radio(
                        "Select the correct answer:",
                        course_data["quiz_options"],
                        key=quiz_key
                    )
                    
                    if st.button("Submit Quiz Answer", key=f"btn_{course_data['slug']}"):
                        if user_answer == course_data["quiz_answer"]:
                            st.session_state.completed_courses.append(selected_cluster)
                            st.success(f"🎉 Correct answer! +{boost_value:g} Employability Points unlocked.")
                            st.rerun()
                        else:
                            st.error("❌ Incorrect answer. Review the lesson notes and try again.")
                            
            with col_l2:
                st.markdown("### 📚 Recommended Courses")
                st.write("Target these external courses to build a solid foundation:")
                rec_courses = COURSES_RECOMMENDATIONS.get(selected_cluster, [])
                for c in rec_courses:
                    st.markdown(f"- **{c['name']}** ({c['source']}) — *Duration: {c['duration']}*")
                st.write("")
                
                st.markdown("### 🎖 Professional Certification Pathways")
                st.write("Industry-validated credentials to bypass background filters:")
                if selected_cluster == "CAD Design":
                    st.markdown("- **Certified SolidWorks Professional (CSWP)**: Pass 3 segments testing segment modeling, configurations, and assemblies.")
                    st.markdown("- **Autodesk Certified Professional**: Core AutoCAD/Inventor validation.")
                elif selected_cluster == "CAE/Simulation":
                    st.markdown("- **ANSYS Certified Professional**: Demonstrates advanced meshing and boundary setup rigor.")
                    st.markdown("- **NAFEMS Professional Simulation Engineer**: Global benchmark certification for finite element analysis.")
                elif selected_cluster == "Robotics/Mechatronics":
                    st.markdown("- **CLAD (Certified LabVIEW Associate Developer)**: Focus on hardware DAQ integration.")
                    st.markdown("- **ASME Robotics Certification**: Focus on automation and mechanism design compliance.")
                elif selected_cluster == "Manufacturing/Operations":
                    st.markdown("- **Lean Six Sigma Green Belt**: Focus on DMAIC frameworks and process variance reduction.")
                    st.markdown("- **SME Certified Manufacturing Engineer (CMfgE)**: Focus on manufacturing automation and operations.")
                else: # HVAC/Thermal
                    st.markdown("- **ASHRAE HVAC Design Certificate**: Focus on load calculations and duct sizing.")
                    st.markdown("- **Revit MEP Certified Professional**: Industry standard BIM modeling credential.")
                    
                st.divider()
                
                # Manim Video Course Reference
                st.markdown("### 🎥 Animation Reference")
                video_source, video_source_type = get_course_video_source(course_data)
                if video_source:
                    st.video(video_source)
                    if video_source_type == "youtube":
                        st.caption("Hosted on YouTube.")
                    else:
                        st.caption("Playing local Manim render reference.")
                else:
                    st.warning(
                        "Animation reference video render pending. Written lecture notes and quizzes are fully active above!"
                    )

    with tab_database:
        # Searchable peer candidate datatable
        st.subheader("📁 Anonymized Competitor Database")
        st.caption("Filter and search through the database of 100,000 (1 Lakh) entry-level candidates")
        
        f_region = st.selectbox("Filter Region", ["All", "India", "Global"])
        f_cluster = st.selectbox("Filter Specialty Specialty", ["All"] + CLUSTERS)
        
        df_filtered = df_candidates.copy()
        if f_region != "All":
            df_filtered = df_filtered[df_filtered["region"] == f_region]
        if f_cluster != "All":
            df_filtered = df_filtered[df_filtered["cluster"] == f_cluster]
            
        st.dataframe(
            df_filtered[["id", "region", "college", "tier", "degree", "cluster", "score"]],
            use_container_width=True,
            hide_index=True
        )
    
else:
    st.info("👈 Please paste your resume text or upload a PDF resume in the sidebar, refine your details in the form, and click 'Compute Rankings & Ranks' to begin the analysis!")
