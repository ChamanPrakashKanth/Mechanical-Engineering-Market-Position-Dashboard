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
    "fluent": "Fluent"
}

CERTS_DICT = {
    "cswa": "Certified SolidWorks Associate (CSWA)",
    "cswp": "Certified SolidWorks Professional (CSWP)",
    "six sigma green": "Lean Six Sigma Green Belt",
    "six sigma yellow": "Lean Six Sigma Yellow Belt",
    "six sigma black": "Lean Six Sigma Black Belt",
    "ashrae": "ASHRAE Member Certification",
    "hvac design": "HVAC Design Certificate",
    "asme": "ASME Member / Cert"
}

CLUSTERS = ["CAD Design", "CAE/Simulation", "Robotics/Mechatronics", "Manufacturing/Operations", "HVAC/Thermal"]

CLUSTER_KEYWORDS = {
    "CAD Design": ["GD&T (Geometric Dimensioning & Tolerancing)", "Product Design", "Sheet Metal Design", "DFM (Design for Manufacturing)", "Tolerance Analysis", "Injection Molding Design", "SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "PTC Creo", "Autodesk Inventor", "Certified SolidWorks Associate (CSWA)", "Certified SolidWorks Professional (CSWP)"],
    "CAE/Simulation": ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Structural Analysis", "Thermal Analysis", "Vibration Analysis", "ANSYS", "Abaqus", "MATLAB", "Fluent", "COMSOL", "HyperMesh", "Nastran"],
    "Robotics/Mechatronics": ["Mechatronics", "Control Systems", "Robotics", "Embedded Systems", "Kinematics & Dynamics", "MATLAB", "Simulink", "Python", "C++", "LabVIEW", "Arduino"],
    "Manufacturing/Operations": ["Lean Manufacturing", "Six Sigma", "Quality Control & Assurance", "CNC Programming", "AutoCAD", "SolidCAM", "Minitab", "Mastercam", "Lean Six Sigma Yellow Belt", "Lean Six Sigma Green Belt", "Lean Six Sigma Black Belt"],
    "HVAC/Thermal": ["HVAC Design", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Piping Design", "AutoCAD", "Revit", "HVAC Design Certificate", "ASHRAE Member Certification"]
}

# ---------------- HELPER FUNCTIONS ----------------

# Cache the dataset load
@st.cache_data
def load_or_generate_dataset():
    # Attempt to load candidates_60k.json if it exists
    try:
        if os.path.exists("candidates_60k.json"):
            with open("candidates_60k.json", "r") as f:
                data = json.load(f)
                df = pd.DataFrame(data)
                return df
    except Exception as e:
         pass
         
    # Fallback/dynamic generation in python
    print("Generating seeded 60k dataset in Python...")
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
    
    for i in range(60000):
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

# ---------------- APPLICATION FLOW ----------------

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
    
    # ---------------- VIEW LAYOUT: MAIN PANEL ----------------
    
    # Header summary block
    st.success(f"⚛ Compiled Profile: {degree} | College Tier: {tier} | Matched Specialization: {best_cluster} (Score: {target_score}/100)")
    
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
        if papers >= 1:
            st.write(f"✓ Research contribution ({papers} publications) signals deep analytical skill suitable for R&D roles.")
            
        if not strengths:
            strengths.append("Basic engineering credentials established. Focus on building projects and certificates to differentiate.")
            
        for s in strengths:
            st.markdown(f"✅ {s}")
            
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
        
        # Calculate cluster gaps
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

    # Searchable peer candidate datatable
    st.subheader("📁 Anonymized Competitor Database")
    st.caption("Filter and search through the database of 60,000 entry-level candidates")
    
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
