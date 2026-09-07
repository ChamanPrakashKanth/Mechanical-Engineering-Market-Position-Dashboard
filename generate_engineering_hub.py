"""Generate the crawlable Engineering Career Intelligence Desk.

All benchmark records produced here are synthetic reference profiles. They are
not scraped resumes, applicants, survey respondents, or anonymized people.
"""
from __future__ import annotations

import json
from pathlib import Path
from random import Random

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "engineering-careers"
BASE = "https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard"

DOMAINS = {
    "mechanical": {
        "name": "Mechanical Engineering", "intro": "Design, analyse, manufacture and maintain physical systems.",
        "roles": ["Mechanical Design Engineer", "Manufacturing Engineer", "CAE Engineer", "Thermal Engineer"],
        "skills": ["engineering mechanics", "CAD", "GD&T", "materials", "manufacturing", "data analysis"],
        "proof": "a toleranced assembly, verified simulation, or manufactured prototype",
    },
    "civil": {
        "name": "Civil Engineering", "intro": "Plan, design and deliver safe infrastructure and the built environment.",
        "roles": ["Structural Engineer", "Site Engineer", "Transportation Engineer", "Water Resources Engineer"],
        "skills": ["structural analysis", "surveying", "construction planning", "AutoCAD", "codes and standards", "quantity estimation"],
        "proof": "a code-referenced design calculation, drawing set, or project schedule",
    },
    "electrical": {
        "name": "Electrical Engineering", "intro": "Develop power, control and electrical systems from generation to end use.",
        "roles": ["Power Systems Engineer", "Electrical Design Engineer", "Controls Engineer", "Test Engineer"],
        "skills": ["circuit analysis", "power systems", "control systems", "protection", "MATLAB", "electrical safety"],
        "proof": "a documented circuit, protection study, or control-system model",
    },
    "electronics": {
        "name": "Electronics & Communication Engineering", "intro": "Build embedded, communication, signal-processing and electronic systems.",
        "roles": ["Embedded Systems Engineer", "PCB Design Engineer", "RF Engineer", "Verification Engineer"],
        "skills": ["analog electronics", "digital electronics", "embedded C", "microcontrollers", "PCB design", "signal processing"],
        "proof": "a working embedded device, tested PCB, or reproducible signal-processing notebook",
    },
    "computer": {
        "name": "Computer & Software Engineering", "intro": "Design reliable software, computing infrastructure and data systems.",
        "roles": ["Software Engineer", "Data Engineer", "Cloud Engineer", "Cybersecurity Engineer"],
        "skills": ["programming", "data structures", "databases", "testing", "version control", "system design"],
        "proof": "a deployed application with tests, documentation and a public code repository",
    },
    "chemical": {
        "name": "Chemical Engineering", "intro": "Transform materials safely through scalable industrial processes.",
        "roles": ["Process Engineer", "Production Engineer", "Process Safety Engineer", "Quality Engineer"],
        "skills": ["mass and energy balances", "thermodynamics", "transport phenomena", "process control", "process safety", "simulation"],
        "proof": "a process simulation, equipment sizing calculation, or HAZOP-style study",
    },
    "aerospace": {
        "name": "Aerospace Engineering", "intro": "Engineer aircraft, spacecraft and their structures, propulsion and control systems.",
        "roles": ["Aerodynamics Engineer", "Structures Engineer", "Propulsion Engineer", "Flight Controls Engineer"],
        "skills": ["fluid dynamics", "flight mechanics", "structures", "propulsion", "control systems", "simulation validation"],
        "proof": "a validated aerodynamic, structural, propulsion or flight-dynamics model",
    },
    "automotive": {
        "name": "Automotive Engineering", "intro": "Develop vehicles across mechanical, electrical, software and manufacturing systems.",
        "roles": ["Vehicle Dynamics Engineer", "EV Systems Engineer", "Powertrain Engineer", "Automotive Test Engineer"],
        "skills": ["vehicle dynamics", "powertrain", "electric vehicles", "CAD", "controls", "testing and validation"],
        "proof": "a subsystem design, vehicle model, test plan, or validated data analysis",
    },
    "biomedical": {
        "name": "Biomedical Engineering", "intro": "Apply engineering to medical devices, diagnostics and healthcare systems.",
        "roles": ["Medical Device Engineer", "Clinical Engineer", "Biomedical Signal Engineer", "Quality Engineer"],
        "skills": ["human physiology", "instrumentation", "biomaterials", "signal processing", "risk management", "quality systems"],
        "proof": "a device prototype, biomedical signal analysis, or documented risk-control file",
    },
    "environmental": {
        "name": "Environmental Engineering", "intro": "Protect health and ecosystems through water, waste, air and sustainability systems.",
        "roles": ["Water Treatment Engineer", "Environmental Consultant", "Waste Management Engineer", "Sustainability Engineer"],
        "skills": ["water treatment", "environmental chemistry", "hydrology", "waste management", "impact assessment", "data analysis"],
        "proof": "a treatment design, impact assessment, emissions analysis, or field-data report",
    },
    "industrial": {
        "name": "Industrial & Production Engineering", "intro": "Improve operations, quality, supply chains and human-machine systems.",
        "roles": ["Industrial Engineer", "Operations Analyst", "Quality Engineer", "Supply Chain Analyst"],
        "skills": ["operations research", "statistics", "lean systems", "quality engineering", "supply chain", "process mapping"],
        "proof": "a measured process improvement, simulation, quality study, or optimization model",
    },
    "mechatronics": {
        "name": "Mechatronics & Robotics Engineering", "intro": "Integrate mechanics, electronics, control and software into intelligent machines.",
        "roles": ["Robotics Engineer", "Automation Engineer", "Controls Engineer", "Systems Integration Engineer"],
        "skills": ["mechanical design", "electronics", "embedded programming", "control systems", "robotics", "systems integration"],
        "proof": "a working robot, automation cell, control loop, or integrated electromechanical prototype",
    },
}

CSS = """
:root{color-scheme:dark;--bg:#071515;--card:#102626;--line:#285050;--text:#eefafa;--muted:#a9c8c8;--accent:#43e0c0}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top,#123535,var(--bg) 42%);color:var(--text);font:16px/1.6 system-ui,sans-serif}a{color:var(--accent)}header,main,footer{max-width:1120px;margin:auto;padding:24px}.brand{font-weight:800;text-decoration:none;font-size:1.2rem}.hero{padding:64px 0 36px}.eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;font-weight:800}h1{font-size:clamp(2.2rem,6vw,4.6rem);line-height:1.05;margin:.25em 0}h2{line-height:1.2;margin-top:2.2rem}.lead{max-width:760px;color:var(--muted);font-size:1.18rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}.card,.step{background:color-mix(in srgb,var(--card) 94%,transparent);border:1px solid var(--line);border-radius:18px;padding:22px}.card{text-decoration:none;color:inherit}.card:hover{border-color:var(--accent);transform:translateY(-2px)}.card p,.muted{color:var(--muted)}.flow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.step strong{display:block;color:var(--accent);font-size:1.6rem}label{display:block;margin:14px 0 6px;font-weight:700}select,input,textarea,button{width:100%;padding:12px;border-radius:10px;border:1px solid var(--line);background:#091b1b;color:var(--text);font:inherit}button,.button{display:inline-block;width:auto;background:var(--accent);color:#05201a;border:0;padding:12px 18px;border-radius:10px;font-weight:800;text-decoration:none;cursor:pointer}.checks label{font-weight:400}.checks input{width:auto;margin-right:8px}.answer{border-left:3px solid var(--accent);padding-left:16px}.disclosure{background:#2b2412;border:1px solid #766122;padding:16px;border-radius:12px}.cta{margin:36px 0}.sr-only{position:absolute;left:-9999px}@media(max-width:760px){.flow{grid-template-columns:1fr}.hero{padding-top:30px}}
"""

def schema(domain=None):
    app = {"@type":"WebApplication","name":"Engineering Career Intelligence Desk","url":f"{BASE}/engineering-careers/","applicationCategory":"EducationalApplication","operatingSystem":"Web","isAccessibleForFree":True,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"A private, browser-local career diagnostic for major engineering disciplines."}
    breadcrumb = {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Engineering Careers","item":f"{BASE}/engineering-careers/"}]}
    if domain:
        breadcrumb["itemListElement"].append({"@type":"ListItem","position":2,"name":domain["name"]})
    return json.dumps({"@context":"https://schema.org","@graph":[app,breadcrumb]}, ensure_ascii=False)

def shell(title, description, body, canonical, domain=None):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><meta name="description" content="{description}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><link rel="canonical" href="{canonical}"><style>{CSS}</style><script type="application/ld+json">{schema(domain)}</script></head><body><header><a class="brand" href="../index.html">Engineering Career Intelligence Desk</a></header><main>{body}</main><footer><p>Zero-retention assessment: inputs exist only in page memory and disappear when the page is refreshed or closed. This static desk has no account, upload, analytics event, profile cookie, local-storage write, or server-side profile store.</p><p><a href="methodology.html">Benchmark and privacy methodology</a></p></footer></body></html>'''

def domain_page(slug, d):
    roles = "".join(f"<li>{r}</li>" for r in d["roles"])
    skills = "".join(f"<li>{s.title()}</li>" for s in d["skills"])
    body = f'''<section class="hero"><p class="eyebrow">Engineering domain guide</p><h1>{d['name']} career intelligence</h1><p class="lead">{d['intro']} Use this five-question framework to make a defensible next-career decision.</p><a class="button" href="index.html?domain={slug}#desk">Run the private assessment</a></section><section class="flow"><div class="step"><strong>1</strong>Where am I now?</div><div class="step"><strong>2</strong>Which roles fit?</div><div class="step"><strong>3</strong>What is missing?</div><div class="step"><strong>4</strong>What this week?</div><div class="step"><strong>5</strong>Did it help?</div></section><h2>Which {d['name'].lower()} roles can I explore?</h2><div class="answer"><p>Start with roles whose required work overlaps your demonstrated skills, interests and evidence—not the role title alone.</p><ul>{roles}</ul></div><h2>What skills should I assess?</h2><div class="answer"><ul>{skills}</ul><p>The strongest evidence is {d['proof']}. A certificate can support evidence, but should not replace it.</p></div><h2>What should I do this week?</h2><div class="grid"><div class="card"><h3>Choose one target</h3><p>Read five current job descriptions and record recurring requirements.</p></div><div class="card"><h3>Produce evidence</h3><p>Build one small, reviewable artifact tied to a recurring requirement.</p></div><div class="card"><h3>Test the market</h3><p>Improve one application, contact two relevant professionals, and record responses.</p></div></div><h2>How do I know whether it improved my opportunities?</h2><p class="answer">Compare meaningful signals week over week: suitable roles found, tailored applications sent, replies, referrals, screening calls, interviews and portfolio reviews. Do not treat a readiness score as a hiring prediction.</p><p class="disclosure"><strong>Evidence boundary:</strong> Role and skill lists are editorial starting points, not live labor-market measurements. Verify requirements against current vacancies, employer career pages, professional bodies and applicable regulations.</p>'''
    return shell(f"{d['name']} Career Paths, Skills & Weekly Plan", f"Assess {d['name'].lower()} role fit, identify skill gaps, choose a weekly action and track real opportunity signals privately.", body, f"{BASE}/engineering-careers/{slug}.html", d)

def hub_page():
    cards = "".join(f'<a class="card" href="{s}.html"><h2>{d["name"]}</h2><p>{d["intro"]}</p><span>Open career guide →</span></a>' for s,d in DOMAINS.items())
    options = "".join(f'<option value="{s}">{d["name"]}</option>' for s,d in DOMAINS.items())
    data = json.dumps(DOMAINS, ensure_ascii=False).replace("</", "<\\/")
    body = f'''<section class="hero"><p class="eyebrow">Zero-retention engineering career assessment</p><h1>Turn uncertainty into this week’s engineering career move.</h1><p class="lead">See your current evidence, compare suitable role families, find one important gap, take a seven-day action and track whether the market responded. Inputs disappear on refresh or close.</p></section><section class="flow"><div class="step"><strong>1</strong>Current evidence</div><div class="step"><strong>2</strong>Role fit</div><div class="step"><strong>3</strong>Priority gap</div><div class="step"><strong>4</strong>Weekly action</div><div class="step"><strong>5</strong>Opportunity signal</div></section><section id="desk" class="card"><h2>Build my private weekly desk</h2><label for="domain">Engineering domain</label><select id="domain">{options}</select><label for="skills">Skills or tools I can demonstrate (comma separated)</label><textarea id="skills" rows="3" placeholder="e.g. CAD, GD&T, materials"></textarea><label for="evidence">Evidence I can show</label><textarea id="evidence" rows="2" placeholder="Project, internship, report, prototype or verified result"></textarea><button id="analyse">Create this week’s plan</button><div id="result" aria-live="polite"></div></section><h2>Explore engineering career domains</h2><div class="grid">{cards}</div><section><h2>Can this tool rank me against engineers?</h2><p class="answer">It can compare answers with a disclosed synthetic reference set, but that is a product test—not a rank among real engineers. A truthful market rank requires a representative, current and permissioned dataset. This desk prioritizes readiness evidence and observed opportunity signals.</p></section><script>const D={data};const q=new URLSearchParams(location.search).get('domain');const sel=document.querySelector('#domain');if(q&&D[q])sel.value=q;const esc=s=>String(s).replace(/[&<>"']/g,c=>({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}}[c]));document.querySelector('#analyse').onclick=()=>{{const d=D[sel.value],have=document.querySelector('#skills').value.toLowerCase(),hits=d.skills.filter(x=>have.includes(x.toLowerCase())),missing=d.skills.filter(x=>!have.includes(x.toLowerCase())),role=d.roles[Math.min(hits.length,d.roles.length-1)],evidence=document.querySelector('#evidence').value.trim();document.querySelector('#result').innerHTML=`<h2>Your five answers</h2><p><strong>Where am I now?</strong> You reported ${{hits.length}} of ${{d.skills.length}} foundation areas and ${{evidence?'some':'no'}} described work evidence.</p><p><strong>Which roles fit?</strong> Explore <em>${{esc(role)}}</em> first, then validate against current vacancies.</p><p><strong>What is missing?</strong> ${{missing.length?esc(missing[0]):'Role-specific depth and interview evidence'}}.</p><p><strong>What should I do this week?</strong> Read five current ${{esc(role)}} vacancies; build one small artifact demonstrating ${{esc(missing[0]||d.skills[0])}}; request one practitioner review; submit two tailored applications.</p><div class="checks"><strong>Did it improve opportunities?</strong><label><input type="checkbox"> I found suitable vacancies</label><label><input type="checkbox"> I received useful feedback</label><label><input type="checkbox"> I received a reply, referral, screen or interview</label></div><p class="muted">This is a rules-based planning result, not an employer assessment or hiring probability. Nothing entered here is retained.</p>`}};</script>'''
    return shell("Engineering Career Intelligence Desk | Roles, Skill Gaps & Weekly Plan", "Private career intelligence for 12 major engineering domains: assess role fit, skill gaps, weekly actions and real opportunity signals.", body, f"{BASE}/engineering-careers/")

def methodology_page():
    body='''<section class="hero"><p class="eyebrow">Trust & methodology</p><h1>What the engineering benchmark can—and cannot—say</h1><p class="lead">A precise number is not useful if its source is misleading. This page defines the evidence boundary.</p></section><h2>Dataset identity</h2><p>The file <code>engineering_reference_profiles.json</code> contains generated synthetic reference profiles. It contains no scraped resumes, real applicants, survey respondents, names, contact details or device identifiers. Synthetic records are not described as anonymized people.</p><h2>Permitted interpretation</h2><p>The dataset can test scoring behavior and show how a profile compares with a fixed reference distribution. It cannot establish a percentile among engineers, predict hiring, measure current employer demand, or represent any country’s workforce.</p><h2>Zero-retention architecture</h2><p>The engineering-wide desk processes profile text only in page memory. It has no profile submission endpoint, account database, advertising pixel, profile cookie, local-storage write or server-side career-history store. Inputs disappear when the page is refreshed or closed. The separate legacy mechanical learning application may store course progress locally and is not covered by this zero-retention claim.</p><h2>Future real-data standard</h2><p>If permissioned human data is introduced, publish the sample dates, geography, recruitment method, inclusion rules, sample size, missing-data handling, weighting, refresh cadence and privacy basis. Report small cohorts as insufficient rather than manufacturing precision.</p><h2>Career guidance limits</h2><p>Editorial skill maps are starting hypotheses. Users should verify them against current employer vacancies, official professional bodies, accreditation requirements and local regulations.</p>'''
    return shell("Engineering Career Benchmark & Privacy Methodology", "Transparent methodology for synthetic engineering reference profiles, browser-local processing, no retention and responsible comparison claims.", body, f"{BASE}/engineering-careers/methodology.html")

def make_dataset():
    rng=Random(814)
    rows=[]
    for slug,d in DOMAINS.items():
        for i in range(200):
            rows.append({"reference_id":f"SYN-{slug[:3].upper()}-{i+1:04d}","domain":slug,"record_type":"synthetic_reference_profile","foundation_coverage":rng.randint(10,95),"portfolio_evidence":rng.randint(0,4),"project_evidence":rng.randint(0,6),"experience_evidence":rng.randint(0,3),"generated_by":"deterministic-v1","seed":814})
    return {"dataset_name":"Engineering synthetic reference profiles","record_type":"synthetic_reference_profiles_only","contains_real_people":False,"contains_anonymized_human_data":False,"permitted_use":"Product testing and directional comparison against this fixed synthetic set only.","prohibited_claims":["rank among real engineers","hiring probability","representative labor-market percentile","live employer demand"],"generation":{"method":"Python pseudorandom generator","seed":814,"profiles_per_domain":200,"domains":len(DOMAINS)},"records":rows}

OUT.mkdir(exist_ok=True)
(OUT / "index.html").write_text(hub_page(), encoding="utf-8")
(OUT / "methodology.html").write_text(methodology_page(), encoding="utf-8")
for slug, domain in DOMAINS.items():
    (OUT / f"{slug}.html").write_text(domain_page(slug, domain), encoding="utf-8")
(ROOT / "engineering_reference_profiles.json").write_text(json.dumps(make_dataset(), indent=2), encoding="utf-8")
print(f"Generated {len(DOMAINS) + 2} pages and {len(DOMAINS) * 200} synthetic reference profiles")
