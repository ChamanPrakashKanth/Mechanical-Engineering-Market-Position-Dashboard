"use strict";
(async function () {
    const $ = id => document.getElementById(id);
    const core = window.IndustrialCore;
    const escape = value => String(value ?? "Not established").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    let data;
    try {
        const response = await fetch("data.json?v=20261105-evidence");
        if (!response.ok) throw Error("Dataset could not be loaded");
        data = await response.json();
        core.validate(data);
    } catch (error) {
        $("status").textContent = "Evidence unavailable. " + error.message;
        return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const endDate = data.asOf < today ? data.asOf : today;
    const firstDate = data.events.map(event => event.knownOn).sort()[0] || endDate;
    let selected = { country: "IN", capability: "osat" };
    let timer;
    let windowEnd = endDate;
    const params = new URLSearchParams(location.search);
    const allowed = (id, value) => [...$(id).options].some(option => option.value === value);
    const offset = (date, days) => new Date(Date.parse(date) + days * 86400000).toISOString().slice(0, 10);
    const option = (value, text) => '<option value="' + escape(value) + '">' + escape(text) + "</option>";
    $("domain").innerHTML += [...new Set(data.capabilities.map(capability => capability.domain))].map(domain => option(domain, domain)).join("");
    $("disrupt").innerHTML += data.nodes.map(node => option(node.id, node.name + " · " + node.type)).join("");
    for (const id of ["domain", "country", "coverage", "window", "speed", "disrupt", "network"]) {
        if (allowed(id, params.get(id))) $(id).value = params.get(id);
    }
    $("search").value = params.get("search") || "";
    $("alternative").checked = params.get("alternative") === "1";
    $("domestic").checked = params.get("domestic") === "1";
    $("date").min = firstDate;
    $("date").max = endDate;
    const requestedDate = params.get("date");
    $("date").value = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate || "") && requestedDate >= firstDate && requestedDate <= endDate ? requestedDate : endDate;
    if (data.countries.some(country => country.id === params.get("selectedCountry")) && data.capabilities.some(capability => capability.id === params.get("capability"))) {
        selected = { country: params.get("selectedCountry"), capability: params.get("capability") };
    }
    const requestedWindowEnd = params.get("windowEnd");
    if (/^\d{4}-\d{2}-\d{2}$/.test(requestedWindowEnd || "") && requestedWindowEnd >= $("date").value && requestedWindowEnd <= endDate) windowEnd = requestedWindowEnd;
    if ($("date").value < offset(windowEnd, 1 - Number($("window").value))) windowEnd = $("date").value;
    function rangeStart() {
        const start = offset(windowEnd, 1 - Number($("window").value));
        return start < firstDate ? firstDate : start;
    }
    function view() {
        const search = $("search").value.toLowerCase().trim();
        return data.capabilities.filter(capability => (!$("domain").value || capability.domain === $("domain").value) && (capability.id + " " + capability.name + " " + capability.domain).toLowerCase().includes(search));
    }
    function countries() {
        return data.countries.filter(country => !$("country").value || country.id === $("country").value);
    }
    function matches(state) {
        const filter = $("coverage").value;
        return !filter || (filter === "known" && state.stage > 0) || (filter === "unknown" && state.stage === 0) || (filter === "vulnerable" && state.dependencies.some(dependency => dependency.materialVulnerability));
    }
    function rows() {
        return countries().flatMap(country => view().map(capability => {
            const state = core.assessment(data, country.id, capability.id, $("date").value);
            return {
                ...state,
                eventId: state.id || null,
                country: country.id,
                countryName: country.name,
                id: capability.id,
                name: capability.name,
                domain: capability.domain,
                sourceUrl: data.evidence.find(source => source.id === state.source)?.url || null
            };
        }).filter(matches));
    }
    function sourceLink(event) {
        const source = data.evidence.find(source => source.id === event.source);
        return source ? '<a href="' + escape(source.url) + '" target="_blank" rel="noopener noreferrer">' + escape(source.title) + "</a>" : "No verified source in this view";
    }
    function renderDetail() {
        const capability = data.capabilities.find(capability => capability.id === selected.capability);
        const country = data.countries.find(country => country.id === selected.country);
        const state = core.assessment(data, country.id, capability.id, $("date").value);
        const previous = core.assessment(data, country.id, capability.id, offset(rangeStart(), -1));
        const review = (data.reviews || []).find(item => item.country === country.id && item.capability === capability.id && item.reviewedOn <= $("date").value);
        const source = data.evidence.find(item => item.id === state.source);
        const dependencies = state.dependencies.length ? state.dependencies.map(dependency => escape(dependency.name)).join(", ") : "Supplier-specific dependencies and concentration have not been assessed.";
        const entities = state.entities || [];
        const nodes = data.nodes.filter(node => node.id === capability.id || data.edges.some(edge => edge.to === capability.id && edge.from === node.id));
        $("detail").innerHTML = `
            <p class="eyebrow">${escape(country.name + " / " + capability.domain)}</p>
            <h2 id="detail-title">${escape(capability.name)}</h2>
            <p>${escape(capability.definition)}</p>
            <p class="assessment-note"><strong>Stage ${state.stage} · ${escape(core.stages[state.stage])}</strong><br>
            ${escape(state.stageRationale || review?.notes || "No additional stage rationale in this historical record.")}
            ${state.kind === "evidence review" ? "<br>Research coverage assessment. The record date does not mark a new factory opening or a new technical achievement." : ""}</p>
            <div class="facts">
                <p><strong>Before window</strong><br>${escape(core.stages[previous.stage])}</p>
                <p><strong>Selected day</strong><br>${escape(core.stages[state.stage])}</p>
                <p><strong>Evidence confidence</strong><br>${escape(state.confidence)}</p>
            </div>
            <div class="branches">
                <div class="branch">
                    <h3>The Gap</h3>
                    <p>Domestic value-add — ${escape(state.valueAdd)}<br>
                    Supplier diversity — ${escape(state.diversification)}<br>
                    Import concentration — ${escape(state.importConcentration)}</p>
                </div>
                <div class="branch">
                    <h3>What Is Running</h3>
                    <p>${escape(state.milestone || "No verified operating milestone recorded as of this date.")}</p>
                    <p>Verified capacity — ${escape(state.capacity)}<br>
                    Industrial scale — ${escape(state.industrialScale)}</p>
                    <p>${sourceLink(state)}</p>
                    <div class="graph">
                        ${entities.map(entity => '<span class="node">' + escape(entity.name + " / " + entity.type) + "</span>").join('<span aria-label="connected to">↔</span>')}
                    </div>
                    <p>Record date — ${escape(state.date)}<br>
                    Knowledge date — ${escape(state.knownOn)}<br>
                    Source observation bound — ${escape(state.evidenceAsOf || source?.published)}<br>
                    Date basis — ${escape(source?.dateBasis || "Dated source")}
                    ${state.stale ? "<br>◷ Evidence needs a freshness review" : ""}</p>
                </div>
                <div class="branch">
                    <h3>Where It Is Stuck</h3>
                    <p>${dependencies}</p>
                    ${review && state.stage === 0 ? "<p>Reviewed " + escape(review.reviewedOn) + " — " + escape(review.notes) + "</p>" : ""}
                    <p>${escape(state.notes || "Evidence gaps require review before an assessment can be made.")}</p>
                    <div class="graph">
                        ${nodes.map(node => '<span class="node">' + escape(node.name + " · " + node.type) + "</span>").join('<span aria-label="connected to">→</span>')}
                    </div>
                    <p>Illustrative process relationships. Connected company and programme nodes above follow the selected evidence record.</p>
                </div>
                <div class="branch">
                    <h3>The Two Clocks</h3>
                    <p>Disruption impact time — unknown<br>Capability replacement time — unknown</p>
                    <p>Timing requires inventory, qualification and supplier evidence.</p>
                </div>
            </div>
            <h3>Three-country comparison · ${escape(capability.name)}</h3>
            <div class="comparison" role="region" aria-label="Capability comparison table" tabindex="0">
                <table>
                    <caption>Before the window and as known on ${escape($("date").value)}</caption>
                    <thead><tr><th scope="col">Country</th><th scope="col">Before</th><th scope="col">Selected day</th><th scope="col">Scale / capacity</th><th scope="col">Import concentration</th><th scope="col">Supplier diversity</th><th scope="col">Confidence</th></tr></thead>
                    <tbody>${data.countries.map(item => {
                        const after = core.assessment(data, item.id, capability.id, $("date").value);
                        const before = core.assessment(data, item.id, capability.id, offset(rangeStart(), -1));
                        return "<tr><th scope=\"row\">" + escape(item.name) + "</th><td>" + escape(core.stages[before.stage]) + "</td><td>" + escape(core.stages[after.stage]) + "</td><td>" + escape(after.capacity || after.industrialScale) + "</td><td>" + escape(after.importConcentration) + "</td><td>" + escape(after.diversification) + "</td><td>" + escape(after.confidence) + "</td></tr>";
                    }).join("")}</tbody>
                </table>
            </div>`;
    }
    function renderCommits() {
        const visibleCapabilities = new Set(view().map(capability => capability.id));
        const visibleCountries = new Set(countries().map(country => country.id));
        const events = data.events.filter(event => event.knownOn >= rangeStart() && event.knownOn <= $("date").value && event.date <= $("date").value && visibleCapabilities.has(event.capability) && visibleCountries.has(event.country) && matches(core.assessment(data, event.country, event.capability, $("date").value))).sort((a, b) => b.knownOn.localeCompare(a.knownOn));
        const renderRecord = event => `
            <article class="commit">
                <h3>${escape(event.id)}</h3>
                <p>${escape(event.date + " · known by " + event.knownOn + " · " + event.kind + " · " + event.verification)}</p>
                <p>${escape(core.stages[event.previousStage] + " → " + core.stages[event.stage])}</p>
                <p>${escape(event.milestone)}</p>
                ${event.stageRationale ? "<p>" + escape(event.stageRationale) + "</p>" : ""}
                <p>Quantitative change — ${escape(event.quantitativeChange)}</p>
                <p>${sourceLink(event)}</p>
                <p>${escape(event.notes)}</p>
            </article>`;
        const milestones = events.filter(event => event.kind !== "evidence review");
        const reviews = events.filter(event => event.kind === "evidence review");
        $("commits").innerHTML = milestones.map(renderRecord).join("") +
            (reviews.length ? "<details><summary>" + reviews.length + " evidence reviews · coverage updates</summary>" + reviews.map(renderRecord).join("") + "</details>" : "") +
            (!events.length ? "<p>No recorded changes in this date window and filter. Unchanged days preserve their existing assessment.</p>" : "");
    }
    function renderAudit() {
        const currentRows = rows();
        const assessed = currentRows.filter(row => row.stage > 0);
        $("research-summary").innerHTML = [
            [currentRows.length, "visible country-capability pairs"],
            [assessed.length, "supported assessments"],
            [currentRows.length - assessed.length, "insufficient evidence"],
            [new Set(assessed.map(row => row.source)).size, "referenced sources"]
        ].map(([count, label]) => "<span><strong>" + count + "</strong> " + escape(label) + "</span>").join("");
        $("criteria").innerHTML = (data.stageCriteria || []).map(rule => "<li>" + escape(rule) + "</li>").join("");
        $("audit").innerHTML = '<table><thead><tr><th scope="col">Country / capability</th><th scope="col">Stage</th><th scope="col">Reason and source</th><th scope="col">Source observation</th></tr></thead><tbody>' + currentRows.map(row => {
            const review = (data.reviews || []).find(item => item.country === row.country && item.capability === row.id && item.reviewedOn <= $("date").value);
            const source = data.evidence.find(item => item.id === row.source);
            return '<tr><th scope="row">' + escape(row.countryName + " / " + row.name) + '</th><td>' + row.stage + " · " + escape(core.stages[row.stage]) + '</td><td>' + escape(row.stageRationale || review?.notes || "Existing historical source record.") + '<div class="review-link">' + sourceLink(row) + '</div></td><td>' + escape(row.evidenceAsOf || source?.published || "Unestablished") + '<br>' + escape(source?.dateBasis || "") + '</td></tr>';
        }).join("") + "</tbody></table>";
    }
    function renderScenario() {
        const input = $("disrupt").value;
        const alternatives = $("alternative").checked ? [input] : [];
        const domestic = $("domestic").checked ? [input] : [];
        const affected = core.propagate(data.edges, input ? [input] : [], alternatives, domestic);
        $("scenario").textContent = "Baseline disrupted nodes 0 → scenario exposed nodes " + affected.length + ". This scenario is separate from verified capability colors.";
        let nodes = data.nodes;
        let edges = data.edges;
        if ($("network").value !== "full") {
            const target = data.nodes.some(node => node.id === selected.capability) ? selected.capability : "wafer-fab";
            const count = $("network").value === "two" ? 1 : 2;
            edges = data.edges.filter(edge => edge.to === target).slice(0, count);
            nodes = data.nodes.filter(node => node.id === target || edges.some(edge => edge.from === node.id));
        }
        $("graph").innerHTML = nodes.map(node => '<span class="node ' + (affected.includes(node.id) ? "affected" : "") + '">' + escape(node.name) + '<br><small>' + escape(node.type) + (affected.includes(node.id) ? " · exposed" : " · baseline") + '</small></span>').join("") + '<p>' + edges.map(edge => escape(data.nodes.find(node => node.id === edge.from).name + " → " + data.nodes.find(node => node.id === edge.to).name)).join("<br>") + "</p>";
    }
    function render() {
        const start = rangeStart();
        if ($("date").value < start) $("date").value = start;
        if (!$("date").value || $("date").value > endDate) $("date").value = endDate;
        const date = $("date").value;
        const visibleRows = rows();
        if (!visibleRows.some(row => row.country === selected.country && row.id === selected.capability) && visibleRows.length) {
            selected = { country: visibleRows[0].country, capability: visibleRows[0].id };
        }
        $("scrub").min = Math.round(Date.parse(start) / 86400000);
        $("scrub").max = Math.round(Date.parse(windowEnd) / 86400000);
        $("scrub").value = Math.round(Date.parse(date) / 86400000);
        $("time-caption").textContent = start + " → " + windowEnd + " · viewing " + date + " · no records beyond dataset cutoff";
        $("status").textContent = date === data.asOf
            ? data.coverageNote + " Dataset reviewed " + data.asOf + "."
            : "Historical knowledge view for " + date + ". Coverage and records below include only evidence entered by this date.";
        $("maps").innerHTML = countries().map(country => {
            const states = view().map(capability => ({ capability, state: core.assessment(data, country.id, capability.id, date) })).filter(item => matches(item.state));
            return '<article class="country"><h2>' + escape(country.name) + '</h2><small>' + states.filter(item => item.state.stage > 0).length + ' assessed / ' + states.length + ' visible definitions</small><div class="dots">' + states.map(({ capability, state }) => {
                const label = country.name + " · " + capability.name + " · Stage " + state.stage + " · " + core.stages[state.stage] + (state.stale ? " · stale evidence" : "");
                return '<button class="dot stage' + state.stage + (state.dependencies.some(dependency => dependency.materialVulnerability) ? " vulnerable" : "") + '" data-country="' + country.id + '" data-capability="' + capability.id + '" aria-label="' + escape(label) + '" title="' + escape(label) + '" aria-pressed="' + (country.id === selected.country && capability.id === selected.capability) + '">' + '<span class="stage-number">' + state.stage + '</span>' + (state.stale ? '<span class="stale-marker" aria-hidden="true">◷</span>' : "") + '</button>';
            }).join("") + '</div>' + (!states.length ? "<p>No capabilities match these filters.</p>" : "") + "</article>";
        }).join("");
        if (visibleRows.length) renderDetail();
        else $("detail").innerHTML = '<h2 id="detail-title">No matching capabilities</h2><p>Adjust the filters to inspect a capability.</p>';
        renderCommits();
        renderAudit();
        renderScenario();
    }
    function pause() {
        clearInterval(timer);
        timer = undefined;
        $("play").disabled = false;
    }
    function play() {
        pause();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            $("status").textContent = "Reduced motion is enabled. Use the date selector or timeline slider to step through history.";
            return;
        }
        if ($("date").value >= windowEnd) $("date").value = rangeStart();
        $("play").disabled = true;
        timer = setInterval(() => {
            if ($("date").value >= windowEnd) { pause(); return; }
            $("date").value = offset($("date").value, 1);
            render();
        }, Number($("speed").value));
        render();
    }
    $("maps").addEventListener("click", event => {
        const button = event.target.closest("[data-capability]");
        if (!button) return;
        selected = { country: button.dataset.country, capability: button.dataset.capability };
        $("maps").querySelectorAll("[aria-pressed]").forEach(dot => dot.setAttribute("aria-pressed", dot === button ? "true" : "false"));
        renderDetail();
        renderScenario();
    });
    for (const id of ["search", "domain", "country", "coverage", "date", "window"]) {
        $(id).addEventListener("input", () => {
            pause();
            if (id === "date") {
                if (!$("date").value || $("date").value < firstDate || $("date").value > endDate) {
                    $("date").value = endDate;
                }
                if ($("date").value < rangeStart() || $("date").value > windowEnd) windowEnd = $("date").value;
            }
            render();
        });
    }
    $("scrub").addEventListener("input", () => {
        pause();
        $("date").value = new Date(Number($("scrub").value) * 86400000).toISOString().slice(0, 10);
        render();
    });
    $("play").onclick = play;
    $("pause").onclick = pause;
    $("replay").onclick = () => { $("date").value = rangeStart(); play(); };
    $("speed").onchange = () => { if (timer) play(); };
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
    for (const id of ["disrupt", "alternative", "domestic", "network"]) $(id).onchange = renderScenario;
    $("reset").onclick = () => { $("disrupt").value = ""; $("alternative").checked = false; $("domestic").checked = false; renderScenario(); };
    $("share").onclick = async () => {
        const url = new URL(location.href);
        url.search = "";
        for (const id of ["search", "domain", "country", "coverage", "date", "window", "speed", "disrupt", "network"]) url.searchParams.set(id, $(id).value);
        for (const id of ["alternative", "domestic"]) url.searchParams.set(id, $(id).checked ? "1" : "0");
        url.searchParams.set("windowEnd", windowEnd);
        url.searchParams.set("selectedCountry", selected.country);
        url.searchParams.set("capability", selected.capability);
        try { await navigator.clipboard.writeText(url.href); $("scenario").textContent = "Scenario URL copied."; }
        catch { $("scenario").textContent = "Copy this scenario URL — " + url.href; }
    };
    function download(name, content, type) {
        const url = URL.createObjectURL(new Blob([content], { type }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = name;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    $("json").onclick = () => {
        const assessments = rows();
        const sourceIds = new Set(assessments.map(row => row.source));
        download("industrial-view-" + $("date").value + ".json", JSON.stringify({ date: $("date").value, assessments, evidence: data.evidence.filter(source => sourceIds.has(source.id)) }, null, 2), "application/json");
    };
    $("csv").onclick = () => {
        const columns = ["country", "id", "name", "domain", "stage", "confidence", "capacity", "valueAdd", "diversification", "importConcentration", "industrialScale", "date", "knownOn", "evidenceAsOf", "kind", "stageRationale", "source", "sourceUrl"];
        const cell = value => '"' + String(value ?? "").replace(/"/g, '""').replace(/^[=+@-]/, "'$&") + '"';
        const content = [columns.join(","), ...rows().map(row => columns.map(column => cell(row[column])).join(","))].join("\r\n");
        download("industrial-view-" + $("date").value + ".csv", content, "text/csv");
    };
    render();
})();
