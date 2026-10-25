"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const os = require("node:os");
const code = fs.readFileSync(path.join(__dirname, "../analytics.js"), "utf8");
function setup({ id = "G-TEST123456", verified = true, saved = null, dnt = false, gpc = false, storageFails = false } = {}) {
    const nodes = [], listeners = {}, writes = new Map(); let reloads = 0;
    if (saved) writes.set("mechintel.analytics-consent.v1", JSON.stringify(saved));
    function node(tag) { const n = { tag, hidden: false, children: [], listeners: {}, setAttribute() {}, append(...kids) { this.children.push(...kids); }, addEventListener(type, fn) { this.listeners[type] = fn; } }; nodes.push(n); return n; }
    const document = { referrer: "https://search.example/find?q=private@example.com#secret", cookie: "", createElement: node,
        querySelector: () => ({ href: "https://owner.github.io/project/" }), head: node("head"), body: node("body") };
    const window = { MECHINTEL_ANALYTICS_CONFIG: { measurementId: id, enhancedMeasurementDisabled: verified }, addEventListener(type, fn) { listeners[type] = fn; } };
    const location = { hostname: "owner.github.io", href: "https://owner.github.io/project/?email=secret@example.com#resume-secret", reload() { reloads++; } };
    const localStorage = { getItem(k) { if (storageFails) throw Error("Storage unavailable"); return writes.get(k) || null; }, setItem(k, v) { if (storageFails) throw Error("Storage unavailable"); writes.set(k, v); } };
    const context = vm.createContext({ window, document, location, localStorage, navigator: { doNotTrack: dnt ? "1" : "0", globalPrivacyControl: gpc }, URL, Date, Object, JSON, encodeURIComponent });
    vm.runInContext(code, context);
    const button = text => nodes.find(n => n.tag === "button" && n.textContent === text);
    return { window, document, nodes, context, listeners, writes, location, reloads: () => reloads,
        accept: () => button("Accept analytics").listeners.click(), reject: () => button("Reject analytics").listeners.click(),
        commands: () => (window.dataLayer || []).map(args => [...args]) };
}
test("no Google request or event before consent; missing, placeholder and incomplete config fail closed", () => {
    for (const options of [{}, { id: "" }, { id: "G-XXXXXXXXXX" }, { id: "G-REPLACE_WITH_MY_ACTUAL_ID" }, { verified: false }]) {
        const s = setup(options);
        assert.equal(s.document.head.children.length, 0);
        assert.equal(s.window.MechIntelAnalytics.track("analysis_started", { analysis_type: "career_assessment" }), false);
        if (options.id !== undefined || options.verified === false) { s.accept(); assert.equal(s.document.head.children.length, 0); }
    }
});
test("accept loads one tag and one sanitized page view; reruns and repeated accepts cannot duplicate it", () => {
    const s = setup(); s.accept(); s.accept(); vm.runInContext(code, s.context);
    assert.equal(s.document.head.children.length, 1);
    assert.match(s.document.head.children[0].src, /^https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-/);
    const commands = s.commands();
    assert.equal(commands.filter(c => c[0] === "event" && c[1] === "page_view").length, 1);
    const config = commands.find(c => c[0] === "config")[2];
    assert.equal(config.send_page_view, false); assert.equal(config.allow_google_signals, false);
    assert.equal(config.page_location, "https://owner.github.io/project/");
    assert.equal(config.page_referrer, "https://search.example/");
    assert(!JSON.stringify(commands).includes("private@example.com"));
    assert(!JSON.stringify(commands).includes("resume-secret"));
});
test("reject, browser privacy signals, expired consent, and storage failure block tracking", () => {
    const s = setup(); s.reject(); assert.equal(s.document.head.children.length, 0);
    const granted = { value: "granted", at: Date.now() };
    for (const options of [{ dnt: true }, { gpc: true }]) {
        const blocked = setup({ ...options, saved: granted }); blocked.accept(); assert.equal(blocked.document.head.children.length, 0);
    }
    assert.equal(setup({ saved: { value: "granted", at: 1 } }).document.head.children.length, 0);
    assert.equal(setup({ storageFails: true }).document.head.children.length, 0);
    assert.equal(setup({ saved: granted }).document.head.children.length, 1);
});
test("custom events admit only fixed names and enum values, never arbitrary resume/profile/error fields", () => {
    const s = setup(); s.accept(); const api = s.window.MechIntelAnalytics;
    assert.equal(api.track("resume_uploaded", { input_type: "pdf", filename: "private-name.pdf", text: "secret resume", email: "secret@example.com" }), true);
    assert.equal(api.track("analysis_failed", { analysis_type: "career_assessment", message: "secret resume" }), true);
    assert.equal(api.track("analysis_started", { analysis_type: "private name" }), false);
    assert.equal(api.track("report_downloaded", { report_type: "competency_matrix", file_format: "csv" }), true);
    assert.equal(api.track("unknown", {}), false); assert.equal(api.track("toString", {}), false);
    assert.doesNotMatch(JSON.stringify(s.commands()), /private-name|secret resume|secret@example/);
});
test("revocation blocks events, clears owned cookies, and reloads; cross-tab revocation also unloads", () => {
    const s = setup(); s.accept(); s.document.cookie = "mechintel_ga=123"; s.reject();
    assert.equal(s.reloads(), 1); assert.equal(s.window["ga-disable-G-TEST123456"], true);
    assert.match(s.document.cookie, /Max-Age=0/);
    assert.equal(s.window.MechIntelAnalytics.track("resume_uploaded", { input_type: "pdf" }), false);
    const tab = setup(); tab.accept(); tab.writes.delete("mechintel.analytics-consent.v1");
    tab.listeners.storage({ key: "mechintel.analytics-consent.v1" }); assert.equal(tab.reloads(), 1);
});
test("failed Google script cannot break the dashboard or continue custom tracking", () => {
    const s = setup(); s.accept(); s.document.head.children[0].onerror();
    assert.equal(s.window.MechIntelAnalytics.status().tagFailed, true);
    assert.equal(s.window.MechIntelAnalytics.track("resume_uploaded", { input_type: "pdf" }), false);
});
test("assessment lifecycle sends completion only after success, failure only on thrown errors, and no profile fields", () => {
    const app = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
    const match = app.match(/function runProfileAnalysis\(profile\) \{[\s\S]*?\n\}/)[0];
    const calls = []; const context = { window: { MechIntelAnalytics: { track: (...args) => calls.push(args) } }, buildDashboard() {} };
    vm.createContext(context); vm.runInContext(match, context);
    context.runProfileAnalysis({ name: "Sensitive name", email: "private@example.com" });
    assert.deepEqual(calls.map(c => c[0]), ["analysis_started", "analysis_completed"]);
    assert.doesNotMatch(JSON.stringify(calls), /Sensitive|private@/);
    calls.length = 0; context.buildDashboard = () => { throw Error("Sensitive error"); };
    assert.throws(() => context.runProfileAnalysis({}), /Sensitive error/);
    assert.deepEqual(calls.map(c => c[0]), ["analysis_started", "analysis_failed"]);
    assert.doesNotMatch(JSON.stringify(calls), /Sensitive error/);
});
test("build config is disabled by default, validates IDs, and uses data serialization", () => {
    const target = fs.mkdtempSync(path.join(os.tmpdir(), "mechintel-ga4-"));
    const file = path.join(__dirname, "../scripts/configure-analytics.cjs");
    const env = { ...process.env, GA4_MEASUREMENT_ID: "", GA4_ENHANCED_MEASUREMENT_DISABLED: "", GA4_DEBUG: "" };
    try {
        execFileSync(process.execPath, [file, target], { env });
        assert.match(fs.readFileSync(path.join(target, "analytics-config.js"), "utf8"), /"measurementId":""/);
        for (const invalid of ['G-X\";alert(1)', 'G-REPLACE_WITH_MY_ACTUAL_ID']) {
            const result = spawnSync(process.execPath, [file, target], { env: { ...env, GA4_MEASUREMENT_ID: invalid } });
            assert.notEqual(result.status, 0);
            assert.match(result.stderr.toString(), /real G- Measurement ID/);
        }
    } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test("PDF ingestion records only successfully extracted readable text, with no file data", async () => {
    const app = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
    const fn = app.slice(app.indexOf("async function handlePdfUpload(file)"), app.indexOf("// Tag helpers"));
    for (const scenario of ["readable", "empty", "corrupt"]) {
        const calls = [], status = { style: {}, innerText: "" }, overlay = { classList: { add() {} } };
        const context = {
            window: { MechIntelAnalytics: { track: (...args) => calls.push(args) } },
            document: { getElementById: id => id === "scanner-overlay" ? overlay : status },
            setTimeout() {}, // The cosmetic scanner's later form population is not an upload.
            pdfjsLib: { getDocument: () => ({ promise: scenario === "corrupt" ? Promise.reject(Error("private filename")) : Promise.resolve({ numPages: 1, getPage: async () => ({ getTextContent: async () => ({ items: [{ str: scenario === "readable" ? "Private name private@example.com resume" : " " }] }) }) }) }) }
        };
        vm.createContext(context); vm.runInContext(fn, context);
        await context.handlePdfUpload({ name: "private-name.pdf", arrayBuffer: async () => new ArrayBuffer(8) });
        assert.equal(calls.length, scenario === "readable" ? 1 : 0);
        if (calls.length) { assert.equal(calls[0][0], "resume_uploaded"); assert.equal(calls[0][1].input_type, "pdf"); }
        assert.doesNotMatch(JSON.stringify(calls), /private|resume\"/);
    }
});
