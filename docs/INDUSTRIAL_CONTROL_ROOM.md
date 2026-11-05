# Industrial Capability Control Room

The entry point is industrial/index.html, linked from the MechIntel homepage. Serve the repository with a static HTTP server and open /industrial/. The existing static preparation script includes this directory for GitHub Pages. Publishing still requires the owner's approval.

## Architecture

- industrial/data.json contains common country and capability definitions, evidence records, immutable change events, and illustrative dependency nodes and edges.
- industrial/core.js reconstructs assessments by event date and knowledge date. It also validates evidence and computes cycle-safe downstream propagation.
- industrial/app.js controls the grids, detail branches, historical playback, comparison, scenario URLs and exports.
- industrial/styles.css implements the dark board and branching editorial layout inspired by the supplied HTML references.
- scripts/update-industrial.cjs validates and atomically applies reviewed incremental batches.
- tests/industrial-ui.test.cjs exercises filter selection, historical rendering and scenario isolation.
- tests/industrial.test.cjs covers temporal isolation, unchanged days, stale evidence, scenario isolation and propagation.

There is no database or paid service requirement. Daily states are reconstructed from events. A day without new evidence therefore uses the same state without storing duplicate snapshots. The browser never writes scenario assumptions to the dataset.

## Evidence policy

A capability means production at a domestic operating facility. Ownership, domestic value-add, import concentration and national scale require separate evidence. Stage 3 at one facility is evidence of an established production operation, with its scope stated explicitly. Stage 4 requires a reviewed claim supporting deep, scalable domestic capability.

Stage values are 0 insufficient evidence, 1 emerging or limited, 2 pilot or early commercial, 3 established manufacturing and 4 deep scalable capability. Progress requires a verified event. Staleness is displayed separately after 180 days.

The starter dataset contains 23 definitions across eleven domains and four semiconductor events covering three assessed country/capability pairs. Remaining cells are unassessed. This coverage supports the working platform but does not constitute a comprehensive national assessment.

The sources are PIB's August 2025 pilot-line release and July 2026 production release, TSMC's March 2025 newsletter and SMIC's Q4 2024 financial presentation. Company disclosures are labeled source-reported. For quarter-only milestones, date uses quarter-end as an upper bound and the notes state that the exact day is unknown. TSMC's publication knowledge date uses month-end conservatively.

Historical queries require both event.date and event.knownOn to be on or before the selected day. Evidence published later cannot color earlier views. Source metadata and entity nodes follow the selected record. Static process edges are explicitly illustrative and carry no country-specific dependency claim.

## Updating the evidence dataset

Review primary sources manually. Prepare a JSON batch with evidence and events arrays. New source records require id, title, url, published and kind. Copy an existing event as the field template and use a new stable ID.

Each event contains country, capability, date, knownOn, previousStage, stage, kind, verification, milestone, technicalMaturity, confidence, capacity, valueAdd, importConcentration, industrialScale, diversification, dependencies, entities, quantitativeChange, source and notes. Use null for unmeasured quantities and an empty dependency list for an unassessed dependency profile.

Keep publication dates distinct from technical milestone dates. Record exact-day uncertainty in notes. Use announcement, investment approval, pilot demonstration, production milestone or evidence correction for kind. Announcements and approvals must retain the previous stage. Mark verification as verified only after editorial review of the supporting evidence.

A material dependency can contain name and materialVulnerability true. Add its supporting source and scope in the event notes. Amber appears only for an explicitly reviewed vulnerability.

Run the incremental review command with the actual review date.

    node scripts/update-industrial.cjs 2026-11-05 path/to/reviewed-batch.json

A no-change review uses the same command without a batch path.

    node scripts/update-industrial.cjs 2026-11-05

Existing IDs are immutable. Identical repeated records are accepted, while conflicting records abort the batch. Corrections require new events and retain knowledge dates so earlier views preserve what was known then. Review the version-control diff before accepting an update. An interrupted write can leave industrial/data.pending, which must be reviewed before retrying.

Run npm test and node scripts/prepare-static.cjs after changes. The existing Pages build also integrates Fieldnotes and runs the site checker.

## Current limitations

Evidence discovery and verification require an editor. No unattended daily crawler or future milestones are included. Playback ends at the dataset review date, with a maximum 365-day window. Select an older date to move the historical window.

The sandbox uses a small illustrative semiconductor chain including a hypothetical equipment supplier. It supports direct disruption, downstream exposure, an available alternative and full domestic substitution. It models qualitative availability. Partial production, inventories, economic losses, recovery durations and country-specific supplier quantities require additional sourced models.

The four mind-map branches show sourced company and programme entities for assessed records and process relationships for mapped nodes. Other domains need evidence and their own dependency graphs before detailed supplier mapping can be provided.

CSV/JSON export contains selected assessments. JSON includes the referenced sources. Reproducible URLs include filters, date, selected capability and scenario assumptions.
