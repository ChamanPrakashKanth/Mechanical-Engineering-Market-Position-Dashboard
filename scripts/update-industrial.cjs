"use strict";
const fs = require("node:fs");
const path = require("node:path");
const core = require("../industrial/core.js");
const root = path.resolve(__dirname, "../industrial");
const args = process.argv.slice(2);
const date = args[0];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > new Date().toISOString().slice(0, 10)) {
    throw Error("Usage: node scripts/update-industrial.cjs YYYY-MM-DD [reviewed-batch.json]. Date must be a real, non-future review date.");
}
const file = path.join(root, "data.json");
const original = fs.readFileSync(file, "utf8");
const data = JSON.parse(original);
if (date < data.asOf) throw Error("Review date cannot move backwards");
const batch = args[1] ? JSON.parse(fs.readFileSync(args[1], "utf8")) : { events: [], evidence: [] };
for (const collection of ["evidence", "events"]) {
    if (!Array.isArray(batch[collection])) throw Error("Batch must contain evidence and events arrays");
    for (const record of batch[collection]) {
        const existing = data[collection].find(item => item.id === record.id);
        if (existing && JSON.stringify(existing) !== JSON.stringify(record)) throw Error("Existing records are immutable. Add a correction event with a new ID.");
        if (!existing) data[collection].push(record);
    }
}
data.asOf = date;
core.validate(data);
const next = JSON.stringify(data, null, 2) + "\n";
// Same-directory rename replaces the dataset only after the entire batch validates.
const temporary = path.join(root, "data.pending");
if (fs.existsSync(temporary)) throw Error("An update is pending. Review industrial/data.pending before retrying.");
fs.writeFileSync(temporary, next, { flag: "wx" });
try {
    if (fs.readFileSync(file, "utf8") !== original) throw Error("Dataset changed during review. Retry against the latest version.");
    fs.renameSync(temporary, file);
} finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
}
console.log("Reviewed through " + date + ". " + batch.events.length + " input events. Unchanged days reconstruct from the same evidence.");
