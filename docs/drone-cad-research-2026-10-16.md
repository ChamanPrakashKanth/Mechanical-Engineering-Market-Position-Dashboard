# Drone accessory CAD research — 16 October 2026

Purpose: choose original small parts that can be printed and customized for civilian FPV, inspection and learning builds. No search-volume or keyword-difficulty dataset was available; no query is claimed to have verified high volume or low competition.

## Evidence and opportunity

- Builders request frame-specific antenna mounts and other TPU files: https://www.reddit.com/r/fpv/comments/1u1getk/looking_for_3dprinted_parts_for_the_tbs_source/
- A builder describes finding antenna STL files but being unable to adapt them easily: https://www.reddit.com/r/fpv/comments/1sgiovn/mounting_walksnail_vtx_antenna/
- A commercial drone print catalog already sells GPS, antenna and connector mounts: https://r3dfpv.com/ . This shows existing supply and competition, not search volume or sales.
- ArduPilot explains the GPS clear-sky-view and compass interference installation requirements: https://ardupilot.org/copter/docs/common-installing-3dr-ublox-gps-compass-module.html
- ExpressLRS documents antenna types and carbon obstruction considerations: https://www.expresslrs.org/hardware/hardware-selection/
- Prusa explains flexible-filament printing considerations: https://help.prusa3d.com/article/flexible-materials_2057

Generic “drone STL” and “antenna mount STL” searches contain many catalogs and marketplaces. The hypothesis is to offer useful dimension-specific pages with editable sources, print orientation and visible limits, then measure relevant impressions/clicks after indexing.

## Initial query families

- FPV GPS tray 25 mm STL / editable GPS module tray
- FPV capacitor strap cradle STL / capacitor tie mount
- FPV antenna cable guide STL / dual antenna cable guide
- receiver tray 20 x 12 mm STL / parametric receiver board tray
- drone arm wire protector 14 mm STL / open tunnel wire cover
- drone battery strap guide 20 mm STL / webbing routing bridge

All six model geometries are independently authored rectangular CSG studies. Sources inform application context only. STL surfaces and editable OpenSCAD come from the same box-expression specifications, generated using CPU-only Python. Physical printing, crash retention, vibration, radio performance and flight suitability remain untested.

## Regeneration

Run `python generate_cad_library.py` followed by `python generate_drone_library.py`. The first generates and checks the meshes and refreshes the general library; the second builds the dedicated hub and print pack. `python render_drone_preview.py` optionally refreshes the gallery using matplotlib's CPU Agg backend. No network or model API is used by these generators.
