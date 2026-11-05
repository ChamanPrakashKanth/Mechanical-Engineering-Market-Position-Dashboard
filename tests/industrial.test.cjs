"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../industrial/core.js");
const data = require("../industrial/data.json");
test("starter evidence passes schema checks", () => assert.equal(core.validate(data), true));
test("historical state excludes production evidence that became known later", () => {
    assert.equal(core.assessment(data, "IN", "osat", "2025-08-27").stage, 0);
    assert.equal(core.assessment(data, "IN", "osat", "2026-07-03").stage, 2);
    assert.equal(core.assessment(data, "IN", "osat", "2026-07-04").stage, 3);
    assert.equal(core.assessment(data, "US", "wafer-fab", "2025-01-01").stage, 0);
});
test("time alone never darkens dots and unknown implies no dependency assessment", () => {
    const early = core.assessment(data, "IN", "osat", "2025-09-01");
    const later = core.assessment(data, "IN", "osat", "2026-06-01");
    assert.equal(early.stage, later.stage);
    assert.equal(early.stale, false);
    assert.equal(later.stale, true);
    assert.deepEqual(core.assessment(data, "CN", "turbines", data.asOf).dependencies, []);
});
test("propagation handles indirect dependencies, cycles and substitutable inputs", () => {
    const edges = [{ from: "a", to: "b" }, { from: "b", to: "c" }, { from: "c", to: "a" }];
    assert.deepEqual(core.propagate(edges, ["a"]), ["a", "b", "c"]);
    assert.deepEqual(core.propagate(edges, ["a"], ["b"]), ["a"]);
    assert.deepEqual(core.propagate(edges, ["a"], [], ["a"]), []);
});
test("scenarios never mutate verified evidence", () => {
    const before = JSON.stringify(data);
    core.propagate(data.edges, ["lithography"]);
    assert.equal(JSON.stringify(data), before);
});
test("unverified stage changes and future events are rejected", () => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.events[0].verification = "announcement";
    assert.throws(() => core.validate(copy), /Unverified/);
    copy.events[0].verification = "verified";
    copy.events[0].knownOn = "2099-01-01";
    assert.throws(() => core.validate(copy), /dates/);
});
test("announcements preserve established stages and inconsistent commit history fails", () => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.events.push({ ...copy.events[1], id: "announcement", date: "2026-11-05", knownOn: "2026-11-05", stage: 3, previousStage: 3, kind: "investment approval", verification: "unverified" });
    assert.equal(core.validate(copy), true);
    assert.equal(core.assessment(copy, "IN", "osat", "2026-11-05").id, "IN-osat-production");
    copy.events[1].previousStage = 0;
    assert.throws(() => core.validate(copy), /Previous stage/);
});
test("research covers every country-capability pair with traceable assessments or explicit gaps", () => {
    assert.equal(data.reviews.length, data.countries.length * data.capabilities.length);
    const keys = data.reviews.map(review => review.country + "/" + review.capability);
    assert.equal(new Set(keys).size, keys.length);
    assert.equal(data.reviews.filter(review => review.outcome === "insufficient evidence").length, 2);
    for (const review of data.reviews) {
        const state = core.assessment(data, review.country, review.capability, data.asOf);
        assert.equal(state.stage > 0, review.outcome === "supported");
        if (state.stage > 0) assert(data.evidence.some(source => source.id === state.source));
    }
});
test("research reviews retain historical isolation and source-vintage staleness", () => {
    assert.equal(core.assessment(data, "CN", "cells", "2026-11-04").stage, 0);
    const reviewed = core.assessment(data, "CN", "cells", "2026-11-05");
    assert.equal(reviewed.stage, 4);
    assert.equal(reviewed.kind, "evidence review");
    assert.equal(reviewed.quantitativeChange, null);
    assert.equal(reviewed.stale, true);
    assert.match(reviewed.stageRationale, /output/);
});
