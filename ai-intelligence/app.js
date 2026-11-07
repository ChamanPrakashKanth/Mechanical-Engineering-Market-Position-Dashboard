"use strict";
(async function () {
    const $ = id => document.getElementById(id);
    const core = window.IndustrialCore;
    const esc = value => String(value ?? "Not established").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    let data;
    try {
        const response = await fetch("data.json?v=20261107-review");
        if (!response.ok) throw Error("Dataset unavailable");
        data = await response.json();
        core.validate(data);
    } catch (error) { $("status").textContent = "Interactive data unavailable. Read the static records below. " + error.message; return; }
    const params = new URLSearchParams(location.search);
    const countries = new Map(data.countries.map(c => [c.id,c]));
    const capabilities = new Map(data.capabilities.map(c => [c.id,c]));
    let selected = {country:countries.has(params.get("selectedCountry")) ? params.get("selectedCountry") : "IN", capability:capabilities.has(params.get("capability")) ? params.get("capability") : "training"};
    let selectedDate = data.asOf;
    const cycles = [...new Set(data.assessmentReviewDates || data.events.map(e => e.knownOn))].sort();
    $("history").hidden = cycles.length < 2;
    $("date").innerHTML = cycles.map(date => '<option value="'+date+'">'+date+'</option>').join("");
    $("date").value = cycles.at(-1);
    $("history-note").textContent = cycles.length < 2 ? "Assessment baseline " + cycles[0] + " · No history yet. Source metadata and presentation corrected " + (data.metadataReviewedOn || data.asOf) + "." : "Select an actual recorded review cycle. Source publication dates do not backdate assessments.";
    $("domain").innerHTML += [...new Set(data.capabilities.map(c => c.domain))].map(domain => '<option value="'+esc(domain)+'">'+esc(domain)+'</option>').join("");
    $("disrupt").innerHTML += data.nodes.map(node => '<option value="'+node.id+'">'+esc(node.name)+'</option>').join("");
    for (const id of ["domain","country","coverage","disrupt","network"]) {
        const choices = id === "domain" ? ["",...new Set(data.capabilities.map(c => c.domain))] : id === "country" ? ["",...countries.keys()] : id === "coverage" ? ["",...Object.keys(data.evidenceStates)] : id === "disrupt" ? ["",...data.nodes.map(n => n.id)] : ["full","one","two"];
        if (choices.includes(params.get(id))) $(id).value = params.get(id);
    }
    $("search").value = params.get("search") || "";
    if (params.has("windowEnd")) {
        if (params.get("network") === "two") $("network").value = "one";
        if (params.get("network") === "three") $("network").value = "two";
    }
    $("alternative").checked = params.get("alternative") === "1" || params.get("domestic") === "1";
    $("scenario-country").value = countries.has(params.get("scenarioCountry")) ? params.get("scenarioCountry") : selected.country;
    const reviewFor = (country,capability) => data.reviews.filter(r => r.country === country && r.capability === capability && r.reviewedOn <= selectedDate).at(-1);
    function row(country,capability) {
        const assessment = core.assessment(data,country,capability,selectedDate);
        const review = reviewFor(country,capability);
        return {...assessment, country, capability, countryName:countries.get(country).name, name:capabilities.get(capability).name, definition:capabilities.get(capability).definition, attribution:capabilities.get(capability).attribution, evidenceState:assessment.stage > 0 ? "supported" : review?.evidenceState || "not-researched", review, sourceIds:assessment.sourceIds || review?.sourceIds || []};
    }
    function rows() {
        const query = $("search").value.trim().toLowerCase();
        return data.countries.filter(c => !$("country").value || c.id === $("country").value).flatMap(country => data.capabilities.filter(cap => (!$("domain").value || cap.domain === $("domain").value) && (cap.name+" "+cap.domain+" "+cap.definition).toLowerCase().includes(query)).map(cap => row(country.id,cap.id))).filter(r => !$("coverage").value || r.evidenceState === $("coverage").value);
    }
    const metricText = r => r.metric ? r.metric.value + " " + r.metric.unit + " · " + r.metric.label : "Quantity not established";
    const stateText = r => data.evidenceStates[r.evidenceState];
    const freshness = r => !r.stage ? "No dated supporting record" : r.publicationUnknown ? "Publication date unknown · freshness undetermined" : r.stale ? "◷ Publication over 180 days old" : "Publication within 180 days; current operation not independently reverified";
    function sourceList(ids) {
        return ids.map(id => {
            const source = data.evidence.find(s => s.id === id);
            return source ? '<li><a href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">'+esc(source.title)+'</a><br>'+esc(source.kind)+'<br>Publication: '+esc(source.published || "date not recorded")+' · Accessed: '+esc(source.accessedOn)+'<br>'+esc(source.dateBasis)+'</li>' : "";
        }).join("");
    }
    function renderDetail() {
        const r = row(selected.country,selected.capability);
        const cap = capabilities.get(selected.capability);
        $("detail").innerHTML = '<p class="eyebrow">'+esc(r.countryName+" / "+cap.domain)+'</p><h2 id="detail-title">'+esc(cap.name)+'</h2><p>'+esc(cap.definition)+'</p><p><strong>Attribution: </strong>'+esc(cap.attribution)+'</p><p>'+esc(cap.adoptionScope)+'</p><div class="assessment-note"><strong>'+esc(r.stage ? "Stage "+r.stage+" · "+r.recordType : stateText(r))+'</strong><p>'+esc(r.stageRationale || r.review?.notes || "No review record entered")+'</p><p>'+esc(r.corroboration || r.review?.researchStatus)+'</p></div><p class="metric">'+esc(metricText(r))+'</p>'+(r.metric ? '<p>'+esc(r.metric.scope)+' · Metric source: '+esc(r.metric.source)+' · Metric checked '+esc(r.metric.observedOn)+'</p>' : '<p>No numerical estimate has been substituted. Different measures and scopes do not form a country ranking.</p>')+'<p class="'+(r.publicationUnknown ? "date-unknown" : "")+'">'+esc(freshness(r))+'</p><p>Assessment entered: '+esc(r.knownOn || r.review?.reviewedOn)+' · Source metadata revised: '+esc(data.metadataReviewedOn || data.asOf)+'</p><h3>Sources and verification limits</h3><ul>'+sourceList(r.sourceIds)+'</ul><p><a href="#'+r.country+'-'+r.capability+'">Permanent static citation</a></p><h3>Same definition across countries</h3><div class="comparison" role="region" aria-label="Same capability evidence comparison" tabindex="0"><table><thead><tr><th>Country</th><th>Evidence state / record type</th><th>Quantity and scope</th><th>Publication status</th></tr></thead><tbody>'+data.countries.map(c => {
            const other = row(c.id,selected.capability);
            return '<tr><th scope="row">'+esc(c.name)+'</th><td>'+esc(other.stage ? other.recordType : stateText(other))+'</td><td>'+esc(metricText(other))+'<br>'+esc(other.metric?.scope || "No comparable quantity entered")+'</td><td>'+esc(freshness(other))+'</td></tr>';
        }).join("")+'</tbody></table></div>';
    }
    function renderScenario() {
        const country = $("scenario-country").value;
        const input = $("disrupt").value;
        const affected = core.propagate(data.edges,input ? [input] : [],$("alternative").checked ? [input] : []);
        let edges = data.edges;
        let nodes = data.nodes;
        if ($("network").value !== "full") {
            const count = $("network").value === "one" ? 1 : 2;
            edges = edges.filter(e => e.to === selected.capability).slice(0,count);
            nodes = nodes.filter(n => n.id === selected.capability || edges.some(e => e.from === n.id));
        }
        $("scenario").textContent = countries.get(country).name+" origin-evidence overlay · scenario exposed nodes "+affected.length+". Evidence gaps do not block propagation. National losses and availability remain unassessed.";
        $("graph").innerHTML = nodes.map(n => {
            const r = row(country,n.id);
            return '<span class="node '+(affected.includes(n.id) ? "affected" : "")+'">'+esc(n.name)+'<small>'+esc(r.stage ? "Origin evidence: stage "+r.stage : stateText(r))+'</small><small>'+esc(affected.includes(n.id) ? "Structurally exposed in this scenario" : "Not reached in this scenario; availability unassessed")+'</small></span>';
        }).join("")+'<p>'+edges.map(e => esc(capabilities.get(e.from).name+" → "+capabilities.get(e.to).name)).join("<br>")+'</p>'+(!nodes.length ? '<p>No direct-input relationship has been entered for the selected capability.</p>' : "");
    }
    function render() {
        const visible = rows();
        if (visible.length && !visible.some(r => r.country === selected.country && r.capability === selected.capability)) selected={country:visible[0].country,capability:visible[0].capability};
        const documented = visible.filter(r => r.stage > 0);
        $("status").textContent = data.coverageNote;
        $("research-summary").innerHTML = [[visible.length,"visible records / gaps"],[documented.length,"documented records"],[visible.length-documented.length,"research gaps"],[new Set(documented.flatMap(r => r.sourceIds)).size,"referenced sources"]].map(([count,label]) => '<span><strong>'+count+'</strong> '+esc(label)+'</span>').join("");
        $("maps").innerHTML = data.countries.filter(c => !$("country").value || c.id === $("country").value).map(c => '<article class="country"><h2>'+esc(c.name)+'</h2><p>Domestic-origin records. Adoption of shared or foreign technology is not assessed.</p><div class="record-list">'+visible.filter(r => r.country === c.id).map(r => '<button class="record-card" data-country="'+c.id+'" data-capability="'+r.capability+'" aria-pressed="'+(selected.country===c.id && selected.capability===r.capability)+'"><strong><span class="stage-badge stage'+r.stage+'" aria-hidden="true">'+(r.stage || "?")+'</span>'+esc(r.name)+'</strong><small>'+esc(r.stage ? "Stage "+r.stage+" · "+r.recordType : stateText(r))+'</small><small>'+esc(metricText(r))+'</small>'+(r.metric ? '<small>'+esc(r.metric.scope)+'</small>' : '')+'<small class="'+(r.publicationUnknown ? "date-unknown" : "")+'">'+esc(freshness(r))+'</small></button>').join("")+'</div>'+(!visible.some(r => r.country===c.id) ? '<p>No records match these filters.</p>' : "")+'</article>').join("");
        if (visible.length) renderDetail(); else $("detail").innerHTML='<h2 id="detail-title">No matching records</h2><p>Adjust the filters. No verified-absence records have been entered in this baseline.</p>';
        $("criteria").innerHTML=data.stageCriteria.map(s => '<li>'+esc(s)+'</li>').join("");
        renderScenario();
    }
    for (const id of ["search","domain","country","coverage"]) $(id).addEventListener("input",render);
    $("maps").addEventListener("click",event => {
        const button=event.target.closest("[data-capability]");
        if (!button) return;
        selected={country:button.dataset.country,capability:button.dataset.capability};
        $("scenario-country").value=selected.country;
        render();
    });
    $("date").onchange=() => {selectedDate=$("date").value;render();};
    for (const id of ["disrupt","network","alternative","scenario-country"]) $(id).onchange=renderScenario;
    $("reset").onclick=() => {$("disrupt").value="";$("alternative").checked=false;renderScenario();};
    $("share").onclick=async () => {
        const url=new URL(location.href);url.search="";url.hash="detail";
        for (const id of ["search","domain","country","coverage","disrupt","network"]) if ($(id).value) url.searchParams.set(id,$(id).value);
        url.searchParams.set("selectedCountry",selected.country);url.searchParams.set("capability",selected.capability);url.searchParams.set("scenarioCountry",$("scenario-country").value);
        if ($("alternative").checked) url.searchParams.set("alternative","1");
        try {await navigator.clipboard.writeText(url.href);$("scenario").textContent="Record / scenario URL copied.";} catch {$("scenario").textContent="Copy this URL: "+url.href;}
    };
    function download(name,content,type) {
        const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    $("json").onclick=() => {
        const assessments=rows();const ids=new Set(assessments.flatMap(r => r.sourceIds));
        download("ai-intelligence-"+selectedDate+".json",JSON.stringify({asOf:selectedDate,assessmentBaseline:cycles[0],metadataReviewedOn:data.metadataReviewedOn,researchMethod:data.researchMethod,assessments,evidence:data.evidence.filter(s => ids.has(s.id))},null,2),"application/json");
    };
    $("csv").onclick=() => {
        const columns=["country","capability","name","definition","attribution","evidenceState","stage","recordType","metricValue","metricUnit","metricScope","metricSource","publicationDate","publicationUnknown","accessedOn","sourceIds","sourceUrls","corroboration","researchStatus"];
        const cell=value=>'"'+String(value ?? "").replace(/"/g,'""').replace(/^[=+@-]/,"'$&")+'"';
        const records=rows().map(r => {const source=data.evidence.find(s=>s.id===r.source);return {...r,metricValue:r.metric?.value,metricUnit:r.metric?.unit,metricScope:r.metric?.scope,metricSource:r.metric?.source,publicationDate:source?.published,publicationUnknown:source?.publishedUnknown,accessedOn:source?.accessedOn,sourceIds:r.sourceIds.join(" | "),sourceUrls:r.sourceIds.map(id=>data.evidence.find(s=>s.id===id).url).join(" | "),researchStatus:r.review?.researchStatus};});
        download("ai-intelligence-"+selectedDate+".csv",[columns.join(","),...records.map(r=>columns.map(k=>cell(r[k])).join(","))].join("\r\n"),"text/csv");
    };
    render();
})();
