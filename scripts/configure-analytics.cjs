"use strict";
const fs = require("node:fs");
const path = require("node:path");
const target = path.resolve(process.argv[2] || "_site");
const id = (process.env.GA4_MEASUREMENT_ID || "").trim();
if (id && (!/^G-[A-Z0-9]{6,20}$/.test(id) || /^G-X+$/.test(id))) {
    throw new Error("GA4_MEASUREMENT_ID must be empty or a real G- Measurement ID, not a placeholder.");
}
const verified = process.env.GA4_ENHANCED_MEASUREMENT_DISABLED === "true";
const debug = process.env.GA4_DEBUG === "true";
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "analytics-config.js"),
    "// Public build-time configuration; no secrets.\nwindow.MECHINTEL_ANALYTICS_CONFIG = Object.freeze(" +
    JSON.stringify({ measurementId: id, enhancedMeasurementDisabled: verified, debug }) + ");\n");
console.log(id && verified ? "GA4 configured, subject to visitor consent; delivery still requires verification." : "GA4 disabled: Measurement ID and enhanced-measurement confirmation are required.");
