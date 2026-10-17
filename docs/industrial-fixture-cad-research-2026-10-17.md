# Printed industrial fixture studies — 17 October 2026

## Research
Searches compared industrial cable management, vise jaw covers, assembly fixtures, parametric corner nests and adjustable stops. Official manufacturers provide a strong signal that printed manufacturing aids are a real application, but these pages do not provide keyword volume or difficulty.

Primary sources:
- Formlabs application guidance: https://formlabs.com/support/Jigs-fixtures-and-manufacturing-aids/
- Markforged tooling applications: https://3d.markforged.com/white-paper-3d-printed-tooling-fixtures.html
- Markforged soft-jaw webinar: https://3d.markforged.com/webinar-why-you-should-3d-print-soft-jaws.html
- Carr Lane jig/fixture context: https://www.carrlane.com/product/jig-fixture
- Kipp steel adapter-plate context: https://www.kipp.at/en/products/CLAMPING-TECHNOLOGY/Workholding-technology/Rest-and-stop-elements/Adapter-plates-for-T-slots-and-grid-systems-/p/agid.34979

Generic vise jaw models already face competition. Narrow dimension-specific queries and editable source are hypotheses to measure, not verified low-competition/high-volume opportunities. Sparse exact-phrase results may mean limited demand. Do not extrapolate supplier material performance or certification to our geometry.

## Original models
- 100 mm L-shaped vise jaw cover: 4 mm front/top, two copies needed for opposing jaws. No snap fit/magnets.
- 80 mm corner nest: two fences, internal-corner relief, two rectangular mounting slots. Manual layout reference only, no calibrated squareness.
- Slotted fixture base: two 6 × 76 mm slots, end fence, underside fastener access required.
- Adjustable stop block: a slotted foot plus upright; companion navigation to base. One bolt does not prevent rotation.

All contain original independently chosen dimensions, editable SCAD, binary STL and mesh-derived SVG. Static pages contain application references and existing catalog metadata; four sitemap URLs added. Main ZIP updated. No STEP/native feature tree, no physical printing or holding-force tests, and no established suitability for powered machining. Bench layout and fit evaluation only.

## Regeneration
python generate_cad_library.py --only industrial-bench-vise-jaw-cover-100mm industrial-assembly-corner-locating-nest industrial-slotted-assembly-fixture-base industrial-adjustable-assembly-stop-block

Local CPU geometry only. Generator checks nondegenerate facets, closed edges, consistent winding, connectivity and positive volume. Approximate nominal volumes: 16000, 34144, 40448 and 5208 mm3 respectively. Print orientation and limitations are on detail pages. Named parameters do not automatically reposition every fixed feature; inspect all offsets after editing.

Measure relevant query impressions, clicks and download interest when real data is available. No ranking or traffic guarantee.
