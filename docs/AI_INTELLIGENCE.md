# AI Intelligence Control Room

Free static route: `/ai-intelligence/`. India, China and United States; 36 capability definitions in 12 stack layers.

`scripts/generate-ai-intelligence.py` is the editable source registry, taxonomy and baseline assessment generator. It emits `ai-intelligence/data.json` and complete static country-capability records in `ai-intelligence/index.html` from `ai-intelligence/template.html`. Edit the template rather than generated HTML. The AI interface is `ai-intelligence/app.js` with its own CSS; schema validation and structural propagation reuse `industrial/core.js`. Industrial rendering remains independent.

Use primary evidence and record narrow scope. Organization origin applies to software/model/IP; physical domestic location applies to fabrication, packaging and infrastructure. Imported compute access must not become a domestic chip-manufacturing claim. Software contributions are international. A model repository is not proof of repeated deployment at scale. Missing evidence means unassessed, not absent.

Assessment baseline: 2026-11-06. Source metadata/presentation correction: 2026-11-07. No new capability progress or historical review cycle is inferred from the correction. Version 2 stores `published: null` with `publishedUnknown: true` when the date is unrecorded, alongside a separate `accessedOn`. Such sources have unknown freshness, not fresh evidence. Core validation rejects a fabricated publication date paired with the unknown flag.

Evidence states are supported, no-qualifying-record, not-researched, and verified-absent. Only the first three occur in the baseline; a verified absence requires dated sources and explicit `absenceScope`. Pending targeted research is not a claim to an exhaustive completed review. Origin attribution and foreign/global technology adoption remain separate. Documented record type distinguishes a released artifact from an operational service, independently of the retained ordinal stage. Scoped metrics are entered only when sourced; unknown quantities remain unknown.

One assessment cycle means no history selector. There is no vulnerability filter without exposure data. Country-specific graph overlays display origin-evidence states without turning gaps into availability assumptions or blocking structural propagation. Fabrication and packaging are included. Direct-input controls use plain names.

Every country-capability record has static HTML, a permanent anchor (`#IN-training`), contextual sources and an interactive query URL. JSON/CSV exports retain evidence state, source dates, attribution, metrics and source scope. External interviews and reporting are labeled with vendor attribution limits; an evaluator listing is not an audit of training. Uncorroborated records remain visibly single-source. Notable records do not claim national firsts.

Shared-engine compatibility fields (`kind`, `verification`, `previousStage`, `knownOn`) preserve event reconstruction. In this baseline `verification` indicates an entered source record, not an independent audit of the underlying provider claim. Empty quantity/value-add fields and redundant technical-maturity fields were removed from AI events. New metric observation dates and supporting-reference knowledge dates prevent later annotations from leaking into earlier baseline assessments.

For later reviews, preserve old events and append new review/correction records with matching previousStage and dated source metadata; do not regenerate a changed historical baseline as if it had always been known. Update asOf only after review, then run the schema/UI tests. Keep unknown review notes in exports. No API key, paid subscription or account is required.

Validation: `node --test tests/industrial.test.cjs tests/industrial-ui.test.cjs tests/ai-intelligence.test.cjs`. Packaging must include both `industrial/` (shared assets) and `ai-intelligence/`. The GitHub Pages workflow must copy the new route before link checks.
