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

test("shared UI uses AI stages, filters, selected evidence and scenario fallback", async () => {
    const nodes = new Map();
    const initial = { window: "365", speed: "500", network: "full" };
    const element = id => {
        if (!nodes.has(id)) nodes.set(id, { value: initial[id] || "", checked: false, options: [], innerHTML: "", textContent: "", handlers: {}, addEventListener(name, fn) { this.handlers[name] = fn; } });
        return nodes.get(id);
    };
    let requested;
    const context = {
        window: { IndustrialCore: core },
        document: { currentScript: { dataset: { dataset: "data.json?v=ai", capability: "training", exportPrefix: "ai-intelligence" } }, getElementById: element, addEventListener() {} },
        fetch: async url => { requested = url; return { ok: true, json: async () => structuredClone(data) }; },
        URLSearchParams, URL, Date, Set, Map, Blob,
        location: { search: "", href: "https://example.test/ai-intelligence/" }, navigator: {},
        setInterval, clearInterval, setTimeout, matchMedia: () => ({ matches: false })
    };
    await vm.runInNewContext(fs.readFileSync(require.resolve("../industrial/app.js"), "utf8"), context);
    assert.equal(requested, "data.json?v=ai");
    assert.equal((element("maps").innerHTML.match(/class="dot /g) || []).length, 108);
    assert.match(element("detail").innerHTML, /Foundation-model training/);
    assert.match(element("detail").innerHTML, /Released \/ operational capability/);
    assert.doesNotMatch(element("detail").innerHTML, /Established manufacturing/);
    element("domain").value = "06 · Modalities";
    element("domain").handlers.input();
    assert.equal((element("maps").innerHTML.match(/class="dot /g) || []).length, 9);
    element("coverage").value = "unknown";
    element("coverage").handlers.input();
    assert.match(element("detail").innerHTML, /not evidence of absence/);
    element("network").value = "two";
    element("network").onchange();
    assert.doesNotMatch(element("graph").innerHTML, /undefined|wafer-fab/);
    element("disrupt").value = "hbm";
    const baseline = element("maps").innerHTML;
    element("disrupt").onchange();
    assert.match(element("scenario").textContent, /exposed nodes [1-9]/);
    assert.equal(element("maps").innerHTML, baseline);
});
