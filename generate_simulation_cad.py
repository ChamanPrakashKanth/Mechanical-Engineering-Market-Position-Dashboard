"""Generate simulation geometry using the Python interpreter bundled with FreeCAD."""
from pathlib import Path
from html import escape
from zipfile import ZipFile, ZIP_DEFLATED

import FreeCAD as App
import Part
import MeshPart

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "cad" / "simulation"
OUT.mkdir(parents=True, exist_ok=True)
V = App.Vector


def box(length, width, height, x=0, y=0, z=0):
    return Part.makeBox(length, width, height, V(x, y, z))


def cylinder(radius, height, x=0, y=0, z=0, direction=V(0, 0, 1)):
    return Part.makeCylinder(radius, height, V(x, y, z), direction)


def fuse(shapes):
    return shapes[0].multiFuse(shapes[1:]).removeSplitter()


def cold_plate():
    # Three straight runs joined by half-annuli at alternating ends.
    runs = [box(80, 8, 6, 20, y - 4, 5) for y in (20, 40, 60)]
    for x, y, clip_x in [(100, 30, 100), (20, 50, 6)]:
        annulus = cylinder(14, 6, x, y, 5).cut(cylinder(6, 6, x, y, 5))
        runs.append(annulus.common(box(14, 28, 6, clip_x, y - 14, 5)))
    runs.extend([box(20, 8, 6, 0, 16, 5), box(20, 8, 6, 100, 56, 5)])
    fluid = fuse(runs)
    blank = box(120, 80, 16)
    solid = blank.cut(fluid).removeSplitter()
    assert abs(solid.Volume + fluid.Volume - blank.Volume) < 1e-6
    assert solid.common(fluid).Volume < 1e-6
    return solid, fluid


def nozzle():
    # Radius and axial position in mm. Revolve a closed meridian about Z.
    section = [(0, 0), (12, 0), (12, 32), (4, 56), (4, 76),
               (12, 76), (12, 160), (0, 160), (0, 0)]
    wire = Part.makePolygon([V(r, 0, z) for r, z in section])
    return Part.Face(wire).revolve(V(), V(0, 0, 1), 360).removeSplitter()


def clevis():
    base = box(80, 58, 10)
    ears = []
    for y in (10, 36):
        ears.extend([box(36, 12, 29, 22, y, 9),
                     cylinder(18, 12, 40, y, 38, V(0, 1, 0))])
    holes = [cylinder(4.5, 12, x, y, -1)
             for x in (10, 70) for y in (10, 48)]
    holes.append(cylinder(9, 60, 40, -1, 38, V(0, 1, 0)))
    return fuse([base, *ears]).cut(holes).removeSplitter()


def elbow_domain():
    radius = 12
    bend_radius = 36
    leg = 48
    bend = Part.makeTorus(bend_radius, radius, V(), V(0, 0, 1), -180, 180, 90)
    inlet = cylinder(radius, leg, bend_radius, -leg, 0, V(0, 1, 0))
    outlet = cylinder(radius, leg, -leg, bend_radius, 0, V(1, 0, 0))
    return fuse([bend, inlet, outlet])


def pin_fin_sink():
    base = box(80, 60, 5)
    fins = [cylinder(3, 21, 10 + 12 * i, 8 + 11 * j + 3 * (i % 2), 4)
            for i in range(6) for j in range(5)]
    return fuse([base, *fins])


def notched_coupon():
    blank = box(140, 32, 6, -70, -16)
    notches = [cylinder(11, 8, 0, y, -1) for y in (-16, 16)]
    holes = [cylinder(5, 8, x, 0, -1) for x in (-55, 55)]
    return blank.cut(notches + holes).removeSplitter()


def export(slug, shape):
    assert shape.isValid() and len(shape.Solids) == 1 and shape.Volume > 0, slug
    step = OUT / (slug + ".step")
    shape.exportStep(str(step))
    step.write_text("\n".join(line.rstrip() for line in step.read_text(encoding="utf-8").splitlines()) + "\n", encoding="utf-8")
    restored = Part.read(str(step))
    assert restored.isValid() and len(restored.Solids) == 1, slug
    assert abs(restored.Volume - shape.Volume) < shape.Volume * 1e-7, slug
    mesh = MeshPart.meshFromShape(Shape=shape, LinearDeflection=0.08,
                                  AngularDeflection=0.15, Relative=False)
    assert mesh.isSolid(), slug
    mesh.write(str(OUT / (slug + ".stl")))
    print(slug, round(shape.Volume, 2), "mm³", mesh.CountFacets, "triangles")


def main():
    plate, coolant = cold_plate()
    models = [
        ("cold-plate", "Serpentine cold plate", plate,
         "120 × 80 × 16 mm solid. Apply a heat load on Z=0 and couple the internal channel walls to the companion coolant volume.",
         "https://link.springer.com/article/10.1007/s00158-026-04292-z"),
        ("coolant-domain", "Serpentine coolant domain", coolant,
         "Three 8 × 6 mm passes with 10 mm centerline bend radius. Inlet at X=0 and outlet at X=120. Import both cold plate files at the same origin for conjugate heat transfer.",
         "https://www.comsol.com/support/learning-center/article/introduction-to-conjugate-heat-transfer-modeling-in-comsol-multiphysics-90531"),
        ("contraction-expansion", "Contraction and sudden expansion flow domain", nozzle(),
         "160 mm long with 24 mm inlet and outlet diameters and an 8 mm throat. Set inlet at Z=0 and outlet at Z=160. Refine the mesh at the expansion at Z=76 to resolve the separated shear layer. This study uses original dimensions.",
         "https://cdrh-rst.fda.gov/benchmark-dataset-validating-computational-fluid-dynamic-cfd-simulation-blood-flow-through"),
        ("clevis-bracket", "Double-ear clevis bracket", clevis(),
         "80 × 58 mm base, four 9 mm mounting holes and two coaxial 18 mm pin bores. Apply bearing loads to the bores or model pin contact. Compare mounting constraints and check mesh convergence near the ear roots.",
         "https://www.comsol.com/blogs/video-tutorial-introduction-modeling-structural-mechanics"),
        ("elbow-domain", "Long-radius elbow flow domain", elbow_domain(),
         "24 mm bore, 36 mm centerline bend radius and 48 mm straight legs. Set inlet at Y=-48 and outlet at X=-48. For fully developed inlet studies, extend the upstream leg or prescribe a developed profile.",
         ""),
        ("pin-fin-heat-sink", "Staggered pin-fin heat sink", pin_fin_sink(),
         "80 × 60 × 5 mm base with thirty 6 mm pins rising 20 mm above it. Create an air enclosure and subtract the sink for conjugate heat transfer. Compare wake mixing and pressure drop at different flow rates.",
         "https://doc.comsol.com/6.4/doc/com.comsol.help.models.heat.heat_sink/heat_sink.html"),
        ("notched-tension-coupon", "Double-notched tension coupon", notched_coupon(),
         "140 × 32 × 6 mm plate with opposing R11 notches, a 10 mm net ligament and two 10 mm pin holes. Apply axial loading through the bores and refine the mesh at both notch roots.",
         ""),
    ]
    cards = []
    readme = ["MechIntel simulation geometry · original CC0 1.0 models",
              "https://creativecommons.org/publicdomain/zero/1.0/",
              "Import STEP as solids in millimetres. For STL, select mm manually.",
              "Define mesh controls, materials, loads and boundary conditions in your solver.",
              "For external validation use the exact geometry and conditions from the benchmark provider."]
    files = []
    for slug, title, shape, notes, source in models:
        export(slug, shape)
        downloads = []
        for ext in ("step", "stl"):
            filename = f"{slug}.{ext}"
            files.append(OUT / filename)
            downloads.append(f'<a class="cta" download href="../assets/cad/simulation/{filename}">{ext.upper()}</a>')
        reference = f'<p><a href="{escape(source, quote=True)}">Engineering reference</a></p>' if source else ""
        cards.append(f'<section class="card"><h2>{title}</h2><p>{notes}</p>'
                     f'<div class="actions">{" ".join(downloads)}</div>'
                     f'{reference}</section>')
        readme.extend(["", title, notes, source])
    (OUT / "README.txt").write_text("\n".join(readme).rstrip() + "\n", encoding="utf-8")
    with ZipFile(OUT / "mechintel-simulation-geometry.zip", "w", ZIP_DEFLATED) as archive:
        for path in [*files, OUT / "README.txt", Path(__file__)]:
            archive.write(path, path.name)
    pages = ROOT / "engineering-careers"
    css = (pages / "mechanical-engineering-resume-checker.html").read_text(encoding="utf-8").split("<style>")[1].split("</style>")[0]
    (pages / "simulation-cad-library.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>STEP Models for CAD, FEA and CFD | MechIntel</title>
<meta name="description" content="Download free STEP and STL files for thermal, internal-flow and structural simulation studies.">
<link rel="canonical" href="https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/engineering-careers/simulation-cad-library.html">
<style>{css}</style></head><body><header><a class="brand" href="../">MechIntel</a><nav><a href="cad-library.html">CAD Library</a></nav></header>
<main><p class="eyebrow">CAD · FEA · CFD</p><h1>Simulation Geometry Library</h1>
<p class="intro">Start with solid geometry for thermal, flow and structural studies. Use STEP for CAD and volume meshing, or STL for surface-based workflows. All dimensions are in millimetres.</p>
<div class="actions"><a class="cta" download href="../assets/cad/simulation/mechintel-simulation-geometry.zip">Download all models and FreeCAD source</a></div>
<div class="grid">{"".join(cards)}</div>
<section class="card"><h2>Import and set up your study</h2><p>Select millimetres when importing STL. Identify the inlet, outlet, interface or loaded faces in your solver, then assign materials, boundary conditions and mesh controls. Use the engineering references for setup guidance and the official geometry when reproducing published benchmarks.</p>
<p>Original geometry released under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>.</p></section></main></body></html>
""", encoding="utf-8")


if __name__ == "__main__":
    main()
