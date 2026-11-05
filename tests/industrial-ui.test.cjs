"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const core = require("../industrial/core.js");
const data = require("../industrial/data.json");
async function app() {
    const nodes = new Map();
    const initial = { window: "365", speed: "500", network: "full", date: "", search: "", country: "", domain: "", coverage: "", disrupt: "" };
    function element(id) {
        if (!nodes.has(id)) nodes.set(id, {
            value: initial[id] || "",
            checked: false,
            options: [],
            innerHTML: "",
            textContent: "",
            handlers: {},
            addEventListener(name, handler) { this.handlers[name] = handler; }
        });
        return nodes.get(id);
    }
    const context = {
        window: { IndustrialCore: core },
        document: { getElementById: element, addEventListener() {} },
        fetch: async () => ({ ok: true, json: async () => JSON.parse(JSON.stringify(data)) }),
        URLSearchParams, URL, Date, Set, Map, Blob,
        location: { search: "", href: "https://example.test/industrial/" },
        navigator: {},
        setInterval, clearInterval, setTimeout,
        matchMedia: () => ({ matches: false })
    };
    await vm.runInNewContext(fs.readFileSync(require.resolve("../industrial/app.js"), "utf8"), context);
    return element;
}
test("assessed-only filtering retains capability IDs and matching detail", async () => {
    const element = await app();
    element("coverage").value = "known";
    element("coverage").handlers.input();
    assert.equal((element("maps").innerHTML.match(/class="dot /g) || []).length, 3);
    assert.match(element("detail").innerHTML, /Chip assembly and test/);
    assert.match(element("maps").innerHTML, /data-capability="osat"/);
    assert.doesNotMatch(element("maps").innerHTML, /data-capability="IN-osat-production"/);
});
test("date views and filters do not expose later production commits", async () => {
    const element = await app();
    element("date").value = "2026-07-03";
    element("date").handlers.input();
    assert.doesNotMatch(element("commits").innerHTML, /IN-osat-production/);
    assert.match(element("detail").innerHTML, /CG Power inaugurated/);
    element("search").value = "turbines";
    element("search").handlers.input();
    assert.equal((element("maps").innerHTML.match(/class="dot /g) || []).length, 3);
    assert.match(element("detail").innerHTML, /Aero-engine hot sections/);
    assert.doesNotMatch(element("detail").innerHTML, /CG Power/);
});
test("sandbox substitutions leave verified grids unchanged", async () => {
    const element = await app();
    const grid = element("maps").innerHTML;
    element("disrupt").value = "supplier";
    element("disrupt").onchange();
    assert.match(element("scenario").textContent, /nodes 5/);
    element("alternative").checked = true;
    element("alternative").onchange();
    assert.match(element("scenario").textContent, /nodes 0/);
    assert.equal(element("maps").innerHTML, grid);
});
