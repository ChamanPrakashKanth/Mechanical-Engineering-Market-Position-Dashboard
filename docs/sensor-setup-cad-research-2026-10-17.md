# Sensor setup and cable identification CAD — 17 October 2026

## Research and selection
Compared pneumatic cutting tools, sensor reflectors/brackets, setup-card stands and cable marking carriers. Manufacturer pages establish real industrial use cases, not search volume. Narrow STL/OpenSCAD searches gave mixed and sparse results; this can indicate limited demand as well as fewer indexed alternatives. No keyword difficulty, monthly searches, ranking or traffic claim is supported.

Primary references:
- Banner reflector mounting families: https://www.bannerengineering.com/us/en/products/accessories/brackets/reflectors.html
- Banner bracket applications: https://www.bannerengineering.com/in/en/products/sensors/sensor-accessories/sensors-brackets.html
- Phoenix Contact cable identification: https://www.phoenixcontact.com/en-sg/products/conductor-and-cable-marking
- HellermannTyton cable marker context: https://www.hellermanntyton.com/products/wire-and-cable-markers/hc09-35/525-10353
- Parker tube cutter context (researched but not selected): https://ph.parker.com/en/us/parflex-division-master/htc

Chosen search-intent hypotheses: photoelectric reflector backing bracket STL; sensor alignment card stand CAD; cable tie label carrier OpenSCAD. The original models use independently chosen dimensions; none reproduce supplier CAD, dimensions or certified properties.

## Deliverables
1. Reflector backing bracket: 70 × 30 × 60 mm, plain 6 × 40 mm upright slot and two slotted feet. No reflector supplied; no claimed footprint or pan/tilt capability.
2. Alignment-card stand: 70 × 35 × 14 mm; open-top 52 × 1.6 mm card passage, 8 mm deep. Card not included or calibrated. Not a laser beam stop or protective device.
3. Cable-tie label carrier: 56 × 20 × 3 mm, 36 × 14 × 0.6 mm recessed writing field and two tie passages. No label, ink, adhesive or protective cover included. No environmental/electrical rating.

All have editable OpenSCAD, binary STL, actual mesh-derived SVG and static detail pages with canonical tags, structured data, limitations and references. Catalog links, download ZIP and three sitemap entries updated. No API/inference/GPU required.

Generate:
python generate_cad_library.py --only industrial-photoeye-reflector-backing-bracket industrial-photoeye-alignment-card-stand industrial-cable-tie-label-carrier

Generation checks: closed consistent triangle edges, nondegenerate triangles, connected geometry and positive volume. Volumes 22544, 13374.4 and 2877.6 mm3. No physical printing, sensor accuracy, optical alignment, material, retention, insulation or flame testing. Dimensions require actual measurement and print-process allowance; inspect fixed offsets after parameter edits.

Evaluate hypotheses using actual relevant Search Console impressions/clicks once data exists. Do not call sparse results proof of high demand or low competition.
