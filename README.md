# Mech-Eng Pathfinder: Market Position & Career Intelligence Dashboard

An interactive, premium career intelligence dashboard designed for Mechanical Engineering graduates to parse resumes, evaluate technical skills, map profiles to career clusters, and compute rankings against a database of **1 Lakh (100,000+) mechanical engineering graduates** worldwide and in India.

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
- **Global / Worldwide Rank**: Position against the entire 100,000 candidate dataset.
- **National (India) Rank**: Position against the subset of Indian candidates (~36,000 records).
- **Tier Group Rank**: Performance relative to peers from the same college tier.
- **Specialization Cluster Rank**: Ranking within the matched career discipline.

The dashboard also includes an anonymized cohort distribution and a **What Moves My Rank?** simulator. Engineers can model additional projects, internships, certifications, and software-proficiency gains to compare projected readiness and ranking impact without changing their saved profile.

### 3. Specialty Career Clustering
Using technical keyword intersections, profiles are matched to one of five key disciplines:
- 📐 **CAD Design**: Focuses on geometric drafting, 3D modeling, GD&T, and Design for Manufacturing (DFM/DFMA).
- 💻 **CAE/Simulation**: Stress, thermal, CFD, and vibration analysis using finite element solvers.
- 🤖 **Robotics/Mechatronics**: Integration of mechanical linkages, control loops, sensors, and microcontrollers.
- ⚙️ **Manufacturing/Operations**: Quality assurance, CNC programming, and Lean Six Sigma methodologies.
- 🔥 **HVAC/Thermal**: Piping design, thermal load sizing, HVAC duct systems, and BIM (Revit MEP) layouts.

### 4. Employer Demand Insights
- Displays target professional roles, in-demand core skills, essential software packages, and professional certifications with priority rankings (Critical, High, Medium) based on employer benchmarks.
- Outlines real-world capstone and portfolio project expectations tailored for each specialization.

### 5. Dynamic Skill Gap Analysis
- Maps the candidate's skillset against the top-requested skills from peers within their matched specialty.
- Renders a clean visual chart showing peer frequency rates alongside a check/gap indicator for the user's profile.

### 6. High-ROI Roadmaps & Strategic Job Hunting
- Recommends the top 3 high-ROI skills, tools, or certifications needed to bridge technical gaps.
- Links to relevant professional certification pathways (e.g. CSWA/CSWP, Lean Six Sigma Green Belt, ASHRAE, or ANSYS Certified Professional) and external course targets.
- **Offline Networking Strategies**: Provides custom job placement guidance, specifically tailoring advice for Tier 3 college graduates (e.g. building portfolios on GrabCAD/GitHub, targeting local manufacturing SMEs, cold outreach tactics) and candidates with zero internship experience.

### 7. Interactive Competitor Database Viewer
- Explore, filter, and paginate through the 100,000 anonymized candidate database.
- Filter by target region (India vs. Global) or career cluster, and search for specific colleges, degrees, or tools.

### 8. Comprehensive Written Courses & Quizzes (Streamlit Exclusive)
- Includes detailed written lecture notes, industrial guidelines, and LaTeX equations for each career cluster:
  - *CAD Design*: ASME Y14.5 GD&T controls, DFM principles, Worst-Case vs. RSS tolerance stack-ups, and the Lewis Bending Equation.
  - *CAE/Simulation*: Element formulations, stiffness matrices ($\mathbf{K}\mathbf{u}=\mathbf{f}$), cantilever deflection, Von Mises yield criteria, Navier-Stokes, and $y^+$ wall distance.
  - *Robotics*: Closed-loop PID control theory, ADC step voltage resolution calculations, and active RC low-pass filters.
  - *Manufacturing*: Six Sigma capability indices ($C_p$/$C_{pk}$ step-by-step example), DMAIC phases, and CNC machining speeds/feeds.
  - *HVAC/Thermal*: Sensible vs. Latent cooling load rates ($q_s$, $q_l$), psychrometrics, and Darcy-Weisbach head loss equations.
- Integrates interactive quiz checks that unlock **employability boost points** (+5.0 score boost) upon correct answers.

### 9. Structured Video Course Tracks
- Organizes the 18 embedded Manim MP4 lessons into five guided courses: Mechanical Design, Simulation Engineering, Thermal & Fluids, Smart Manufacturing, and Controls & Robotics.
- Saves lesson completion and active-course progress locally, provides a sequenced module queue, and resumes from the next unfinished lesson.
- Automatically marks a lesson complete when playback ends, with a manual completion control for review workflows.

### 10. Mathematics Shorts Library
- Includes **1,000 separate 20-second visual mathematics lessons** inside Video Academy: 20 topics with 50 worked examples per topic.
- Covers arithmetic, algebra, geometry, trigonometry, vectors, matrices, calculus, differential equations, complex numbers, probability, statistics, numerical methods, Laplace transforms, and engineering units.
- Renders each lesson as a lightweight animated canvas video on demand, avoiding the multi-gigabyte download that 1,000 bundled MP4 files would require.
- Provides play, pause, replay, automatic completion, manual completion, saved progress, search, topic/level/status filters, and 50-page browsing.

---

## 🎥 Video Course Production (Manim)

The project includes automated video production tooling inside the `manim_courses/` directory to generate visual lesson videos for the Streamlit dashboard and the SPA Learning Hub:

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
   - Enables automated YouTube uploads using OAuth credentials:
     - Save your Google Cloud OAuth client credentials to `manim_courses/client_secrets.json`.
     - Run the upload script:
       ```powershell
       .\.venv-manim\Scripts\python.exe manim_courses\upload_youtube.py --lesson <lesson-slug> --privacy private
       ```
     - Update the returned YouTube video ID in `COURSE_CATALOG` in `app_streamlit.py` to embed the videos.

4. **Embedded in the SPA Learning Hub**:
   - The rendered MP4s are embedded directly inside the matching course cards in the client-side app (`Machine Design`, `Finite Element Analysis`, `Robotics`, `Six Sigma`, and `Heat Transfer`) via the `VIDEO_LESSONS` mapping in `app.js`.
   - When served with the repo present, the `<video>` players load the MP4s from `manim_courses/renders/`. The single-file builds (`compile_single_file.py`, `compile_blogspot_safe.py`) automatically inline the videos as base64 `data:` URIs so they play in fully self-contained deployments.
   - If a video asset is unavailable, the player falls back to a graceful notice so the course stays usable.

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
├── candidates_100k.json       # Main benchmark database of 1 Lakh (100,000) anonymized candidates
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
- *Note*: If opening `index.html` directly as a local file, browsers may block loading the local `candidates_100k.json` due to CORS. In this case, `app.js` automatically falls back to generating a deterministic, seeded dataset of 100,000 candidates directly in the browser so that the app remains fully functional.

---

## 🛡️ Privacy & Compliance

- **No Data Exfiltration**: Resume content is parsed purely on the client (or on the local Streamlit server instance) and is never sent to third-party endpoints.
- **PII Stripping**: The parser actively strips out email addresses, phone numbers, GitHub/LinkedIn profile handles, and URLs.
- **Competitor Database Anonymity**: The candidate database is composed entirely of randomized, non-identifiable candidate markers (e.g. `Candidate #ME-10023`) to serve as secure, compliant benchmarks.
