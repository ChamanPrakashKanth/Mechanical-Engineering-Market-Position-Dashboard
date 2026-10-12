"""Generate the complete, authoritative Engineering Career Intelligence Desk across 12 disciplines.

Optimizations:
- Fixed skill-based checkbox selection (resolved double-toggle event bug, bidirectional matching, slider sync)
- Quick Select Core / Clear buttons for rapid mobile skill picking
- Fully optimized for phone & mobile screens down to 320px (touch ergonomics, swipe stepper, responsive charts, 2x2 scorecards)
- High-DPI Retina responsive HTML5 canvas for 6-axis Radar & Benchmark Distribution charts
- 650,000 deterministically simulated benchmark profiles (100k Mechanical, 50k each for other 11 disciplines)
- Interactive Peer Comparison Table with mobile swipe hint
- Recruiter Talent Pool Filter Sandbox
- Dual-mode Assessment: In-browser Resume Assessment (PDF/TXT) AND Interactive Skill-Based Assessment
- Zero-retention client-side execution (no server storage, no cookies, no tracking)
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from random import Random

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "engineering-careers"
BASE = "https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard"

DOMAINS = {
    "mechanical": {
        "name": "Mechanical Engineering",
        "benchmark_size": 100000,
        "authority": "ASME & ABET EAC Criteria",
        "intro": "Design, analyse, simulate, manufacture, and maintain mechanical systems and thermal machinery.",
        "fundamentals": [
            "Engineering Mechanics (Statics & Dynamics)", "Strength of Materials", "Thermodynamics",
            "Fluid Mechanics", "Heat & Mass Transfer", "Machine Design & Mechanisms", "Materials Science & Metallurgy"
        ],
        "methods": [
            "Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Tolerance Stack-up Analysis",
            "Design for Manufacturing & Assembly (DFM/DFA)", "Modal & Vibration Analysis", "Fatigue & Fracture Mechanics",
            "Root Cause Failure Analysis (RCFA)"
        ],
        "software": [
            "SolidWorks", "Autodesk Inventor", "PTC Creo", "CATIA V5", "AutoCAD",
            "ANSYS Mechanical", "ANSYS Fluent", "Abaqus", "MATLAB", "Simulink", "Python"
        ],
        "standards": [
            "ASME Y14.5 (GD&T)", "ASME Section VIII (Pressure Vessels)", "ASTM Material Testing Standards",
            "ISO 1101 (Geometrical Tolerancing)", "OSHA Machine Safety Standards"
        ],
        "in_demand": [
            "Additive Manufacturing (DFAM)", "Digital Twin Modeling", "Thermal Management for EV & Electronics",
            "Lightweight Composite Structures", "Generative & AI-Assisted CAD Design"
        ],
        "certifications": [
            "Certified SolidWorks Associate/Professional (CSWA/CSWP)", "ASME GD&T Professional (GDTP)",
            "Fundamentals of Engineering (FE Mechanical)", "NAFEMS FEA/CFD Specialist"
        ],
        "clusters": [
            "Mechanical Design & CAD", "CAE Simulation & FEA/CFD", "Manufacturing & DFM",
            "Thermal & Energy Systems", "Robotics & Electro-Mechanical"
        ],
        "roles": [
            {"name": "Mechanical Design Engineer", "focus": ["SolidWorks", "ASME Y14.5 (GD&T)", "Design for Manufacturing & Assembly (DFM/DFA)", "Strength of Materials", "Tolerance Stack-up Analysis"]},
            {"name": "CAE / Simulation Analyst", "focus": ["Finite Element Analysis (FEA)", "ANSYS Mechanical", "Computational Fluid Dynamics (CFD)", "Fluid Mechanics", "Modal & Vibration Analysis"]},
            {"name": "Thermal Systems Engineer", "focus": ["Thermodynamics", "Heat & Mass Transfer", "ANSYS Fluent", "Thermal Management for EV & Electronics", "Fluid Mechanics"]},
            {"name": "Manufacturing & Process Engineer", "focus": ["Design for Manufacturing & Assembly (DFM/DFA)", "Additive Manufacturing (DFAM)", "Materials Science & Metallurgy", "SolidWorks", "Root Cause Failure Analysis (RCFA)"]},
            {"name": "Product Development Engineer", "focus": ["Machine Design & Mechanisms", "SolidWorks", "Generative & AI-Assisted CAD Design", "ASME Y14.5 (GD&T)", "Strength of Materials"]},
            {"name": "HVAC / MEP Engineer", "focus": ["Thermodynamics", "Heat & Mass Transfer", "Fluid Mechanics", "AutoCAD", "Thermal Management for EV & Electronics"]}
        ],
        "proof": "a fully dimensioned & toleranced 3D assembly (ASME Y14.5), a mesh-converged FEA/CFD validation report with boundary conditions, or a physical manufactured prototype with DFM documentation"
    },
    "civil": {
        "name": "Civil Engineering",
        "benchmark_size": 50000,
        "authority": "ASCE Body of Knowledge & ABET Criteria",
        "intro": "Plan, engineer, construct, and oversee essential physical infrastructure, structural frameworks, and environmental systems.",
        "fundamentals": [
            "Structural Analysis & Mechanics", "Geotechnical Engineering & Soil Mechanics", "Fluid Mechanics & Open Channel Hydraulics",
            "Surveying & Geomatics", "Civil Construction Materials", "Transportation & Highway Engineering", "Environmental Engineering Basics"
        ],
        "methods": [
            "Reinforced Concrete Design", "Structural Steel Design", "Seismic & Wind Load Calculation",
            "Hydrologic & Drainage Modeling", "Foundation & Retaining Wall Design", "Quantity Takeoff & Cost Estimation",
            "Construction Project Scheduling"
        ],
        "software": [
            "AutoCAD", "AutoCAD Civil 3D", "Autodesk Revit (BIM)", "STAAD.Pro", "ETABS",
            "SAP2000", "ArcGIS", "QGIS", "HEC-RAS", "Bluebeam Revu", "Primavera P6"
        ],
        "standards": [
            "ASCE 7 (Minimum Design Loads for Buildings)", "ACI 318 (Structural Concrete Code)",
            "AISC 360 (Structural Steel Buildings)", "International Building Code (IBC)", "AASHTO Highway & Bridge Design"
        ],
        "in_demand": [
            "BIM Coordination & 4D/5D Modeling", "Resilient & Climate-Adaptive Infrastructure", "Infrastructure Digital Twins",
            "Geospatial AI & Drone LiDAR Surveying", "Mass Timber & Low-Carbon Concrete Design"
        ],
        "certifications": [
            "Fundamentals of Engineering (FE Civil / EIT)", "Professional Engineer (PE Civil)",
            "Autodesk Certified Professional (Revit/Civil 3D)", "LEED Green Associate / AP", "Envision Sustainability Professional (ENV SP)"
        ],
        "clusters": [
            "Structural Engineering", "Transportation & Highways", "Geotechnical & Foundations",
            "Water Resources & Drainage", "Construction Management & BIM"
        ],
        "roles": [
            {"name": "Structural Design Engineer", "focus": ["Structural Analysis & Mechanics", "Reinforced Concrete Design", "STAAD.Pro", "ETABS", "ASCE 7 (Minimum Design Loads for Buildings)"]},
            {"name": "Highway / Transportation Engineer", "focus": ["AutoCAD Civil 3D", "Transportation & Highway Engineering", "Surveying & Geomatics", "AASHTO Highway & Bridge Design", "ArcGIS"]},
            {"name": "Water Resources Engineer", "focus": ["Hydrologic & Drainage Modeling", "HEC-RAS", "Fluid Mechanics & Open Channel Hydraulics", "ArcGIS", "Environmental Engineering Basics"]},
            {"name": "Geotechnical Engineer", "focus": ["Geotechnical Engineering & Soil Mechanics", "Foundation & Retaining Wall Design", "Civil Construction Materials", "Structural Analysis & Mechanics", "AutoCAD"]},
            {"name": "BIM / VDC Coordinator", "focus": ["Autodesk Revit (BIM)", "BIM Coordination & 4D/5D Modeling", "AutoCAD Civil 3D", "Bluebeam Revu", "Construction Project Scheduling"]},
            {"name": "Construction Project Engineer", "focus": ["Construction Project Scheduling", "Quantity Takeoff & Cost Estimation", "Primavera P6", "International Building Code (IBC)", "Bluebeam Revu"]}
        ],
        "proof": "a complete code-referenced calculation package (ASCE 7/ACI 318), a coordinated multi-discipline Revit BIM model with clash report, or a calibrated HEC-RAS watershed simulation"
    },
    "electrical": {
        "name": "Electrical Engineering",
        "benchmark_size": 50000,
        "authority": "IEEE Standards & ABET Criteria",
        "intro": "Engineer power systems, electrical machines, control circuits, renewable energy, and grid infrastructure.",
        "fundamentals": [
            "Linear Circuit Theory (AC/DC)", "Electromagnetic Field Theory", "Electrical Machines & Transformers",
            "Power Systems Analysis", "Feedback Control Systems", "Power Electronics & Inverters", "Analog Signals & Systems"
        ],
        "methods": [
            "Load Flow & Fault Current Analysis", "Relay Coordination & System Protection", "Substation Earthing & Grounding Design",
            "Harmonic Mitigation & Power Quality", "Motor Drive Control & VFD Tuning", "Short-Circuit Calculations"
        ],
        "software": [
            "MATLAB", "Simulink", "ETAP", "PSCAD", "AutoCAD Electrical",
            "EasyPower", "PSpice", "LTspice", "DIgSILENT PowerFactory", "LabVIEW", "Python"
        ],
        "standards": [
            "National Electrical Code (NEC / NFPA 70)", "IEEE 1584 (Arc Flash Hazard Calculations)",
            "IEEE 802 Standards", "IEC 61850 (Power Utility Automation)", "NEMA Standards", "OSHA NFPA 70E Safety"
        ],
        "in_demand": [
            "Battery Energy Storage Systems (BESS)", "Smart Grid & Microgrid Controller Design",
            "High-Voltage Direct Current (HVDC)", "Solar PV & Wind Grid Interconnection", "EV Fast Charging Infrastructure (CCS/NACS)"
        ],
        "certifications": [
            "Fundamentals of Engineering (FE Electrical)", "Professional Engineer (PE Power)",
            "Certified Energy Manager (CEM)", "NABCEP PV Installation Professional", "IEEE PES Member"
        ],
        "clusters": [
            "Power & Utility Systems", "Renewable Energy & Microgrids", "Industrial Automation & Controls",
            "Power Electronics & Drives", "Building Electrical & MEP"
        ],
        "roles": [
            {"name": "Power Systems Engineer", "focus": ["Power Systems Analysis", "ETAP", "Load Flow & Fault Current Analysis", "Relay Coordination & System Protection", "IEEE 1584 (Arc Flash Hazard Calculations)"]},
            {"name": "Renewable Energy Project Engineer", "focus": ["Solar PV & Wind Grid Interconnection", "Battery Energy Storage Systems (BESS)", "MATLAB", "Power Electronics & Inverters", "NEC / NFPA 70"]},
            {"name": "Electrical Controls Engineer", "focus": ["Feedback Control Systems", "Motor Drive Control & VFD Tuning", "AutoCAD Electrical", "Simulink", "National Electrical Code (NEC / NFPA 70)"]},
            {"name": "Substation & Protection Engineer", "focus": ["Relay Coordination & System Protection", "IEC 61850 (Power Utility Automation)", "Substation Earthing & Grounding Design", "ETAP", "Electrical Machines & Transformers"]},
            {"name": "Power Electronics Engineer", "focus": ["Power Electronics & Inverters", "LTspice", "MATLAB", "Linear Circuit Theory (AC/DC)", "Harmonic Mitigation & Power Quality"]},
            {"name": "MEP Electrical Engineer", "focus": ["National Electrical Code (NEC / NFPA 70)", "AutoCAD Electrical", "Short-Circuit Calculations", "OSHA NFPA 70E Safety", "Load Flow & Fault Current Analysis"]}
        ],
        "proof": "a modeled ETAP short-circuit & protective device coordination study, an IEEE 1584 arc-flash assessment, or an operational hardware prototype of a power converter with efficiency data"
    },
    "electronics": {
        "name": "Electronics & Communication Engineering",
        "benchmark_size": 50000,
        "authority": "IEEE Communications & Solid-State Societies",
        "intro": "Develop embedded systems, high-speed PCB hardware, RF communication links, and digital signal processors.",
        "fundamentals": [
            "Analog Circuit Design", "Digital Logic Design & Verilog/VHDL", "Signals & Digital Signal Processing (DSP)",
            "Electromagnetic Wave Theory & Antennas", "Microprocessors & ARM Cortex Architectures", "Semiconductor Device Physics", "Communication Theory (Modulation/Coding)"
        ],
        "methods": [
            "High-Speed PCB Layout & Routing", "Signal Integrity & Power Integrity Analysis", "Mixed-Signal Hardware Simulation",
            "RF Front-End Matching & Tuning", "Embedded Firmware Architecture", "Hardware-Software Debugging (Oscilloscope/Logic Analyzer)"
        ],
        "software": [
            "Altium Designer", "KiCad", "Cadence Allegro", "OrCAD", "Keil uVision",
            "MATLAB", "Simulink", "Quartus Prime", "Vivado (FPGA)", "LTspice", "Embedded C/C++", "Python"
        ],
        "standards": [
            "IPC-2221 / IPC-A-610 (PCB Design & Acceptability)", "FCC Part 15 (EMI/EMC Compliance)",
            "IEEE 802.11 (Wi-Fi) & 802.15 (Bluetooth/Zigbee)", "USB-IF & PCIe Specifications"
        ],
        "in_demand": [
            "Edge AI & TinyML Inference", "5G / mmWave RF Circuit Design", "FPGA Hardware Accelerators (RISC-V)",
            "Ultra-Low Power IoT Sensors", "Automotive Ethernet & High-Speed SerDes"
        ],
        "certifications": [
            "Certified IPC Specialist (CIS - IPC-A-610)", "ARM Accredited Engineer",
            "Certified Wireless Network Administrator (CWNA)", "IEEE ComSoc Certified"
        ],
        "clusters": [
            "Embedded Firmware & Systems", "Hardware & PCB Design", "RF & Wireless Communications",
            "FPGA & Digital ASIC Design", "DSP & Signal Processing"
        ],
        "roles": [
            {"name": "Embedded Systems Engineer", "focus": ["Embedded C/C++", "Microprocessors & ARM Cortex Architectures", "Keil uVision", "Hardware-Software Debugging (Oscilloscope/Logic Analyzer)", "Edge AI & TinyML Inference"]},
            {"name": "PCB Design Engineer", "focus": ["Altium Designer", "High-Speed PCB Layout & Routing", "Signal Integrity & Power Integrity Analysis", "IPC-2221 / IPC-A-610 (PCB Design & Acceptability)", "KiCad"]},
            {"name": "RF / Wireless Engineer", "focus": ["Electromagnetic Wave Theory & Antennas", "RF Front-End Matching & Tuning", "Communication Theory (Modulation/Coding)", "FCC Part 15 (EMI/EMC Compliance)", "MATLAB"]},
            {"name": "FPGA Firmware Engineer", "focus": ["Digital Logic Design & Verilog/VHDL", "Vivado (FPGA)", "Quartus Prime", "FPGA Hardware Accelerators (RISC-V)", "Digital Signal Processing (DSP)"]},
            {"name": "Hardware Test & Validation Engineer", "focus": ["Hardware-Software Debugging (Oscilloscope/Logic Analyzer)", "Mixed-Signal Hardware Simulation", "Analog Circuit Design", "LTspice", "FCC Part 15 (EMI/EMC Compliance)"]},
            {"name": "DSP / Audio & Vision Systems Engineer", "focus": ["Signals & Digital Signal Processing (DSP)", "MATLAB", "Communication Theory (Modulation/Coding)", "Embedded C/C++", "Python"]}
        ],
        "proof": "a fabricated 4-layer+ PCB layout in Altium/KiCad with full BOM and Gerber files, an RTL Verilog core verified on hardware FPGA, or a working ARM Cortex firmware device with custom peripheral driver code"
    },
    "computer": {
        "name": "Computer & Software Engineering",
        "benchmark_size": 50000,
        "authority": "ACM / IEEE Computer Society Guidelines",
        "intro": "Architect distributed software systems, cloud computing backends, robust data platforms, and secure applications.",
        "fundamentals": [
            "Data Structures & Algorithms", "Object-Oriented & Functional Programming", "Computer Systems Architecture & Memory Hierarchy",
            "Operating Systems & Concurrency", "Relational & NoSQL Database Theory", "Computer Networking (TCP/IP, HTTP/3)", "Discrete Mathematics"
        ],
        "methods": [
            "Distributed Systems Design", "RESTful & gRPC API Engineering", "Cloud-Native Infrastructure as Code (IaC)",
            "Continuous Integration & Continuous Deployment (CI/CD)", "Automated Unit, Integration & End-to-End Testing",
            "Application Performance Profiling & Optimization"
        ],
        "software": [
            "Python", "Java", "C++", "TypeScript", "Go", "Rust",
            "Docker", "Kubernetes", "AWS", "Azure", "PostgreSQL", "Redis", "Kafka", "Git", "Linux"
        ],
        "standards": [
            "POSIX Standards", "OWASP Top 10 Security Framework", "ISO/IEC 27001 (Information Security)",
            "Semantic Versioning (SemVer)", "Twelve-Factor App Methodology"
        ],
        "in_demand": [
            "Large Language Model (LLM) Integration & Agentic AI", "Vector Databases & Retrieval Augmented Generation (RAG)",
            "Zero-Trust Cloud Security Architecture", "Kubernetes Microservice Orchestration", "High-Throughput Stream Processing (Kafka/Flink)"
        ],
        "certifications": [
            "AWS Certified Solutions Architect", "Certified Kubernetes Administrator (CKA)",
            "Google Professional Cloud Architect", "CompTIA Security+"
        ],
        "clusters": [
            "Full-Stack & Backend Systems", "Cloud & DevOps Infrastructure", "Data Platforms & Pipelines",
            "Machine Learning & AI Engineering", "Systems & Embedded Software"
        ],
        "roles": [
            {"name": "Backend Software Engineer", "focus": ["Data Structures & Algorithms", "Distributed Systems Design", "RESTful & gRPC API Engineering", "PostgreSQL", "Go"]},
            {"name": "Cloud / DevOps Engineer", "focus": ["Docker", "Kubernetes", "Cloud-Native Infrastructure as Code (IaC)", "AWS", "Continuous Integration & Continuous Deployment (CI/CD)"]},
            {"name": "Full-Stack Engineer", "focus": ["TypeScript", "Object-Oriented & Functional Programming", "RESTful & gRPC API Engineering", "PostgreSQL", "Git"]},
            {"name": "Data Platform Engineer", "focus": ["Relational & NoSQL Database Theory", "Kafka", "High-Throughput Stream Processing (Kafka/Flink)", "Python", "Redis"]},
            {"name": "Machine Learning Systems Engineer", "focus": ["Python", "Large Language Model (LLM) Integration & Agentic AI", "Vector Databases & Retrieval Augmented Generation (RAG)", "Docker", "Linux"]},
            {"name": "Systems & Reliability Engineer", "focus": ["Operating Systems & Concurrency", "Computer Networking (TCP/IP, HTTP/3)", "OWASP Top 10 Security Framework", "Linux", "Application Performance Profiling & Optimization"]}
        ],
        "proof": "a production-grade deployed software project with comprehensive automated test suite (CI/CD), clean modular architecture, documented API endpoints, and a public git repository"
    },
    "chemical": {
        "name": "Chemical Engineering",
        "benchmark_size": 50000,
        "authority": "AIChE & Center for Chemical Process Safety (CCPS)",
        "intro": "Transform raw feedstocks into valuable chemicals, fuels, materials, and pharmaceuticals through scalable, safe processes.",
        "fundamentals": [
            "Chemical Engineering Thermodynamics", "Mass Transfer Operations & Separation", "Heat Transfer & Exchanger Design",
            "Chemical Reaction Kinetics & Reactor Design", "Fluid Flow & Momentum Transport", "Process Dynamics & Feedback Control", "Industrial Chemistry"
        ],
        "methods": [
            "Steady-State & Dynamic Flowsheet Simulation", "Mass & Energy Balance Reconciliation", "Distillation & Absorption Column Sizing",
            "Hazard & Operability Studies (HAZOP)", "Layers of Protection Analysis (LOPA)", "Piping & Instrumentation Diagram (P&ID) Development",
            "Pressure Relief & Flare System Sizing"
        ],
        "software": [
            "Aspen Plus", "Aspen HYSYS", "ChemCAD", "PRO/II", "COMSOL Multiphysics",
            "AutoCAD Plant 3D", "MATLAB", "DWSIM", "Python for Process Data"
        ],
        "standards": [
            "OSHA Process Safety Management (PSM 29 CFR 1910.119)", "API 520 / 521 (Pressure Relief Systems)",
            "ASME Boiler & Pressure Vessel Code (BPVC)", "NFPA 652 (Combustible Dust Standard)", "EPA Clean Air Act RMP"
        ],
        "in_demand": [
            "Green Hydrogen Production & Water Electrolysis", "Carbon Capture, Utilization & Storage (CCUS)",
            "Bio-Based Materials & Synthetic Biology Scale-Up", "Circular Chemical Recycling & Plastics Pyrolysis",
            "Process Electrification & Industrial Decarbonization"
        ],
        "certifications": [
            "Fundamentals of Engineering (FE Chemical)", "Professional Engineer (PE Chemical)",
            "CCPS Certified Process Safety Professional (CCPSC)", "Certified HAZOP Study Leader", "Six Sigma Green Belt"
        ],
        "clusters": [
            "Process Design & Simulation", "Plant Operations & Manufacturing", "Process Safety (PSM / HAZOP)",
            "Energy Transition & Decarbonization", "Biochemical & Pharma Processing"
        ],
        "roles": [
            {"name": "Process Design Engineer", "focus": ["Aspen HYSYS", "Steady-State & Dynamic Flowsheet Simulation", "Mass & Energy Balance Reconciliation", "Chemical Engineering Thermodynamics", "Piping & Instrumentation Diagram (P&ID) Development"]},
            {"name": "Chemical Plant Operations Engineer", "focus": ["Process Dynamics & Feedback Control", "Heat Transfer & Exchanger Design", "Mass Transfer Operations & Separation", "Piping & Instrumentation Diagram (P&ID) Development", "OSHA Process Safety Management (PSM 29 CFR 1910.119)"]},
            {"name": "Process Safety Engineer (PSM)", "focus": ["Hazard & Operability Studies (HAZOP)", "Layers of Protection Analysis (LOPA)", "Pressure Relief & Flare System Sizing", "OSHA Process Safety Management (PSM 29 CFR 1910.119)", "API 520 / 521 (Pressure Relief Systems)"]},
            {"name": "Decarbonization / Energy Engineer", "focus": ["Carbon Capture, Utilization & Storage (CCUS)", "Green Hydrogen Production & Water Electrolysis", "Heat Transfer & Exchanger Design", "Aspen Plus", "Chemical Engineering Thermodynamics"]},
            {"name": "Biochemical Process Engineer", "focus": ["Chemical Reaction Kinetics & Reactor Design", "Mass Transfer Operations & Separation", "Bio-Based Materials & Synthetic Biology Scale-Up", "MATLAB", "Industrial Chemistry"]},
            {"name": "Refinery & Petrochemical Engineer", "focus": ["Distillation & Absorption Column Sizing", "Aspen HYSYS", "Mass & Energy Balance Reconciliation", "Pressure Relief & Flare System Sizing", "API 520 / 521 (Pressure Relief Systems)"]}
        ],
        "proof": "a converged Aspen Plus / HYSYS process flowsheet with equipment sizing calculations, a documented team HAZOP log with node deviations and safeguards, or an empirical pilot-plant reactor scale-up balance"
    },
    "aerospace": {
        "name": "Aerospace Engineering",
        "benchmark_size": 50000,
        "authority": "AIAA & FAA Airworthiness Guidelines",
        "intro": "Engineer flight vehicles, spacecraft, hypersonic systems, advanced propulsion, and orbital mechanics.",
        "fundamentals": [
            "Aerodynamics & Compressible Flow", "Flight Mechanics & Aircraft Performance", "Aerospace Propulsion (Gas Turbines & Rocketry)",
            "Aerospace Structural Mechanics", "Orbital Mechanics & Astrodynamics", "Flight Dynamics, Stability & Control", "Space Environment & Radiation"
        ],
        "methods": [
            "Computational Fluid Dynamics (CFD)", "Finite Element Aero-Structural Analysis", "Aeroelastic Flutter & Gust Analysis",
            "Trajectory & Orbital Insertion Optimization", "Thermal Protection System (TPS) Design", "Model-Based Systems Engineering (MBSE)"
        ],
        "software": [
            "ANSYS Fluent", "Siemens STAR-CCM+", "NASTRAN / PATRAN", "CATIA V5", "Siemens NX",
            "OpenVSP", "MATLAB", "Simulink", "Systems Tool Kit (STK)", "XFLR5", "Python"
        ],
        "standards": [
            "FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)", "DO-178C (Software in Airborne Systems)",
            "DO-254 (Electronic Hardware in Airborne Systems)", "MIL-STD-810 (Environmental Engineering Considerations)", "NASA Systems Engineering Handbook"
        ],
        "in_demand": [
            "eVTOL & Advanced Air Mobility (AAM)", "Hypersonic Aerodynamics & Aerothermodynamics",
            "Autonomous Flight Guidance, Navigation & Control (GNC)", "SmallSat Constellation Mission Design", "Hybrid-Electric Propulsion & Hydrogen Aircraft"
        ],
        "certifications": [
            "Fundamentals of Engineering (FE Aerospace)", "Professional Engineer (PE Aerospace)",
            "AIAA Senior Member / Specialist", "DO-178C Certification Practitioner", "INCOSE ASEP/CSEP"
        ],
        "clusters": [
            "Aerodynamics & Aero-Thermal", "Aerospace Structures & Materials", "Propulsion & Rocketry",
            "Guidance, Navigation & Control (GNC)", "Spacecraft Systems & Mission Design"
        ],
        "roles": [
            {"name": "Aerodynamics / CFD Engineer", "focus": ["Aerodynamics & Compressible Flow", "Computational Fluid Dynamics (CFD)", "ANSYS Fluent", "OpenVSP", "Flight Mechanics & Aircraft Performance"]},
            {"name": "Aerospace Stress & Structures Engineer", "focus": ["Aerospace Structural Mechanics", "NASTRAN / PATRAN", "Finite Element Aero-Structural Analysis", "CATIA V5", "FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)"]},
            {"name": "Propulsion Systems Engineer", "focus": ["Aerospace Propulsion (Gas Turbines & Rocketry)", "Thermal Protection System (TPS) Design", "Compressible Flow", "MATLAB", "MIL-STD-810 (Environmental Engineering Considerations)"]},
            {"name": "Guidance, Navigation & Control (GNC) Engineer", "focus": ["Flight Dynamics, Stability & Control", "MATLAB", "Simulink", "Autonomous Flight Guidance, Navigation & Control (GNC)", "DO-178C (Software in Airborne Systems)"]},
            {"name": "Spacecraft Systems Engineer", "focus": ["Orbital Mechanics & Astrodynamics", "Systems Tool Kit (STK)", "Space Environment & Radiation", "Trajectory & Orbital Insertion Optimization", "NASA Systems Engineering Handbook"]},
            {"name": "Flight Test Engineer", "focus": ["Flight Mechanics & Aircraft Performance", "FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)", "MIL-STD-810 (Environmental Engineering Considerations)", "MATLAB", "Flight Dynamics, Stability & Control"]}
        ],
        "proof": "a mesh-converged CFD lift/drag polar calculation (ANSYS/STAR-CCM+) validated against wind-tunnel benchmarks, a 6-DOF trajectory simulation in MATLAB/Simulink, or an FE stress margin analysis for an aircraft rib/spar"
    },
    "automotive": {
        "name": "Automotive Engineering",
        "benchmark_size": 50000,
        "authority": "SAE International Standards",
        "intro": "Design software-defined vehicles, electric powertrains, battery management systems, and autonomous driving architectures.",
        "fundamentals": [
            "Vehicle Dynamics & Handling (Tire Mechanics)", "Powertrain Systems (EV & Hybrid)", "Automotive Electronics & Microcontrollers",
            "Chassis, Suspension & Braking Systems", "Internal Combustion & Electric Motors", "NVH (Noise, Vibration & Harshness)", "Crashworthiness & Impact Mechanics"
        ],
        "methods": [
            "Model-Based Design (MBD)", "Hardware-in-the-Loop (HIL) & SIL Simulation", "Battery State of Charge (SOC) & SOH Estimation",
            "CAN / LIN / Automotive Ethernet Network Decoding", "Multi-Body Dynamics (MBD) Simulation", "Crash Impact FEA Analysis"
        ],
        "software": [
            "MATLAB", "Simulink", "Stateflow", "Vector CANoe", "CANalyzer",
            "Adams Car", "CATIA", "SolidWorks", "ANSYS LS-DYNA", "CarMaker", "Embedded C/C++"
        ],
        "standards": [
            "ISO 26262 (Functional Safety - ASIL A to D)", "AUTOSAR Classic & Adaptive Platforms",
            "SAE J1939 / J1772 Standards", "FMVSS / UNECE Crash Safety Regulations", "UN R155 (Automotive Cybersecurity)"
        ],
        "in_demand": [
            "EV Battery Management Systems (BMS)", "Software-Defined Vehicle (SDV) Architectures",
            "ADAS Sensor Fusion (Camera, Radar, LiDAR)", "Silicon Carbide (SiC) High-Voltage Inverters", "Over-the-Air (OTA) Safe Update Pipelines"
        ],
        "certifications": [
            "SAE International Certified Specialist", "TUV Certified Functional Safety Professional (ISO 26262)",
            "Certified ScrumMaster (Automotive Agile)", "Vector Certified CANoe Professional"
        ],
        "clusters": [
            "EV Powertrain & Battery Systems", "Vehicle Dynamics & Chassis", "Automotive Embedded Software",
            "ADAS & Autonomous Systems", "Body, Safety & Crashworthiness"
        ],
        "roles": [
            {"name": "EV Battery Management (BMS) Engineer", "focus": ["Battery State of Charge (SOC) & SOH Estimation", "EV Battery Management Systems (BMS)", "MATLAB", "Simulink", "ISO 26262 (Functional Safety - ASIL A to D)"]},
            {"name": "Automotive Embedded Controls Engineer", "focus": ["Model-Based Design (MBD)", "AUTOSAR Classic & Adaptive Platforms", "Vector CANoe", "Embedded C/C++", "ISO 26262 (Functional Safety - ASIL A to D)"]},
            {"name": "Vehicle Dynamics Engineer", "focus": ["Vehicle Dynamics & Handling (Tire Mechanics)", "Adams Car", "Chassis, Suspension & Braking Systems", "Multi-Body Dynamics (MBD) Simulation", "CarMaker"]},
            {"name": "ADAS / Autonomous Systems Engineer", "focus": ["ADAS Sensor Fusion (Camera, Radar, LiDAR)", "CAN / LIN / Automotive Ethernet Network Decoding", "Simulink", "Vector CANoe", "Software-Defined Vehicle (SDV) Architectures"]},
            {"name": "Crashworthiness & Safety Engineer", "focus": ["Crashworthiness & Impact Mechanics", "ANSYS LS-DYNA", "FMVSS / UNECE Crash Safety Regulations", "CATIA", "NVH (Noise, Vibration & Harshness)"]},
            {"name": "Automotive Test & HIL Engineer", "focus": ["Hardware-in-the-Loop (HIL) & SIL Simulation", "Vector CANoe", "CANalyzer", "Automotive Electronics & Microcontrollers", "Embedded C/C++"]}
        ],
        "proof": "a Simulink MBD control model with MIL/SIL test harness conforming to ISO 26262, an in-vehicle CAN/CAN FD decoding log trace, or a verified Adams Car multi-body suspension kinematic simulation"
    },
    "biomedical": {
        "name": "Biomedical Engineering",
        "benchmark_size": 50000,
        "authority": "BMES & FDA Center for Devices (CDRH)",
        "intro": "Engineer biocompatible medical devices, surgical implants, biosensing instrumentation, and healthcare diagnostic systems.",
        "fundamentals": [
            "Human Anatomy & Organ Physiology", "Biomaterials & Biocompatibility", "Biomechanics & Orthopedic Mechanics",
            "Bioinstrumentation & Biosensors", "Biomedical Signal & Image Processing", "Cell & Tissue Engineering", "Fluid Biomechanics (Cardiovascular)"
        ],
        "methods": [
            "Medical Device Design Controls & Risk Management", "Finite Element Modeling of Implants & Bone", "Microfluidic Lab-on-a-Chip Design",
            "Biosignal Filtering (ECG/EMG/EEG)", "Kinematic Gait Analysis", "Preclinical In-Vitro & Verification Testing"
        ],
        "software": [
            "SolidWorks", "MATLAB", "Python", "COMSOL Multiphysics",
            "ImageJ / 3D Slicer", "LabVIEW", "ANSYS Mechanical", "Minitab"
        ],
        "standards": [
            "ISO 13485 (Medical Devices - Quality Management)", "FDA 21 CFR Part 820 / QMSR",
            "ISO 14971 (Application of Risk Management to Medical Devices)", "IEC 60601-1 (Medical Electrical Equipment Safety)", "EU Medical Device Regulation (MDR)"
        ],
        "in_demand": [
            "Wearable Health Monitors & Continuous Biosensing", "AI / Deep Learning in Medical Imaging",
            "Robotic-Assisted Surgery Subsystems", "3D Bioprinting & Tissue Scaffolding", "Point-of-Care Microfluidic Diagnostics"
        ],
        "certifications": [
            "Regulatory Affairs Certification (RAC - RAPS)", "Certified Biomedical Auditor (CBA - ASQ)",
            "BMES Professional Membership", "Certified Six Sigma Green Belt in Healthcare"
        ],
        "clusters": [
            "Medical Device R&D", "Biomechanics & Implants", "Biosensors & Bioinstrumentation",
            "Regulatory Affairs & Quality Assurance", "Biomedical Imaging & Diagnostics"
        ],
        "roles": [
            {"name": "Medical Device Design Engineer", "focus": ["SolidWorks", "Medical Device Design Controls & Risk Management", "Biomaterials & Biocompatibility", "ISO 13485 (Medical Devices - Quality Management)", "FDA 21 CFR Part 820 / QMSR"]},
            {"name": "Biomechanical Implant Engineer", "focus": ["Biomechanics & Orthopedic Mechanics", "Finite Element Modeling of Implants & Bone", "ANSYS Mechanical", "Biomaterials & Biocompatibility", "SolidWorks"]},
            {"name": "Biosensors & Instrumentation Engineer", "focus": ["Bioinstrumentation & Biosensors", "Biosignal Filtering (ECG/EMG/EEG)", "MATLAB", "LabVIEW", "IEC 60601-1 (Medical Electrical Equipment Safety)"]},
            {"name": "Regulatory Affairs Specialist", "focus": ["FDA 21 CFR Part 820 / QMSR", "ISO 13485 (Medical Devices - Quality Management)", "ISO 14971 (Application of Risk Management to Medical Devices)", "EU Medical Device Regulation (MDR)", "Medical Device Design Controls & Risk Management"]},
            {"name": "Biomedical Imaging Analyst", "focus": ["Biomedical Signal & Image Processing", "ImageJ / 3D Slicer", "Python", "MATLAB", "AI / Deep Learning in Medical Imaging"]},
            {"name": "Clinical Systems Engineer", "focus": ["IEC 60601-1 (Medical Electrical Equipment Safety)", "Human Anatomy & Organ Physiology", "Bioinstrumentation & Biosensors", "Risk Management to Medical Devices", "Minitab"]}
        ],
        "proof": "a complete Design History File (DHF) excerpt with traceability matrix (ISO 14971/21 CFR 820), a biomechanical FEA study showing bone-implant interface stresses, or a verified biosignal acquisition prototype with DSP filter code"
    },
    "environmental": {
        "name": "Environmental Engineering",
        "benchmark_size": 50000,
        "authority": "AAEE & EPA Regulatory Standards",
        "intro": "Protect public health and ecosystems through water/wastewater systems, air quality engineering, and climate remediation.",
        "fundamentals": [
            "Environmental Chemistry & Microbiology", "Fluid Mechanics & Open Channel Hydraulics", "Hydrology & Groundwater Transport",
            "Water & Wastewater Treatment Unit Operations", "Air Pollution Meteorology & Dispersion", "Hazardous Waste Management", "Environmental Toxicology"
        ],
        "methods": [
            "Biological Nutrient Removal (BNR) Sizing", "Stormwater Runoff & Watershed Modeling", "Contaminant Fate & Transport Modeling",
            "Life Cycle Assessment (LCA) & Carbon Footprinting", "Air Dispersion Modeling (AERMOD)", "Soil & Aquifer Remediation Design",
            "Environmental Impact Assessment (EIA)"
        ],
        "software": [
            "ArcGIS", "QGIS", "EPA SWMM", "EPANET", "AERMOD",
            "MODFLOW", "SimaPro / openLCA", "AutoCAD Civil 3D", "Python", "R for Environmental Statistics"
        ],
        "standards": [
            "Clean Water Act (NPDES Discharge Permits)", "Clean Air Act (NAAQS & Title V)",
            "Resource Conservation & Recovery Act (RCRA)", "ISO 14001 (Environmental Management Systems)", "OSHA 40-Hour HAZWOPER"
        ],
        "in_demand": [
            "PFAS Remediation & Destruction Technologies", "Scope 1/2/3 Corporate Greenhouse Gas (GHG) Accounting",
            "Climate Vulnerability & Urban Flood Resilience", "Circular Waste-to-Energy & Resource Recovery", "Nature-Based Infrastructure & Wetland Restoration"
        ],
        "certifications": [
            "Fundamentals of Engineering (FE Environmental)", "Board Certified Environmental Engineer (BCEE)",
            "Professional Engineer (PE Environmental)", "LEED AP / Envision Sustainability Professional (ENV SP)", "OSHA 40-Hr HAZWOPER"
        ],
        "clusters": [
            "Water & Wastewater Treatment", "Hydrology & Watershed Modeling", "Air Quality & Dispersion",
            "Sustainability & ESG / LCA", "Site Remediation & Hazardous Waste"
        ],
        "roles": [
            {"name": "Water / Wastewater Process Engineer", "focus": ["Water & Wastewater Treatment Unit Operations", "Biological Nutrient Removal (BNR) Sizing", "EPANET", "Clean Water Act (NPDES Discharge Permits)", "Environmental Chemistry & Microbiology"]},
            {"name": "Hydrologist / Watershed Modeler", "focus": ["EPA SWMM", "Hydrology & Groundwater Transport", "ArcGIS", "Stormwater Runoff & Watershed Modeling", "MODFLOW"]},
            {"name": "Air Quality Specialist", "focus": ["Air Dispersion Modeling (AERMOD)", "Air Pollution Meteorology & Dispersion", "Clean Air Act (NAAQS & Title V)", "Python", "Environmental Impact Assessment (EIA)"]},
            {"name": "Sustainability & Carbon (LCA) Analyst", "focus": ["Life Cycle Assessment (LCA) & Carbon Footprinting", "SimaPro / openLCA", "Scope 1/2/3 Corporate Greenhouse Gas (GHG) Accounting", "ISO 14001 (Environmental Management Systems)", "Circular Waste-to-Energy & Resource Recovery"]},
            {"name": "Environmental Remediation Engineer", "focus": ["Soil & Aquifer Remediation Design", "Contaminant Fate & Transport Modeling", "Hazardous Waste Management", "Resource Conservation & Recovery Act (RCRA)", "OSHA 40-Hour HAZWOPER"]},
            {"name": "Environmental Compliance Consultant", "focus": ["Environmental Impact Assessment (EIA)", "Clean Water Act (NPDES Discharge Permits)", "Clean Air Act (NAAQS & Title V)", "ISO 14001 (Environmental Management Systems)", "ArcGIS"]}
        ],
        "proof": "an EPA SWMM hydraulic runoff calibration model, a comprehensive ISO 14040-compliant Life Cycle Assessment (LCA) report, or an AERMOD industrial air quality dispersion footprint study"
    },
    "industrial": {
        "name": "Industrial & Production Engineering",
        "benchmark_size": 50000,
        "authority": "IISE & ASQ Quality Body of Knowledge",
        "intro": "Optimize complex manufacturing plants, supply chains, human-machine workflows, and quality systems for maximum throughput and reliability.",
        "fundamentals": [
            "Operations Research & Mathematical Optimization", "Applied Engineering Statistics & Probability", "Work Study, Ergonomics & Motion Economy",
            "Production Planning & Inventory Control (PPIC)", "Facility Layout & Material Handling Design", "Engineering Economics & Cost Analysis", "Supply Chain Systems"
        ],
        "methods": [
            "Lean Manufacturing & Value Stream Mapping (VSM)", "Six Sigma DMAIC Problem-Solving", "Discrete-Event Process Simulation",
            "Statistical Process Control (SPC & Control Charts)", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)",
            "Overall Equipment Effectiveness (OEE) Optimization"
        ],
        "software": [
            "Minitab", "Arena Simulation", "Simio", "AnyLogic", "AutoCAD (Plant Layout)",
            "Python", "R", "Tableau", "Power BI", "SAP ERP (PP/MM Modules)", "MS Excel Advanced Solver"
        ],
        "standards": [
            "ISO 9001 (Quality Management Systems)", "AIAG / VDA APQP & PPAP (Automotive Quality)",
            "ISO 45001 (Occupational Health and Safety)", "ASQ Six Sigma Body of Knowledge", "SCOR Model (Supply Chain Operations)"
        ],
        "in_demand": [
            "Smart Manufacturing & Industry 4.0 IoT Analytics", "Digital Supply Chain Twin Simulation",
            "Automated Guided Vehicle (AGV/AMR) Fleet Routing", "Predictive Machine Maintenance Machine Learning", "Sustainable & Carbon-Neutral Factory Operations"
        ],
        "certifications": [
            "ASQ Certified Six Sigma Green / Black Belt (CSSGB/CSSBB)", "ASQ Certified Quality Engineer (CQE)",
            "Certified Supply Chain Professional (CSCP - ASCM)", "SME Certified Manufacturing Engineer (CMfgE)"
        ],
        "clusters": [
            "Lean & Operational Excellence", "Quality Engineering & Six Sigma", "Process Simulation & Operations Research",
            "Supply Chain Logistics & Inventory", "Smart Manufacturing & Automation"
        ],
        "roles": [
            {"name": "Industrial Engineer", "focus": ["Lean Manufacturing & Value Stream Mapping (VSM)", "Work Study, Ergonomics & Motion Economy", "Facility Layout & Material Handling Design", "Minitab", "AutoCAD (Plant Layout)"]},
            {"name": "Quality Assurance / Six Sigma Engineer", "focus": ["Six Sigma DMAIC Problem-Solving", "Statistical Process Control (SPC & Control Charts)", "ISO 9001 (Quality Management Systems)", "Minitab", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)"]},
            {"name": "Manufacturing Systems Integrator", "focus": ["Overall Equipment Effectiveness (OEE) Optimization", "Smart Manufacturing & Industry 4.0 IoT Analytics", "Discrete-Event Process Simulation", "Arena Simulation", "Production Planning & Inventory Control (PPIC)"]},
            {"name": "Supply Chain & Operations Analyst", "focus": ["Operations Research & Mathematical Optimization", "Supply Chain Systems", "Tableau", "SAP ERP (PP/MM Modules)", "SCOR Model (Supply Chain Operations)"]},
            {"name": "Continuous Improvement / Kaizen Manager", "focus": ["Lean Manufacturing & Value Stream Mapping (VSM)", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)", "Overall Equipment Effectiveness (OEE) Optimization", "ISO 9001 (Quality Management Systems)", "Work Study, Ergonomics & Motion Economy"]},
            {"name": "Discrete Event Simulation Specialist", "focus": ["Discrete-Event Process Simulation", "Arena Simulation", "Simio", "Operations Research & Mathematical Optimization", "Python"]}
        ],
        "proof": "a quantified Value Stream Map (VSM) with before/after takt time & lead-time reduction, an Arena/Simio discrete-event factory throughput simulation, or a complete Six Sigma DMAIC project charter with Minitab SPC capability analysis (Cp/Cpk)"
    },
    "mechatronics": {
        "name": "Mechatronics & Robotics Engineering",
        "benchmark_size": 50000,
        "authority": "IEEE Robotics & Automation Society (RAS)",
        "intro": "Synthesize precision mechanics, embedded electronics, real-time software, and modern control theory into autonomous machines.",
        "fundamentals": [
            "Electromechanical Actuators & Motor Drives", "Classical & Modern Control Theory (PID, State-Space)", "Robot Kinematics & Inverse Dynamics",
            "Embedded Microcontrollers & RTOS", "Digital Signal Processing & Sensor Interfacing", "Power Electronics & H-Bridges", "Applied Computer Vision"
        ],
        "methods": [
            "Simultaneous Localization and Mapping (SLAM)", "Robot Trajectory Generation & Motion Planning", "Multi-Sensor Fusion (Kalman Filtering)",
            "Real-Time Hardware Interfacing (SPI, I2C, CAN)", "PLC Industrial Automation Ladder Logic", "Closed-Loop Servo Tuning"
        ],
        "software": [
            "ROS / ROS 2", "MATLAB", "Simulink", "Gazebo Simulator", "SolidWorks",
            "OpenCV", "Embedded C/C++", "Python", "Linux (Ubuntu)", "Arduino / STM32 / ESP32", "Git"
        ],
        "standards": [
            "ISO 10218-1/2 (Industrial Robot Safety)", "ISO/TS 15066 (Collaborative Robots - Cobots)",
            "IEC 61131-3 (Programmable Controllers / PLC Programming)", "CE Machinery Directive"
        ],
        "in_demand": [
            "Autonomous Mobile Robots (AMR) & Navigation Stack (Nav2)", "AI-Powered Robotic Grasping & Manipulation",
            "Human-Robot Collaboration & Cobot Workcells", "Edge Vision AI on NVIDIA Jetson", "Micro-Aerial Vehicle (Drone) Autonomy"
        ],
        "certifications": [
            "Certified Motion Control Specialist (A3 Robotics)", "Certified LabVIEW Associate / Developer (CLAD/CLD)",
            "FANUC / KUKA Industrial Robotics Programmer", "ROS 2 Developer Certificate"
        ],
        "clusters": [
            "Robotics Software & Navigation (ROS)", "Embedded Systems & Firmware", "Industrial Automation & PLCs",
            "Electro-Mechanical Mechanism Design", "Vision & Perception Systems"
        ],
        "roles": [
            {"name": "Robotics Software Engineer", "focus": ["ROS / ROS 2", "Autonomous Mobile Robots (AMR) & Navigation Stack (Nav2)", "Embedded C/C++", "Python", "Simultaneous Localization and Mapping (SLAM)"]},
            {"name": "Mechatronics Systems Design Engineer", "focus": ["Electromechanical Actuators & Motor Drives", "SolidWorks", "Embedded Microcontrollers & RTOS", "Power Electronics & H-Bridges", "Closed-Loop Servo Tuning"]},
            {"name": "Automation & Controls Engineer", "focus": ["Classical & Modern Control Theory (PID, State-Space)", "PLC Industrial Automation Ladder Logic", "IEC 61131-3 (Programmable Controllers / PLC Programming)", "MATLAB", "Simulink"]},
            {"name": "Robotics Perception & Vision Engineer", "focus": ["Applied Computer Vision", "OpenCV", "Multi-Sensor Fusion (Kalman Filtering)", "Edge Vision AI on NVIDIA Jetson", "Python"]},
            {"name": "Motion Control Specialist", "focus": ["Robot Kinematics & Inverse Dynamics", "Robot Trajectory Generation & Motion Planning", "Closed-Loop Servo Tuning", "MATLAB", "ISO 10218-1/2 (Industrial Robot Safety)"]},
            {"name": "Embedded Firmware Robotics Engineer", "focus": ["Embedded C/C++", "Embedded Microcontrollers & RTOS", "Real-Time Hardware Interfacing (SPI, I2C, CAN)", "Linux (Ubuntu)", "Git"]}
        ],
        "proof": "a documented ROS 2 workspace running in Gazebo simulation with Nav2 autonomous navigation and sensor fusion, a physical STM32 closed-loop brushless motor controller, or a certified PLC industrial workcell simulation"
    }
}

def generate_benchmark_summary():
    """Generate metadata for deterministic simulated benchmark profile pools."""
    domains_meta = {}
    total_records = 0
    for slug, d in DOMAINS.items():
        size = d["benchmark_size"]
        total_records += size
        domains_meta[slug] = {
            "domain_name": d["name"],
            "benchmark_candidates": size,
            "regional_distribution": {"India": round(size * 0.55), "Global": round(size * 0.45)},
            "tier_distribution": {"Tier 1": round(size * 0.18), "Tier 2": round(size * 0.45), "Tier 3": round(size * 0.37)},
            "score_deciles": {
                "top_1%": 93.5, "top_5%": 87.2, "top_10%": 82.0, "top_25%": 74.5,
                "median_50%": 63.8, "bottom_25%": 51.2, "bottom_10%": 41.5
            },
            "clusters": d["clusters"],
            "roles": [r["name"] for r in d["roles"]]
        }
    return {
        "dataset_name": "Engineering Simulated Benchmark Profile Pools",
        "description": "650,000 deterministically generated simulated profiles across 12 disciplines (100,000 for Mechanical, 50,000 each for other 11 domains). These are not real or anonymized applicant records.",
        "total_benchmark_records": total_records,
        "synthetic_profiles": True,
        "pii_redacted": False,
        "domains": domains_meta
    }

def generate_css():
    return """
:root {
  --bg-primary: #060d13;
  --bg-secondary: #0c1822;
  --bg-card: rgba(16, 32, 45, 0.75);
  --bg-card-hover: rgba(22, 44, 62, 0.9);
  --border: rgba(64, 180, 210, 0.18);
  --border-focus: rgba(0, 242, 254, 0.55);
  --accent: #00f2fe;
  --accent-glow: rgba(0, 242, 254, 0.25);
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  --text-main: #f0f9ff;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --font: 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-heading: 'Manrope', system-ui, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  -webkit-text-size-adjust: 100%;
}
body {
  background: radial-gradient(circle at 50% -10%, #0d2838 0%, var(--bg-primary) 55%);
  color: var(--text-main);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
a { color: var(--accent); text-decoration: none; transition: all .2s; }
a:hover { text-decoration: underline; }
header, main, footer { max-width: 1240px; margin: 0 auto; padding: 24px 20px; }

/* Navigation */
.nav-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; background: rgba(12, 24, 34, 0.65); backdrop-filter: blur(14px);
  border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 28px;
}
.brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #fff; text-decoration: none; }
.brand-dot { color: var(--accent); }
.nav-links { display: flex; gap: 18px; font-size: 0.92rem; align-items: center; flex-wrap: wrap; }
.nav-badge { background: rgba(0, 242, 254, 0.1); color: var(--accent); border: 1px solid var(--border-focus); padding: 4px 10px; border-radius: 99px; font-weight: 700; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }

/* Hero */
.hero { text-align: center; padding: 36px 10px 24px; }
.eyebrow { color: var(--accent); font-weight: 800; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 12px; }
h1 { font-family: var(--font-heading); font-size: clamp(2rem, 5.5vw, 3.8rem); line-height: 1.14; font-weight: 800; margin-bottom: 18px; color: #fff; letter-spacing: -0.02em; }
.lead { max-width: 840px; margin: 0 auto 28px; color: var(--text-muted); font-size: 1.12rem; line-height: 1.65; }
.hero-cta { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  color: #051821; font-weight: 800; padding: 13px 24px; border-radius: var(--radius-sm);
  border: 0; cursor: pointer; font-size: 0.96rem; min-height: 44px; transition: transform .15s, box-shadow .2s;
  text-decoration: none; user-select: none;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--accent-glow); text-decoration: none; }
.btn:active { transform: translateY(0); }
.btn-secondary {
  background: rgba(255, 255, 255, 0.05); color: var(--text-main); border: 1px solid var(--border);
}
.btn-secondary:hover { background: rgba(255, 255, 255, 0.1); border-color: var(--accent); box-shadow: none; }
.btn-sm { padding: 8px 14px; font-size: 0.84rem; min-height: 36px; }

/* Cards & Layout */
.card {
  background: var(--bg-card); backdrop-filter: blur(16px);
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 24px; transition: border-color .2s, box-shadow .2s;
}
.card:hover { border-color: rgba(0, 242, 254, 0.35); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

/* Process Stepper */
.workflow-stepper { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 28px 0; }
.step-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; position: relative; }
.step-num { font-size: 1.4rem; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
.step-label { font-size: 0.88rem; color: var(--text-muted); font-weight: 600; }

/* Assessment Desk */
.desk-container { margin-top: 32px; border: 1px solid var(--border-focus); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4); }
.desk-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--border); margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.domain-select-wrap { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
.domain-select-wrap label { font-weight: 700; color: var(--accent); min-width: 140px; }

/* Inputs with iOS Zoom Prevention (16px) */
select, input[type="text"], textarea {
  width: 100%; padding: 12px 14px; background: #07131d; border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-main); font-family: inherit; font-size: 16px;
  transition: border-color .2s;
}
select:focus, input[type="text"]:focus, textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

/* Mode Switch Tabs */
.mode-toggle { display: grid; grid-template-columns: 1fr 1fr; background: #07131d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 4px; margin-bottom: 24px; gap: 4px; }
.mode-btn {
  padding: 12px 14px; background: transparent; border: 0; color: var(--text-muted);
  font-weight: 700; font-size: 0.94rem; min-height: 44px; border-radius: 6px; cursor: pointer; transition: all .2s;
  display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center;
}
.mode-btn.active { background: linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.1)); color: #fff; border: 1px solid var(--border-focus); }

/* Upload Area (Tappable on mobile) */
.dropzone {
  border: 2px dashed var(--border); border-radius: var(--radius-md); padding: 32px 20px; text-align: center;
  background: rgba(0, 242, 254, 0.02); transition: all .2s; cursor: pointer; margin-bottom: 18px;
}
.dropzone:hover, .dropzone.dragover { border-color: var(--accent); background: rgba(0, 242, 254, 0.06); }
.dropzone-icon { font-size: 2.2rem; margin-bottom: 10px; color: var(--accent); }
.file-status { margin-top: 10px; font-weight: 600; color: var(--accent-emerald); font-size: 0.92rem; }

/* Skill Category Pills */
.skill-category-title { font-size: 0.86rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); font-weight: 800; margin: 18px 0 10px; }
.skill-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.skill-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
  background: #081622; border: 1px solid var(--border); border-radius: 99px;
  color: var(--text-muted); font-size: 0.88rem; cursor: pointer; user-select: none; transition: all .15s;
  min-height: 38px;
}
.skill-pill:hover { border-color: var(--accent); color: var(--text-main); }
.skill-pill input { display: none; }
.skill-pill.selected { background: rgba(0, 242, 254, 0.18); border-color: var(--accent); color: #fff; font-weight: 700; box-shadow: 0 0 10px rgba(0, 242, 254, 0.25); }

/* Software Sliders */
.slider-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin: 16px 0; }
.slider-item { background: #07131d; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.slider-header { display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 700; margin-bottom: 6px; }
input[type="range"] {
  width: 100%; height: 32px; accent-color: var(--accent); cursor: pointer;
}

/* Results Section */
.results-container { margin-top: 40px; animation: fadeIn .4s ease-out; }
.score-overview {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;
}
.score-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 20px; text-align: center; position: relative; overflow: hidden;
}
.score-card.highlight { border-color: var(--accent); background: linear-gradient(145deg, rgba(0,242,254,0.08), var(--bg-card)); }
.score-card span { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 6px; }
.score-val { font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent); line-height: 1; margin-bottom: 6px; }
.score-card small { font-size: 0.8rem; color: var(--text-dim); }

/* Responsive Canvas Charts */
.charts-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px; margin-bottom: 24px; }
.chart-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; overflow: hidden; }
.chart-title { font-size: 1.05rem; font-weight: 800; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
canvas { width: 100% !important; max-width: 100%; height: auto !important; display: block; }

/* Role Match List */
.role-match-card {
  background: #081622; border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 14px 18px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 14px;
}
.role-match-info strong { display: block; font-size: 1rem; color: #fff; margin-bottom: 4px; }
.role-match-info small { color: var(--text-muted); font-size: 0.84rem; }
.role-badge { font-size: 1.05rem; font-weight: 800; color: var(--accent-emerald); white-space: nowrap; }

/* Skill Gap Matrix */
.gap-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 6px; font-size: 0.84rem; font-weight: 600; margin: 3px; }
.gap-tag.met { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.gap-tag.missing { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
.gap-tag.in-demand { background: rgba(0, 242, 254, 0.15); color: var(--accent); border: 1px solid rgba(0, 242, 254, 0.4); }

/* Career Simulator */
.simulator-box { background: linear-gradient(145deg, rgba(0, 242, 254, 0.05), #0a1924); border: 1px solid var(--border-focus); border-radius: var(--radius-md); padding: 24px; margin-top: 24px; }
.sim-controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 18px 0; }
.sim-control { background: #07131d; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; }
.sim-control label { font-size: 0.82rem; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 8px; }
.sim-stepper { display: flex; align-items: center; justify-content: center; gap: 10px; }
.sim-btn {
  width: 42px; height: 42px; border-radius: 8px; background: #162c3e; border: 1px solid var(--border);
  color: #fff; font-size: 1.25rem; cursor: pointer; font-weight: bold; min-height: 42px; min-width: 42px;
  display: flex; align-items: center; justify-content: center;
}
.sim-btn:hover { background: var(--accent); color: #000; }
.sim-val { font-size: 1.15rem; font-weight: 800; min-width: 28px; }
.sim-impact { background: #071520; border-left: 4px solid var(--accent); padding: 14px 18px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.95rem; }

/* Peer Benchmark & Recruiter Sandbox Tables */
.table-responsive {
  width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 14px;
  border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.mobile-table-hint {
  display: none; font-size: 0.8rem; color: var(--accent); margin: 6px 0; font-weight: 600;
}
.benchmark-table { width: 100%; min-width: 660px; border-collapse: collapse; font-size: 0.88rem; text-align: left; }
.benchmark-table th { background: #081622; color: var(--accent); padding: 12px 14px; font-weight: 700; border-bottom: 1px solid var(--border); white-space: nowrap; }
.benchmark-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); color: var(--text-main); }
.benchmark-table tr:hover td { background: rgba(0, 242, 254, 0.04); }
.benchmark-table tr.user-row td { background: rgba(0, 242, 254, 0.12); border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent); font-weight: 700; color: #fff; }
.standing-badge { padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; white-space: nowrap; }
.standing-badge.ahead { background: rgba(244, 63, 94, 0.2); color: #fb7185; }
.standing-badge.peer { background: rgba(0, 242, 254, 0.2); color: var(--accent); }
.standing-badge.behind { background: rgba(16, 185, 129, 0.2); color: #34d399; }

/* 7-Day Sprint Plan */
.sprint-list { list-style: none; margin-top: 14px; }
.sprint-item { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.sprint-day { background: var(--accent); color: #051a24; font-weight: 800; font-size: 0.8rem; padding: 4px 10px; border-radius: 6px; height: fit-content; white-space: nowrap; }

/* Utility */
.hide { display: none !important; }
.text-accent { color: var(--accent); }
.muted { color: var(--text-muted); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* =========================================================
   PHONE & TABLET OPTIMIZATION MEDIA QUERIES
   ========================================================= */

/* Tablet & Mobile (<=960px) */
@media (max-width: 960px) {
  .charts-grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .nav-bar { flex-direction: column; gap: 12px; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
}

/* Smartphone Portrait & Landscape (<=768px) */
@media (max-width: 768px) {
  header, main, footer { padding: 16px 14px; }
  .mobile-table-hint { display: block; }
  .score-overview { grid-template-columns: 1fr 1fr; gap: 10px; }
  .sim-controls { grid-template-columns: 1fr 1fr; }
  .hero { padding: 24px 6px 16px; }
  .hero-cta { flex-direction: column; }
  .hero-cta .btn { width: 100%; }
}

/* Dedicated Smartphone Small Screens (<=640px) */
@media (max-width: 640px) {
  header, main, footer { padding: 12px 10px; }
  
  /* Compact Mobile Nav */
  .nav-bar { padding: 12px 14px; margin-bottom: 20px; }
  .brand { justify-content: center; font-size: 1.1rem; }
  .nav-links { justify-content: center; gap: 8px 12px; font-size: 0.82rem; }
  
  /* Hero typography */
  h1 { font-size: clamp(1.75rem, 6.8vw, 2.6rem); line-height: 1.16; margin-bottom: 14px; }
  .lead { font-size: 1rem; margin-bottom: 20px; }

  /* Swipeable Horizontal Workflow Stepper */
  .workflow-stepper {
    display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch; gap: 8px; padding-bottom: 8px; margin: 18px 0;
  }
  .step-item {
    min-width: 140px; flex: 0 0 140px; scroll-snap-align: start; padding: 12px;
  }
  .step-num { font-size: 1.2rem; }
  .step-label { font-size: 0.82rem; }

  /* Desk Card */
  .desk-container { padding: 16px 12px; margin-top: 18px; }
  .desk-header { flex-direction: column; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
  .domain-select-wrap { flex-direction: column; align-items: stretch; gap: 6px; }
  .domain-select-wrap label { min-width: unset; font-size: 0.86rem; }
  
  /* Mode buttons */
  .mode-btn { padding: 10px 8px; font-size: 0.84rem; min-height: 44px; }

  /* Dropzone touch padding */
  .dropzone { padding: 22px 12px; }
  .dropzone-icon { font-size: 1.8rem; }

  /* Skill Pills */
  .skill-pill { padding: 8px 12px; font-size: 0.82rem; min-height: 38px; }
  
  /* Demographics grid */
  .grid-4 { grid-template-columns: 1fr 1fr; gap: 10px; }
  
  /* Run Assessment Button */
  #run-assessment-btn { width: 100%; min-height: 50px; font-size: 1.02rem; padding: 14px 20px; }

  /* Scorecard 2x2 layout on mobile */
  .score-overview { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .score-card { padding: 14px 8px; }
  .score-val { font-size: 1.7rem; }
  .score-card span { font-size: 0.74rem; }

  /* Charts */
  .chart-box { padding: 14px 10px; }
  
  /* Role match card */
  .role-match-card { flex-direction: column; align-items: flex-start; gap: 8px; }
  
  /* Career simulator */
  .simulator-box { padding: 16px 12px; }
  .sim-controls { grid-template-columns: 1fr 1fr; gap: 8px; }
  .sim-btn { width: 44px; height: 44px; font-size: 1.3rem; }

  /* Sprint plan */
  .sprint-item { flex-direction: column; gap: 6px; }

  /* Domain directory */
  .grid-3 { grid-template-columns: 1fr; }
}

/* Extra Narrow Phones (<=360px) */
@media (max-width: 360px) {
  .grid-4, .score-overview, .sim-controls, .mode-toggle { grid-template-columns: 1fr; }
}
"""

def shell_page(title, description, body_content, canonical, active_slug=""):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="{canonical}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <style>{generate_css()}</style>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "{title}",
    "url": "{canonical}",
    "description": "{description}",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "isAccessibleForFree": true,
    "offers": {{ "@type": "Offer", "price": "0", "priceCurrency": "USD" }}
  }}
  </script>
</head>
<body>
  <header>
    <nav class="nav-bar">
      <a class="brand" href="index.html">
        <span>Engineering Desk<span class="brand-dot">.ai</span></span>
      </a>
      <div class="nav-links">
        <a href="index.html#desk">Career Assessment</a>
        <a href="methodology.html">Simulated Benchmark & Privacy</a>
        <a href="../index.html">MechIntel Core</a>
        <span class="nav-badge">Browser-based</span>
      </div>
    </nav>
  </header>
  <main>
    {body_content}
  </main>
  <footer>
    <div style="border-top: 1px solid var(--border); padding-top: 24px; margin-top: 48px; text-align: center; color: var(--text-dim); font-size: 0.88rem;">
      <p>Engineering Career Intelligence Desk · Client-side assessment with simulated benchmark profiles.</p>
      <p style="margin-top: 6px;">Benchmark counts describe deterministic simulated profiles, not real applicants or anonymized records. Resume text is processed in your browser and is not sent to a MechIntel backend.</p>
      <p style="margin-top: 8px;"><a href="methodology.html">Read Full Benchmark & Privacy Methodology</a> | <a href="../sitemap.xml">Sitemap</a> | <a href="../llms.txt">llms.txt</a></p>
    </div>
  </footer>
</body>
</html>
"""

def generate_hub_html():
    domain_options = "".join(f'<option value="{s}">{d["name"]} ({d["benchmark_size"]:,} simulated profiles)</option>' for s, d in DOMAINS.items())
    domain_cards = "".join(f'''
    <a class="card" href="{s}.html" style="display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <span class="eyebrow">{d["authority"]}</span>
        <h3 style="font-size:1.25rem; margin:6px 0 10px; color:#fff;">{d["name"]}</h3>
        <p class="muted" style="font-size:0.92rem; margin-bottom:14px;">{d["intro"]}</p>
        <div style="margin-bottom:12px;">
          <small style="color:var(--accent); font-weight:700;">Top In-Demand Skills:</small>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            {"".join(f'<span class="gap-tag in-demand" style="font-size:0.75rem;">{sk}</span>' for sk in d["in_demand"][:3])}
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px; margin-top:8px;">
        <span style="font-size:0.8rem; color:var(--accent-emerald); font-weight:700;">{d["benchmark_size"]:,} Simulated Profiles</span>
        <span style="color:var(--accent); font-weight:700; font-size:0.88rem;">Explore Guide →</span>
      </div>
    </a>
    ''' for s, d in DOMAINS.items())

    body = f'''
    <section class="hero">
      <p class="eyebrow">Free Browser-Based Engineering Career Assessment</p>
      <h1>Engineering Career Intelligence Desk</h1>
      <p class="lead">
        Analyze your resume or select demonstrable skills across 12 engineering domains. Compare your role alignment against <strong>650,000 deterministically simulated profiles</strong> (100,000 Mechanical and 50,000 each for 11 other fields), visualize skill gaps, and plan career moves. These profiles are not real applicants.
      </p>
      <div class="hero-cta">
        <a class="btn" href="#desk">Start Free Assessment</a>
        <a class="btn btn-secondary" href="methodology.html">View Benchmark Methodology</a>
      </div>
    </section>

    <!-- Swipeable Workflow Stepper on Phone -->
    <div class="workflow-stepper">
      <div class="step-item"><div class="step-num">01</div><div class="step-label">Resume / Skills</div><small class="muted">Upload PDF or pick skills</small></div>
      <div class="step-item"><div class="step-num">02</div><div class="step-label">Role Alignment</div><small class="muted">Match specialized roles</small></div>
      <div class="step-item"><div class="step-num">03</div><div class="step-label">50k+ Cohort Rank</div><small class="muted">Global & tier percentiles</small></div>
      <div class="step-item"><div class="step-num">04</div><div class="step-label">Radar Visuals</div><small class="muted">6-axis competency map</small></div>
      <div class="step-item"><div class="step-num">05</div><div class="step-label">Weekly Action</div><small class="muted">7-day portfolio sprint</small></div>
    </div>

    <!-- MAIN INTERACTIVE DESK -->
    <section id="desk" class="card desk-container">
      <div class="desk-header">
        <div>
          <span class="eyebrow">Interactive Diagnostic</span>
          <h2 style="font-size:1.6rem; color:#fff;">Evaluate Your Market Standing</h2>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="reset-desk-btn" class="btn btn-secondary btn-sm" type="button">Reset All</button>
        </div>
      </div>

      <!-- Domain Selector -->
      <div class="domain-select-wrap">
        <label for="domain-select">Target Engineering Field:</label>
        <select id="domain-select">
          {domain_options}
        </select>
      </div>

      <!-- Assessment Mode Switcher -->
      <div class="mode-toggle">
        <button id="tab-resume" class="mode-btn active" type="button" onclick="window.switchMode('resume')">
          📄 Resume Assessment (PDF/TXT)
        </button>
        <button id="tab-skills" class="mode-btn" type="button" onclick="window.switchMode('skills')">
          ⚡ Skill-Based Assessment (Interactive)
        </button>
      </div>

      <!-- MODE 1: RESUME UPLOAD & PARSER -->
      <div id="panel-resume" class="mode-panel">
        <div id="resume-dropzone" class="dropzone">
          <div class="dropzone-icon">📥</div>
          <h3 style="font-size:1.15rem; color:#fff; margin-bottom:4px;">Tap or Drop Engineering Resume</h3>
          <p class="muted" style="font-size:0.9rem;">Supports PDF or TXT. Extracted locally via PDF.js. Zero data is uploaded.</p>
          <input id="resume-file-input" type="file" accept=".pdf,.txt,text/plain,application/pdf" style="display:none;">
          <button class="btn btn-secondary btn-sm" style="margin-top:14px;" type="button" onclick="document.getElementById('resume-file-input').click()">
            Browse File
          </button>
          <div id="file-status" class="file-status hide"></div>
        </div>

        <label for="resume-paste-area" style="font-weight:700; font-size:0.88rem; color:var(--text-muted); display:block; margin-bottom:6px;">
          Or paste resume experience, projects, tools and coursework:
        </label>
        <textarea id="resume-paste-area" rows="6" placeholder="Paste full resume text here. E.g., B.Tech graduate, experienced with CAD modeling, simulation, GD&T tolerancing, completed 2 industry internships..."></textarea>
      </div>

      <!-- MODE 2: SKILL & PROFILE PICKER -->
      <div id="panel-skills" class="mode-panel hide">
        <p class="muted" style="font-size:0.92rem; margin-bottom:12px;">
          Select skills and tools you can substantiate with an academic project, thesis, internship, or verified portfolio work.
        </p>

        <!-- Quick Selection Buttons for Mobile -->
        <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
          <button id="btn-quick-core" type="button" class="btn btn-secondary btn-sm">⚡ Select Core Foundations</button>
          <button id="btn-clear-skills" type="button" class="btn btn-secondary btn-sm">🧹 Clear Selection</button>
        </div>

        <!-- Search / Filter -->
        <input id="skill-search-input" type="text" placeholder="🔍 Search domain skills, software, codes..." style="margin-bottom:16px;">

        <!-- Categories populated dynamically -->
        <div id="skill-categories-container"></div>

        <!-- Software proficiency sliders -->
        <div style="margin-top:20px;">
          <div class="skill-category-title">Core Software & Computational Proficiency (0% - 100%)</div>
          <div id="software-sliders-container" class="slider-grid"></div>
        </div>
      </div>

      <!-- Background Demographics for Contextual Benchmark -->
      <div style="border-top:1px solid var(--border); padding-top:18px; margin-top:22px;">
        <span class="skill-category-title">Peer Benchmark Context (Optional)</span>
        <div class="grid-4" style="margin-top:8px;">
          <div>
            <label for="user-region" style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Region:</label>
            <select id="user-region" style="margin-top:4px;">
              <option value="Global">Global (Worldwide)</option>
              <option value="India">India</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
            </select>
          </div>
          <div>
            <label for="user-tier" style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">College / Univ Tier:</label>
            <select id="user-tier" style="margin-top:4px;">
              <option value="Tier 1">Tier 1 (IIT/NIT/MIT/Ivy/Top Global)</option>
              <option value="Tier 2" selected>Tier 2 (Accredited State/Regional Top)</option>
              <option value="Tier 3">Tier 3 (Local / Affiliated Colleges)</option>
            </select>
          </div>
          <div>
            <label for="user-degree" style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Degree Level:</label>
            <select id="user-degree" style="margin-top:4px;">
              <option value="B.Tech/B.S." selected>B.Tech / B.S. / B.E.</option>
              <option value="M.Tech/M.S.">M.Tech / M.S.</option>
              <option value="Ph.D.">Ph.D. / Doctorate</option>
            </select>
          </div>
          <div>
            <label for="user-projects" style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Projects Count:</label>
            <select id="user-projects" style="margin-top:4px;">
              <option value="1">1 Project</option>
              <option value="2" selected>2 Projects</option>
              <option value="3">3 Projects</option>
              <option value="4">4+ Projects</option>
            </select>
          </div>
        </div>
      </div>

      <div style="margin-top:26px; text-align:center;">
        <button id="run-assessment-btn" class="btn" style="min-width:280px; padding:15px 32px; font-size:1.05rem;" type="button">
          Compute Benchmark Ranking & Skills
        </button>
      </div>
    </section>

    <!-- RESULTS DISPLAY SECTION (Revealed upon calculation) -->
    <section id="results-panel" class="results-container hide">
      
      <!-- Key Scores (2x2 on phones) -->
      <div class="score-overview">
        <div class="score-card highlight">
          <span>Market Readiness</span>
          <div id="res-readiness-score" class="score-val">0</div>
          <small>Calibrated index out of 100</small>
        </div>
        <div class="score-card">
          <span>Global Domain Standing</span>
          <div id="res-global-rank" class="score-val" style="color:#fff;">—</div>
          <small id="res-global-pct">0th percentile · Top 100%</small>
        </div>
        <div class="score-card">
          <span>Peer Tier Standing</span>
          <div id="res-tier-rank" class="score-val" style="color:var(--accent-emerald);">—</div>
          <small id="res-tier-pct">Among college tier peers</small>
        </div>
        <div class="score-card">
          <span>Specialty Cluster</span>
          <div id="res-cluster-rank" class="score-val" style="color:var(--accent-amber);">—</div>
          <small id="res-cluster-name">Domain specialty cohort</small>
        </div>
      </div>

      <!-- Visual Charts Grid: Radar & Bell Curve (Responsive) -->
      <div class="charts-grid">
        <div class="chart-box">
          <div class="chart-title">
            <span>6-Axis Competency Profile</span>
            <small style="font-size:0.8rem; color:var(--text-dim);">Profile vs Industry Ideal</small>
          </div>
          <canvas id="radarChartCanvas"></canvas>
        </div>
        <div class="chart-box">
          <div class="chart-title">
            <span>Benchmark Distribution Curve</span>
            <small id="dist-curve-subtitle" style="font-size:0.8rem; color:var(--text-dim);">Cohort Distribution</small>
          </div>
          <canvas id="distributionCanvas"></canvas>
        </div>
      </div>

      <!-- Interactive Peer Candidate Comparison Table -->
      <div class="card" style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:8px;">
          <div>
            <span class="eyebrow">Peer Standing Comparison</span>
            <h3 style="font-size:1.25rem; color:#fff;">Simulated Profiles in Your Score Bracket</h3>
          </div>
          <span id="peer-cohort-badge" class="nav-badge">Simulated pool: 50,000 profiles</span>
        </div>
        <p class="muted" style="font-size:0.9rem;">
          Compare your readiness standing with deterministically simulated profiles near your score. The benchmark is a model, not a collection of real or anonymized applicants.
        </p>
        <div class="mobile-table-hint">📱 Swipe table horizontally to inspect peer details →</div>

        <div class="table-responsive">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>Global Rank</th>
                <th>Candidate ID</th>
                <th>Academic Status</th>
                <th>Region</th>
                <th>Specialty Cluster</th>
                <th>Key Demonstrated Skills</th>
                <th>Score</th>
                <th>Standing</th>
              </tr>
            </thead>
            <tbody id="peer-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- Role Matches & Skill Gaps -->
      <div class="grid-2">
        <div class="card">
          <h3 style="font-size:1.2rem; color:#fff; margin-bottom:14px;">🎯 Matched Specialized Roles</h3>
          <div id="role-matches-list"></div>
        </div>
        <div class="card">
          <h3 style="font-size:1.2rem; color:#fff; margin-bottom:14px;">🔍 Skill Gap & In-Demand Matrix</h3>
          
          <div style="margin-bottom:14px;">
            <span style="font-size:0.84rem; font-weight:700; color:var(--accent-emerald); display:block; margin-bottom:6px;">
              ✅ Demonstrated Foundations & Tools:
            </span>
            <div id="met-skills-tags"></div>
          </div>

          <div style="margin-bottom:14px;">
            <span style="font-size:0.84rem; font-weight:700; color:var(--accent); display:block; margin-bottom:6px;">
              🚀 2025-2026 In-Demand High Leverage Skills:
            </span>
            <div id="indemand-skills-tags"></div>
          </div>

          <div>
            <span style="font-size:0.84rem; font-weight:700; color:var(--accent-rose); display:block; margin-bottom:6px;">
              ⚠️ Critical Gaps to Unlock Top Tier:
            </span>
            <div id="missing-skills-tags"></div>
          </div>
        </div>
      </div>

      <!-- Recruiter Talent Pool Filter Sandbox -->
      <div class="card" style="margin-top:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
          <div>
            <span class="eyebrow">Recruiter Benchmark Sandbox</span>
            <h3 style="font-size:1.25rem; color:#fff;">Explore the Simulated Profile Pool</h3>
          </div>
          <span id="recruiter-match-counter" style="color:var(--accent); font-weight:700; font-size:0.92rem;">Filter to explore</span>
        </div>
        <div class="grid-4" style="margin-bottom:16px;">
          <div>
            <label style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Min Score: <span id="recruiter-score-val" style="color:var(--accent);">70</span></label>
            <input id="recruiter-score-slider" type="range" min="40" max="95" value="70" style="margin-top:6px;">
          </div>
          <div>
            <label style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Region Filter:</label>
            <select id="recruiter-region-filter" style="margin-top:6px;">
              <option value="All">All Regions</option>
              <option value="Global">Global Only</option>
              <option value="India">India Only</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Tier Filter:</label>
            <select id="recruiter-tier-filter" style="margin-top:6px;">
              <option value="All">All Tiers</option>
              <option value="Tier 1">Tier 1 Only</option>
              <option value="Tier 2">Tier 2 Only</option>
              <option value="Tier 3">Tier 3 Only</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Specialty Cluster:</label>
            <select id="recruiter-cluster-filter" style="margin-top:6px;">
              <option value="All">All Clusters</option>
            </select>
          </div>
        </div>

        <div class="mobile-table-hint">📱 Swipe table horizontally to inspect candidates →</div>
        <div class="table-responsive">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>Candidate ID</th>
                <th>Academic Status</th>
                <th>Specialty Cluster</th>
                <th>Score</th>
                <th>Simulated Action</th>
              </tr>
            </thead>
            <tbody id="recruiter-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- Career Move Simulator -->
      <div class="simulator-box">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <span class="eyebrow">Real-Time Growth Engine</span>
            <h3 style="font-size:1.25rem; color:#fff;">Simulate Your Next Career Moves</h3>
          </div>
          <button id="sim-reset-btn" class="btn btn-secondary btn-sm" type="button">Reset Additions</button>
        </div>
        <p class="muted" style="font-size:0.9rem; margin-top:4px;">
          See how tangible additions (projects, internships, industry certs, software) directly shift your readiness score and market rank:
        </p>
        
        <div class="sim-controls">
          <div class="sim-control">
            <label>Add Proven Project</label>
            <div class="sim-stepper">
              <button class="sim-btn" type="button" onclick="window.adjustSim('projects', -1)">-</button>
              <span id="sim-val-projects" class="sim-val">0</span>
              <button class="sim-btn" type="button" onclick="window.adjustSim('projects', 1)">+</button>
            </div>
          </div>
          <div class="sim-control">
            <label>Add Internship</label>
            <div class="sim-stepper">
              <button class="sim-btn" type="button" onclick="window.adjustSim('internships', -1)">-</button>
              <span id="sim-val-internships" class="sim-val">0</span>
              <button class="sim-btn" type="button" onclick="window.adjustSim('internships', 1)">+</button>
            </div>
          </div>
          <div class="sim-control">
            <label>Add Industry Cert</label>
            <div class="sim-stepper">
              <button class="sim-btn" type="button" onclick="window.adjustSim('certs', -1)">-</button>
              <span id="sim-val-certs" class="sim-val">0</span>
              <button class="sim-btn" type="button" onclick="window.adjustSim('certs', 1)">+</button>
            </div>
          </div>
          <div class="sim-control">
            <label>Raise Software +15%</label>
            <div class="sim-stepper">
              <button class="sim-btn" type="button" onclick="window.adjustSim('software', -15)">-</button>
              <span id="sim-val-software" class="sim-val">0%</span>
              <button class="sim-btn" type="button" onclick="window.adjustSim('software', 15)">+</button>
            </div>
          </div>
        </div>

        <div class="sim-impact">
          <strong style="color:#fff;">Simulated Impact:</strong>
          <span id="sim-impact-text" style="margin-left:8px; color:var(--accent);">No additions selected.</span>
        </div>
      </div>

      <!-- 7-Day Action Sprint -->
      <div class="card" style="margin-top:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="eyebrow">Actionable Opportunity Blueprint</span>
            <h3 style="font-size:1.25rem; color:#fff;">Your 7-Day Evidence Sprint</h3>
          </div>
          <button id="export-csv-btn" class="btn btn-secondary btn-sm" type="button">
            📥 Export Assessment (CSV)
          </button>
        </div>
        <p class="muted" style="font-size:0.92rem; margin-top:4px;">
          Transform your identified gap into a reviewable, verifiable engineering artifact this week.
        </p>

        <ul id="sprint-plan-list" class="sprint-list"></ul>
      </div>

    </section>

    <!-- 12 DOMAIN DIRECTORY -->
    <section style="margin-top:54px;">
      <div style="text-align:center; margin-bottom:28px;">
        <span class="eyebrow">Explore Engineering Disciplines</span>
        <h2 style="font-size:2rem; color:#fff;">Comprehensive Engineering Curricula & Skill Frameworks</h2>
        <p class="lead">Curated according to ABET criteria, national engineering societies, and high-demand industry specializations.</p>
      </div>
      <div class="grid-3">
        {domain_cards}
      </div>
    </section>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
    <script src="app.js"></script>
    '''
    return shell_page(
        "Free Engineering Career Assessment & Resume Skill Checker | MechIntel",
        "Free engineering career assessment across 12 fields. Check resume skills, explore role matches, and compare with a deterministic simulated benchmark. No real applicant records are used.",
        body,
        f"{BASE}/engineering-careers/"
    )

def generate_domain_page(slug, d):
    fundamentals = "".join(f'<li>{s}</li>' for s in d["fundamentals"])
    methods = "".join(f'<li>{s}</li>' for s in d["methods"])
    software = "".join(f'<span class="gap-tag met">{s}</span>' for s in d["software"])
    standards = "".join(f'<span class="gap-tag in-demand">{s}</span>' for s in d["standards"])
    in_demand = "".join(f'<span class="gap-tag in-demand" style="border-color:var(--accent);">{s}</span>' for s in d["in_demand"])
    
    roles_cards = "".join(f'''
    <div class="role-match-card">
      <div class="role-match-info">
        <strong>{r["name"]}</strong>
        <small>Key Competencies: {", ".join(r["focus"])}</small>
      </div>
    </div>
    ''' for r in d["roles"])

    body = f'''
    <section class="hero" style="text-align:left; padding:20px 0 30px;">
      <p class="eyebrow">{d["authority"]} Guideline · {d["benchmark_size"]:,} Simulated Profiles</p>
      <h1>{d["name"]} Career Intelligence</h1>
      <p class="lead">{d["intro"]}</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <a class="btn" href="index.html?domain={slug}#desk">Run Free {d["name"].split()[0]} Assessment ({d["benchmark_size"]:,} Pool)</a>
        <a class="btn btn-secondary" href="methodology.html">View Benchmark Methodology</a>
      </div>
    </section>

    <div class="grid-2" style="margin-bottom:24px;">
      <div class="card">
        <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">📚 Foundational Engineering Science</h3>
        <ul style="padding-left:20px; line-height:1.8;" class="muted">
          {fundamentals}
        </ul>
      </div>
      <div class="card">
        <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">⚙️ Core Engineering Methods & Analysis</h3>
        <ul style="padding-left:20px; line-height:1.8;" class="muted">
          {methods}
        </ul>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">💻 Industry-Standard Software & Computational Tools</h3>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        {software}
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:24px;">
      <div class="card">
        <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">📜 Regulatory Codes & Safety Standards</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          {standards}
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">🚀 2025-2026 Emerging In-Demand Specializations</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          {in_demand}
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h3 style="font-size:1.2rem; color:#fff; margin-bottom:12px;">🎯 Target Specialized Career Tracks</h3>
      <div class="grid-2">
        {roles_cards}
      </div>
    </div>

    <div class="card" style="margin-bottom:24px; border-left:4px solid var(--accent);">
      <h3 style="font-size:1.2rem; color:#fff; margin-bottom:8px;">🏆 The Gold Standard of Portfolio Proof</h3>
      <p class="muted" style="margin-bottom:12px;">
        Certificates validate knowledge, but demonstrated engineering proof wins interviews. For {d["name"]}, the definitive proof artifact is:
      </p>
      <div style="background:#07131d; padding:16px; border-radius:var(--radius-sm); border:1px solid var(--border);">
        <strong style="color:var(--accent); font-size:1.02rem;">{d["proof"]}</strong>
      </div>
    </div>

    <div class="card" style="text-align:center; padding:36px 20px;">
      <h3 style="font-size:1.4rem; color:#fff; margin-bottom:10px;">Ready to Audit Your {d["name"].split()[0]} Standing?</h3>
      <p class="muted" style="max-width:600px; margin:0 auto 20px;">
        Upload your resume or pick your skills to see where you rank among {d["benchmark_size"]:,} candidates in {d["name"]} and generate this week's evidence sprint.
      </p>
      <a class="btn" href="index.html?domain={slug}#desk">Launch {d["name"].split()[0]} Assessment →</a>
    </div>
    '''
    return shell_page(
        f"{d['name']} Skills, Roles & Career Intelligence",
        f"Authoritative guide to {d['name']} competencies, software, codes, emerging in-demand skills, and portfolio evidence according to {d['authority']}.",
        body,
        f"{BASE}/engineering-careers/{slug}.html",
        active_slug=slug
    )

def generate_methodology_html():
    body = '''
    <section class="hero" style="text-align:left; padding:20px 0 30px;">
      <p class="eyebrow">Integrity & Scientific Methodology</p>
      <h1>Engineering Benchmark & Scoring Methodology</h1>
      <p class="lead">
        This page explains the score formula and generated comparison pool. Benchmark profiles are deterministic simulations, not real or anonymized candidates. The assessment runs in your browser.
      </p>
    </section>

    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-size:1.35rem; color:#fff; margin-bottom:12px;">1. Simulated Benchmark Pool Sizes</h2>
      <p class="muted" style="margin-bottom:12px;">
        The displayed pool sizes are deterministic model sizes used to calculate relative ranks. They do not represent collected applicant records:
      </p>
      <ul style="padding-left:22px; line-height:1.8;" class="muted">
        <li><strong>Mechanical Engineering:</strong> Compared with a generated pool sized at <strong>100,000 simulated profiles</strong>.</li>
        <li><strong>11 Other Engineering Disciplines:</strong> Each uses a generated pool sized at <strong>50,000 simulated profiles</strong>.</li>
        <li><strong>Total Modeled Pool Size:</strong> 100,000 + (11 × 50,000) = <strong>650,000 simulated profiles across 12 pools</strong>.</li>
        <li><strong>Data source:</strong> Profiles are generated from fixed domain templates and a seeded random process; they are not sourced from people, resumes, surveys, or hiring records.</li>
      </ul>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-size:1.35rem; color:#fff; margin-bottom:12px;">2. Readiness Score Formula</h2>
      <p class="muted" style="margin-bottom:14px;">
        Rather than an unexplainable score, the Market Readiness Index is calculated via an explicit multi-factor weighted formula:
      </p>
      <div style="background:#07131d; padding:18px; border-radius:var(--radius-sm); border:1px solid var(--border); font-family:monospace; font-size:0.92rem; color:var(--accent); margin-bottom:16px;">
        Readiness = 20% academics + 45% skills/software + 35% practical evidence
      </div>
      <ul style="padding-left:22px; line-height:1.8;" class="muted">
        <li><strong>Academic & Institution Factor (20%):</strong> Combines the selected institution tier (60%) and degree level (40%), then weights that subtotal at 20%.</li>
        <li><strong>Technical & Software Coverage (45%):</strong> Combines the detected domain-skill score (55%) and software score (45%); this subtotal contributes 45% of readiness.</li>
        <li><strong>Practical Evidence Factor (35%):</strong> Capped at 100, this uses project count plus a fixed baseline; resume mode adds a small signal when internship language is detected. The text match does not verify work history.</li>
      </ul>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-size:1.35rem; color:#fff; margin-bottom:12px;">3. Percentile & Ranking Computation</h2>
      <p class="muted" style="margin-bottom:12px;">
        Every assessment evaluates your computed Readiness Score against a sorted seeded, simulated score pool:
      </p>
      <ul style="padding-left:22px; line-height:1.8;" class="muted">
        <li><strong>Global Domain Standing:</strong> Your rank within the generated pool size for the selected domain (50,000 or 100,000 simulated profiles).</li>
        <li><strong>Peer Tier Standing:</strong> Your rank among generated profiles assigned to the same university tier.</li>
        <li><strong>Specialty Cluster Standing:</strong> Your rank among specialists in your focus area (e.g. Aerodynamics vs Structural vs EV Powertrain).</li>
      </ul>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-size:1.35rem; color:#fff; margin-bottom:12px;">4. Browser-Based Resume Privacy</h2>
      <p class="muted" style="margin-bottom:12px;">
        The assessment is client-side:
      </p>
      <ul style="padding-left:22px; line-height:1.8;" class="muted">
        <li><strong>PDF parsing:</strong> Resume PDFs are parsed locally via Mozilla PDF.js. The assessment code does not send resume text to a MechIntel backend.</li>
        <li><strong>Network requests:</strong> Assessment inputs are processed in the browser. Your browser still requests the site and static assets from their hosting and CDN providers.</li>
        <li><strong>Browser storage:</strong> This assessment page does not save profiles to local storage or use a MechIntel account system. The main dashboard may save progress in browser storage.</li>
      </ul>
    </div>

    <div class="card" style="text-align:center; padding:28px 20px;">
      <h3 style="font-size:1.25rem; color:#fff; margin-bottom:10px;">Explore Your Engineering Career Profile</h3>
      <a class="btn" href="index.html#desk">Run the Free Browser-Based Assessment →</a>
    </div>
    '''
    return shell_page(
        "Engineering Readiness Score & Benchmark Methodology | MechIntel",
        "See how MechIntel calculates engineering readiness scores and compares profiles with generated benchmark cohorts. The cohort is simulated, not real or anonymized applicant data.",
        body,
        f"{BASE}/engineering-careers/methodology.html"
    )

def generate_app_js():
    """Generates the comprehensive, mobile-optimized client-side logic engine for engineering-careers/app.js."""
    domains_json = json.dumps(DOMAINS, ensure_ascii=False)
    
    return f"""/**
 * Engineering Career Intelligence Desk - Client Logic Engine
 * 100% Client-Side, Zero-Retention, Multi-Discipline Assessment & 50k/100k Benchmark Engine
 * Optimized for Mobile, Touch Ergonomics, and High-DPI Canvas Rendering
 */
(function() {{
  'use strict';

  const DOMAINS = {domains_json};
  let activeMode = 'resume';
  let extractedText = '';
  let currentDomainKey = 'mechanical';
  let simAdditions = {{ projects: 0, internships: 0, certs: 0, software: 0 }};
  let lastAssessment = null;
  let activeCohort = []; // Cached candidate records for active domain (50k / 100k)

  // Seeded LCG random generator for deterministic benchmark generation
  function createLCG(seed) {{
    let s = seed;
    return function() {{
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    }};
  }}

  // DOM Elements
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {{
    initDomain();
    initEventListeners();
    buildDomainCohort(currentDomainKey);
  }});

  function initDomain() {{
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain');
    if (domainParam && DOMAINS[domainParam]) {{
      currentDomainKey = domainParam;
      $('domain-select').value = domainParam;
    }}
    renderSkillModeUI();
    updateRecruiterClusterOptions();
  }}

  function initEventListeners() {{
    $('domain-select').addEventListener('change', (e) => {{
      currentDomainKey = e.target.value;
      renderSkillModeUI();
      updateRecruiterClusterOptions();
      buildDomainCohort(currentDomainKey);
      if (lastAssessment) {{
        runAssessment();
      }}
    }});

    // Drag and drop / Tap for resume file
    const dropzone = $('resume-dropzone');
    const fileInput = $('resume-file-input');

    // On mobile & desktop, tap anywhere on the dropzone card to select file
    dropzone.addEventListener('click', (e) => {{
      if (e.target !== fileInput) fileInput.click();
    }});

    ['dragenter', 'dragover'].forEach(eventName => {{
      dropzone.addEventListener(eventName, (e) => {{
        e.preventDefault();
        dropzone.classList.add('dragover');
      }}, false);
    }});

    ['dragleave', 'drop'].forEach(eventName => {{
      dropzone.addEventListener(eventName, (e) => {{
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }}, false);
    }});

    dropzone.addEventListener('drop', (e) => {{
      const files = e.dataTransfer.files;
      if (files.length) handleFile(files[0]);
    }});

    fileInput.addEventListener('change', (e) => {{
      if (e.target.files.length) handleFile(e.target.files[0]);
    }});

    $('run-assessment-btn').addEventListener('click', runAssessment);
    $('reset-desk-btn').addEventListener('click', resetDesk);
    $('sim-reset-btn').addEventListener('click', resetSim);
    $('export-csv-btn').addEventListener('click', exportCSV);

    // Quick selection buttons in skill mode
    $('btn-quick-core').addEventListener('click', selectCoreFoundations);
    $('btn-clear-skills').addEventListener('click', clearSkillsSelection);

    // Live search filter in skill mode
    $('skill-search-input').addEventListener('input', (e) => {{
      const q = e.target.value.toLowerCase().trim();
      $$('.skill-pill').forEach(pill => {{
        const text = pill.textContent.toLowerCase();
        pill.style.display = (!q || text.includes(q)) ? 'inline-flex' : 'none';
      }});
    }});

    // Recruiter sandbox filters
    $('recruiter-score-slider').addEventListener('input', (e) => {{
      $('recruiter-score-val').textContent = e.target.value;
      renderRecruiterSandbox();
    }});
    $('recruiter-region-filter').addEventListener('change', renderRecruiterSandbox);
    $('recruiter-tier-filter').addEventListener('change', renderRecruiterSandbox);
    $('recruiter-cluster-filter').addEventListener('change', renderRecruiterSandbox);

    // Responsive Canvas Resize Listener
    let resizeTimer;
    window.addEventListener('resize', () => {{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {{
        if (lastAssessment) {{
          drawRadarChart(lastAssessment);
          drawDistributionCurve(parseFloat($('res-readiness-score').textContent) || lastAssessment.baseReadiness);
        }}
      }}, 150);
    }});
  }}

  window.switchMode = function(mode) {{
    activeMode = mode;
    $('tab-resume').classList.toggle('active', mode === 'resume');
    $('tab-skills').classList.toggle('active', mode === 'skills');
    $('panel-resume').classList.toggle('hide', mode !== 'resume');
    $('panel-skills').classList.toggle('hide', mode !== 'skills');
  }};

  async function handleFile(file) {{
    const statusEl = $('file-status');
    statusEl.classList.remove('hide');
    statusEl.textContent = 'Reading ' + file.name + ' locally...';

    try {{
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {{
        if (!window.pdfjsLib) throw new Error('PDF.js library not loaded');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({{ data: arrayBuffer }}).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {{
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\\n';
        }}
        extractedText = fullText;
      }} else {{
        extractedText = await file.text();
      }}
      statusEl.textContent = '✓ Ready: ' + file.name + ' (' + extractedText.length.toLocaleString() + ' chars parsed locally)';
    }} catch (err) {{
      console.error(err);
      extractedText = '';
      statusEl.textContent = '⚠️ Could not parse file locally. Please copy & paste text below.';
    }}
  }}

  /**
   * Renders skill options with reliable change listeners
   */
  function renderSkillModeUI() {{
    const d = DOMAINS[currentDomainKey];
    const catContainer = $('skill-categories-container');
    catContainer.innerHTML = '';

    const categories = [
      {{ title: 'Foundational Theory & Mechanics', items: d.fundamentals, isCore: true }},
      {{ title: 'Core Engineering Analysis & Methods', items: d.methods, isCore: true }},
      {{ title: 'Industry-Standard Software & Tools', items: d.software, isCore: false }},
      {{ title: 'Industry Codes, Standards & Safety', items: d.standards, isCore: false }},
      {{ title: 'Emerging & High-Demand 2025/2026', items: d.in_demand, isCore: false }},
      {{ title: 'Industry Recognized Certifications', items: d.certifications, isCore: false }}
    ];

    categories.forEach(cat => {{
      const titleEl = document.createElement('div');
      titleEl.className = 'skill-category-title';
      titleEl.textContent = cat.title;
      catContainer.appendChild(titleEl);

      const pillsDiv = document.createElement('div');
      pillsDiv.className = 'skill-pills';

      cat.items.forEach(item => {{
        const label = document.createElement('label');
        label.className = 'skill-pill';
        label.dataset.core = cat.isCore ? '1' : '0';
        label.innerHTML = `<input type="checkbox" value="${{item}}"> <span>${{item}}</span>`;

        // Proper change event handler (no double-toggle)
        const cb = label.querySelector('input');
        cb.addEventListener('change', () => {{
          label.classList.toggle('selected', cb.checked);
        }});

        pillsDiv.appendChild(label);
      }});

      catContainer.appendChild(pillsDiv);
    }});

    // Software sliders
    const sliderContainer = $('software-sliders-container');
    sliderContainer.innerHTML = '';
    d.software.slice(0, 8).forEach(sw => {{
      const item = document.createElement('div');
      item.className = 'slider-item';
      const cleanId = sw.replace(/[^a-zA-Z0-9]/g, '');
      item.innerHTML = `
        <div class="slider-header">
          <span>${{sw}}</span>
          <span id="sw-val-${{cleanId}}">40%</span>
        </div>
        <input type="range" min="0" max="100" value="40" data-sw="${{sw}}" oninput="document.getElementById('sw-val-${{cleanId}}').textContent = this.value + '%'">
      `;
      sliderContainer.appendChild(item);
    }});
  }}

  function selectCoreFoundations() {{
    $$('#skill-categories-container label[data-core="1"] input[type="checkbox"]').forEach(cb => {{
      cb.checked = true;
      cb.parentElement.classList.add('selected');
    }});
  }}

  function clearSkillsSelection() {{
    $$('#skill-categories-container input[type="checkbox"]').forEach(cb => {{
      cb.checked = false;
      cb.parentElement.classList.remove('selected');
    }});
    $('skill-search-input').value = '';
    $$('.skill-pill').forEach(pill => pill.style.display = 'inline-flex');
  }}

  function updateRecruiterClusterOptions() {{
    const d = DOMAINS[currentDomainKey];
    const sel = $('recruiter-cluster-filter');
    sel.innerHTML = '<option value="All">All Clusters</option>';
    d.clusters.forEach(c => {{
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    }});
  }}

  /**
   * Builds the 50,000+ benchmark cohort (100,000 for mechanical, 50,000 for each other domain)
   * High-speed, deterministic generation in ~25ms.
   */
  function buildDomainCohort(domainKey) {{
    const d = DOMAINS[domainKey];
    const poolSize = d.benchmark_size || 50000;
    const prefix = domainKey.slice(0, 3).toUpperCase();
    const rng = createLCG(814 + Object.keys(DOMAINS).indexOf(domainKey) * 73);
    const cohort = [];

    const clusters = d.clusters;
    const topSkills = d.fundamentals.concat(d.methods).slice(0, 6);
    const topTools = d.software.slice(0, 5);

    for (let i = 0; i < poolSize; i++) {{
      const id = `${{prefix}}-${{10000 + i}}`;
      const isIndia = rng() < 0.55;
      const region = isIndia ? 'India' : 'Global';
      const tierRoll = rng();
      const tier = tierRoll < 0.18 ? 'Tier 1' : (tierRoll < 0.55 ? 'Tier 2' : 'Tier 3');
      const degRoll = rng();
      const degree = degRoll < 0.78 ? 'B.Tech' : (degRoll < 0.96 ? 'M.Tech' : 'Ph.D.');
      const cluster = clusters[Math.floor(rng() * clusters.length)];

      // Calibrated benchmark score (Gaussian-skewed distribution centered around 64.5)
      const baseVal = 32 + rng() * 38 + rng() * 26 + (tier === 'Tier 1' ? 7 : (tier === 'Tier 2' ? 3 : 0));
      const score = Math.min(99.4, Math.max(31.0, Math.round(baseVal * 10) / 10));

      const candSkills = [topSkills[Math.floor(rng() * topSkills.length)], topTools[Math.floor(rng() * topTools.length)]].join(', ');

      cohort.push({{
        id,
        region,
        tier,
        degree,
        cluster,
        skills: candSkills,
        score
      }});
    }}

    // Sort descending by score for instant binary search / index lookup
    cohort.sort((a, b) => b.score - a.score);
    activeCohort = cohort;
  }}

  function runAssessment() {{
    const d = DOMAINS[currentDomainKey];
    let detectedSkills = [];
    let textCorpus = '';

    if (activeMode === 'resume') {{
      textCorpus = (extractedText + ' ' + $('resume-paste-area').value).toLowerCase();
      if (textCorpus.trim().length < 20) {{
        alert('Please upload a resume file or paste your resume text to analyze.');
        return;
      }}
      // Search all taxonomy items
      const allTaxonomy = [...d.fundamentals, ...d.methods, ...d.standards, ...d.in_demand, ...d.software, ...d.certifications];
      allTaxonomy.forEach(item => {{
        const words = item.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
        const match = words.length > 0 && words.some(w => textCorpus.includes(w));
        if (match) detectedSkills.push(item);
      }});
    }} else {{
      // Gather checked skill pills
      $$('#skill-categories-container input[type="checkbox"]:checked').forEach(cb => {{
        detectedSkills.push(cb.value);
      }});

      // Also include any software from sliders if proficiency >= 20%
      $$('#software-sliders-container input[type="range"]').forEach(s => {{
        const val = parseInt(s.value, 10);
        const swName = s.dataset.sw;
        if (val >= 20 && swName && !detectedSkills.includes(swName)) {{
          detectedSkills.push(swName);
        }}
      }});

      if (detectedSkills.length === 0) {{
        alert('Please select at least 2 skills or adjust software proficiency sliders.');
        return;
      }}
    }}

    // Contextual Inputs
    const tier = $('user-tier').value;
    const region = $('user-region').value;
    const degree = $('user-degree').value;
    const projects = parseInt($('user-projects').value, 10);

    // Calculate Sub-Scores
    const tierWeight = tier === 'Tier 1' ? 95 : (tier === 'Tier 2' ? 76 : 58);
    const degWeight = degree === 'B.Tech/B.S.' ? 75 : (degree === 'M.Tech/M.S.' ? 88 : 98);
    const acadScore = tierWeight * 0.6 + degWeight * 0.4;

    const totalDomainSkills = d.fundamentals.length + d.methods.length + d.standards.length + d.in_demand.length;
    const matchedCount = detectedSkills.length;
    const techScore = Math.min(100, Math.round((matchedCount / Math.max(6, totalDomainSkills * 0.40)) * 100));

    // Software Score
    let swAvg = 50;
    if (activeMode === 'skills') {{
      const sliders = $$('#software-sliders-container input[type="range"]');
      if (sliders.length) {{
        let sum = 0;
        sliders.forEach(s => sum += parseInt(s.value, 10));
        swAvg = sum / sliders.length;
      }}
    }} else {{
      const swHits = d.software.filter(s => textCorpus.includes(s.toLowerCase()));
      swAvg = Math.min(100, (swHits.length / 4) * 80 + 20);
    }}

    const evidenceScore = Math.min(100, projects * 22 + (activeMode === 'resume' && textCorpus.includes('intern') ? 25 : 15));
    const baseReadiness = Math.round(acadScore * 0.20 + (techScore * 0.55 + swAvg * 0.45) * 0.45 + evidenceScore * 0.35);

    lastAssessment = {{
      domain: currentDomainKey,
      baseReadiness,
      detectedSkills,
      tier,
      region,
      projects,
      swAvg,
      techScore,
      acadScore,
      evidenceScore
    }};

    renderAssessmentResults();
  }}

  function renderAssessmentResults() {{
    if (!lastAssessment) return;
    const d = DOMAINS[currentDomainKey];
    const a = lastAssessment;
    const poolSize = d.benchmark_size || 50000;

    // Apply sim additions
    const simBoost = simAdditions.projects * 4.5 + simAdditions.internships * 6.5 + simAdditions.certs * 3.5 + (simAdditions.software * 0.25);
    const effectiveReadiness = Math.min(99.4, Math.round((a.baseReadiness + simBoost) * 10) / 10);

    $('res-readiness-score').textContent = effectiveReadiness.toFixed(1);

    // Exact rank lookup in active cohort of 50,000 (or 100,000)
    let userRankIndex = activeCohort.findIndex(c => c.score <= effectiveReadiness);
    if (userRankIndex === -1) userRankIndex = activeCohort.length - 1;
    const globalRank = userRankIndex + 1;

    const globalPct = Math.max(0.1, Math.min(99.9, Math.round(((poolSize - globalRank) / poolSize) * 1000) / 10));
    const topShare = Math.max(0.1, Math.round((globalRank / poolSize) * 1000) / 10);

    $('res-global-rank').textContent = '#' + globalRank.toLocaleString();
    $('res-global-pct').textContent = `Top ${{topShare}}% · ${{globalPct}}th percentile of ${{poolSize.toLocaleString()}}`;

    // Peer Tier Rank
    const tierCohort = activeCohort.filter(c => c.tier === a.tier);
    let tierRankIdx = tierCohort.findIndex(c => c.score <= effectiveReadiness);
    if (tierRankIdx === -1) tierRankIdx = tierCohort.length - 1;
    const tierRank = tierRankIdx + 1;
    $('res-tier-rank').textContent = '#' + tierRank.toLocaleString();
    $('res-tier-pct').textContent = `of ${{tierCohort.length.toLocaleString()}} ${{a.tier}} Peers`;

    // Specialty Cluster Rank
    const clusterName = d.clusters[0];
    $('res-cluster-name').textContent = clusterName;
    const clusterCohort = activeCohort.filter(c => c.cluster === clusterName);
    let clusterRankIdx = clusterCohort.findIndex(c => c.score <= effectiveReadiness);
    if (clusterRankIdx === -1) clusterRankIdx = clusterCohort.length - 1;
    const clusterRank = clusterRankIdx + 1;
    $('res-cluster-rank').textContent = '#' + clusterRank.toLocaleString();

    // Update Subtitles
    $('peer-cohort-badge').textContent = `Simulated benchmark: ${{poolSize.toLocaleString()}} profiles`;
    $('dist-curve-subtitle').textContent = `${{poolSize.toLocaleString()}} Simulated Profile Score Distribution`;

    // Render Role Matches (Bidirectional matching)
    const roleListEl = $('role-matches-list');
    roleListEl.innerHTML = '';
    d.roles.forEach((role) => {{
      const focusMatches = role.focus.filter(f => {{
        const fLower = f.toLowerCase();
        return a.detectedSkills.some(ds => {{
          const dsLower = ds.toLowerCase();
          return dsLower.includes(fLower) || fLower.includes(dsLower) ||
            fLower.split(/[\\s(/]+/).filter(w => w.length > 3).some(w => dsLower.includes(w));
        }});
      }});
      const matchPct = Math.min(98, Math.round(45 + (focusMatches.length / role.focus.length) * 50));
      const roleCard = document.createElement('div');
      roleCard.className = 'role-match-card';
      roleCard.innerHTML = `
        <div class="role-match-info">
          <strong>${{role.name}}</strong>
          <small>Matched: ${{focusMatches.length ? focusMatches.join(', ') : 'Emerging Alignment'}}</small>
        </div>
        <div class="role-badge">${{matchPct}}% Match</div>
      `;
      roleListEl.appendChild(roleCard);
    }});

    // Met, In-Demand, and Missing Tags
    const metTagsEl = $('met-skills-tags');
    metTagsEl.innerHTML = '';
    const metList = a.detectedSkills.slice(0, 10);
    if (metList.length) {{
      metList.forEach(s => metTagsEl.innerHTML += `<span class="gap-tag met">✓ ${{s}}</span>`);
    }} else {{
      metTagsEl.innerHTML = '<span class="muted" style="font-size:0.86rem;">No core foundations logged yet.</span>';
    }}

    const inDemandEl = $('indemand-skills-tags');
    inDemandEl.innerHTML = '';
    d.in_demand.forEach(s => {{
      const has = a.detectedSkills.some(ds => ds.toLowerCase().includes(s.toLowerCase()));
      inDemandEl.innerHTML += `<span class="gap-tag in-demand">${{has ? '★' : '○'}} ${{s}}</span>`;
    }});

    const missingTagsEl = $('missing-skills-tags');
    missingTagsEl.innerHTML = '';
    const missing = d.fundamentals.concat(d.methods).filter(f => !a.detectedSkills.some(ds => ds.toLowerCase().includes(f.toLowerCase()))).slice(0, 5);
    missing.forEach(m => {{
      missingTagsEl.innerHTML += `<span class="gap-tag missing">! ${{m}}</span>`;
    }});

    // Render Peer Comparison Table
    renderPeerComparisonTable(userRankIndex, effectiveReadiness);

    // Render Recruiter Sandbox Table
    renderRecruiterSandbox();

    // Render Canvas Charts (Responsive & Retina Scaled)
    drawRadarChart(a);
    drawDistributionCurve(effectiveReadiness);

    // 7-Day Sprint Plan
    renderSprintPlan(d, missing[0] || d.in_demand[0]);

    // Show Results Panel
    $('results-panel').classList.remove('hide');
    $('results-panel').scrollIntoView({{ behavior: 'smooth', block: 'start' }});
  }}

  /**
   * Renders the interactive Peer Comparison Table showing candidates directly surrounding user's score
   */
  function renderPeerComparisonTable(userRankIndex, userScore) {{
    const tbody = $('peer-table-body');
    tbody.innerHTML = '';

    const startIdx = Math.max(0, userRankIndex - 4);
    const endIdx = Math.min(activeCohort.length - 1, userRankIndex + 4);

    for (let idx = startIdx; idx <= endIdx; idx++) {{
      const c = activeCohort[idx];
      const isUser = (idx === userRankIndex);
      const delta = (c.score - userScore).toFixed(1);
      let standingBadge = '';

      if (isUser) {{
        standingBadge = '<span class="standing-badge peer">⭐ YOU (Current)</span>';
      }} else if (c.score > userScore) {{
        standingBadge = `<span class="standing-badge ahead">+${{delta}} pts ahead</span>`;
      }} else {{
        standingBadge = `<span class="standing-badge behind">${{delta}} pts behind</span>`;
      }}

      const tr = document.createElement('tr');
      if (isUser) tr.className = 'user-row';
      tr.innerHTML = `
        <td><strong>#${{(idx + 1).toLocaleString()}}</strong></td>
        <td>${{isUser ? '<strong style="color:var(--accent);">YOU</strong>' : c.id}}</td>
        <td>${{c.degree}} (${{c.tier}})</td>
        <td>${{c.region}}</td>
        <td>${{c.cluster}}</td>
        <td><small class="muted">${{c.skills}}</small></td>
        <td><strong>${{isUser ? userScore.toFixed(1) : c.score}}</strong></td>
        <td>${{standingBadge}}</td>
      `;
      tbody.appendChild(tr);
    }}
  }}

  /**
   * Renders the Recruiter Talent Pool Filter Sandbox
   */
  function renderRecruiterSandbox() {{
    const minScore = parseFloat($('recruiter-score-slider').value);
    const regionFilter = $('recruiter-region-filter').value;
    const tierFilter = $('recruiter-tier-filter').value;
    const clusterFilter = $('recruiter-cluster-filter').value;

    let matches = activeCohort.filter(c => c.score >= minScore);
    if (regionFilter !== 'All') matches = matches.filter(c => c.region === regionFilter);
    if (tierFilter !== 'All') matches = matches.filter(c => c.tier === tierFilter);
    if (clusterFilter !== 'All') matches = matches.filter(c => c.cluster === clusterFilter);

    $('recruiter-match-counter').textContent = `${{matches.length.toLocaleString()}} candidates match in ${{activeCohort.length.toLocaleString()}} cohort`;

    const tbody = $('recruiter-table-body');
    tbody.innerHTML = '';

    matches.slice(0, 8).forEach(c => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${{c.id}}</strong></td>
        <td>${{c.degree}} (${{c.tier}}) · ${{c.region}}</td>
        <td>${{c.cluster}}</td>
        <td><strong style="color:var(--accent);">${{c.score}}</strong></td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Portfolio Request for ' + '${{c.id}}' + ' sent! In a live deployment, this notifies the verified candidate to share their project repo.')">Request Portfolio</button></td>
      `;
      tbody.appendChild(tr);
    }});
  }}

  /**
   * Sets up a high-DPI Retina responsive canvas matching container dimensions perfectly
   */
  function setupResponsiveCanvas(canvasId, aspect = 0.72) {{
    const canvas = $(canvasId);
    if (!canvas || !canvas.parentElement) return null;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const box = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(260, Math.floor(box.width - 24));
    const height = Math.min(320, Math.max(220, Math.floor(width * aspect)));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {{ ctx, w: width, h: height }};
  }}

  function drawRadarChart(a) {{
    const setup = setupResponsiveCanvas('radarChartCanvas', 0.74);
    if (!setup) return;
    const {{ ctx, w, h }} = setup;
    const cx = w / 2;
    const cy = h / 2 + 10;
    const r = Math.min(w, h) * 0.36;

    ctx.clearRect(0, 0, w, h);

    const axes = [
      'Foundations', 'Design / CAD', 'CAE Simulation',
      'Tools & Code', 'Standards/Codes', 'Evidence'
    ];
    const n = axes.length;

    // Background Web Grid
    for (let level = 1; level <= 4; level++) {{
      const curR = (r / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {{
        const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
        const x = cx + curR * Math.cos(angle);
        const y = cy + curR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }}
      ctx.closePath();
      ctx.strokeStyle = 'rgba(64, 180, 210, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }}

    // Axis Lines & Labels - font size adjusts for mobile width
    const fontSize = w < 360 ? 9 : (w < 440 ? 10 : 11);
    ctx.font = `${{fontSize}}px 'DM Sans', sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    for (let i = 0; i < n; i++) {{
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(64, 180, 210, 0.2)';
      ctx.stroke();

      const labelDist = r + (w < 360 ? 14 : 18);
      const labelX = cx + labelDist * Math.cos(angle);
      const labelY = cy + labelDist * Math.sin(angle) + (angle > 0 && angle < Math.PI ? 4 : -2);
      ctx.fillText(axes[i], labelX, labelY);
    }}

    // User Profile Polygon
    const userValues = [
      Math.min(100, a.techScore || 60),
      Math.min(100, (a.swAvg || 50) + 10),
      Math.min(100, (a.techScore || 50) * 0.9),
      Math.min(100, a.swAvg || 50),
      Math.min(100, a.detectedSkills.length > 5 ? 75 : 40),
      Math.min(100, a.evidenceScore || 50)
    ];

    ctx.beginPath();
    for (let i = 0; i < n; i++) {{
      const val = userValues[i] / 100;
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }}
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 242, 254, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Ideal Role Benchmark Polygon (dotted)
    ctx.beginPath();
    for (let i = 0; i < n; i++) {{
      const val = 0.85; // 85% ideal
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }}
    ctx.closePath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }}

  function drawDistributionCurve(score) {{
    const setup = setupResponsiveCanvas('distributionCanvas', 0.72);
    if (!setup) return;
    const {{ ctx, w, h }} = setup;
    ctx.clearRect(0, 0, w, h);

    const padL = w < 360 ? 30 : 38;
    const padR = 16;
    const padT = 26;
    const padB = 34;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const mean = 64.5;
    const stdDev = 13;
    function gaussian(x) {{
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    }}

    const maxP = gaussian(mean);

    // Area fill
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    for (let xVal = 0; xVal <= 100; xVal += 1) {{
      const x = padL + (xVal / 100) * plotW;
      const yVal = gaussian(xVal);
      const y = padT + plotH - (yVal / maxP) * plotH * 0.9;
      ctx.lineTo(x, y);
    }}
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Baseline axis
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    [20, 40, 60, 80, 100].forEach(tick => {{
      const x = padL + (tick / 100) * plotW;
      ctx.fillText(tick, x, padT + plotH + 15);
    }});

    // User pin
    const userX = padL + (Math.max(0, Math.min(100, score)) / 100) * plotW;
    ctx.beginPath();
    ctx.moveTo(userX, padT);
    ctx.lineTo(userX, padT + plotH);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Marker badge
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(userX, padT + 6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px "DM Sans", sans-serif';
    const isRightEdge = userX > w - 85;
    ctx.textAlign = isRightEdge ? 'right' : 'left';
    ctx.fillText(`YOU: ${{score}} pts`, isRightEdge ? userX - 8 : userX + 8, padT + 10);
  }}

  function renderSprintPlan(d, focusGap) {{
    const list = $('sprint-plan-list');
    list.innerHTML = `
      <li class="sprint-item">
        <div class="sprint-day">Day 1 - 2</div>
        <div>
          <strong style="color:#fff;">Target Analysis & Requirement Extraction</strong>
          <p class="muted" style="font-size:0.88rem;">Inspect 5 current job postings for ${{d.roles[0].name}}. Identify recurring keywords and mandatory CAD/simulation standards.</p>
        </div>
      </li>
      <li class="sprint-item">
        <div class="sprint-day">Day 3 - 5</div>
        <div>
          <strong style="color:#fff;">Evidence Artifact Build: ${{focusGap}}</strong>
          <p class="muted" style="font-size:0.88rem;">Develop the domain proof: ${{d.proof}}. Document your boundary assumptions, engineering calculations, and validation results.</p>
        </div>
      </li>
      <li class="sprint-item">
        <div class="sprint-day">Day 6</div>
        <div>
          <strong style="color:#fff;">Peer & Practitioner Verification</strong>
          <p class="muted" style="font-size:0.88rem;">Publish technical report or repository with README. Solicit review from 2 practicing engineers or alumni in this specialty.</p>
        </div>
      </li>
      <li class="sprint-item">
        <div class="sprint-day">Day 7</div>
        <div>
          <strong style="color:#fff;">Tailored Application & Market Signal Test</strong>
          <p class="muted" style="font-size:0.88rem;">Submit 2 tailored applications featuring your new proof artifact link. Track replies, portfolio views, and recruiter callbacks.</p>
        </div>
      </li>
    `;
  }}

  window.adjustSim = function(key, delta) {{
    const poolSize = DOMAINS[currentDomainKey].benchmark_size || 50000;
    if (key === 'software') {{
      simAdditions.software = Math.max(0, Math.min(45, simAdditions.software + delta));
      $('sim-val-software').textContent = simAdditions.software + '%';
    }} else {{
      simAdditions[key] = Math.max(0, Math.min(3, simAdditions[key] + delta));
      $('sim-val-' + key).textContent = simAdditions[key];
    }}

    const totalGain = Math.round((simAdditions.projects * 4.5 + simAdditions.internships * 6.5 + simAdditions.certs * 3.5 + simAdditions.software * 0.25) * 10) / 10;
    if (totalGain > 0) {{
      const ranksGained = Math.round((totalGain / 100) * poolSize * 0.45);
      $('sim-impact-text').textContent = `+${{totalGain}} pts to Readiness Score · Jump ~${{ranksGained.toLocaleString()}} positions on the ${{poolSize.toLocaleString()}} Board!`;
    }} else {{
      $('sim-impact-text').textContent = 'No additions selected.';
    }}

    renderAssessmentResults();
  }};

  function resetSim() {{
    simAdditions = {{ projects: 0, internships: 0, certs: 0, software: 0 }};
    $('sim-val-projects').textContent = '0';
    $('sim-val-internships').textContent = '0';
    $('sim-val-certs').textContent = '0';
    $('sim-val-software').textContent = '0%';
    $('sim-impact-text').textContent = 'No additions selected.';
    renderAssessmentResults();
  }}

  function resetDesk() {{
    extractedText = '';
    $('resume-file-input').value = '';
    $('resume-paste-area').value = '';
    $('file-status').classList.add('hide');
    $('results-panel').classList.add('hide');
    clearSkillsSelection();
    lastAssessment = null;
    resetSim();
    window.scrollTo({{ top: 0, behavior: 'smooth' }});
  }}

  function exportCSV() {{
    if (!lastAssessment) return;
    const a = lastAssessment;
    const d = DOMAINS[currentDomainKey];

    let csv = 'Category,Value\\n';
    csv += `Domain,"${{d.name}}"\\n`;
    csv += `Simulated Profile Pool Size,"${{d.benchmark_size.toLocaleString()}} profiles"\\n`;
    csv += `Readiness Score,${{$('res-readiness-score').textContent}}\\n`;
    csv += `Global Rank,"${{$('res-global-rank').textContent}}"\\n`;
    csv += `Percentile,"${{$('res-global-pct').textContent}}"\\n`;
    csv += `Peer Tier,"${{a.tier}}"\\n`;
    csv += `Demonstrated Skills,"${{a.detectedSkills.join('; ')}}"\\n`;
    csv += `Proof Recommended,"${{d.proof.replace(/"/g, '""')}}"\\n`;

    const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8;' }});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${{currentDomainKey}}_career_assessment.csv`;
    link.click();
  }}

}})();
"""

def main():
    print("Generating complete, authoritative Engineering Career Intelligence Desk...")
    OUT.mkdir(exist_ok=True)

    # 1. Benchmark summary dataset
    benchmark_summary = generate_benchmark_summary()
    (ROOT / "engineering_reference_profiles.json").write_text(json.dumps(benchmark_summary, indent=2), encoding="utf-8")
    (OUT / "engineering_benchmark_data.json").write_text(json.dumps(benchmark_summary), encoding="utf-8")
    print(f"Generated benchmark summary covering {benchmark_summary['total_benchmark_records']:,} total candidate profiles (100k Mechanical, 50k for each other 11 domains).")

    # 2. Stylesheet
    (OUT / "styles.css").write_text(generate_css(), encoding="utf-8")
    print("Generated engineering-careers/styles.css")

    # 3. JavaScript logic engine
    (OUT / "app.js").write_text(generate_app_js(), encoding="utf-8")
    print("Generated engineering-careers/app.js")

    # 4. Hub Index Page
    (OUT / "index.html").write_text(generate_hub_html(), encoding="utf-8")
    print("Generated engineering-careers/index.html")

    # 5. Methodology Page
    (OUT / "methodology.html").write_text(generate_methodology_html(), encoding="utf-8")
    print("Generated engineering-careers/methodology.html")

    # 6. Domain Pages (12 pages)
    for slug, d in DOMAINS.items():
        (OUT / f"{slug}.html").write_text(generate_domain_page(slug, d), encoding="utf-8")
    print(f"Generated 12 domain guide pages.")

    print(f"Successfully generated all {len(DOMAINS) + 2} pages and dataset artifacts.")

if __name__ == "__main__":
    main()
