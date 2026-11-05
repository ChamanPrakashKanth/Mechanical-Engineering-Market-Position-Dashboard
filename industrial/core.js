(function (root) {
    "use strict";
    const stages = ["Insufficient verified evidence", "Emerging / limited", "Pilot / early commercial", "Established manufacturing", "Deep scalable capability"];
    function assessment(data, country, capability, date) {
        const events = data.events.filter(event => event.country === country && event.capability === capability && event.knownOn <= date && event.date <= date && event.verification === "verified").sort((a, b) => a.knownOn.localeCompare(b.knownOn) || a.id.localeCompare(b.id));
        const event = events[events.length - 1];
        return event ? { ...event, stage: event.stage, stale: (Date.parse(date) - Date.parse(event.knownOn)) / 86400000 > 180 } : { country, capability, stage: 0, confidence: "Unassessed", capacity: null, valueAdd: null, dependencies: [], diversification: null, stale: false };
    }
    function propagate(edges, disrupted, alternatives = [], domestic = []) {
        const affected = new Set(disrupted.filter(id => !alternatives.includes(id) && !domestic.includes(id)));
        let changed = true;
        while (changed) {
            changed = false;
            for (const edge of edges) {
                if (affected.has(edge.from) && !affected.has(edge.to) && !alternatives.includes(edge.to) && !domestic.includes(edge.to)) {
                    affected.add(edge.to);
                    changed = true;
                }
            }
        }
        return [...affected];
    }
    function validate(data) {
        const ids = new Set();
        const validDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
        if (!validDate(data.asOf)) throw Error("Invalid dataset date");
        for (const name of ["countries", "capabilities", "evidence", "nodes"]) {
            if (!Array.isArray(data[name])) throw Error("Missing " + name);
            if (data[name].some(record => !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(record.id))) throw Error("Invalid record ID");
            if (new Set(data[name].map(record => record.id)).size !== data[name].length) throw Error("Duplicate " + name);
        }
        for (const source of data.evidence) {
            if (!/^https:\/\//.test(source.url) || !validDate(source.published)) throw Error("Invalid source");
        }
        const nodeIds = new Set(data.nodes.map(node => node.id));
        for (const edge of data.edges) {
            if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) throw Error("Unknown graph endpoint");
        }
        for (const event of data.events) {
            if (ids.has(event.id)) throw Error("Duplicate event ID");
            ids.add(event.id);
            if (!data.countries.some(country => country.id === event.country) || !data.capabilities.some(capability => capability.id === event.capability)) throw Error("Unknown country or capability");
            if (!validDate(event.date) || !validDate(event.knownOn)) throw Error("Invalid event dates");
            if (!Array.isArray(event.dependencies)) throw Error("Dependencies must be explicit");
            if (!["announcement", "investment approval", "pilot demonstration", "production milestone", "evidence correction"].includes(event.kind)) throw Error("Invalid milestone kind");
            const source = data.evidence.find(source => source.id === event.source);
            if (source && source.published > event.knownOn) throw Error("Evidence unavailable on knowledge date");
            if (!Number.isInteger(event.stage) || event.stage < 0 || event.stage > 4) throw Error("Invalid stage");
            if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !/^\d{4}-\d{2}-\d{2}$/.test(event.knownOn) || event.date > event.knownOn || event.knownOn > data.asOf) throw Error("Invalid evidence dates");
            if (!data.evidence.some(source => source.id === event.source)) throw Error("Missing source");
            if (event.stage !== event.previousStage && event.verification !== "verified") throw Error("Unverified progress");
        }
        const previous = new Map();
        const ordered = [...data.events].sort((a, b) => a.knownOn.localeCompare(b.knownOn) || a.id.localeCompare(b.id));
        for (const event of ordered) {
            const key = event.country + "/" + event.capability;
            if (event.previousStage !== (previous.get(key) || 0)) throw Error("Previous stage does not match recorded history");
            if (event.verification === "verified") previous.set(key, event.stage);
        }
        return true;
    }
    const api = { stages, assessment, propagate, validate };
    if (typeof module !== "undefined") module.exports = api;
    else root.IndustrialCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
