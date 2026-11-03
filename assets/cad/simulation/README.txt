MechIntel simulation geometry · original CC0 1.0 models
https://creativecommons.org/publicdomain/zero/1.0/
Import STEP as solids in millimetres. For STL, select mm manually.
Define mesh controls, materials, loads and boundary conditions in your solver.
For external validation use the exact geometry and conditions from the benchmark provider.

Serpentine cold plate
120 × 80 × 16 mm solid. Apply a heat load on Z=0 and couple the internal channel walls to the companion coolant volume.
https://link.springer.com/article/10.1007/s00158-026-04292-z

Serpentine coolant domain
Three 8 × 6 mm passes with 10 mm centerline bend radius. Inlet at X=0 and outlet at X=120. Import both cold plate files at the same origin for conjugate heat transfer.
https://www.comsol.com/support/learning-center/article/introduction-to-conjugate-heat-transfer-modeling-in-comsol-multiphysics-90531

Contraction and sudden expansion flow domain
160 mm long with 24 mm inlet and outlet diameters and an 8 mm throat. Set inlet at Z=0 and outlet at Z=160. Refine the mesh at the expansion at Z=76 to resolve the separated shear layer. This study uses original dimensions.
https://cdrh-rst.fda.gov/benchmark-dataset-validating-computational-fluid-dynamic-cfd-simulation-blood-flow-through

Double-ear clevis bracket
80 × 58 mm base, four 9 mm mounting holes and two coaxial 18 mm pin bores. Apply bearing loads to the bores or model pin contact. Compare mounting constraints and check mesh convergence near the ear roots.
https://www.comsol.com/blogs/video-tutorial-introduction-modeling-structural-mechanics

Long-radius elbow flow domain
24 mm bore, 36 mm centerline bend radius and 48 mm straight legs. Set inlet at Y=-48 and outlet at X=-48. For fully developed inlet studies, extend the upstream leg or prescribe a developed profile.


Staggered pin-fin heat sink
80 × 60 × 5 mm base with thirty 6 mm pins rising 20 mm above it. Create an air enclosure and subtract the sink for conjugate heat transfer. Compare wake mixing and pressure drop at different flow rates.
https://doc.comsol.com/6.4/doc/com.comsol.help.models.heat.heat_sink/heat_sink.html

Double-notched tension coupon
140 × 32 × 6 mm plate with opposing R11 notches, a 10 mm net ligament and two 10 mm pin holes. Apply axial loading through the bores and refine the mesh at both notch roots.
