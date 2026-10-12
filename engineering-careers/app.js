/**
 * Engineering Career Intelligence Desk - Client Logic Engine
 * Browser-based multi-discipline assessment with deterministic simulated profile pools
 * Optimized for Mobile, Touch Ergonomics, and High-DPI Canvas Rendering
 */
(function() {
  'use strict';

  const DOMAINS = {"mechanical": {"name": "Mechanical Engineering", "benchmark_size": 100000, "authority": "ASME & ABET EAC Criteria", "intro": "Design, analyse, simulate, manufacture, and maintain mechanical systems and thermal machinery.", "fundamentals": ["Engineering Mechanics (Statics & Dynamics)", "Strength of Materials", "Thermodynamics", "Fluid Mechanics", "Heat & Mass Transfer", "Machine Design & Mechanisms", "Materials Science & Metallurgy"], "methods": ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Tolerance Stack-up Analysis", "Design for Manufacturing & Assembly (DFM/DFA)", "Modal & Vibration Analysis", "Fatigue & Fracture Mechanics", "Root Cause Failure Analysis (RCFA)"], "software": ["SolidWorks", "Autodesk Inventor", "PTC Creo", "CATIA V5", "AutoCAD", "ANSYS Mechanical", "ANSYS Fluent", "Abaqus", "MATLAB", "Simulink", "Python"], "standards": ["ASME Y14.5 (GD&T)", "ASME Section VIII (Pressure Vessels)", "ASTM Material Testing Standards", "ISO 1101 (Geometrical Tolerancing)", "OSHA Machine Safety Standards"], "in_demand": ["Additive Manufacturing (DFAM)", "Digital Twin Modeling", "Thermal Management for EV & Electronics", "Lightweight Composite Structures", "Generative & AI-Assisted CAD Design"], "certifications": ["Certified SolidWorks Associate/Professional (CSWA/CSWP)", "ASME GD&T Professional (GDTP)", "Fundamentals of Engineering (FE Mechanical)", "NAFEMS FEA/CFD Specialist"], "clusters": ["Mechanical Design & CAD", "CAE Simulation & FEA/CFD", "Manufacturing & DFM", "Thermal & Energy Systems", "Robotics & Electro-Mechanical"], "roles": [{"name": "Mechanical Design Engineer", "focus": ["SolidWorks", "ASME Y14.5 (GD&T)", "Design for Manufacturing & Assembly (DFM/DFA)", "Strength of Materials", "Tolerance Stack-up Analysis"]}, {"name": "CAE / Simulation Analyst", "focus": ["Finite Element Analysis (FEA)", "ANSYS Mechanical", "Computational Fluid Dynamics (CFD)", "Fluid Mechanics", "Modal & Vibration Analysis"]}, {"name": "Thermal Systems Engineer", "focus": ["Thermodynamics", "Heat & Mass Transfer", "ANSYS Fluent", "Thermal Management for EV & Electronics", "Fluid Mechanics"]}, {"name": "Manufacturing & Process Engineer", "focus": ["Design for Manufacturing & Assembly (DFM/DFA)", "Additive Manufacturing (DFAM)", "Materials Science & Metallurgy", "SolidWorks", "Root Cause Failure Analysis (RCFA)"]}, {"name": "Product Development Engineer", "focus": ["Machine Design & Mechanisms", "SolidWorks", "Generative & AI-Assisted CAD Design", "ASME Y14.5 (GD&T)", "Strength of Materials"]}, {"name": "HVAC / MEP Engineer", "focus": ["Thermodynamics", "Heat & Mass Transfer", "Fluid Mechanics", "AutoCAD", "Thermal Management for EV & Electronics"]}], "proof": "a fully dimensioned & toleranced 3D assembly (ASME Y14.5), a mesh-converged FEA/CFD validation report with boundary conditions, or a physical manufactured prototype with DFM documentation"}, "civil": {"name": "Civil Engineering", "benchmark_size": 50000, "authority": "ASCE Body of Knowledge & ABET Criteria", "intro": "Plan, engineer, construct, and oversee essential physical infrastructure, structural frameworks, and environmental systems.", "fundamentals": ["Structural Analysis & Mechanics", "Geotechnical Engineering & Soil Mechanics", "Fluid Mechanics & Open Channel Hydraulics", "Surveying & Geomatics", "Civil Construction Materials", "Transportation & Highway Engineering", "Environmental Engineering Basics"], "methods": ["Reinforced Concrete Design", "Structural Steel Design", "Seismic & Wind Load Calculation", "Hydrologic & Drainage Modeling", "Foundation & Retaining Wall Design", "Quantity Takeoff & Cost Estimation", "Construction Project Scheduling"], "software": ["AutoCAD", "AutoCAD Civil 3D", "Autodesk Revit (BIM)", "STAAD.Pro", "ETABS", "SAP2000", "ArcGIS", "QGIS", "HEC-RAS", "Bluebeam Revu", "Primavera P6"], "standards": ["ASCE 7 (Minimum Design Loads for Buildings)", "ACI 318 (Structural Concrete Code)", "AISC 360 (Structural Steel Buildings)", "International Building Code (IBC)", "AASHTO Highway & Bridge Design"], "in_demand": ["BIM Coordination & 4D/5D Modeling", "Resilient & Climate-Adaptive Infrastructure", "Infrastructure Digital Twins", "Geospatial AI & Drone LiDAR Surveying", "Mass Timber & Low-Carbon Concrete Design"], "certifications": ["Fundamentals of Engineering (FE Civil / EIT)", "Professional Engineer (PE Civil)", "Autodesk Certified Professional (Revit/Civil 3D)", "LEED Green Associate / AP", "Envision Sustainability Professional (ENV SP)"], "clusters": ["Structural Engineering", "Transportation & Highways", "Geotechnical & Foundations", "Water Resources & Drainage", "Construction Management & BIM"], "roles": [{"name": "Structural Design Engineer", "focus": ["Structural Analysis & Mechanics", "Reinforced Concrete Design", "STAAD.Pro", "ETABS", "ASCE 7 (Minimum Design Loads for Buildings)"]}, {"name": "Highway / Transportation Engineer", "focus": ["AutoCAD Civil 3D", "Transportation & Highway Engineering", "Surveying & Geomatics", "AASHTO Highway & Bridge Design", "ArcGIS"]}, {"name": "Water Resources Engineer", "focus": ["Hydrologic & Drainage Modeling", "HEC-RAS", "Fluid Mechanics & Open Channel Hydraulics", "ArcGIS", "Environmental Engineering Basics"]}, {"name": "Geotechnical Engineer", "focus": ["Geotechnical Engineering & Soil Mechanics", "Foundation & Retaining Wall Design", "Civil Construction Materials", "Structural Analysis & Mechanics", "AutoCAD"]}, {"name": "BIM / VDC Coordinator", "focus": ["Autodesk Revit (BIM)", "BIM Coordination & 4D/5D Modeling", "AutoCAD Civil 3D", "Bluebeam Revu", "Construction Project Scheduling"]}, {"name": "Construction Project Engineer", "focus": ["Construction Project Scheduling", "Quantity Takeoff & Cost Estimation", "Primavera P6", "International Building Code (IBC)", "Bluebeam Revu"]}], "proof": "a complete code-referenced calculation package (ASCE 7/ACI 318), a coordinated multi-discipline Revit BIM model with clash report, or a calibrated HEC-RAS watershed simulation"}, "electrical": {"name": "Electrical Engineering", "benchmark_size": 50000, "authority": "IEEE Standards & ABET Criteria", "intro": "Engineer power systems, electrical machines, control circuits, renewable energy, and grid infrastructure.", "fundamentals": ["Linear Circuit Theory (AC/DC)", "Electromagnetic Field Theory", "Electrical Machines & Transformers", "Power Systems Analysis", "Feedback Control Systems", "Power Electronics & Inverters", "Analog Signals & Systems"], "methods": ["Load Flow & Fault Current Analysis", "Relay Coordination & System Protection", "Substation Earthing & Grounding Design", "Harmonic Mitigation & Power Quality", "Motor Drive Control & VFD Tuning", "Short-Circuit Calculations"], "software": ["MATLAB", "Simulink", "ETAP", "PSCAD", "AutoCAD Electrical", "EasyPower", "PSpice", "LTspice", "DIgSILENT PowerFactory", "LabVIEW", "Python"], "standards": ["National Electrical Code (NEC / NFPA 70)", "IEEE 1584 (Arc Flash Hazard Calculations)", "IEEE 802 Standards", "IEC 61850 (Power Utility Automation)", "NEMA Standards", "OSHA NFPA 70E Safety"], "in_demand": ["Battery Energy Storage Systems (BESS)", "Smart Grid & Microgrid Controller Design", "High-Voltage Direct Current (HVDC)", "Solar PV & Wind Grid Interconnection", "EV Fast Charging Infrastructure (CCS/NACS)"], "certifications": ["Fundamentals of Engineering (FE Electrical)", "Professional Engineer (PE Power)", "Certified Energy Manager (CEM)", "NABCEP PV Installation Professional", "IEEE PES Member"], "clusters": ["Power & Utility Systems", "Renewable Energy & Microgrids", "Industrial Automation & Controls", "Power Electronics & Drives", "Building Electrical & MEP"], "roles": [{"name": "Power Systems Engineer", "focus": ["Power Systems Analysis", "ETAP", "Load Flow & Fault Current Analysis", "Relay Coordination & System Protection", "IEEE 1584 (Arc Flash Hazard Calculations)"]}, {"name": "Renewable Energy Project Engineer", "focus": ["Solar PV & Wind Grid Interconnection", "Battery Energy Storage Systems (BESS)", "MATLAB", "Power Electronics & Inverters", "NEC / NFPA 70"]}, {"name": "Electrical Controls Engineer", "focus": ["Feedback Control Systems", "Motor Drive Control & VFD Tuning", "AutoCAD Electrical", "Simulink", "National Electrical Code (NEC / NFPA 70)"]}, {"name": "Substation & Protection Engineer", "focus": ["Relay Coordination & System Protection", "IEC 61850 (Power Utility Automation)", "Substation Earthing & Grounding Design", "ETAP", "Electrical Machines & Transformers"]}, {"name": "Power Electronics Engineer", "focus": ["Power Electronics & Inverters", "LTspice", "MATLAB", "Linear Circuit Theory (AC/DC)", "Harmonic Mitigation & Power Quality"]}, {"name": "MEP Electrical Engineer", "focus": ["National Electrical Code (NEC / NFPA 70)", "AutoCAD Electrical", "Short-Circuit Calculations", "OSHA NFPA 70E Safety", "Load Flow & Fault Current Analysis"]}], "proof": "a modeled ETAP short-circuit & protective device coordination study, an IEEE 1584 arc-flash assessment, or an operational hardware prototype of a power converter with efficiency data"}, "electronics": {"name": "Electronics & Communication Engineering", "benchmark_size": 50000, "authority": "IEEE Communications & Solid-State Societies", "intro": "Develop embedded systems, high-speed PCB hardware, RF communication links, and digital signal processors.", "fundamentals": ["Analog Circuit Design", "Digital Logic Design & Verilog/VHDL", "Signals & Digital Signal Processing (DSP)", "Electromagnetic Wave Theory & Antennas", "Microprocessors & ARM Cortex Architectures", "Semiconductor Device Physics", "Communication Theory (Modulation/Coding)"], "methods": ["High-Speed PCB Layout & Routing", "Signal Integrity & Power Integrity Analysis", "Mixed-Signal Hardware Simulation", "RF Front-End Matching & Tuning", "Embedded Firmware Architecture", "Hardware-Software Debugging (Oscilloscope/Logic Analyzer)"], "software": ["Altium Designer", "KiCad", "Cadence Allegro", "OrCAD", "Keil uVision", "MATLAB", "Simulink", "Quartus Prime", "Vivado (FPGA)", "LTspice", "Embedded C/C++", "Python"], "standards": ["IPC-2221 / IPC-A-610 (PCB Design & Acceptability)", "FCC Part 15 (EMI/EMC Compliance)", "IEEE 802.11 (Wi-Fi) & 802.15 (Bluetooth/Zigbee)", "USB-IF & PCIe Specifications"], "in_demand": ["Edge AI & TinyML Inference", "5G / mmWave RF Circuit Design", "FPGA Hardware Accelerators (RISC-V)", "Ultra-Low Power IoT Sensors", "Automotive Ethernet & High-Speed SerDes"], "certifications": ["Certified IPC Specialist (CIS - IPC-A-610)", "ARM Accredited Engineer", "Certified Wireless Network Administrator (CWNA)", "IEEE ComSoc Certified"], "clusters": ["Embedded Firmware & Systems", "Hardware & PCB Design", "RF & Wireless Communications", "FPGA & Digital ASIC Design", "DSP & Signal Processing"], "roles": [{"name": "Embedded Systems Engineer", "focus": ["Embedded C/C++", "Microprocessors & ARM Cortex Architectures", "Keil uVision", "Hardware-Software Debugging (Oscilloscope/Logic Analyzer)", "Edge AI & TinyML Inference"]}, {"name": "PCB Design Engineer", "focus": ["Altium Designer", "High-Speed PCB Layout & Routing", "Signal Integrity & Power Integrity Analysis", "IPC-2221 / IPC-A-610 (PCB Design & Acceptability)", "KiCad"]}, {"name": "RF / Wireless Engineer", "focus": ["Electromagnetic Wave Theory & Antennas", "RF Front-End Matching & Tuning", "Communication Theory (Modulation/Coding)", "FCC Part 15 (EMI/EMC Compliance)", "MATLAB"]}, {"name": "FPGA Firmware Engineer", "focus": ["Digital Logic Design & Verilog/VHDL", "Vivado (FPGA)", "Quartus Prime", "FPGA Hardware Accelerators (RISC-V)", "Digital Signal Processing (DSP)"]}, {"name": "Hardware Test & Validation Engineer", "focus": ["Hardware-Software Debugging (Oscilloscope/Logic Analyzer)", "Mixed-Signal Hardware Simulation", "Analog Circuit Design", "LTspice", "FCC Part 15 (EMI/EMC Compliance)"]}, {"name": "DSP / Audio & Vision Systems Engineer", "focus": ["Signals & Digital Signal Processing (DSP)", "MATLAB", "Communication Theory (Modulation/Coding)", "Embedded C/C++", "Python"]}], "proof": "a fabricated 4-layer+ PCB layout in Altium/KiCad with full BOM and Gerber files, an RTL Verilog core verified on hardware FPGA, or a working ARM Cortex firmware device with custom peripheral driver code"}, "computer": {"name": "Computer & Software Engineering", "benchmark_size": 50000, "authority": "ACM / IEEE Computer Society Guidelines", "intro": "Architect distributed software systems, cloud computing backends, robust data platforms, and secure applications.", "fundamentals": ["Data Structures & Algorithms", "Object-Oriented & Functional Programming", "Computer Systems Architecture & Memory Hierarchy", "Operating Systems & Concurrency", "Relational & NoSQL Database Theory", "Computer Networking (TCP/IP, HTTP/3)", "Discrete Mathematics"], "methods": ["Distributed Systems Design", "RESTful & gRPC API Engineering", "Cloud-Native Infrastructure as Code (IaC)", "Continuous Integration & Continuous Deployment (CI/CD)", "Automated Unit, Integration & End-to-End Testing", "Application Performance Profiling & Optimization"], "software": ["Python", "Java", "C++", "TypeScript", "Go", "Rust", "Docker", "Kubernetes", "AWS", "Azure", "PostgreSQL", "Redis", "Kafka", "Git", "Linux"], "standards": ["POSIX Standards", "OWASP Top 10 Security Framework", "ISO/IEC 27001 (Information Security)", "Semantic Versioning (SemVer)", "Twelve-Factor App Methodology"], "in_demand": ["Large Language Model (LLM) Integration & Agentic AI", "Vector Databases & Retrieval Augmented Generation (RAG)", "Zero-Trust Cloud Security Architecture", "Kubernetes Microservice Orchestration", "High-Throughput Stream Processing (Kafka/Flink)"], "certifications": ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator (CKA)", "Google Professional Cloud Architect", "CompTIA Security+"], "clusters": ["Full-Stack & Backend Systems", "Cloud & DevOps Infrastructure", "Data Platforms & Pipelines", "Machine Learning & AI Engineering", "Systems & Embedded Software"], "roles": [{"name": "Backend Software Engineer", "focus": ["Data Structures & Algorithms", "Distributed Systems Design", "RESTful & gRPC API Engineering", "PostgreSQL", "Go"]}, {"name": "Cloud / DevOps Engineer", "focus": ["Docker", "Kubernetes", "Cloud-Native Infrastructure as Code (IaC)", "AWS", "Continuous Integration & Continuous Deployment (CI/CD)"]}, {"name": "Full-Stack Engineer", "focus": ["TypeScript", "Object-Oriented & Functional Programming", "RESTful & gRPC API Engineering", "PostgreSQL", "Git"]}, {"name": "Data Platform Engineer", "focus": ["Relational & NoSQL Database Theory", "Kafka", "High-Throughput Stream Processing (Kafka/Flink)", "Python", "Redis"]}, {"name": "Machine Learning Systems Engineer", "focus": ["Python", "Large Language Model (LLM) Integration & Agentic AI", "Vector Databases & Retrieval Augmented Generation (RAG)", "Docker", "Linux"]}, {"name": "Systems & Reliability Engineer", "focus": ["Operating Systems & Concurrency", "Computer Networking (TCP/IP, HTTP/3)", "OWASP Top 10 Security Framework", "Linux", "Application Performance Profiling & Optimization"]}], "proof": "a production-grade deployed software project with comprehensive automated test suite (CI/CD), clean modular architecture, documented API endpoints, and a public git repository"}, "chemical": {"name": "Chemical Engineering", "benchmark_size": 50000, "authority": "AIChE & Center for Chemical Process Safety (CCPS)", "intro": "Transform raw feedstocks into valuable chemicals, fuels, materials, and pharmaceuticals through scalable, safe processes.", "fundamentals": ["Chemical Engineering Thermodynamics", "Mass Transfer Operations & Separation", "Heat Transfer & Exchanger Design", "Chemical Reaction Kinetics & Reactor Design", "Fluid Flow & Momentum Transport", "Process Dynamics & Feedback Control", "Industrial Chemistry"], "methods": ["Steady-State & Dynamic Flowsheet Simulation", "Mass & Energy Balance Reconciliation", "Distillation & Absorption Column Sizing", "Hazard & Operability Studies (HAZOP)", "Layers of Protection Analysis (LOPA)", "Piping & Instrumentation Diagram (P&ID) Development", "Pressure Relief & Flare System Sizing"], "software": ["Aspen Plus", "Aspen HYSYS", "ChemCAD", "PRO/II", "COMSOL Multiphysics", "AutoCAD Plant 3D", "MATLAB", "DWSIM", "Python for Process Data"], "standards": ["OSHA Process Safety Management (PSM 29 CFR 1910.119)", "API 520 / 521 (Pressure Relief Systems)", "ASME Boiler & Pressure Vessel Code (BPVC)", "NFPA 652 (Combustible Dust Standard)", "EPA Clean Air Act RMP"], "in_demand": ["Green Hydrogen Production & Water Electrolysis", "Carbon Capture, Utilization & Storage (CCUS)", "Bio-Based Materials & Synthetic Biology Scale-Up", "Circular Chemical Recycling & Plastics Pyrolysis", "Process Electrification & Industrial Decarbonization"], "certifications": ["Fundamentals of Engineering (FE Chemical)", "Professional Engineer (PE Chemical)", "CCPS Certified Process Safety Professional (CCPSC)", "Certified HAZOP Study Leader", "Six Sigma Green Belt"], "clusters": ["Process Design & Simulation", "Plant Operations & Manufacturing", "Process Safety (PSM / HAZOP)", "Energy Transition & Decarbonization", "Biochemical & Pharma Processing"], "roles": [{"name": "Process Design Engineer", "focus": ["Aspen HYSYS", "Steady-State & Dynamic Flowsheet Simulation", "Mass & Energy Balance Reconciliation", "Chemical Engineering Thermodynamics", "Piping & Instrumentation Diagram (P&ID) Development"]}, {"name": "Chemical Plant Operations Engineer", "focus": ["Process Dynamics & Feedback Control", "Heat Transfer & Exchanger Design", "Mass Transfer Operations & Separation", "Piping & Instrumentation Diagram (P&ID) Development", "OSHA Process Safety Management (PSM 29 CFR 1910.119)"]}, {"name": "Process Safety Engineer (PSM)", "focus": ["Hazard & Operability Studies (HAZOP)", "Layers of Protection Analysis (LOPA)", "Pressure Relief & Flare System Sizing", "OSHA Process Safety Management (PSM 29 CFR 1910.119)", "API 520 / 521 (Pressure Relief Systems)"]}, {"name": "Decarbonization / Energy Engineer", "focus": ["Carbon Capture, Utilization & Storage (CCUS)", "Green Hydrogen Production & Water Electrolysis", "Heat Transfer & Exchanger Design", "Aspen Plus", "Chemical Engineering Thermodynamics"]}, {"name": "Biochemical Process Engineer", "focus": ["Chemical Reaction Kinetics & Reactor Design", "Mass Transfer Operations & Separation", "Bio-Based Materials & Synthetic Biology Scale-Up", "MATLAB", "Industrial Chemistry"]}, {"name": "Refinery & Petrochemical Engineer", "focus": ["Distillation & Absorption Column Sizing", "Aspen HYSYS", "Mass & Energy Balance Reconciliation", "Pressure Relief & Flare System Sizing", "API 520 / 521 (Pressure Relief Systems)"]}], "proof": "a converged Aspen Plus / HYSYS process flowsheet with equipment sizing calculations, a documented team HAZOP log with node deviations and safeguards, or an empirical pilot-plant reactor scale-up balance"}, "aerospace": {"name": "Aerospace Engineering", "benchmark_size": 50000, "authority": "AIAA & FAA Airworthiness Guidelines", "intro": "Engineer flight vehicles, spacecraft, hypersonic systems, advanced propulsion, and orbital mechanics.", "fundamentals": ["Aerodynamics & Compressible Flow", "Flight Mechanics & Aircraft Performance", "Aerospace Propulsion (Gas Turbines & Rocketry)", "Aerospace Structural Mechanics", "Orbital Mechanics & Astrodynamics", "Flight Dynamics, Stability & Control", "Space Environment & Radiation"], "methods": ["Computational Fluid Dynamics (CFD)", "Finite Element Aero-Structural Analysis", "Aeroelastic Flutter & Gust Analysis", "Trajectory & Orbital Insertion Optimization", "Thermal Protection System (TPS) Design", "Model-Based Systems Engineering (MBSE)"], "software": ["ANSYS Fluent", "Siemens STAR-CCM+", "NASTRAN / PATRAN", "CATIA V5", "Siemens NX", "OpenVSP", "MATLAB", "Simulink", "Systems Tool Kit (STK)", "XFLR5", "Python"], "standards": ["FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)", "DO-178C (Software in Airborne Systems)", "DO-254 (Electronic Hardware in Airborne Systems)", "MIL-STD-810 (Environmental Engineering Considerations)", "NASA Systems Engineering Handbook"], "in_demand": ["eVTOL & Advanced Air Mobility (AAM)", "Hypersonic Aerodynamics & Aerothermodynamics", "Autonomous Flight Guidance, Navigation & Control (GNC)", "SmallSat Constellation Mission Design", "Hybrid-Electric Propulsion & Hydrogen Aircraft"], "certifications": ["Fundamentals of Engineering (FE Aerospace)", "Professional Engineer (PE Aerospace)", "AIAA Senior Member / Specialist", "DO-178C Certification Practitioner", "INCOSE ASEP/CSEP"], "clusters": ["Aerodynamics & Aero-Thermal", "Aerospace Structures & Materials", "Propulsion & Rocketry", "Guidance, Navigation & Control (GNC)", "Spacecraft Systems & Mission Design"], "roles": [{"name": "Aerodynamics / CFD Engineer", "focus": ["Aerodynamics & Compressible Flow", "Computational Fluid Dynamics (CFD)", "ANSYS Fluent", "OpenVSP", "Flight Mechanics & Aircraft Performance"]}, {"name": "Aerospace Stress & Structures Engineer", "focus": ["Aerospace Structural Mechanics", "NASTRAN / PATRAN", "Finite Element Aero-Structural Analysis", "CATIA V5", "FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)"]}, {"name": "Propulsion Systems Engineer", "focus": ["Aerospace Propulsion (Gas Turbines & Rocketry)", "Thermal Protection System (TPS) Design", "Compressible Flow", "MATLAB", "MIL-STD-810 (Environmental Engineering Considerations)"]}, {"name": "Guidance, Navigation & Control (GNC) Engineer", "focus": ["Flight Dynamics, Stability & Control", "MATLAB", "Simulink", "Autonomous Flight Guidance, Navigation & Control (GNC)", "DO-178C (Software in Airborne Systems)"]}, {"name": "Spacecraft Systems Engineer", "focus": ["Orbital Mechanics & Astrodynamics", "Systems Tool Kit (STK)", "Space Environment & Radiation", "Trajectory & Orbital Insertion Optimization", "NASA Systems Engineering Handbook"]}, {"name": "Flight Test Engineer", "focus": ["Flight Mechanics & Aircraft Performance", "FAA FAR Part 23 / 25 / 33 (Airworthiness Regulations)", "MIL-STD-810 (Environmental Engineering Considerations)", "MATLAB", "Flight Dynamics, Stability & Control"]}], "proof": "a mesh-converged CFD lift/drag polar calculation (ANSYS/STAR-CCM+) validated against wind-tunnel benchmarks, a 6-DOF trajectory simulation in MATLAB/Simulink, or an FE stress margin analysis for an aircraft rib/spar"}, "automotive": {"name": "Automotive Engineering", "benchmark_size": 50000, "authority": "SAE International Standards", "intro": "Design software-defined vehicles, electric powertrains, battery management systems, and autonomous driving architectures.", "fundamentals": ["Vehicle Dynamics & Handling (Tire Mechanics)", "Powertrain Systems (EV & Hybrid)", "Automotive Electronics & Microcontrollers", "Chassis, Suspension & Braking Systems", "Internal Combustion & Electric Motors", "NVH (Noise, Vibration & Harshness)", "Crashworthiness & Impact Mechanics"], "methods": ["Model-Based Design (MBD)", "Hardware-in-the-Loop (HIL) & SIL Simulation", "Battery State of Charge (SOC) & SOH Estimation", "CAN / LIN / Automotive Ethernet Network Decoding", "Multi-Body Dynamics (MBD) Simulation", "Crash Impact FEA Analysis"], "software": ["MATLAB", "Simulink", "Stateflow", "Vector CANoe", "CANalyzer", "Adams Car", "CATIA", "SolidWorks", "ANSYS LS-DYNA", "CarMaker", "Embedded C/C++"], "standards": ["ISO 26262 (Functional Safety - ASIL A to D)", "AUTOSAR Classic & Adaptive Platforms", "SAE J1939 / J1772 Standards", "FMVSS / UNECE Crash Safety Regulations", "UN R155 (Automotive Cybersecurity)"], "in_demand": ["EV Battery Management Systems (BMS)", "Software-Defined Vehicle (SDV) Architectures", "ADAS Sensor Fusion (Camera, Radar, LiDAR)", "Silicon Carbide (SiC) High-Voltage Inverters", "Over-the-Air (OTA) Safe Update Pipelines"], "certifications": ["SAE International Certified Specialist", "TUV Certified Functional Safety Professional (ISO 26262)", "Certified ScrumMaster (Automotive Agile)", "Vector Certified CANoe Professional"], "clusters": ["EV Powertrain & Battery Systems", "Vehicle Dynamics & Chassis", "Automotive Embedded Software", "ADAS & Autonomous Systems", "Body, Safety & Crashworthiness"], "roles": [{"name": "EV Battery Management (BMS) Engineer", "focus": ["Battery State of Charge (SOC) & SOH Estimation", "EV Battery Management Systems (BMS)", "MATLAB", "Simulink", "ISO 26262 (Functional Safety - ASIL A to D)"]}, {"name": "Automotive Embedded Controls Engineer", "focus": ["Model-Based Design (MBD)", "AUTOSAR Classic & Adaptive Platforms", "Vector CANoe", "Embedded C/C++", "ISO 26262 (Functional Safety - ASIL A to D)"]}, {"name": "Vehicle Dynamics Engineer", "focus": ["Vehicle Dynamics & Handling (Tire Mechanics)", "Adams Car", "Chassis, Suspension & Braking Systems", "Multi-Body Dynamics (MBD) Simulation", "CarMaker"]}, {"name": "ADAS / Autonomous Systems Engineer", "focus": ["ADAS Sensor Fusion (Camera, Radar, LiDAR)", "CAN / LIN / Automotive Ethernet Network Decoding", "Simulink", "Vector CANoe", "Software-Defined Vehicle (SDV) Architectures"]}, {"name": "Crashworthiness & Safety Engineer", "focus": ["Crashworthiness & Impact Mechanics", "ANSYS LS-DYNA", "FMVSS / UNECE Crash Safety Regulations", "CATIA", "NVH (Noise, Vibration & Harshness)"]}, {"name": "Automotive Test & HIL Engineer", "focus": ["Hardware-in-the-Loop (HIL) & SIL Simulation", "Vector CANoe", "CANalyzer", "Automotive Electronics & Microcontrollers", "Embedded C/C++"]}], "proof": "a Simulink MBD control model with MIL/SIL test harness conforming to ISO 26262, an in-vehicle CAN/CAN FD decoding log trace, or a verified Adams Car multi-body suspension kinematic simulation"}, "biomedical": {"name": "Biomedical Engineering", "benchmark_size": 50000, "authority": "BMES & FDA Center for Devices (CDRH)", "intro": "Engineer biocompatible medical devices, surgical implants, biosensing instrumentation, and healthcare diagnostic systems.", "fundamentals": ["Human Anatomy & Organ Physiology", "Biomaterials & Biocompatibility", "Biomechanics & Orthopedic Mechanics", "Bioinstrumentation & Biosensors", "Biomedical Signal & Image Processing", "Cell & Tissue Engineering", "Fluid Biomechanics (Cardiovascular)"], "methods": ["Medical Device Design Controls & Risk Management", "Finite Element Modeling of Implants & Bone", "Microfluidic Lab-on-a-Chip Design", "Biosignal Filtering (ECG/EMG/EEG)", "Kinematic Gait Analysis", "Preclinical In-Vitro & Verification Testing"], "software": ["SolidWorks", "MATLAB", "Python", "COMSOL Multiphysics", "ImageJ / 3D Slicer", "LabVIEW", "ANSYS Mechanical", "Minitab"], "standards": ["ISO 13485 (Medical Devices - Quality Management)", "FDA 21 CFR Part 820 / QMSR", "ISO 14971 (Application of Risk Management to Medical Devices)", "IEC 60601-1 (Medical Electrical Equipment Safety)", "EU Medical Device Regulation (MDR)"], "in_demand": ["Wearable Health Monitors & Continuous Biosensing", "AI / Deep Learning in Medical Imaging", "Robotic-Assisted Surgery Subsystems", "3D Bioprinting & Tissue Scaffolding", "Point-of-Care Microfluidic Diagnostics"], "certifications": ["Regulatory Affairs Certification (RAC - RAPS)", "Certified Biomedical Auditor (CBA - ASQ)", "BMES Professional Membership", "Certified Six Sigma Green Belt in Healthcare"], "clusters": ["Medical Device R&D", "Biomechanics & Implants", "Biosensors & Bioinstrumentation", "Regulatory Affairs & Quality Assurance", "Biomedical Imaging & Diagnostics"], "roles": [{"name": "Medical Device Design Engineer", "focus": ["SolidWorks", "Medical Device Design Controls & Risk Management", "Biomaterials & Biocompatibility", "ISO 13485 (Medical Devices - Quality Management)", "FDA 21 CFR Part 820 / QMSR"]}, {"name": "Biomechanical Implant Engineer", "focus": ["Biomechanics & Orthopedic Mechanics", "Finite Element Modeling of Implants & Bone", "ANSYS Mechanical", "Biomaterials & Biocompatibility", "SolidWorks"]}, {"name": "Biosensors & Instrumentation Engineer", "focus": ["Bioinstrumentation & Biosensors", "Biosignal Filtering (ECG/EMG/EEG)", "MATLAB", "LabVIEW", "IEC 60601-1 (Medical Electrical Equipment Safety)"]}, {"name": "Regulatory Affairs Specialist", "focus": ["FDA 21 CFR Part 820 / QMSR", "ISO 13485 (Medical Devices - Quality Management)", "ISO 14971 (Application of Risk Management to Medical Devices)", "EU Medical Device Regulation (MDR)", "Medical Device Design Controls & Risk Management"]}, {"name": "Biomedical Imaging Analyst", "focus": ["Biomedical Signal & Image Processing", "ImageJ / 3D Slicer", "Python", "MATLAB", "AI / Deep Learning in Medical Imaging"]}, {"name": "Clinical Systems Engineer", "focus": ["IEC 60601-1 (Medical Electrical Equipment Safety)", "Human Anatomy & Organ Physiology", "Bioinstrumentation & Biosensors", "Risk Management to Medical Devices", "Minitab"]}], "proof": "a complete Design History File (DHF) excerpt with traceability matrix (ISO 14971/21 CFR 820), a biomechanical FEA study showing bone-implant interface stresses, or a verified biosignal acquisition prototype with DSP filter code"}, "environmental": {"name": "Environmental Engineering", "benchmark_size": 50000, "authority": "AAEE & EPA Regulatory Standards", "intro": "Protect public health and ecosystems through water/wastewater systems, air quality engineering, and climate remediation.", "fundamentals": ["Environmental Chemistry & Microbiology", "Fluid Mechanics & Open Channel Hydraulics", "Hydrology & Groundwater Transport", "Water & Wastewater Treatment Unit Operations", "Air Pollution Meteorology & Dispersion", "Hazardous Waste Management", "Environmental Toxicology"], "methods": ["Biological Nutrient Removal (BNR) Sizing", "Stormwater Runoff & Watershed Modeling", "Contaminant Fate & Transport Modeling", "Life Cycle Assessment (LCA) & Carbon Footprinting", "Air Dispersion Modeling (AERMOD)", "Soil & Aquifer Remediation Design", "Environmental Impact Assessment (EIA)"], "software": ["ArcGIS", "QGIS", "EPA SWMM", "EPANET", "AERMOD", "MODFLOW", "SimaPro / openLCA", "AutoCAD Civil 3D", "Python", "R for Environmental Statistics"], "standards": ["Clean Water Act (NPDES Discharge Permits)", "Clean Air Act (NAAQS & Title V)", "Resource Conservation & Recovery Act (RCRA)", "ISO 14001 (Environmental Management Systems)", "OSHA 40-Hour HAZWOPER"], "in_demand": ["PFAS Remediation & Destruction Technologies", "Scope 1/2/3 Corporate Greenhouse Gas (GHG) Accounting", "Climate Vulnerability & Urban Flood Resilience", "Circular Waste-to-Energy & Resource Recovery", "Nature-Based Infrastructure & Wetland Restoration"], "certifications": ["Fundamentals of Engineering (FE Environmental)", "Board Certified Environmental Engineer (BCEE)", "Professional Engineer (PE Environmental)", "LEED AP / Envision Sustainability Professional (ENV SP)", "OSHA 40-Hr HAZWOPER"], "clusters": ["Water & Wastewater Treatment", "Hydrology & Watershed Modeling", "Air Quality & Dispersion", "Sustainability & ESG / LCA", "Site Remediation & Hazardous Waste"], "roles": [{"name": "Water / Wastewater Process Engineer", "focus": ["Water & Wastewater Treatment Unit Operations", "Biological Nutrient Removal (BNR) Sizing", "EPANET", "Clean Water Act (NPDES Discharge Permits)", "Environmental Chemistry & Microbiology"]}, {"name": "Hydrologist / Watershed Modeler", "focus": ["EPA SWMM", "Hydrology & Groundwater Transport", "ArcGIS", "Stormwater Runoff & Watershed Modeling", "MODFLOW"]}, {"name": "Air Quality Specialist", "focus": ["Air Dispersion Modeling (AERMOD)", "Air Pollution Meteorology & Dispersion", "Clean Air Act (NAAQS & Title V)", "Python", "Environmental Impact Assessment (EIA)"]}, {"name": "Sustainability & Carbon (LCA) Analyst", "focus": ["Life Cycle Assessment (LCA) & Carbon Footprinting", "SimaPro / openLCA", "Scope 1/2/3 Corporate Greenhouse Gas (GHG) Accounting", "ISO 14001 (Environmental Management Systems)", "Circular Waste-to-Energy & Resource Recovery"]}, {"name": "Environmental Remediation Engineer", "focus": ["Soil & Aquifer Remediation Design", "Contaminant Fate & Transport Modeling", "Hazardous Waste Management", "Resource Conservation & Recovery Act (RCRA)", "OSHA 40-Hour HAZWOPER"]}, {"name": "Environmental Compliance Consultant", "focus": ["Environmental Impact Assessment (EIA)", "Clean Water Act (NPDES Discharge Permits)", "Clean Air Act (NAAQS & Title V)", "ISO 14001 (Environmental Management Systems)", "ArcGIS"]}], "proof": "an EPA SWMM hydraulic runoff calibration model, a comprehensive ISO 14040-compliant Life Cycle Assessment (LCA) report, or an AERMOD industrial air quality dispersion footprint study"}, "industrial": {"name": "Industrial & Production Engineering", "benchmark_size": 50000, "authority": "IISE & ASQ Quality Body of Knowledge", "intro": "Optimize complex manufacturing plants, supply chains, human-machine workflows, and quality systems for maximum throughput and reliability.", "fundamentals": ["Operations Research & Mathematical Optimization", "Applied Engineering Statistics & Probability", "Work Study, Ergonomics & Motion Economy", "Production Planning & Inventory Control (PPIC)", "Facility Layout & Material Handling Design", "Engineering Economics & Cost Analysis", "Supply Chain Systems"], "methods": ["Lean Manufacturing & Value Stream Mapping (VSM)", "Six Sigma DMAIC Problem-Solving", "Discrete-Event Process Simulation", "Statistical Process Control (SPC & Control Charts)", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)", "Overall Equipment Effectiveness (OEE) Optimization"], "software": ["Minitab", "Arena Simulation", "Simio", "AnyLogic", "AutoCAD (Plant Layout)", "Python", "R", "Tableau", "Power BI", "SAP ERP (PP/MM Modules)", "MS Excel Advanced Solver"], "standards": ["ISO 9001 (Quality Management Systems)", "AIAG / VDA APQP & PPAP (Automotive Quality)", "ISO 45001 (Occupational Health and Safety)", "ASQ Six Sigma Body of Knowledge", "SCOR Model (Supply Chain Operations)"], "in_demand": ["Smart Manufacturing & Industry 4.0 IoT Analytics", "Digital Supply Chain Twin Simulation", "Automated Guided Vehicle (AGV/AMR) Fleet Routing", "Predictive Machine Maintenance Machine Learning", "Sustainable & Carbon-Neutral Factory Operations"], "certifications": ["ASQ Certified Six Sigma Green / Black Belt (CSSGB/CSSBB)", "ASQ Certified Quality Engineer (CQE)", "Certified Supply Chain Professional (CSCP - ASCM)", "SME Certified Manufacturing Engineer (CMfgE)"], "clusters": ["Lean & Operational Excellence", "Quality Engineering & Six Sigma", "Process Simulation & Operations Research", "Supply Chain Logistics & Inventory", "Smart Manufacturing & Automation"], "roles": [{"name": "Industrial Engineer", "focus": ["Lean Manufacturing & Value Stream Mapping (VSM)", "Work Study, Ergonomics & Motion Economy", "Facility Layout & Material Handling Design", "Minitab", "AutoCAD (Plant Layout)"]}, {"name": "Quality Assurance / Six Sigma Engineer", "focus": ["Six Sigma DMAIC Problem-Solving", "Statistical Process Control (SPC & Control Charts)", "ISO 9001 (Quality Management Systems)", "Minitab", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)"]}, {"name": "Manufacturing Systems Integrator", "focus": ["Overall Equipment Effectiveness (OEE) Optimization", "Smart Manufacturing & Industry 4.0 IoT Analytics", "Discrete-Event Process Simulation", "Arena Simulation", "Production Planning & Inventory Control (PPIC)"]}, {"name": "Supply Chain & Operations Analyst", "focus": ["Operations Research & Mathematical Optimization", "Supply Chain Systems", "Tableau", "SAP ERP (PP/MM Modules)", "SCOR Model (Supply Chain Operations)"]}, {"name": "Continuous Improvement / Kaizen Manager", "focus": ["Lean Manufacturing & Value Stream Mapping (VSM)", "Root Cause Analysis (8D, 5-Why, Ishikawa/Fishbone)", "Overall Equipment Effectiveness (OEE) Optimization", "ISO 9001 (Quality Management Systems)", "Work Study, Ergonomics & Motion Economy"]}, {"name": "Discrete Event Simulation Specialist", "focus": ["Discrete-Event Process Simulation", "Arena Simulation", "Simio", "Operations Research & Mathematical Optimization", "Python"]}], "proof": "a quantified Value Stream Map (VSM) with before/after takt time & lead-time reduction, an Arena/Simio discrete-event factory throughput simulation, or a complete Six Sigma DMAIC project charter with Minitab SPC capability analysis (Cp/Cpk)"}, "mechatronics": {"name": "Mechatronics & Robotics Engineering", "benchmark_size": 50000, "authority": "IEEE Robotics & Automation Society (RAS)", "intro": "Synthesize precision mechanics, embedded electronics, real-time software, and modern control theory into autonomous machines.", "fundamentals": ["Electromechanical Actuators & Motor Drives", "Classical & Modern Control Theory (PID, State-Space)", "Robot Kinematics & Inverse Dynamics", "Embedded Microcontrollers & RTOS", "Digital Signal Processing & Sensor Interfacing", "Power Electronics & H-Bridges", "Applied Computer Vision"], "methods": ["Simultaneous Localization and Mapping (SLAM)", "Robot Trajectory Generation & Motion Planning", "Multi-Sensor Fusion (Kalman Filtering)", "Real-Time Hardware Interfacing (SPI, I2C, CAN)", "PLC Industrial Automation Ladder Logic", "Closed-Loop Servo Tuning"], "software": ["ROS / ROS 2", "MATLAB", "Simulink", "Gazebo Simulator", "SolidWorks", "OpenCV", "Embedded C/C++", "Python", "Linux (Ubuntu)", "Arduino / STM32 / ESP32", "Git"], "standards": ["ISO 10218-1/2 (Industrial Robot Safety)", "ISO/TS 15066 (Collaborative Robots - Cobots)", "IEC 61131-3 (Programmable Controllers / PLC Programming)", "CE Machinery Directive"], "in_demand": ["Autonomous Mobile Robots (AMR) & Navigation Stack (Nav2)", "AI-Powered Robotic Grasping & Manipulation", "Human-Robot Collaboration & Cobot Workcells", "Edge Vision AI on NVIDIA Jetson", "Micro-Aerial Vehicle (Drone) Autonomy"], "certifications": ["Certified Motion Control Specialist (A3 Robotics)", "Certified LabVIEW Associate / Developer (CLAD/CLD)", "FANUC / KUKA Industrial Robotics Programmer", "ROS 2 Developer Certificate"], "clusters": ["Robotics Software & Navigation (ROS)", "Embedded Systems & Firmware", "Industrial Automation & PLCs", "Electro-Mechanical Mechanism Design", "Vision & Perception Systems"], "roles": [{"name": "Robotics Software Engineer", "focus": ["ROS / ROS 2", "Autonomous Mobile Robots (AMR) & Navigation Stack (Nav2)", "Embedded C/C++", "Python", "Simultaneous Localization and Mapping (SLAM)"]}, {"name": "Mechatronics Systems Design Engineer", "focus": ["Electromechanical Actuators & Motor Drives", "SolidWorks", "Embedded Microcontrollers & RTOS", "Power Electronics & H-Bridges", "Closed-Loop Servo Tuning"]}, {"name": "Automation & Controls Engineer", "focus": ["Classical & Modern Control Theory (PID, State-Space)", "PLC Industrial Automation Ladder Logic", "IEC 61131-3 (Programmable Controllers / PLC Programming)", "MATLAB", "Simulink"]}, {"name": "Robotics Perception & Vision Engineer", "focus": ["Applied Computer Vision", "OpenCV", "Multi-Sensor Fusion (Kalman Filtering)", "Edge Vision AI on NVIDIA Jetson", "Python"]}, {"name": "Motion Control Specialist", "focus": ["Robot Kinematics & Inverse Dynamics", "Robot Trajectory Generation & Motion Planning", "Closed-Loop Servo Tuning", "MATLAB", "ISO 10218-1/2 (Industrial Robot Safety)"]}, {"name": "Embedded Firmware Robotics Engineer", "focus": ["Embedded C/C++", "Embedded Microcontrollers & RTOS", "Real-Time Hardware Interfacing (SPI, I2C, CAN)", "Linux (Ubuntu)", "Git"]}], "proof": "a documented ROS 2 workspace running in Gazebo simulation with Nav2 autonomous navigation and sensor fusion, a physical STM32 closed-loop brushless motor controller, or a certified PLC industrial workcell simulation"}};
  let activeMode = 'resume';
  let extractedText = '';
  let currentDomainKey = 'mechanical';
  let simAdditions = { projects: 0, internships: 0, certs: 0, software: 0 };
  let lastAssessment = null;
  let activeCohort = []; // Cached candidate records for active domain (50k / 100k)

  // Seeded LCG random generator for deterministic benchmark generation
  function createLCG(seed) {
    let s = seed;
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  // DOM Elements
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initDomain();
    initEventListeners();
    buildDomainCohort(currentDomainKey);
  });

  function initDomain() {
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain');
    if (domainParam && DOMAINS[domainParam]) {
      currentDomainKey = domainParam;
      $('domain-select').value = domainParam;
    }
    renderSkillModeUI();
    updateRecruiterClusterOptions();
  }

  function initEventListeners() {
    $('domain-select').addEventListener('change', (e) => {
      currentDomainKey = e.target.value;
      renderSkillModeUI();
      updateRecruiterClusterOptions();
      buildDomainCohort(currentDomainKey);
      if (lastAssessment) {
        runAssessment();
      }
    });

    // Drag and drop / Tap for resume file
    const dropzone = $('resume-dropzone');
    const fileInput = $('resume-file-input');

    // On mobile & desktop, tap anywhere on the dropzone card to select file
    dropzone.addEventListener('click', (e) => {
      if (e.target !== fileInput) fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) handleFile(files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    $('run-assessment-btn').addEventListener('click', runAssessment);
    $('reset-desk-btn').addEventListener('click', resetDesk);
    $('sim-reset-btn').addEventListener('click', resetSim);
    $('export-csv-btn').addEventListener('click', exportCSV);

    // Quick selection buttons in skill mode
    $('btn-quick-core').addEventListener('click', selectCoreFoundations);
    $('btn-clear-skills').addEventListener('click', clearSkillsSelection);

    // Live search filter in skill mode
    $('skill-search-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      $$('.skill-pill').forEach(pill => {
        const text = pill.textContent.toLowerCase();
        pill.style.display = (!q || text.includes(q)) ? 'inline-flex' : 'none';
      });
    });

    // Recruiter sandbox filters
    $('recruiter-score-slider').addEventListener('input', (e) => {
      $('recruiter-score-val').textContent = e.target.value;
      renderRecruiterSandbox();
    });
    $('recruiter-region-filter').addEventListener('change', renderRecruiterSandbox);
    $('recruiter-tier-filter').addEventListener('change', renderRecruiterSandbox);
    $('recruiter-cluster-filter').addEventListener('change', renderRecruiterSandbox);

    // Responsive Canvas Resize Listener
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (lastAssessment) {
          drawRadarChart(lastAssessment);
          drawDistributionCurve(parseFloat($('res-readiness-score').textContent) || lastAssessment.baseReadiness);
        }
      }, 150);
    });
  }

  window.switchMode = function(mode) {
    activeMode = mode;
    $('tab-resume').classList.toggle('active', mode === 'resume');
    $('tab-skills').classList.toggle('active', mode === 'skills');
    $('panel-resume').classList.toggle('hide', mode !== 'resume');
    $('panel-skills').classList.toggle('hide', mode !== 'skills');
  };

  async function handleFile(file) {
    const statusEl = $('file-status');
    statusEl.classList.remove('hide');
    statusEl.textContent = 'Reading ' + file.name + ' locally...';

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (!window.pdfjsLib) throw new Error('PDF.js library not loaded');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\n';
        }
        extractedText = fullText;
      } else {
        extractedText = await file.text();
      }
      statusEl.textContent = '✓ Ready: ' + file.name + ' (' + extractedText.length.toLocaleString() + ' chars parsed locally)';
    } catch (err) {
      console.error(err);
      extractedText = '';
      statusEl.textContent = '⚠️ Could not parse file locally. Please copy & paste text below.';
    }
  }

  /**
   * Renders skill options with reliable change listeners
   */
  function renderSkillModeUI() {
    const d = DOMAINS[currentDomainKey];
    const catContainer = $('skill-categories-container');
    catContainer.innerHTML = '';

    const categories = [
      { title: 'Foundational Theory & Mechanics', items: d.fundamentals, isCore: true },
      { title: 'Core Engineering Analysis & Methods', items: d.methods, isCore: true },
      { title: 'Industry-Standard Software & Tools', items: d.software, isCore: false },
      { title: 'Industry Codes, Standards & Safety', items: d.standards, isCore: false },
      { title: 'Emerging & High-Demand 2025/2026', items: d.in_demand, isCore: false },
      { title: 'Industry Recognized Certifications', items: d.certifications, isCore: false }
    ];

    categories.forEach(cat => {
      const titleEl = document.createElement('div');
      titleEl.className = 'skill-category-title';
      titleEl.textContent = cat.title;
      catContainer.appendChild(titleEl);

      const pillsDiv = document.createElement('div');
      pillsDiv.className = 'skill-pills';

      cat.items.forEach(item => {
        const label = document.createElement('label');
        label.className = 'skill-pill';
        label.dataset.core = cat.isCore ? '1' : '0';
        label.innerHTML = `<input type="checkbox" value="${item}"> <span>${item}</span>`;

        // Proper change event handler (no double-toggle)
        const cb = label.querySelector('input');
        cb.addEventListener('change', () => {
          label.classList.toggle('selected', cb.checked);
        });

        pillsDiv.appendChild(label);
      });

      catContainer.appendChild(pillsDiv);
    });

    // Software sliders
    const sliderContainer = $('software-sliders-container');
    sliderContainer.innerHTML = '';
    d.software.slice(0, 8).forEach(sw => {
      const item = document.createElement('div');
      item.className = 'slider-item';
      const cleanId = sw.replace(/[^a-zA-Z0-9]/g, '');
      item.innerHTML = `
        <div class="slider-header">
          <span>${sw}</span>
          <span id="sw-val-${cleanId}">40%</span>
        </div>
        <input type="range" min="0" max="100" value="40" data-sw="${sw}" oninput="document.getElementById('sw-val-${cleanId}').textContent = this.value + '%'">
      `;
      sliderContainer.appendChild(item);
    });
  }

  function selectCoreFoundations() {
    $$('#skill-categories-container label[data-core="1"] input[type="checkbox"]').forEach(cb => {
      cb.checked = true;
      cb.parentElement.classList.add('selected');
    });
  }

  function clearSkillsSelection() {
    $$('#skill-categories-container input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      cb.parentElement.classList.remove('selected');
    });
    $('skill-search-input').value = '';
    $$('.skill-pill').forEach(pill => pill.style.display = 'inline-flex');
  }

  function updateRecruiterClusterOptions() {
    const d = DOMAINS[currentDomainKey];
    const sel = $('recruiter-cluster-filter');
    sel.innerHTML = '<option value="All">All Clusters</option>';
    d.clusters.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  /**
   * Builds the 50,000+ benchmark cohort (100,000 for mechanical, 50,000 for each other domain)
   * High-speed, deterministic generation in ~25ms.
   */
  function buildDomainCohort(domainKey) {
    const d = DOMAINS[domainKey];
    const poolSize = d.benchmark_size || 50000;
    const prefix = domainKey.slice(0, 3).toUpperCase();
    const rng = createLCG(814 + Object.keys(DOMAINS).indexOf(domainKey) * 73);
    const cohort = [];

    const clusters = d.clusters;
    const topSkills = d.fundamentals.concat(d.methods).slice(0, 6);
    const topTools = d.software.slice(0, 5);

    for (let i = 0; i < poolSize; i++) {
      const id = `${prefix}-${10000 + i}`;
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

      cohort.push({
        id,
        region,
        tier,
        degree,
        cluster,
        skills: candSkills,
        score
      });
    }

    // Sort descending by score for instant binary search / index lookup
    cohort.sort((a, b) => b.score - a.score);
    activeCohort = cohort;
  }

  function runAssessment() {
    const d = DOMAINS[currentDomainKey];
    let detectedSkills = [];
    let textCorpus = '';

    if (activeMode === 'resume') {
      textCorpus = (extractedText + ' ' + $('resume-paste-area').value).toLowerCase();
      if (textCorpus.trim().length < 20) {
        alert('Please upload a resume file or paste your resume text to analyze.');
        return;
      }
      // Search all taxonomy items
      const allTaxonomy = [...d.fundamentals, ...d.methods, ...d.standards, ...d.in_demand, ...d.software, ...d.certifications];
      allTaxonomy.forEach(item => {
        const words = item.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
        const match = words.length > 0 && words.some(w => textCorpus.includes(w));
        if (match) detectedSkills.push(item);
      });
    } else {
      // Gather checked skill pills
      $$('#skill-categories-container input[type="checkbox"]:checked').forEach(cb => {
        detectedSkills.push(cb.value);
      });

      // Also include any software from sliders if proficiency >= 20%
      $$('#software-sliders-container input[type="range"]').forEach(s => {
        const val = parseInt(s.value, 10);
        const swName = s.dataset.sw;
        if (val >= 20 && swName && !detectedSkills.includes(swName)) {
          detectedSkills.push(swName);
        }
      });

      if (detectedSkills.length === 0) {
        alert('Please select at least 2 skills or adjust software proficiency sliders.');
        return;
      }
    }

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
    if (activeMode === 'skills') {
      const sliders = $$('#software-sliders-container input[type="range"]');
      if (sliders.length) {
        let sum = 0;
        sliders.forEach(s => sum += parseInt(s.value, 10));
        swAvg = sum / sliders.length;
      }
    } else {
      const swHits = d.software.filter(s => textCorpus.includes(s.toLowerCase()));
      swAvg = Math.min(100, (swHits.length / 4) * 80 + 20);
    }

    const evidenceScore = Math.min(100, projects * 22 + (activeMode === 'resume' && textCorpus.includes('intern') ? 25 : 15));
    const baseReadiness = Math.round(acadScore * 0.20 + (techScore * 0.55 + swAvg * 0.45) * 0.45 + evidenceScore * 0.35);

    lastAssessment = {
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
    };

    renderAssessmentResults();
  }

  function renderAssessmentResults() {
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
    $('res-global-pct').textContent = `Top ${topShare}% · ${globalPct}th percentile of ${poolSize.toLocaleString()}`;

    // Peer Tier Rank
    const tierCohort = activeCohort.filter(c => c.tier === a.tier);
    let tierRankIdx = tierCohort.findIndex(c => c.score <= effectiveReadiness);
    if (tierRankIdx === -1) tierRankIdx = tierCohort.length - 1;
    const tierRank = tierRankIdx + 1;
    $('res-tier-rank').textContent = '#' + tierRank.toLocaleString();
    $('res-tier-pct').textContent = `of ${tierCohort.length.toLocaleString()} ${a.tier} Peers`;

    // Specialty Cluster Rank
    const clusterName = d.clusters[0];
    $('res-cluster-name').textContent = clusterName;
    const clusterCohort = activeCohort.filter(c => c.cluster === clusterName);
    let clusterRankIdx = clusterCohort.findIndex(c => c.score <= effectiveReadiness);
    if (clusterRankIdx === -1) clusterRankIdx = clusterCohort.length - 1;
    const clusterRank = clusterRankIdx + 1;
    $('res-cluster-rank').textContent = '#' + clusterRank.toLocaleString();

    // Update Subtitles
    $('peer-cohort-badge').textContent = `Simulated benchmark: ${poolSize.toLocaleString()} profiles`;
    $('dist-curve-subtitle').textContent = `${poolSize.toLocaleString()} Simulated Profile Score Distribution`;

    // Render Role Matches (Bidirectional matching)
    const roleListEl = $('role-matches-list');
    roleListEl.innerHTML = '';
    d.roles.forEach((role) => {
      const focusMatches = role.focus.filter(f => {
        const fLower = f.toLowerCase();
        return a.detectedSkills.some(ds => {
          const dsLower = ds.toLowerCase();
          return dsLower.includes(fLower) || fLower.includes(dsLower) ||
            fLower.split(/[\s(/]+/).filter(w => w.length > 3).some(w => dsLower.includes(w));
        });
      });
      const matchPct = Math.min(98, Math.round(45 + (focusMatches.length / role.focus.length) * 50));
      const roleCard = document.createElement('div');
      roleCard.className = 'role-match-card';
      roleCard.innerHTML = `
        <div class="role-match-info">
          <strong>${role.name}</strong>
          <small>Matched: ${focusMatches.length ? focusMatches.join(', ') : 'Emerging Alignment'}</small>
        </div>
        <div class="role-badge">${matchPct}% Match</div>
      `;
      roleListEl.appendChild(roleCard);
    });

    // Met, In-Demand, and Missing Tags
    const metTagsEl = $('met-skills-tags');
    metTagsEl.innerHTML = '';
    const metList = a.detectedSkills.slice(0, 10);
    if (metList.length) {
      metList.forEach(s => metTagsEl.innerHTML += `<span class="gap-tag met">✓ ${s}</span>`);
    } else {
      metTagsEl.innerHTML = '<span class="muted" style="font-size:0.86rem;">No core foundations logged yet.</span>';
    }

    const inDemandEl = $('indemand-skills-tags');
    inDemandEl.innerHTML = '';
    d.in_demand.forEach(s => {
      const has = a.detectedSkills.some(ds => ds.toLowerCase().includes(s.toLowerCase()));
      inDemandEl.innerHTML += `<span class="gap-tag in-demand">${has ? '★' : '○'} ${s}</span>`;
    });

    const missingTagsEl = $('missing-skills-tags');
    missingTagsEl.innerHTML = '';
    const missing = d.fundamentals.concat(d.methods).filter(f => !a.detectedSkills.some(ds => ds.toLowerCase().includes(f.toLowerCase()))).slice(0, 5);
    missing.forEach(m => {
      missingTagsEl.innerHTML += `<span class="gap-tag missing">! ${m}</span>`;
    });

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
    $('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Renders the interactive Peer Comparison Table showing candidates directly surrounding user's score
   */
  function renderPeerComparisonTable(userRankIndex, userScore) {
    const tbody = $('peer-table-body');
    tbody.innerHTML = '';

    const startIdx = Math.max(0, userRankIndex - 4);
    const endIdx = Math.min(activeCohort.length - 1, userRankIndex + 4);

    for (let idx = startIdx; idx <= endIdx; idx++) {
      const c = activeCohort[idx];
      const isUser = (idx === userRankIndex);
      const delta = (c.score - userScore).toFixed(1);
      let standingBadge = '';

      if (isUser) {
        standingBadge = '<span class="standing-badge peer">⭐ YOU (Current)</span>';
      } else if (c.score > userScore) {
        standingBadge = `<span class="standing-badge ahead">+${delta} pts ahead</span>`;
      } else {
        standingBadge = `<span class="standing-badge behind">${delta} pts behind</span>`;
      }

      const tr = document.createElement('tr');
      if (isUser) tr.className = 'user-row';
      tr.innerHTML = `
        <td><strong>#${(idx + 1).toLocaleString()}</strong></td>
        <td>${isUser ? '<strong style="color:var(--accent);">YOU</strong>' : c.id}</td>
        <td>${c.degree} (${c.tier})</td>
        <td>${c.region}</td>
        <td>${c.cluster}</td>
        <td><small class="muted">${c.skills}</small></td>
        <td><strong>${isUser ? userScore.toFixed(1) : c.score}</strong></td>
        <td>${standingBadge}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  /**
   * Renders the Recruiter Talent Pool Filter Sandbox
   */
  function renderRecruiterSandbox() {
    const minScore = parseFloat($('recruiter-score-slider').value);
    const regionFilter = $('recruiter-region-filter').value;
    const tierFilter = $('recruiter-tier-filter').value;
    const clusterFilter = $('recruiter-cluster-filter').value;

    let matches = activeCohort.filter(c => c.score >= minScore);
    if (regionFilter !== 'All') matches = matches.filter(c => c.region === regionFilter);
    if (tierFilter !== 'All') matches = matches.filter(c => c.tier === tierFilter);
    if (clusterFilter !== 'All') matches = matches.filter(c => c.cluster === clusterFilter);

    $('recruiter-match-counter').textContent = `${matches.length.toLocaleString()} candidates match in ${activeCohort.length.toLocaleString()} cohort`;

    const tbody = $('recruiter-table-body');
    tbody.innerHTML = '';

    matches.slice(0, 8).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>${c.degree} (${c.tier}) · ${c.region}</td>
        <td>${c.cluster}</td>
        <td><strong style="color:var(--accent);">${c.score}</strong></td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Portfolio Request for ' + '${c.id}' + ' sent! In a live deployment, this notifies the verified candidate to share their project repo.')">Request Portfolio</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Sets up a high-DPI Retina responsive canvas matching container dimensions perfectly
   */
  function setupResponsiveCanvas(canvasId, aspect = 0.72) {
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
    return { ctx, w: width, h: height };
  }

  function drawRadarChart(a) {
    const setup = setupResponsiveCanvas('radarChartCanvas', 0.74);
    if (!setup) return;
    const { ctx, w, h } = setup;
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
    for (let level = 1; level <= 4; level++) {
      const curR = (r / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
        const x = cx + curR * Math.cos(angle);
        const y = cy + curR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(64, 180, 210, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis Lines & Labels - font size adjusts for mobile width
    const fontSize = w < 360 ? 9 : (w < 440 ? 10 : 11);
    ctx.font = `${fontSize}px 'DM Sans', sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    for (let i = 0; i < n; i++) {
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
    }

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
    for (let i = 0; i < n; i++) {
      const val = userValues[i] / 100;
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 242, 254, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Ideal Role Benchmark Polygon (dotted)
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const val = 0.85; // 85% ideal
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawDistributionCurve(score) {
    const setup = setupResponsiveCanvas('distributionCanvas', 0.72);
    if (!setup) return;
    const { ctx, w, h } = setup;
    ctx.clearRect(0, 0, w, h);

    const padL = w < 360 ? 30 : 38;
    const padR = 16;
    const padT = 26;
    const padB = 34;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const mean = 64.5;
    const stdDev = 13;
    function gaussian(x) {
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    }

    const maxP = gaussian(mean);

    // Area fill
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    for (let xVal = 0; xVal <= 100; xVal += 1) {
      const x = padL + (xVal / 100) * plotW;
      const yVal = gaussian(xVal);
      const y = padT + plotH - (yVal / maxP) * plotH * 0.9;
      ctx.lineTo(x, y);
    }
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
    [20, 40, 60, 80, 100].forEach(tick => {
      const x = padL + (tick / 100) * plotW;
      ctx.fillText(tick, x, padT + plotH + 15);
    });

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
    ctx.fillText(`YOU: ${score} pts`, isRightEdge ? userX - 8 : userX + 8, padT + 10);
  }

  function renderSprintPlan(d, focusGap) {
    const list = $('sprint-plan-list');
    list.innerHTML = `
      <li class="sprint-item">
        <div class="sprint-day">Day 1 - 2</div>
        <div>
          <strong style="color:#fff;">Target Analysis & Requirement Extraction</strong>
          <p class="muted" style="font-size:0.88rem;">Inspect 5 current job postings for ${d.roles[0].name}. Identify recurring keywords and mandatory CAD/simulation standards.</p>
        </div>
      </li>
      <li class="sprint-item">
        <div class="sprint-day">Day 3 - 5</div>
        <div>
          <strong style="color:#fff;">Evidence Artifact Build: ${focusGap}</strong>
          <p class="muted" style="font-size:0.88rem;">Develop the domain proof: ${d.proof}. Document your boundary assumptions, engineering calculations, and validation results.</p>
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
  }

  window.adjustSim = function(key, delta) {
    const poolSize = DOMAINS[currentDomainKey].benchmark_size || 50000;
    if (key === 'software') {
      simAdditions.software = Math.max(0, Math.min(45, simAdditions.software + delta));
      $('sim-val-software').textContent = simAdditions.software + '%';
    } else {
      simAdditions[key] = Math.max(0, Math.min(3, simAdditions[key] + delta));
      $('sim-val-' + key).textContent = simAdditions[key];
    }

    const totalGain = Math.round((simAdditions.projects * 4.5 + simAdditions.internships * 6.5 + simAdditions.certs * 3.5 + simAdditions.software * 0.25) * 10) / 10;
    if (totalGain > 0) {
      const ranksGained = Math.round((totalGain / 100) * poolSize * 0.45);
      $('sim-impact-text').textContent = `+${totalGain} pts to Readiness Score · Jump ~${ranksGained.toLocaleString()} positions on the ${poolSize.toLocaleString()} Board!`;
    } else {
      $('sim-impact-text').textContent = 'No additions selected.';
    }

    renderAssessmentResults();
  };

  function resetSim() {
    simAdditions = { projects: 0, internships: 0, certs: 0, software: 0 };
    $('sim-val-projects').textContent = '0';
    $('sim-val-internships').textContent = '0';
    $('sim-val-certs').textContent = '0';
    $('sim-val-software').textContent = '0%';
    $('sim-impact-text').textContent = 'No additions selected.';
    renderAssessmentResults();
  }

  function resetDesk() {
    extractedText = '';
    $('resume-file-input').value = '';
    $('resume-paste-area').value = '';
    $('file-status').classList.add('hide');
    $('results-panel').classList.add('hide');
    clearSkillsSelection();
    lastAssessment = null;
    resetSim();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function exportCSV() {
    if (!lastAssessment) return;
    const a = lastAssessment;
    const d = DOMAINS[currentDomainKey];

    let csv = 'Category,Value\n';
    csv += `Domain,"${d.name}"\n`;
    csv += `Simulated Profile Pool Size,"${d.benchmark_size.toLocaleString()} profiles"\n`;
    csv += `Readiness Score,${$('res-readiness-score').textContent}\n`;
    csv += `Global Rank,"${$('res-global-rank').textContent}"\n`;
    csv += `Percentile,"${$('res-global-pct').textContent}"\n`;
    csv += `Peer Tier,"${a.tier}"\n`;
    csv += `Demonstrated Skills,"${a.detectedSkills.join('; ')}"\n`;
    csv += `Proof Recommended,"${d.proof.replace(/"/g, '""')}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentDomainKey}_career_assessment.csv`;
    link.click();
  }

})();
