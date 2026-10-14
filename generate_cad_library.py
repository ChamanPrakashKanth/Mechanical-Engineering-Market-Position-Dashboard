"""Generate the four original MechIntel educational CAD parts (millimetres)."""
from pathlib import Path
import math
import struct
import zipfile

ROOT = Path(__file__).absolute().parent
OUT = ROOT / 'assets' / 'cad'
OUT.mkdir(parents=True, exist_ok=True)

def ring(ro, ri, height, n=96):
    faces = []
    def p(r, i, z):
        a = 2 * math.pi * i / n
        return (r * math.cos(a), r * math.sin(a), z)
    for i in range(n):
        j = (i + 1) % n
        a,b,c,d = p(ro,i,0),p(ro,j,0),p(ro,j,height),p(ro,i,height)
        faces.extend([(a,b,c),(a,c,d)])
        if ri:
            e,f,g,h = p(ri,i,0),p(ri,j,0),p(ri,j,height),p(ri,i,height)
            faces.extend([(e,g,f),(e,h,g),(d,c,g),(d,g,h),(a,f,b),(a,e,f)])
        else:
            faces.extend([((0,0,height),d,c),((0,0,0),b,a)])
    return faces

def box(x,y,z):
    v=[(0,0,0),(x,0,0),(x,y,0),(0,y,0),(0,0,z),(x,0,z),(x,y,z),(0,y,z)]
    quads=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    return [(v[a],v[b],v[c]) for a,b,c,d in quads]+[(v[a],v[c],v[d]) for a,b,c,d in quads]

def revolve(profile, n=96):
    """Revolve a CCW radius/height section, omitting collapsed axis triangles."""
    def point(rz,i):
        r,z=rz;a=2*math.pi*i/n
        return (r*math.cos(a),r*math.sin(a),z)
    faces=[]
    for k,a in enumerate(profile):
        b=profile[(k+1)%len(profile)]
        for i in range(n):
            j=(i+1)%n
            for tri in [(point(a,i),point(a,j),point(b,j)),(point(a,i),point(b,j),point(b,i))]:
                if len(set(tri))==3: faces.append(tri)
    return faces

def mesh_preview(faces):
    def project(p):
        x,y,z=p
        return (.866*(x-y),.35*(x+y)-z)
    points=[project(p) for tri in faces for p in tri]
    xs,ys=zip(*points);scale=min(230/(max(xs)-min(xs)),145/(max(ys)-min(ys)))
    cx=(max(xs)+min(xs))/2;cy=(max(ys)+min(ys))/2
    shapes=[]
    for tri in sorted(faces,key=lambda t:sum(p[0]+p[1]+p[2]*.2 for p in t)):
        coords=' '.join(f'{150+(project(p)[0]-cx)*scale:.2f},{90+(project(p)[1]-cy)*scale:.2f}' for p in tri)
        a,b,c=tri;u=[b[k]-a[k] for k in range(3)];v=[c[k]-a[k] for k in range(3)]
        normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        length=math.sqrt(sum(x*x for x in normal));shade=int(110+70*abs(normal[2])/length)
        shapes.append(f'<polygon points="{coords}" fill="rgb({shade//2},{shade},{int(shade*.88)})" stroke="none"/>')
    return ''.join(shapes)

def stl(path, faces):
    with path.open('wb') as f:
        f.write(b'MechIntel educational part; dimensions in mm'.ljust(80,b'\0'))
        f.write(struct.pack('<I',len(faces)))
        for a,b,c in faces:
            u=[b[k]-a[k] for k in range(3)];v=[c[k]-a[k] for k in range(3)]
            n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
            length=math.sqrt(sum(t*t for t in n))
            n=[t/length for t in n]
            f.write(struct.pack('<12fH',*(n+list(a)+list(b)+list(c)),0))

parts=[
 ('plain-washer','Plain washer','OD 24 · ID 10 · thickness 2 mm',ring(12,5,2),
  'outer_diameter=24;\ninner_diameter=10;\nheight=2;', 'difference(){ cylinder(d=outer_diameter,h=height); translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }',24,10,2),
 ('tubular-spacer','Tubular spacer','OD 16 · ID 8 · length 20 mm',ring(8,4,20),
  'outer_diameter=16;\ninner_diameter=8;\nheight=20;', 'difference(){ cylinder(d=outer_diameter,h=height); translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }',16,8,20),
 ('solid-shaft','Solid shaft','Diameter 12 · length 60 mm',ring(6,0,60),
  'diameter=12;\nheight=60;', 'cylinder(d=diameter,h=height);',12,0,60),
 ('rectangular-plate','Rectangular plate','Length 60 · width 40 · thickness 5 mm',box(60,40,5),
  'length=60;\nwidth=40;\nheight=5;', 'cube([length,width,height]);',60,40,5)
]
# Reuse the same primitives for a compact collection of useful stock shapes.
for slug,title,od,inner,h in [
 ('thin-shim','Thin shim',30,12,0.5),
 ('heavy-washer','Heavy washer',36,14,5),
 ('short-bushing','Short bushing',22,12,15),
 ('long-sleeve','Long sleeve',20,12,50),
 ('round-disk','Round disk',40,0,6),
 ('dowel-pin','Plain dowel pin',6,0,30),
 ('tube-section','Tube section',30,24,60),
 ('annular-flange-blank','Annular flange blank',60,24,8),
]:
    params=f'outer_diameter={od};\ninner_diameter={inner};\nheight={h};'
    model='difference(){ cylinder(d=outer_diameter,h=height); if(inner_diameter>0) translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }'
    dims=f'OD {od} · '+(f'ID {inner} · ' if inner else '')+f'height {h} mm'
    parts.append((slug,title,dims,ring(od/2,inner/2,h),params,model,od,inner,h))
for slug,title,x,y,z in [
 ('square-plate','Square plate',50,50,6),
 ('rectangular-bar','Rectangular bar',100,20,10),
 ('stock-block','Stock block',40,30,25),
]:
    parts.append((slug,title,f'{x} × {y} × {z} mm',box(x,y,z),f'length={x};\nwidth={y};\nheight={z};','cube([length,width,height]);',x,y,z))
parts.append(('hexagonal-blank','Hexagonal blank','Across corners 24 · length 15 mm',ring(12,0,15,6),'across_corners=24;\nheight=15;','cylinder(d=across_corners,h=height,$fn=6);',24,0,15))
profiles={
 'flanged-bushing':('Flanged bushing',[(6,0),(16,0),(16,4),(10,4),(10,25),(6,25)]),
 'stepped-shaft':('Stepped shaft',[(0,0),(10,0),(10,8),(7,8),(7,30),(4,30),(4,45),(0,45)]),
 'tapered-sleeve':('Tapered thin sleeve',[(9,0),(11,0),(6,30),(4,30)]),
 'reducer-tube':('Thin-wall reducer tube',[(13,0),(15,0),(15,6),(8,25),(8,32),(6,32),(6,25),(13,6)]),
 'spool':('Cable spool blank',[(4,0),(22,0),(22,3),(10,3),(10,27),(22,27),(22,30),(4,30)]),
 'grooved-roller':('Grooved roller blank',[(5,0),(16,0),(16,6),(11,10),(11,16),(16,20),(16,26),(5,26)]),
 'thin-cup':('Thin-walled cup',[(0,0),(18,0),(18,25),(16.5,25),(16.5,1.5),(0,1.5)]),
 'tapered-washer':('Tapered washer',[(5,0),(18,0),(12,5),(5,5)]),
 'nozzle-blank':('Tapered nozzle blank',[(2,0),(8,0),(8,6),(4,20),(2,20)]),
 'ribbed-sleeve':('Ribbed sleeve',[(5,0),(10,0),(10,3),(8,3),(8,7),(10,7),(10,10),(8,10),(8,14),(10,14),(10,17),(8,17),(8,21),(10,21),(10,24),(5,24)]),
 'rounded-ring':('Rounded torus ring',[(12+2*math.cos(2*math.pi*i/24),2+2*math.sin(2*math.pi*i/24)) for i in range(24)]),
 'bellows-sleeve':('Thin bellows study',[(8,0),(9,0),(12,5),(9,10),(12,15),(9,20),(12,25),(9,30),(8,30),(11,25),(8,20),(11,15),(8,10),(11,5)]),
 'rounded-knob':('Rounded knob blank',[(0,0),(8,0),(8,5),(12,7),(14,11),(14,16),(12,20),(8,22),(0,22)]),
 'collared-spacer':('Collared spacer',[(4,0),(8,0),(8,12),(13,12),(13,16),(8,16),(8,28),(4,28)]),
 'conical-seat':('Conical seat ring',[(5,0),(16,0),(16,8),(12,8),(5,3)]),
 'thin-lip-bushing':('Thin-lip bushing',[(6,0),(14,0),(14,1),(8,1),(8,20),(6,20)]),
 'shoulder-washer':('Shoulder washer',[(3.2,0),(8,0),(8,1.5),(4.5,1.5),(4.5,6),(3.2,6)]),
 'panel-grommet':('Panel cable grommet study',[(4,0),(9,0),(9,2),(7,2),(7,4),(9,4),(9,6),(4,6)]),
 'countersunk-washer':('Countersunk washer',[(3.2,0),(9,0),(9,4),(6.2,4),(3.2,1)]),
 'guide-bushing':('Chamfered guide bushing',[(4.5,0),(7.5,0),(8,0.5),(8,18),(10,18),(10,21),(5.5,21),(4.5,20)]),
 'tapered-locating-pin':('Tapered lead-in locating pin',[(0,0),(8,0),(8,4),(5,4),(5,24),(3,27),(0,27)]),
 'ferrule-sleeve':('Thin ferrule sleeve',[(5,0),(6,0),(6,16),(7,18),(7,20),(5,20)]),
 'blind-end-cap':('Blind tube end cap study',[(0,0),(12,0),(12,14),(10.5,14),(10.5,2),(0,2)]),
 'tube-adapter':('Stepped tube adapter',[(4,0),(7,0),(7,12),(10,12),(10,25),(8,25),(8,15),(4,15)]),
 'vee-pulley-blank':('V-groove pulley blank',[(4,0),(20,0),(20,3),(14,7),(20,11),(20,14),(4,14)]),
 'retaining-groove-pin':('Retaining-groove pin blank',[(0,0),(5,0),(5,4),(4,4),(4,5.5),(5,5.5),(5,26),(4,26),(4,27.5),(5,27.5),(5,30),(0,30)]),
 'thrust-collar':('Thrust collar blank',[(6,0),(14,0),(14,3),(10,3),(10,9),(6,9)]),
 'cup-seal-profile':('Thin cup seal profile study',[(5,0),(12,0),(12,1),(11,1),(11,7),(10,8),(9,8),(10,6),(10,2),(5,2)]),
 'counterbored-spacer':('Counterbored spacer',[(3,0),(10,0),(10,18),(6,18),(6,13),(3,13)]),
 'double-flanged-bushing':('Double-flanged bushing',[(5,0),(14,0),(14,3),(9,3),(9,17),(14,17),(14,20),(5,20)]),
 'compression-sleeve':('Compression sleeve blank',[(4,0),(6,0),(8,4),(8,10),(6,14),(4,14)]),
 'face-groove-ring':('Face-groove ring',[(6,0),(18,0),(18,5),(14,5),(14,3),(11,3),(11,5),(6,5)]),
 'chamfered-pivot-pin':('Chamfered pivot pin',[(0,0),(5,0),(6,1),(6,29),(5,30),(0,30)]),
 'shoulder-pin':('Shoulder pin blank',[(0,0),(8,0),(8,5),(5,5),(5,25),(3,25),(3,31),(0,31)]),
 'blind-bore-boss':('Blind-bore mounting boss',[(0,0),(10,0),(10,16),(4,16),(4,4),(0,4)]),
 'sensor-sleeve':('Sensor sleeve study',[(4,0),(6,0),(6,20),(9,20),(9,23),(4,23)]),
 'dished-washer':('Dished washer study',[(4,0),(14,2),(14,3),(4,1)]),
 'double-groove-roller':('Double-groove roller',[(4,0),(18,0),(18,3),(13,6),(18,9),(18,12),(13,15),(18,18),(18,21),(4,21)]),
 'labyrinth-ring':('Labyrinth ring geometry study',[(6,0),(18,0),(18,3),(15,3),(15,8),(12,8),(12,3),(9,3),(9,8),(6,8)]),
 'rounded-nose-pin':('Rounded-nose pin',[(0,0),(5,0),(5,20)]+[(5*math.cos(i*math.pi/16),20+5*math.sin(i*math.pi/16)) for i in range(1,9)]),
 'hose-tail-blank':('Hose tail geometry blank',[(3,0),(8,0),(8,4),(5,4),(6.5,8),(5,8),(6.5,12),(5,12),(6.5,16),(5,16),(5,20),(3,20)]),
 'tapered-plug':('Tapered plug blank',[(0,0),(10,0),(7,20),(0,20)]),
 'pulley-hub-blank':('Pulley hub blank',[(5,0),(12,0),(12,8),(22,8),(22,12),(12,12),(12,20),(5,20)]),
 'flared-tube-mouth':('Flared tube mouth study',[(5,0),(6.5,0),(6.5,15),(11,23),(9.5,23),(5,15)]),
}
for slug,(title,profile) in profiles.items():
    radius=max(p[0] for p in profile);height=max(p[1] for p in profile)
    dims=f'Max OD {radius*2:g} · height {height:g} mm · section dimensions in source'
    parts.append((slug,title,dims,revolve(profile),'// Section points: [radius, height], mm. Edit to change the profile.\nsection='+str([list(point) for point in profile])+';','rotate_extrude($fn=96) polygon(points=section);',radius*2,min(p[0] for p in profile)*2,height))
cards=[]
for slug,title,dims,faces,params,model,od,inside,height in parts:
    stl(OUT/(slug+'.stl'),faces)
    (OUT/(slug+'.scad')).write_text('// Original MechIntel educational model. CC0-1.0. Units: mm.\n// Not a standardized or load-rated component.\n$fn=96;\n'+params+'\n'+model+'\n',encoding='utf-8')
    if slug in profiles:
        drawing=mesh_preview(revolve(profiles[slug][1],24))
    elif model.startswith('cube'):
        drawing='<path d="M65 65L190 45L245 90L120 115Z" fill="#a3ecd5"/><path d="M65 65V85L120 135V115Z" fill="#548e80"/><path d="M120 115V135L245 110V90Z" fill="#76b9a5"/>'
    elif slug=='hexagonal-blank':
        drawing='<polygon points="145,90 117.5,137.63 62.5,137.63 35,90 62.5,42.37 117.5,42.37" fill="#a3ecd5"/><rect x="180" y="70" width="65" height="75" fill="#76b9a5"/><text x="90" y="170">TOP</text><text x="210" y="170">SIDE</text>'
    else:
        # Orthographic top and side views derived from model dimensions.
        scale=55/(od/2); outer=55; inner=inside/2*scale
        drawing=f'<circle cx="90" cy="90" r="{outer}" fill="#a3ecd5"/><circle cx="90" cy="90" r="{inner}" fill="#0b161b"/><rect x="180" y="{145-min(100,height*2)}" width="65" height="{min(100,height*2)}" fill="#76b9a5"/><text x="90" y="170">TOP</text><text x="210" y="170">SIDE</text>'
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 190"><rect width="300" height="190" rx="15" fill="#0b161b"/><g stroke="#466459" stroke-width="1">'+drawing+'</g><style>text{font:10px sans-serif;fill:#bad4c8;text-anchor:middle;stroke:none}</style></svg>'
    (OUT/(slug+'.svg')).write_text(svg,encoding='utf-8')
    cards.append(f'<article class="card" id="{slug}" data-part="{title.lower()}"><img loading="lazy" src="../assets/cad/{slug}.svg" alt="{title}: illustrative geometry preview" width="300" height="190"><h2>{title}</h2><p>{dims}</p><small>Original educational geometry · no threads, fit tolerances or material specification</small><div class="actions"><a class="cta" download href="../assets/cad/{slug}.stl">Download STL</a><a class="cta secondary" download href="../assets/cad/{slug}.scad">OpenSCAD source</a></div><p><a href="cad-{slug}.html">Dimensions &amp; modeling notes →</a></p></article>')

(OUT/'README.txt').write_text('MechIntel CAD starter library\nOriginal educational geometry, released under CC0 1.0 Universal.\nhttps://creativecommons.org/publicdomain/zero/1.0/\n\nAll dimensions are millimetres. STL does not encode units: select mm when importing.\nSTL is a faceted mesh (96 segments around circles), not editable STEP or a native feature tree.\nOpen the .scad sources in OpenSCAD to change the dimensions and regenerate geometry.\nThe models have no tolerances, threads, chamfers, fits, material specifications, or load ratings.\nThey are not representations of standardized catalog hardware. Check dimensions and suitability before fabrication.\nSVG previews are illustrative and are not dimensioned manufacturing drawings.\n',encoding='utf-8')
with zipfile.ZipFile(OUT/'mechintel-simple-parts.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(OUT.iterdir()):
        if p.suffix in ('.stl','.scad','.svg','.txt'): z.write(p,p.name)

base=(ROOT/'engineering-careers/mechanical-engineering-resume-checker.html').read_text(encoding='utf-8')
css=base.split('<style>')[1].split('</style>')[0]
url='https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/engineering-careers/cad-library.html'
html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Free Mechanical CAD Library: STL & OpenSCAD Parts | MechIntel</title><meta name="description" content="Download four simple mechanical CAD parts: washer, spacer, shaft and plate. Free STL meshes and editable parametric OpenSCAD sources, with dimensions in millimetres."><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'''+url+'''"><meta name="theme-color" content="#0b1216"><style>'''+css+''' .card img{width:100%;height:190px;object-fit:contain}input{background:#132127;color:#edf5f1;border:1px solid #49685d;border-radius:10px;padding:14px;font:inherit;width:100%;max-width:480px}.grid .card{margin-top:0}#parts{margin-top:25px}</style></head><body><header><a class="brand" href="../">MechIntel.ai</a><nav aria-label="Main"><a href="../#resume-builder">Resume Builder</a><a href="mechanical-engineering-portfolio-planner.html">Project Planner</a><a href="./">Career Guides</a></nav></header><main><p class="eyebrow">Small parts · useful starting points</p><h1>Mechanical CAD Library</h1><p class="intro">Four original, simple parts for learning CAD and starting your own models. Download a ready-made STL mesh or edit the dimensions in the parametric OpenSCAD source.</p><div class="pills"><span>Free · CC0</span><span>Millimetres</span><span>No signup, tokens or GPU</span></div><div class="actions"><a class="cta" download href="../assets/cad/mechintel-simple-parts.zip">Download all four parts (.zip)</a><a href="../assets/cad/README.txt">Read file notes</a></div><section class="card"><h2>What is included?</h2><p>Each part includes an STL mesh and an editable .scad source. Circles use 96 segments. STL is a faceted format and does not encode units: select <strong>millimetres</strong> when importing. These downloads do not include STEP or native SolidWorks files.</p><p>These are simplified educational models, not standardized catalog hardware. No tolerances, material properties, threads, chamfers, fits or load ratings are specified. Confirm suitability before fabrication.</p></section><p><label for="search">Find a part</label></p><input id="search" type="search" placeholder="Washer, spacer, shaft, plate…"><p id="count" role="status">4 parts</p><div id="parts" class="grid">'''+''.join(cards)+'''</div><section class="card"><h2>How do I change the dimensions?</h2><ol><li>Download a part’s OpenSCAD source.</li><li>Open it in OpenSCAD and edit the named dimensions at the top. Keep dimensions positive; for hollow parts, keep the inside diameter smaller than the outside diameter.</li><li>Render the model and export a new mesh. Check dimensions in your CAD or slicing application.</li></ol><h2>Can I use these models commercially?</h2><p>MechIntel releases these original geometries under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 Universal</a>. Attribution is appreciated but not required. There is no warranty or certification. File dimensions, not preview scaling, define the geometry.</p><p>Created October 14, 2026. Sources are included so you can inspect and modify the geometry. <a href="mechanical-engineering-portfolio-planner.html">Turn a part study into a portfolio project →</a></p></section></main><footer><p>MechIntel · Original educational CAD geometry</p></footer><script>const search=document.getElementById('search');search.addEventListener('input',()=>{let visible=0;document.querySelectorAll('[data-part]').forEach(card=>{card.hidden=!card.dataset.part.includes(search.value.trim().toLowerCase());if(!card.hidden)visible++;});document.getElementById('count').textContent=visible+' parts'+(visible?'':' — try washer, spacer, shaft, or plate');});</script></body></html>'''
html=html.replace('Download four simple mechanical CAD parts: washer, spacer, shaft and plate.','Download 16 simple mechanical CAD parts: washers, bushings, sleeves, stock plates, pins and blanks.').replace('Four original, simple parts','16 original, simple parts').replace('Download all four parts','Download all 16 parts').replace('>4 parts<','>16 parts<').replace('Washer, spacer, shaft, plate…','Washer, bushing, sleeve, disk, bar…')
html=html.replace('16 simple mechanical CAD parts',str(len(parts))+' mechanical CAD parts').replace('16 original, simple parts',str(len(parts))+' original parts, from simple stock shapes to detailed revolved profiles').replace('all 16 parts','all '+str(len(parts))+' parts').replace('>16 parts<','>'+str(len(parts))+' parts<').replace('Circles use 96 segments.','Circular sweeps use 96 segments; the rounded ring section uses 24 points.').replace('No tolerances, material properties, threads, chamfers, fits or load ratings are specified.','No fit tolerances, material properties, threads or load ratings are specified.').replace('Each part includes an STL mesh', 'Thin-wall and bellows shapes are geometry studies: printability, flexibility and strength are not established. Each part includes an STL mesh')
(ROOT/'engineering-careers/cad-library.html').write_text(html,encoding='utf-8')

# Each part page exposes its actual dimensions and source, not a keyword-only stub.
from html import escape
import json
for slug,title,dims,faces,params,model,od,inside,height in parts:
    part_url=url.replace('cad-library.html','cad-'+slug+'.html')
    if slug in profiles:
        profile=profiles[slug][1]
        rows=''.join(f'<tr><td>{i+1}</td><td>{r:g}</td><td>{z:g}</td></tr>' for i,(r,z) in enumerate(profile))
        dimensions='<h2>Cross-section coordinates</h2><p>Closed polygon in the radius/height plane, revolved through 360°. Values are millimetres; point order defines the section. The first point is automatically joined to the last.</p><div class="table-wrap"><table><thead><tr><th>Point</th><th>Radius (mm)</th><th>Height (mm)</th></tr></thead><tbody>'+rows+'</tbody></table></div>'
        notes='Edit the radius/height section points in the source. Keep the polygon simple, with no crossed edges, and do not use negative radii. The mesh approximates the sweep with 96 angular segments.'
    else:
        dimensions='<h2>Named dimensions</h2><pre style="white-space:pre-wrap">'+escape(params)+'</pre>'
        notes='Edit the named dimensions in the source. Keep dimensions positive and, for hollow models, keep the inside diameter smaller than the outside diameter.'
    metadata={'@context':'https://schema.org','@type':'TechArticle','headline':title+' CAD: dimensions, STL and OpenSCAD','url':part_url,'description':dims+'; original educational geometry with downloadable source.','datePublished':'2026-10-14','author':{'@type':'Organization','name':'MechIntel'}}
    detail='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' CAD Dimensions, STL & OpenSCAD | MechIntel</title><meta name="description" content="Download an original '+escape(title.lower())+' CAD study. '+escape(dims)+'. View exact source dimensions, editable OpenSCAD and STL files."><link rel="canonical" href="'+part_url+'"><meta name="robots" content="index,follow"><script type="application/ld+json">'+json.dumps(metadata)+'</script><style>'+css+'pre{overflow-x:auto;background:#0b161b;padding:18px;border-radius:12px}img{max-width:100%;height:auto}</style></head><body><header><a class="brand" href="../">MechIntel.ai</a><nav><a href="cad-library.html">All CAD parts</a><a href="mechanical-engineering-portfolio-planner.html">Project Planner</a></nav></header><main><p class="eyebrow">Original CAD geometry · millimetres</p><h1>'+escape(title)+'</h1><p class="intro">'+escape(dims)+'. Download the STL mesh for a geometry reference or edit the OpenSCAD source for your own dimensions.</p><img src="../assets/cad/'+slug+'.svg" alt="'+escape(title)+' illustrative geometry preview" width="600" height="380"><div class="actions"><a class="cta" download href="../assets/cad/'+slug+'.stl">Download STL</a><a class="cta secondary" download href="../assets/cad/'+slug+'.scad">Download editable source</a></div><section class="card">'+dimensions+'</section><section class="card"><h2>How to modify this model</h2><p>'+notes+'</p><h3>Included OpenSCAD source</h3><pre>'+escape('$fn=96;\n'+params+'\n'+model)+'</pre><h2>Use and limitations</h2><p>This is an original educational starting shape, not a manufacturer replacement or standards-compliant component. No fit, material, load, sealing, electrical insulation, fatigue, or wear performance is established. Thin sections and grooves need process-specific review before manufacture. STL contains no units: import as millimetres.</p><p>Use this model to practice changing dimensions, comparing sections, and documenting your design choices. Supplier-specific fits and certified performance require the actual supplier drawing and specifications.</p><h2>License and provenance</h2><p>Created by MechIntel on October 14, 2026 using procedural geometry. Released under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>. No supplier CAD was copied. Geometry and source are supplied without warranty.</p><p><a href="cad-library.html#'+slug+'">Return to the CAD library →</a></p></section></main></body></html>'
    (ROOT/'engineering-careers'/('cad-'+slug+'.html')).write_text(detail,encoding='utf-8')
