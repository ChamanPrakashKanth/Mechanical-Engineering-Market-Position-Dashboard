# Mech-Eng Pathfinder: Market Position & Career Intelligence Dashboard

An interactive, premium career intelligence dashboard designed for Mechanical Engineering graduates to parse resumes, evaluate technical skills, map profiles to career clusters, and compute rankings against a database of **60,000+ mechanical engineering graduates** worldwide and in India.

This project offers two fully functional UI versions:
1. **Single-Page Application (SPA)**: Built with HTML5, Vanilla CSS3 (glassmorphic theme), and pure JavaScript. It operates completely client-side in the browser.
2. **Streamlit Web Application**: Python-based interactive dashboard that adds course learning modules, quiz checks, and advanced data rendering.

---

## 🚀 Key Features

### 1. Smart Resume Parser (Client-Side & Streamlit)
- Paste resume text or upload a PDF resume (uses `pdf.js` for the frontend SPA and `pypdf` for the Streamlit app).
- Scans text for academic credentials (degree type, college tier heuristics) and technical keywords.
- Extracts core mechanical engineering skills, CAD/CAE software packages, and professional certifications.
- Automatically counts internships, academic projects, publications, and engineering competition involvement.
- Removes PII (personally identifiable information) such as emails, phone numbers, and social URLs to ensure data privacy.

### 2. Double-Percentile Ranking Heuristics
Computes a custom **Employability Score** (from 0 to 100) based on weighted resume attributes, and calculates the candidate's exact percentile and ordinal rank across four key dimensions:
- **Global / Worldwide Rank**: Position against the entire 60,000 candidate dataset.
- **National (India) Rank**: Position against the subset of Indian candidates (~36,000 records).
- **Tier Group Rank**: Performance relative to peers from the same college tier.
- **Specialization Cluster Rank**: Ranking within the matched career discipline.

### 3. Specialty Career Clustering
Using technical keyword intersections, profiles are matched to one of five key disciplines:
- 📐 **CAD Design**: Focuses on geometric drafting, 3D modeling, GD&T, and Design for Manufacturing (DFM/DFMA).
- 💻 **CAE/Simulation**: Stress, thermal, CFD, and vibration analysis using finite element solvers.
- 🤖 **Robotics/Mechatronics**: Integration of mechanical linkages, control loops, sensors, and microcontrollers.
- ⚙️ **Manufacturing/Operations**: Quality assurance, CNC programming, and Lean Six Sigma methodologies.
- 🔥 **HVAC/Thermal**: Piping design, thermal load sizing, HVAC duct systems, and BIM (Revit MEP) layouts.

### 4. Dynamic Skill Gap Analysis
- Maps the candidate's skillset against the top-requested skills from peers within their matched specialty.
- Renders a clean visual chart showing peer frequency rates alongside a check/gap indicator for the user's profile.

### 5. High-ROI Roadmaps & Strategic Job Hunting
- Recommends the top 3 high-ROI skills, tools, or certifications needed to bridge technical gaps.
- Links to relevant professional certification pathways (e.g. CSWA/CSWP, Lean Six Sigma Green Belt, ASHRAE, or ANSYS Certified Professional) and external course targets.
- **Offline Networking Strategies**: Provides custom job placement guidance, specifically tailoring advice for Tier 3 college graduates (e.g. building portfolios on GrabCAD/GitHub, targeting local manufacturing SMEs, cold outreach tactics) and candidates with zero internship experience.

### 6. Interactive Competitor Database Viewer
- Explore, filter, and paginate through the 60,000 anonymized candidate database.
- Filter by target region (India vs. Global) or career cluster, and search for specific colleges, degrees, or tools.

### 7. Course Learning Modules (Streamlit Exclusive)
- Includes micro-course modules for each career cluster.
- Provides written lecture notes and formula cheatsheets.
- Integrates quick quiz checks that unlock **employability boost points** upon correct answers, updating the candidate's percentile score in real-time.

---

## 🎥 Video Course Production (Manim)

The project includes automated video production tooling inside the `manim_courses/` directory to generate visual lesson videos for the Streamlit dashboard:

1. **Setup**:
   Using a Python 3.10 virtual environment (to run Manim 0.19.1):
   ```powershell
   py -3.10 -m venv .venv-manim
   .\.venv-manim\Scripts\python.exe -m pip install -r manim_courses\requirements-render.txt
   ```
2. **Render Videos**:
   To render all lesson videos (rendered MP4s will be saved to `manim_courses/renders/`):
   ```powershell
   .\.venv-manim\Scripts\python.exe manim_courses\render_lessons.py
   ```
3. **Upload to YouTube**:
   Enables automated YouTube uploads using OAuth credentials:
   - Save your Google Cloud OAuth client credentials to `manim_courses/client_secrets.json`.
   - Run the upload script:
     ```powershell
     .\.venv-manim\Scripts\python.exe manim_courses\upload_youtube.py --lesson <lesson-slug> --privacy private
     ```
   - Update the returned YouTube video ID in `COURSE_CATALOG` in `app_streamlit.py` to embed the videos.

---

## 📊 Employability Scoring Algorithm

The Employability Score is calculated out of 100 points using the following weights:

| Category | Weight | Description / Sub-components |
| :--- | :--- | :--- |
| **Academics** | **25%** | Tier 1 (100 pts), Tier 2 (70 pts), Tier 3 (40 pts) weighted 60% + Degree Level (Ph.D.: 100 pts, M.Tech/M.S.: 85 pts, B.Tech/B.S.: 70 pts) weighted 40% |
| **Skills & Tools** | **35%** | Skill breadth (up to 12 skills, 50%) + Software tool usage (up to 7 tools, 50%) |
| **Experience** | **30%** | Internships (40%) + Project count (40%) + Major competitions (e.g. FSAE/BAJA) (20%) |
| **Extras** | **10%** | Research publications (50%) + Professional certifications (50%) |

---

## 🛠️ Project Structure

```
├── app_streamlit.py           # Streamlit app entrypoint (UI, database logic, courses, quizzes)
├── index.html                 # Frontend SPA HTML entry point (glassmorphism template)
├── app.js                     # SPA application logic (local resume parser, score calculator)
├── styles.css                 # SPA glassmorphic CSS styling sheet
├── candidates_60k.json        # Main benchmark database of 60,000 anonymized candidates
├── extract_web_data.py        # Resume parsing helpers and parser normalization taxonomy
├── requirements.txt           # Python application dependencies
├── compile_single_file.py     # Combines HTML, CSS, and JS into blogspot_deploy.html
├── compile_blogspot_safe.py   # Combines, minifies, and outputs blogspot_deploy_safe.html
├── blogspot_redirect_card.html# Redirect CTA card for Blogspot/Blogger linking to the live app
├── manim_courses/             # Production tooling for generating Streamlit visual lessons
│   ├── render_lessons.py      # Automated batch rendering script
│   ├── course_scenes.py       # Manim scene configuration and visual nodes
│   ├── upload_youtube.py      # OAuth automated YouTube video uploader
│   ├── course_catalog.json    # JSON definition of course contents, lectures, and options
│   └── requirements-render.txt# Rendering dependencies (manim, google-api-client)
```

---

## 📦 Compilation & Blogger Deployment

The dashboard has utility scripts to compile the local frontend files (`index.html`, `styles.css`, and `app.js`) into single, self-contained HTML files suitable for iframe hosting or embedding into static pages (like Blogger/Blogspot):

- **Development Build**: Runs `compile_single_file.py` to output `blogspot_deploy.html`. It nests CSS and JS inside the HTML in plain-text.
- **Production Build (Blogger-Safe)**: Runs `compile_blogspot_safe.py` to output `blogspot_deploy_safe.html`. This script minifies the CSS, strips multi-line and single-line comments from JavaScript, and adds necessary semicolons to avoid layout breaks and syntax errors when Blogger parses script tags.
- **Redirect Card**: `blogspot_redirect_card.html` is a glassmorphic HTML card ready to be pasted directly into Blogger posts, which displays summary highlights and redirects users to the live Streamlit site.

---

## ⚙️ Setup & Running Locally

### Option A: Running the Streamlit App (Recommended)
1. Ensure Python 3.8+ is installed.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   streamlit run app_streamlit.py
   ```
4. Access the dashboard at `http://localhost:8501`.

### Option B: Running the Single-Page Application (SPA)
The frontend client requires zero external package installations.

#### 1. Running with a local server (Avoids CORS policy issues):
- **Python**: Run `python -m http.server 8000` and open `http://localhost:8000`.
- **Node.js**: Run `npx http-server` or `npm install -g http-server` and run `http-server`.

#### 2. Running without a local server:
- Double-click `index.html` to open it in any modern browser.
- *Note*: If opening `index.html` directly as a local file, browsers may block loading the local `candidates_60k.json` due to CORS. In this case, `app.js` automatically falls back to generating a deterministic, seeded dataset of 60,000 candidates directly in the browser so that the app remains fully functional.

---

## 🛡️ Privacy & Compliance

- **No Data Exfiltration**: Resume content is parsed purely on the client (or on the local Streamlit server instance) and is never sent to third-party endpoints.
- **PII Stripping**: The parser actively strips out email addresses, phone numbers, GitHub/LinkedIn profile handles, and URLs.
- **Competitor Database Anonymity**: The candidate database is composed entirely of randomized, non-identifiable candidate markers (e.g. `Candidate #ME-10023`) to serve as secure, compliant benchmarks.
