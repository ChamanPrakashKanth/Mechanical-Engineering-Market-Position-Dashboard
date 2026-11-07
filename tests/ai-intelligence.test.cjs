"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const core = require("../industrial/core.js");
const data = require("../ai-intelligence/data.json");

test("AI baseline covers all layers and countries with explicit gaps", () => {
    assert.equal(core.validate(data), true);
    assert.equal(data.capabilities.length, 36);
    assert.equal(new Set(data.capabilities.map(c => c.domain)).size, 12);
    assert.deepEqual(data.countries.map(c => c.id), ["IN", "CN", "US"]);
    assert.equal(data.reviews.length, 108);
    for (const country of data.countries) for (const cap of data.capabilities) {
        const reviews = data.reviews.filter(r => r.country === country.id && r.capability === cap.id);
        assert.equal(reviews.length, 1);
        const state = core.assessment(data, country.id, cap.id, data.asOf);
        assert.equal(state.stage > 0, reviews[0].outcome === "supported");
        if (!state.stage) assert.match(reviews[0].notes, /not evidence of absence/);
    }
});

test("access and corporate origin never substitute for domestic fabrication evidence", () => {
    assert.ok(core.assessment(data, "IN", "cloud", data.asOf).stage > 0);
    assert.equal(core.assessment(data, "IN", "hbm", data.asOf).stage, 0);
    assert.equal(core.assessment(data, "IN", "logic-fab", data.asOf).stage, 0);
    assert.match(core.assessment(data, "US", "logic-fab", data.asOf).stageRationale, /Arizona/);
    for (const event of data.events) {
        assert.equal(event.kind, "evidence review");
        assert.equal(event.quantitativeChange, null);
        assert.ok(event.stage < 4, "No unsubstantiated scalable-capability claims");
        assert.equal(core.assessment(data, event.country, event.capability, "2026-11-05").stage, 0);
    }
});

test("unrecorded publication dates stay null and have unknown freshness", () => {
    for (const source of data.evidence) {
        if (source.publishedUnknown) assert.equal(source.published, null);
        assert.ok(source.accessedOn);
    }
    const unknown = data.events.find(e => data.evidence.find(s => s.id === e.source).publishedUnknown);
    const state = core.assessment(data,unknown.country,unknown.capability,data.asOf);
    assert.equal(state.publicationUnknown,true);
    assert.equal(state.stale,false);
    const changed = structuredClone(data);
    changed.evidence.find(s => s.publishedUnknown).published = data.asOf;
    assert.throws(() => core.validate(changed), /Unknown publication date/);
});

test("November 7 metrics and corroboration do not leak into the November 6 baseline", () => {
    const before=core.assessment(data,"IN","training","2026-11-06");
    assert.equal(before.metric,null);
    assert.ok(!before.sourceIds.includes("sarvam-report"));
    const after=core.assessment(data,"IN","training","2026-11-07");
    assert.equal(after.metric.value,105);
    assert.ok(after.sourceIds.includes("sarvam-report"));
});

test("absence requires sources and scope; metrics require scope and provenance", () => {
    const absent = structuredClone(data);
    const gap = absent.reviews.find(r => r.evidenceState === "not-researched");
    gap.evidenceState = "verified-absent";
    assert.throws(() => core.validate(absent), /Verified absence requires/);
    assert.ok(data.reviews.some(r => r.evidenceState === "no-qualifying-record"));
    assert.ok(data.reviews.some(r => r.evidenceState === "not-researched"));
    const invalid = structuredClone(data);
    invalid.events.find(e => e.metric).metric.scope = "";
    assert.throws(() => core.validate(invalid), /Unscoped metric/);
    assert.ok(data.events.some(e => e.sourceIds.length > 1));
});

async function app(search = "") {
    const nodes = new Map();
    const initial = {network:"full","scenario-country":"IN"};
    const element = id => {
        if (!nodes.has(id)) nodes.set(id,{value:initial[id] || "",checked:false,hidden:false,innerHTML:"",textContent:"",handlers:{},addEventListener(name,fn){this.handlers[name]=fn;}});
        return nodes.get(id);
    };
    let downloaded;
    let shared;
    class TestURL extends URL {
        static createObjectURL(blob) { downloaded=blob;return "blob:test"; }
        static revokeObjectURL() {}
    }
    const context = {
        window:{IndustrialCore:core},document:{getElementById:element,createElement:()=>({click(){}})},
        fetch:async()=>({ok:true,json:async()=>structuredClone(data)}),
        URLSearchParams,URL:TestURL,Date,Set,Map,Blob,
        location:{search,href:"https://example.test/ai-intelligence/"+search},
        navigator:{clipboard:{writeText:async text=>{shared=text;}}},setTimeout:fn=>fn()
    };
    await vm.runInNewContext(fs.readFileSync(require.resolve("../ai-intelligence/app.js"),"utf8"),context);
    return {element,downloaded:()=>downloaded,shared:()=>shared};
}

test("AI cards show names, artifact types, quantities and publication uncertainty", async () => {
    const {element}=await app();
    assert.equal((element("maps").innerHTML.match(/class="record-card"/g)||[]).length,108);
    assert.match(element("maps").innerHTML,/Publication date unknown/);
    assert.match(element("maps").innerHTML,/Released artifact \/ published research/);
    assert.match(element("maps").innerHTML,/Documented operation \/ service/);
    assert.match(element("detail").innerHTML,/105 billion parameters/);
    assert.match(element("detail").innerHTML,/training-location claims are attributed/);
    assert.equal(element("history").hidden,true);
    assert.match(element("history-note").textContent,/No history yet/);
    element("coverage").value="verified-absent";
    element("coverage").handlers.input();
    assert.match(element("detail").innerHTML,/No verified-absence records/);
});

test("country overlay labels gaps without blocking packaging disruption", async () => {
    const {element}=await app();
    element("disrupt").value="packaging";
    element("disrupt").onchange();
    assert.match(element("scenario").textContent,/India origin-evidence overlay/);
    assert.match(element("scenario").textContent,/exposed nodes [1-9]/);
    assert.match(element("graph").innerHTML,/No qualifying record entered/);
    const baseline=element("maps").innerHTML;
    element("scenario-country").value="US";
    element("scenario-country").onchange();
    assert.match(element("scenario").textContent,/United States origin-evidence overlay/);
    assert.equal(element("maps").innerHTML,baseline);
    element("alternative").checked=true;
    element("alternative").onchange();
    assert.match(element("scenario").textContent,/exposed nodes 0/);
});

test("filtered exports retain all source dates, gap state, metric scope and contextual URLs", async () => {
    const ui=await app("?selectedCountry=US&capability=logic-fab");
    await ui.element("share").onclick();
    assert.equal(new URL(ui.shared()).searchParams.get("capability"),"logic-fab");
    assert.equal(new URL(ui.shared()).hash,"#detail");
    ui.element("json").onclick();
    const exported=JSON.parse(await ui.downloaded().text());
    assert.equal(exported.assessments.length,108);
    assert.ok(exported.evidence.some(s=>s.published === null && s.publishedUnknown));
    assert.ok(exported.assessments.some(r=>r.evidenceState === "not-researched"));
    ui.element("coverage").value="no-qualifying-record";
    ui.element("coverage").handlers.input();
    ui.element("csv").onclick();
    const csv=await ui.downloaded().text();
    assert.match(csv,/metricScope,metricSource,publicationDate,publicationUnknown,accessedOn/);
    assert.match(csv,/no-qualifying-record/);
});

test("generated HTML exposes all 108 durable citations without JavaScript", () => {
    const html=fs.readFileSync(require.resolve("../ai-intelligence/index.html"),"utf8");
    for (const c of data.countries) for (const cap of data.capabilities) assert.ok(html.includes('id="'+c.id+'-'+cap.id+'"'));
    assert.match(html,/Publication|publication:/);
    assert.match(html,/date not recorded/);
    assert.doesNotMatch(html,/Material vulnerability|two-body|three-body/i);
});

