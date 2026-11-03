# Simulation CAD research · November 3, 2026

Prioritized by documented engineering use and setup effort saved. The sources establish practical workflows and public benchmark activity. They do not provide a comparable measure of search volume or downloads across model types.

| Geometry | Workflow and scope | Evidence |
| --- | --- | --- |
| Serpentine cold plate and matching coolant | Included as aligned STEP solids. A separate fluid region skips passage extraction and supports conjugate heat transfer. | [Cold plate channel optimization](https://link.springer.com/article/10.1007/s00158-026-04292-z), [COMSOL CHT setup](https://www.comsol.com/support/learning-center/article/introduction-to-conjugate-heat-transfer-modeling-in-comsol-multiphysics-90531) |
| Contraction and sudden expansion | Included as an original closed fluid volume with planar end faces. The FDA publishes its exact geometry and experimental conditions for validation. | [FDA benchmark](https://cdrh-rst.fda.gov/benchmark-dataset-validating-computational-fluid-dynamic-cfd-simulation-blood-flow-through) |
| Double-ear clevis | Included as a structural solid with coaxial bores and separate mounting holes. Supports pin bearing and constraint sensitivity studies. | [COMSOL pin-loaded bracket](https://www.comsol.com/blogs/video-tutorial-introduction-modeling-structural-mechanics) |
| Long-radius elbow, pin-fin sink and notched coupon | Included for bend loss, electronics cooling and stress concentration studies. | [COMSOL heat sink workflow](https://doc.comsol.com/6.4/doc/com.comsol.help.models.heat.heat_sink/heat_sink.html) |
| Ahmed body | Candidate for external CFD. The public dataset has 500 variants with time-averaged CFD results. Its CC BY-SA license requires separate attribution and licensing if redistributed. | [AhmedML dataset and license](https://caemldatasets.org/ahmedml/) |
| ONERA M6 wing | Candidate for transonic CFD. The TMR case supplies CAD and documents the sharp trailing edge used for the exercise. | [TMR validation case](https://tmbwg.github.io/turbmodels/onerawingnumerics_val.html) |
| Gyroid heat exchanger | Candidate for thermal studies. A usable pack needs a bounded solid and separately checked fluid regions with accessible ports. | [NAFEMS heat exchanger case study](https://www.nafems.org/publications/resource_center/c_jun_20_americas_47/) |

Regenerate with the Python interpreter bundled with FreeCAD 1.1 by running `generate_simulation_cad.py` from the repository. The generator validates each B-rep, reimports STEP and checks volume preservation, and checks that each STL tessellation is closed. It also checks volume conservation and zero volumetric interference for the cold plate pair.
