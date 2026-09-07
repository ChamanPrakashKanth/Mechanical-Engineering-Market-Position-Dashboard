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
:root{color-scheme:dark;--bg:#071515;--card:#102626;--line:#285050;--text:#eefafa;--muted:#a9c8c8;--accent:#43e0c0}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top,#123535,var(--bg) 42%);color:var(--text);font:16px/1.6 system-ui,sans-serif}a{color:var(--accent)}header,main,footer{max-width:1120px;margin:auto;padding:24px}.brand{font-weight:800;text-decoration:none;font-size:1.2rem}.hero{padding:64px 0 36px}.eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;font-weight:800}h1{font-size:clamp(2.2rem,6vw,4.6rem);line-height:1.05;margin:.25em 0}h2{line-height:1.2;margin-top:2.2rem}.lead{max-width:760px;color:var(--muted);font-size:1.18rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}.card,.step,.metric{background:color-mix(in srgb,var(--card) 94%,transparent);border:1px solid var(--line);border-radius:18px;padding:22px}.card{text-decoration:none;color:inherit}.card:hover{border-color:var(--accent)}.grid>a.card:hover{transform:translateY(-2px)}.card p,.muted{color:var(--muted)}.flow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.step strong{display:block;color:var(--accent);font-size:1.6rem}label{display:block;margin:14px 0 6px;font-weight:700}select,input,textarea,button{width:100%;padding:12px;border-radius:10px;border:1px solid var(--line);background:#091b1b;color:var(--text);font:inherit}button,.button{display:inline-block;width:auto;background:var(--accent);color:#05201a;border:0;padding:12px 18px;border-radius:10px;font-weight:800;text-decoration:none;cursor:pointer}button.secondary{background:transparent;color:var(--text);border:1px solid var(--line)}.checks label{font-weight:400}.checks input,.skill-options input{width:auto;margin-right:8px}.answer{border-left:3px solid var(--accent);padding-left:16px}.disclosure{background:#2b2412;border:1px solid #766122;padding:16px;border-radius:12px}.cta{margin:36px 0}.sr-only{position:absolute;left:-9999px}.hide{display:none!important}.assessment,.results,.moat{margin-top:42px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:18px}.section-head h2,.section-head p{margin:.15rem 0}.privacy-chip{color:var(--accent);border:1px solid var(--accent);border-radius:99px;padding:5px 10px;font-size:.8rem;font-weight:800}.mode-tabs{display:flex;gap:8px;margin:20px 0}.mode{background:transparent;color:var(--muted);border:1px solid var(--line)}.mode.active{background:var(--accent);color:#05201a}.skill-options{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.skill-options label{margin:0;background:#0a1d1d;padding:10px;border-radius:10px;font-weight:500}.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}.metric span,.metric small{display:block;color:var(--muted)}.metric strong{display:block;font-size:1.8rem;color:var(--accent)}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.role-row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}.role-row small{display:block;color:var(--muted)}.role-row b{color:var(--accent);white-space:nowrap}.gap{display:flex;align-items:center;gap:12px;padding:10px 0}.gap strong{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#623333}.skill-bar{display:grid;grid-template-columns:minmax(170px,1fr) 2fr;gap:16px;align-items:center;margin:14px 0}.skill-bar small{display:block;color:var(--muted)}.track{height:12px;background:#071515;border-radius:99px;overflow:hidden}.track i{display:block;height:100%;border-radius:99px}.track .met{background:var(--accent)}.track .miss{background:#b75b5b}.weekly li{margin:10px 0}.moat{padding:28px;border:1px solid var(--accent);border-radius:22px;background:linear-gradient(135deg,rgba(67,224,192,.09),transparent)}@media(max-width:760px){.flow,.metric-grid,.result-grid{grid-template-columns:1fr}.hero{padding-top:30px}.section-head{align-items:flex-start;flex-direction:column}.skill-options{grid-template-columns:1fr}.skill-bar{grid-template-columns:1fr;gap:5px}}
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
    body = f'''<section class="hero"><p class="eyebrow">Zero-retention engineering career assessment</p><h1>From resume or skills to an engineering career move.</h1><p class="lead">Choose resume assessment or manual skills. See role fit, visible skill gaps, a transparent synthetic-reference position, and one seven-day experiment. Your input never leaves this page.</p><a class="button" href="#desk">Assess my profile</a></section>
<section class="flow"><div class="step"><strong>1</strong>Where am I now?</div><div class="step"><strong>2</strong>Which roles fit?</div><div class="step"><strong>3</strong>What is missing?</div><div class="step"><strong>4</strong>What this week?</div><div class="step"><strong>5</strong>Did it improve?</div></section>
<section id="desk" class="card assessment"><div class="section-head"><div><p class="eyebrow">Private assessment</p><h2>Choose how to assess your profile</h2></div><span class="privacy-chip">No retention</span></div><label for="domain">Engineering domain</label><select id="domain">{options}</select><div class="mode-tabs" role="tablist"><button class="mode active" data-mode="resume" type="button">Resume assessment</button><button class="mode" data-mode="skills" type="button">Enter skills manually</button></div>
<div id="resume-mode" class="mode-panel"><label for="resume-file">Resume PDF or TXT</label><input id="resume-file" type="file" accept=".pdf,.txt,text/plain,application/pdf"><p id="file-status" class="muted">PDF text is extracted locally in your browser.</p><label for="resume-text">Or paste resume text</label><textarea id="resume-text" rows="7" placeholder="Paste experience, projects, skills and tools…"></textarea></div>
<div id="skills-mode" class="mode-panel hide"><p class="muted">Select only skills you can demonstrate with a project, internship, test, report or work sample.</p><div id="skill-options" class="skill-options"></div><label for="other-skills">Other skills or tools</label><textarea id="other-skills" rows="3" placeholder="Comma-separated skills and software"></textarea></div>
<label for="evidence">Evidence you can show</label><textarea id="evidence" rows="3" placeholder="Describe projects, internships, prototypes, reports, code, calculations or measured outcomes"></textarea><button id="analyse" type="button">Analyse role fit and gaps</button><p class="muted">This is a rules-based diagnostic. It is not an employer decision, labor-market census, or hiring probability.</p></section>
<section id="result" class="results hide" aria-live="polite"><div class="section-head"><div><p class="eyebrow">Your career intelligence brief</p><h2 id="result-domain"></h2></div><button id="clear-result" class="secondary" type="button">Clear assessment</button></div><div class="metric-grid"><div class="metric"><span>Evidence readiness</span><strong id="readiness-score">—</strong><small>Rules-based score</small></div><div class="metric"><span>Synthetic reference</span><strong id="reference-position">—</strong><small>Not a real-engineer rank</small></div><div class="metric"><span>Skills detected</span><strong id="skills-detected">—</strong><small>Domain foundations</small></div><div class="metric"><span>Evidence signals</span><strong id="evidence-signals">—</strong><small>Projects / experience</small></div></div><div class="result-grid"><article class="card"><h3>Which roles fit?</h3><div id="role-matches"></div></article><article class="card"><h3>What is missing?</h3><div id="priority-gaps"></div></article></div><article class="card"><h3>Skill readiness visualization</h3><p class="muted">Editorial priority indicates importance in this starter role map—not measured live job-posting demand.</p><div id="skill-chart"></div></article><article class="card weekly"><h3>What should I do this week?</h3><div id="weekly-plan"></div></article><article class="card"><h3>Did it improve my opportunities?</h3><p>Use these temporary checkboxes during this visit. They are not saved.</p><div class="checks"><label><input type="checkbox"> Found five relevant current vacancies</label><label><input type="checkbox"> Completed the recommended evidence artifact</label><label><input type="checkbox"> Received practitioner or recruiter feedback</label><label><input type="checkbox"> Received a reply, referral, screening call or interview</label></div></article></section>
<section class="moat"><p class="eyebrow">The product moat</p><h2>Not another resume score: an evidence-to-opportunity loop.</h2><div class="grid"><div class="card"><h3>Cross-domain translation</h3><p>One private engine translates resume evidence into the language of 12 engineering families.</p></div><div class="card"><h3>Explainable recommendations</h3><p>Every role match shows detected foundations and missing evidence. No opaque AI verdict.</p></div><div class="card"><h3>Weekly market experiment</h3><p>The result becomes a build, validation and outreach action whose opportunity signals can be observed.</p></div></div></section>
<h2>Explore engineering career domains</h2><div class="grid">{cards}</div><section><h2>Where does the reference position come from?</h2><p class="answer">The comparison uses 200 disclosed synthetic profiles per domain from a fixed deterministic dataset. It tests the scoring distribution only. It is never described as a rank among real engineers, a market percentile, or a prediction of employment.</p><p><a href="methodology.html">Read the complete dataset and privacy methodology →</a></p></section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script><script>window.ENGINEERING_DOMAINS={data}</script><script src="app.js"></script>'''
    return shell("Engineering Resume Assessment | Role Fit, Skill Gaps & Weekly Plan", "Assess an engineering resume or manually enter skills across 12 domains. Visualize role fit and gaps, compare with a disclosed synthetic reference set, and receive a private weekly plan.", body, f"{BASE}/engineering-careers/")

def hub_script():
    return r'''(() => {
const D=window.ENGINEERING_DOMAINS, $=s=>document.querySelector(s), esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mode='resume', extracted='', referencePromise=null;
const aliases={'cad':['cad','solidworks','creo','catia','autocad'],'gd&t':['gd&t','geometric dimensioning','tolerancing'],'programming':['programming','python','java','javascript','c++','c#'],'databases':['database','sql','postgres','mysql'],'embedded c':['embedded c','firmware'],'microcontrollers':['microcontroller','arduino','stm32','esp32'],'pcb design':['pcb','altium','kicad'],'matlab':['matlab','simulink'],'simulation':['simulation','ansys','abaqus','comsol'],'statistics':['statistics','statistical','minitab'],'robotics':['robotics','ros','robot operating system'],'version control':['version control','git','github']};
function terms(skill){return [skill.toLowerCase(),...(aliases[skill.toLowerCase()]||[])];}
function detected(skill,text){return terms(skill).some(x=>text.includes(x));}
function renderSkills(){const d=D[$('#domain').value];$('#skill-options').innerHTML=d.skills.map((s,i)=>`<label><input type="checkbox" value="${esc(s)}">${esc(s)}</label>`).join('');}
function setMode(next){mode=next;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===next));$('#resume-mode').classList.toggle('hide',next!=='resume');$('#skills-mode').classList.toggle('hide',next!=='skills');}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('#domain').onchange=renderSkills;renderSkills();const q=new URLSearchParams(location.search).get('domain');if(q&&D[q]){$('#domain').value=q;renderSkills()}
$('#resume-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#file-status').textContent='Reading locally…';try{if(f.type==='application/pdf'||f.name.toLowerCase().endsWith('.pdf')){if(!window.pdfjsLib)throw Error('PDF reader unavailable');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;let parts=[];for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i),c=await p.getTextContent();parts.push(c.items.map(x=>x.str).join(' '))}extracted=parts.join('\n')}else extracted=await f.text();$('#file-status').textContent=`Ready: ${f.name} · ${extracted.length.toLocaleString()} characters read locally`;}catch(err){extracted='';$('#file-status').textContent='Could not read this file. Paste the resume text below instead.'}};
function evidenceCounts(text){return {projects:(text.match(/\b(project|prototype|portfolio|capstone|built|designed|developed)\b/g)||[]).length,experience:(text.match(/\b(intern|internship|experience|employed|engineer at|worked at)\b/g)||[]).length,validation:(text.match(/\b(test|tested|validated|measured|result|improved|reduced|increased|%|certif)/g)||[]).length};}
function roleResults(d,hits){return d.roles.map((r,i)=>{const focus=d.skills.filter((_,j)=>j%Math.min(d.roles.length,3)===i%3||j===i%d.skills.length);const matched=focus.filter(s=>hits.includes(s));return {name:r,score:Math.round(35+65*(matched.length/Math.max(1,focus.length))),matched,missing:focus.filter(s=>!hits.includes(s))}}).sort((a,b)=>b.score-a.score);}
function refScore(x){return .6*x.foundation_coverage+.15*Math.min(100,x.portfolio_evidence*20)+.15*Math.min(100,x.project_evidence*15)+.1*Math.min(100,x.experience_evidence*30)}
async function refs(){if(!referencePromise)referencePromise=fetch('../engineering_reference_profiles.json',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('reference unavailable');return r.json()});return referencePromise;}
$('#analyse').onclick=async()=>{const key=$('#domain').value,d=D[key],manual=[...document.querySelectorAll('#skill-options input:checked')].map(x=>x.value),other=$('#other-skills').value,resume=extracted+' '+$('#resume-text').value,evidence=$('#evidence').value,source=(mode==='resume'?resume:manual.join(' ')+' '+other).toLowerCase(),all=(source+' '+evidence).toLowerCase();if(!source.trim()){alert(mode==='resume'?'Upload a resume or paste resume text first.':'Select or enter at least one demonstrable skill.');return}const hits=d.skills.filter(s=>detected(s,all)),missing=d.skills.filter(s=>!hits.includes(s)),ev=evidenceCounts(all),evidenceScore=Math.min(100,ev.projects*12+ev.experience*22+ev.validation*6),score=Math.round(65*(hits.length/d.skills.length)+35*(evidenceScore/100)),roles=roleResults(d,hits);let position='Unavailable';try{const set=(await refs()).records.filter(x=>x.domain===key),rank=1+set.filter(x=>refScore(x)>score).length;position=`#${rank} of ${set.length}`;}catch(e){position='Reference offline'}$('#result-domain').textContent=d.name;$('#readiness-score').textContent=score+'/100';$('#reference-position').textContent=position;$('#skills-detected').textContent=`${hits.length}/${d.skills.length}`;$('#evidence-signals').textContent=ev.projects+ev.experience+ev.validation;$('#role-matches').innerHTML=roles.map((r,i)=>`<div class="role-row"><div><strong>${i+1}. ${esc(r.name)}</strong><small>${r.matched.length?`Matched: ${r.matched.map(esc).join(', ')}`:'No foundation match detected yet'}</small></div><b>${r.score}% fit</b></div>`).join('');$('#priority-gaps').innerHTML=(missing.length?missing.slice(0,4):['role-specific depth','interview evidence']).map((s,i)=>`<div class="gap"><strong>${i+1}</strong><span>${esc(s)}</span></div>`).join('');$('#skill-chart').innerHTML=d.skills.map((s,i)=>{const yes=hits.includes(s),priority=Math.max(58,100-i*7);return `<div class="skill-bar"><div><span>${esc(s)}</span><small>${yes?'Detected':'Gap'} · editorial priority ${priority}/100</small></div><div class="track"><i style="width:${yes?priority:8}%" class="${yes?'met':'miss'}"></i></div></div>`}).join('');const gap=missing[0]||d.skills[0],role=roles[0].name;$('#weekly-plan').innerHTML=`<ol><li><strong>Validate the target:</strong> review five current ${esc(role)} vacancies and record repeated requirements.</li><li><strong>Close one gap:</strong> build a small artifact demonstrating ${esc(gap)}.</li><li><strong>Make it credible:</strong> document assumptions, method, test or validation, and result.</li><li><strong>Test the market:</strong> request one practitioner review and submit two tailored applications.</li></ol><p><strong>Best proof for this domain:</strong> ${esc(d.proof)}.</p>`;$('#result').classList.remove('hide');$('#result').scrollIntoView({behavior:'smooth'});};
$('#clear-result').onclick=()=>{$('#result').classList.add('hide');$('#resume-text').value='';$('#other-skills').value='';$('#evidence').value='';$('#resume-file').value='';extracted='';document.querySelectorAll('#skill-options input').forEach(x=>x.checked=false);$('#desk').scrollIntoView({behavior:'smooth'})};
})();'''

def methodology_page():
    body='''<section class="hero"><p class="eyebrow">Trust & methodology</p><h1>What the engineering benchmark can—and cannot—say</h1><p class="lead">A precise number is not useful if its source is misleading. This page defines the evidence boundary.</p></section><h2>Dataset identity</h2><p>The file <code>engineering_reference_profiles.json</code> contains generated synthetic reference profiles. It contains no scraped resumes, real applicants, survey respondents, names, contact details or device identifiers. Synthetic records are not described as anonymized people.</p><h2>Scoring method</h2><p>The evidence-readiness score assigns 65% to detected domain foundations and 35% to evidence signals such as projects, experience, testing, validation and measured outcomes. Keyword detection is explainable but imperfect: absence from a resume does not prove absence of a skill. The synthetic position compares that score with 200 generated records in the selected domain. Ties share the same position.</p><h2>Permitted interpretation</h2><p>The dataset can test scoring behavior and show how a profile compares with a fixed reference distribution. It cannot establish a percentile among engineers, predict hiring, measure current employer demand, or represent any country’s workforce.</p><h2>Demand and skill-map boundary</h2><p>Skill priority values are editorial starter weights, not counts from current vacancies. The product deliberately does not label them as live demand. A future demand index must publish its job sources, collection dates, geography, deduplication method and sample size.</p><h2>Zero-retention architecture</h2><p>The engineering-wide desk processes resume and skill text only in page memory. PDF extraction occurs locally with PDF.js. The only same-site request is for the static synthetic reference file and does not contain user input. The desk has no profile submission endpoint, account database, advertising pixel, profile cookie, local-storage write or server-side career-history store. Inputs disappear when the page is refreshed or closed. The separate legacy mechanical learning application may store course progress locally and is not covered by this zero-retention claim.</p><h2>Future real-data standard</h2><p>If permissioned human data is introduced, publish the sample dates, geography, recruitment method, inclusion rules, sample size, missing-data handling, weighting, refresh cadence and privacy basis. Report small cohorts as insufficient rather than manufacturing precision.</p><h2>Career guidance limits</h2><p>Editorial skill maps are starting hypotheses. Users should verify them against current employer vacancies, official professional bodies, accreditation requirements and local regulations.</p>'''
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
(OUT / "app.js").write_text(hub_script(), encoding="utf-8")
(OUT / "methodology.html").write_text(methodology_page(), encoding="utf-8")
for slug, domain in DOMAINS.items():
    (OUT / f"{slug}.html").write_text(domain_page(slug, domain), encoding="utf-8")
(ROOT / "engineering_reference_profiles.json").write_text(json.dumps(make_dataset(), indent=2), encoding="utf-8")
print(f"Generated {len(DOMAINS) + 2} pages and {len(DOMAINS) * 200} synthetic reference profiles")
