# AI Intelligence Control Room

Free static route: `/ai-intelligence/`. India, China and United States; 36 capability definitions in 12 stack layers.

`scripts/generate-ai-intelligence.py` is the editable source registry, taxonomy and baseline assessment generator. Run it after changing reviewed claims. It produces `ai-intelligence/data.json`; `ai-intelligence/index.html` is the page source. Shared rendering, history, exports and hypothetical dependency propagation live in `industrial/app.js` and `industrial/core.js`. Script data attributes select the dataset, initial capability and export prefix. Existing industrial defaults are preserved.

Use primary evidence and record narrow scope. Organization origin applies to software/model/IP; physical domestic location applies to fabrication, packaging and infrastructure. Imported compute access must not become a domestic chip-manufacturing claim. Software contributions are international. A model repository is not proof of repeated deployment at scale. Missing evidence means unassessed, not absent.

All baseline records become known on 2026-11-06. Original publication dates and undated-page observation bounds remain separate. This baseline has no reconstructed pre-review history or automatic research refresh. The sandbox is country-neutral and illustrative; it never changes evidence colors. Null quantities, supplier exposure and timing are intentionally unestimated.

For later reviews, preserve old events and append new review/correction records with matching previousStage and dated source metadata; do not regenerate a changed historical baseline as if it had always been known. Update asOf only after review, then run the schema/UI tests. Keep unknown review notes in exports. No API key, paid subscription or account is required.

Validation: `node --test tests/industrial.test.cjs tests/industrial-ui.test.cjs tests/ai-intelligence.test.cjs`. Packaging must include both `industrial/` (shared assets) and `ai-intelligence/`. The GitHub Pages workflow must copy the new route before link checks.
