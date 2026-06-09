# Mech-Eng Pathfinder: Market Position & Career Intelligence Dashboard

An interactive, premium glassmorphism single-page web dashboard designed for Mechanical Engineering graduates to parse their resumes, evaluate their skills, and compute percentile rankings against a massive database of mechanical engineers worldwide and in India.

## Key Features

1. **Massive Seeded Dataset**: Uses a seeded pseudo-random data generator to build a highly realistic benchmark database of **25,000 Mechanical Engineering candidates** (60% India, 40% Global) distributed across different college tiers, degree levels, and specializations.
2. **Smart Resume Parser**: Reads pasted resume text client-side, extracting key mechanical skills, CAD/CAE software packages, certifications, and calculating counts for internships, projects, and papers.
3. **Double-Percentile Ranking**: Calculates and charts the candidate's exact percentile ranking:
   - **Worldwide** (against the full 25,000 candidate pool).
   - **National (India)** (against the subset of ~15,000 Indian candidates).
4. **Specialty Career Clustering**: Maps profiles to 5 key mechanical specializations (CAD Design, Simulation/CAE, Robotics/Mechatronics, Manufacturing/Production, HVAC/Thermal) using similarity alignment.
5. **Skill Gap Analysis Chart**: Dynamically matches your profile against peers in your cluster, rendering a comparative SVG chart of skill frequencies.
6. **High-ROI Roadmap**: Outputs a prioritized list of high-value skills, projects, and certifications to target next, with estimated career ROI.
7. **Interactive Database Viewer**: Includes a searchable, filterable, and paginated table to explore the 25,000 candidate profiles.

## Setup & Running Locally

The dashboard is completely self-contained and operates entirely in the browser (client-side JS/CSS/HTML) with zero external library dependencies (no NPM install or node servers required).

### Option 1: Direct Execution
Double-click `index.html` to open the application directly in any modern web browser.

### Option 2: Local Server (Recommended)
To run with a local server, navigate to the folder in your terminal and run:
- Python 3: `python -m http.server 8000` (then open `http://localhost:8000`)
- Node.js (via npx): `npx http-server`

## PII Compliance & Privacy

This application is strictly compliant with non-PII rules:
* It does **not** send any data to external servers.
* It immediately discards any personal names, email addresses, phone numbers, social links, or profile locations during parsing.
* All generated candidates are fully anonymous (e.g. `Candidate #ME-14902`) and identified solely by academic tiers, skills, and projects.
