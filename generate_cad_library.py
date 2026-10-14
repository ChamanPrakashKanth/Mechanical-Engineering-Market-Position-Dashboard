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
 'rounded-nose-pin':('Rounded-nose pin',[(0,0),(5,0),(5,20)]+[(5*math.cos(i*math.pi/16),20+5*math.sin(i*math.pi/16)) for i in range(1,8)]+[(0,25)]),
 'hose-tail-blank':('Hose tail geometry blank',[(3,0),(8,0),(8,4),(5,4),(6.5,8),(5,8),(6.5,12),(5,12),(6.5,16),(5,16),(5,20),(3,20)]),
 'tapered-plug':('Tapered plug blank',[(0,0),(10,0),(7,20),(0,20)]),
 'pulley-hub-blank':('Pulley hub blank',[(5,0),(12,0),(12,8),(22,8),(22,12),(12,12),(12,20),(5,20)]),
 'flared-tube-mouth':('Flared tube mouth study',[(5,0),(6.5,0),(6.5,15),(11,23),(9.5,23),(5,15)]),
 'top-hat-spacer':('Top-hat spacer',[(3,0),(12,0),(12,2),(6,2),(6,15),(3,15)]),
 'stepped-bore-bushing':('Stepped-bore bushing',[(4,0),(10,0),(10,22),(7,22),(7,12),(4,12)]),
 'double-taper-sleeve':('Double-taper sleeve',[(4,0),(6,0),(10,12),(6,24),(4,24),(8,12)]),
 'flanged-guide-roller':('Flanged guide roller',[(4,0),(18,0),(18,3),(12,3),(12,22),(18,22),(18,25),(4,25)]),
 'wire-guide-eyelet':('Wire guide eyelet study',[(3,0),(7,0),(9,2),(9,5),(7,7),(3,7),(2,6),(2,1)]),
 'chamfered-thrust-ring':('Chamfered thrust ring',[(6,0),(15,0),(16,1),(16,5),(15,6),(6,6),(5,5),(5,1)]),
 'stepped-piston-blank':('Stepped piston blank',[(0,0),(14,0),(14,5),(12,5),(12,8),(14,8),(14,16),(8,16),(8,22),(0,22)]),
 'turned-handle-blank':('Turned handle blank',[(0,0),(5,0),(5,8),(8,12),(10,24),(8,36),(5,40),(0,40)]),
 'venturi-tube-study':('Venturi tube geometry study',[(10,0),(12,0),(12,40),(10,40),(5,24),(5,16)]),
 'double-lip-ring':('Double-lip ring study',[(5,0),(12,0),(12,2),(10,2),(10,8),(9,8),(9,2),(7,2),(7,8),(6,8),(6,2),(5,2)]),
 'grooved-mandrel-blank':('Grooved mandrel blank',[(0,0),(8,0),(8,8),(6,8),(6,10),(8,10),(8,24),(6,24),(6,26),(8,26),(8,34),(0,34)]),
 'tapered-ferrule':('Tapered ferrule',[(4,0),(6,0),(8,16),(7,18),(6,18)]),
 'recessed-mounting-foot':('Recessed mounting foot blank',[(0,0),(18,0),(18,4),(10,4),(10,16),(4,16),(4,5),(0,5)]),
 'axial-stop-ring':('Axial stop ring blank',[(6,0),(12,0),(12,8),(10,8),(10,5),(6,5)]),
 'conical-roller':('Conical roller blank',[(4,0),(10,0),(18,25),(4,25)]),
 'thin-flared-cup':('Thin flared cup study',[(0,0),(12,0),(18,20),(16.5,20),(10.8,1.5),(0,1.5)]),
 'bearing-seat-sleeve':('Bearing-seat sleeve blank',[(5,0),(11,0),(11,5),(9,5),(9,25),(7,25),(7,12),(5,12)]),
 'flanged-ferrule':('Flanged ferrule',[(4,0),(11,0),(11,2),(6,2),(6,18),(4,18)]),
 'recessed-disc':('Recessed disc blank',[(0,0),(20,0),(20,6),(16,6),(16,3),(0,3)]),
 'crowned-roller':('Crowned roller study',[(4,0),(12,0),(14,6),(15,12),(14,18),(12,24),(4,24)]),
 'triple-groove-pulley':('Triple-groove pulley blank',[(4,0),(20,0),(20,2),(15,5),(20,8),(20,10),(15,13),(20,16),(20,18),(15,21),(20,24),(20,26),(4,26)]),
 'two-step-shaft':('Two-step shaft blank',[(0,0),(12,0),(12,10),(8,10),(8,35),(5,35),(5,50),(0,50)]),
 'cable-pass-sleeve':('Cable pass-through sleeve study',[(5,0),(9,0),(9,3),(7,3),(7,25),(9,25),(9,28),(5,28)]),
 'thin-conical-shroud':('Thin conical shroud',[(18,0),(19,0),(9,30),(8,30)]),
 'dished-roller':('Dished roller blank',[(4,0),(18,0),(18,12),(15,12),(9,6),(4,6)]),
 'tapered-mandrel':('Tapered mandrel blank',[(0,0),(8,0),(8,5),(5,5),(3,40),(0,40)]),
 'cup-with-bore':('Bored cup blank',[(3,0),(16,0),(16,20),(14,20),(14,3),(3,3)]),
 'annular-recess-spacer':('Annular recess spacer',[(5,0),(13,0),(13,10),(11,10),(11,7),(8,7),(8,10),(5,10)]),
 'shouldered-guide-sleeve':('Shouldered guide sleeve',[(4,0),(8,0),(8,16),(12,16),(12,20),(7,20),(7,25),(4,25)]),
 'double-cone-roller':('Double-cone roller blank',[(4,0),(9,0),(17,15),(9,30),(4,30)]),
 'tapered-end-cap':('Tapered end cap study',[(0,0),(12,0),(9,18),(7.5,18),(10.2,2),(0,2)]),
 'small-reel':('Small winding reel blank',[(3,0),(16,0),(16,2),(7,2),(7,18),(16,18),(16,20),(3,20)]),
 'stepped-flange-adapter':('Stepped flange adapter',[(4,0),(18,0),(18,4),(11,4),(11,12),(7,12),(7,24),(4,24)]),
 'long-guide-bushing':('Long guide bushing blank',[(3,0),(7,0),(7,35),(10,35),(10,38),(3,38)]),
 'chamfered-spool':('Chamfered spool blank',[(3,0),(17,0),(18,1),(18,3),(9,3),(9,21),(18,21),(18,23),(17,24),(3,24)]),
 'stepped-thrust-washer':('Stepped thrust washer',[(5,0),(18,0),(18,2),(12,2),(12,5),(5,5)]),
 'tapered-bearing-seat':('Tapered bearing-seat blank',[(5,0),(16,0),(16,4),(11,20),(8,20),(5,12)]),
 'double-recess-disc':('Double-recess disc blank',[(0,2),(12,2),(12,0),(20,0),(20,8),(12,8),(12,6),(0,6)]),
 'bell-mouth-sleeve':('Bell-mouth sleeve study',[(4,0),(6,0),(6,15),(7,19),(10,23),(14,25),(13,26),(9,24),(5,20),(4,16)]),
 'nose-cone-blank':('Nose cone blank',[(0,0),(12,0),(11,6),(8,14),(4,21),(0,25)]),
 'rounded-flange-pin':('Rounded flange pin blank',[(0,0),(10,0),(12,2),(12,4),(10,6),(5,6),(5,25),(0,25)]),
 'cable-drum-blank':('Cable drum blank',[(5,0),(25,0),(25,4),(16,4),(16,36),(25,36),(25,40),(5,40)]),
 'thin-stepped-sleeve':('Thin stepped sleeve study',[(5,0),(6,0),(6,12),(9,12),(9,24),(8,24),(8,13),(5,13)]),
 'double-collar-shaft':('Double-collar shaft blank',[(0,0),(6,0),(6,8),(11,8),(11,12),(6,12),(6,28),(11,28),(11,32),(6,32),(6,40),(0,40)]),
 'chamfered-insert-blank':('Chamfered insert blank',[(3,0),(6,0),(7,1),(7,11),(6,12),(3,12)]),
 'seal-carrier-ring':('Seal carrier ring study',[(6,0),(15,0),(15,10),(12,10),(12,6),(9,6),(9,10),(6,10)]),
 'hollow-tapered-roller':('Hollow tapered roller blank',[(4,0),(10,0),(16,25),(13,25),(7,3),(4,3)]),
 'stepped-end-plug':('Stepped end plug blank',[(0,0),(15,0),(15,3),(10,3),(10,12),(7,12),(7,20),(0,20)]),
 'rimmed-wheel-blank':('Rimmed wheel blank',[(4,0),(18,0),(18,3),(24,3),(24,10),(18,10),(18,13),(4,13)]),
 'recessed-hub':('Recessed hub blank',[(4,0),(14,0),(14,18),(10,18),(10,13),(6,13),(6,6),(4,6)]),
 'flanged-nozzle':('Flanged nozzle blank',[(2,0),(16,0),(16,3),(8,3),(4,22),(2,22)]),
 'ribbed-cable-sleeve':('Ribbed cable sleeve study',[(4,0),(7,0),(7,3),(6,3),(6,6),(7,6),(7,9),(6,9),(6,12),(7,12),(7,15),(6,15),(6,18),(7,18),(7,21),(4,21)]),
 'stepped-cup':('Stepped cup blank',[(0,0),(15,0),(15,8),(12,8),(12,22),(10,22),(10,6),(13,6),(13,2),(0,2)]),
 'countersunk-spacer':('Countersunk spacer',[(3,0),(9,0),(9,16),(6,16),(3,13)]),
 'twin-flange-adapter':('Twin-flange adapter blank',[(4,0),(16,0),(16,4),(8,4),(8,18),(16,18),(16,22),(6,22),(6,12),(4,12)]),
 'tapered-guide-pin':('Tapered guide pin blank',[(0,0),(7,0),(7,5),(5,5),(5,20),(2,28),(0,28)]),
 'deep-flanged-cup':('Deep flanged cup study',[(0,0),(12,0),(12,30),(18,30),(18,33),(10,33),(10,2),(0,2)]),
 'thin-conical-ring':('Thin conical ring study',[(8,0),(9,0),(15,12),(14,12)]),
 'three-step-spacer':('Three-step spacer',[(3,0),(12,0),(12,5),(9,5),(9,12),(6,12),(6,20),(3,20)]),
 'rounded-rim-ring':('Rounded rim ring study',[(5,0),(12,0),(15,2),(16,4),(15,6),(12,8),(5,8)]),
 'short-bearing-boss':('Short bearing boss blank',[(5,0),(18,0),(18,3),(11,3),(11,14),(8,14),(8,8),(5,8)]),
 'stepped-hollow-axle':('Stepped hollow axle blank',[(3,0),(8,0),(8,8),(6,8),(6,32),(8,32),(8,40),(3,40)]),
 'tapered-seat-washer':('Tapered seat washer',[(4,0),(14,0),(14,3),(10,7),(7,7),(4,4)]),
 'flared-reel':('Flared reel blank',[(3,0),(20,0),(20,2),(9,6),(9,18),(20,22),(20,24),(3,24)]),
 'stepped-idler-roller':('Stepped idler roller blank',[(4,0),(12,0),(12,4),(18,4),(18,18),(12,18),(12,22),(4,22)]),
 'flanged-counterbore-sleeve':('Flanged counterbore sleeve',[(3,0),(14,0),(14,3),(8,3),(8,22),(5,22),(5,16),(3,16)]),
 'thin-dust-shield':('Thin dust shield study',[(6,0),(20,0),(20,1),(8,1),(8,8),(6,8)]),
 'conical-hub':('Conical hub blank',[(4,0),(18,0),(18,4),(10,20),(4,20)]),
 'rimmed-bush':('Rimmed bush blank',[(5,0),(12,0),(14,2),(14,5),(12,7),(9,7),(9,20),(5,20)]),
 'recessed-pulley-blank':('Recessed pulley blank',[(4,0),(20,0),(20,3),(15,7),(20,11),(20,14),(11,14),(11,10),(4,10)]),
 'shouldered-taper-plug':('Shouldered taper plug blank',[(0,0),(14,0),(14,3),(10,3),(6,23),(0,23)]),
 'twin-bore-adapter':('Twin-bore adapter blank',[(3,0),(10,0),(10,24),(6,24),(6,12),(3,12)]),
 'grooved-guide-bush':('Grooved guide bush blank',[(4,0),(10,0),(10,5),(8,5),(8,7),(10,7),(10,17),(8,17),(8,19),(10,19),(10,24),(4,24)]),
 'thin-tapered-eyelet':('Thin tapered eyelet study',[(3,0),(5,0),(8,8),(8,10),(6.5,10),(3,2)]),
 'stepped-drum':('Stepped drum blank',[(5,0),(22,0),(22,4),(15,4),(15,14),(12,14),(12,26),(22,26),(22,30),(5,30)]),
 'annular-support-foot':('Annular support foot blank',[(4,0),(20,0),(20,3),(14,8),(9,8),(9,15),(4,15)]),
 'flanged-bearing-spacer':('Flanged bearing spacer',[(6,0),(16,0),(16,3),(10,3),(10,18),(6,18)]),
 'stepped-hollow-pin':('Stepped hollow pin blank',[(2,0),(8,0),(8,5),(5,5),(5,30),(2,30)]),
 'recessed-end-button':('Recessed end button blank',[(0,0),(12,0),(14,2),(14,6),(12,8),(7,8),(7,5),(0,5)]),
 'flared-collar-ring':('Flared collar ring',[(5,0),(9,0),(9,10),(16,15),(16,17),(7,12),(5,12)]),
 'flanged-drill-guide':('Flanged drill guide blank',[(3,0),(8,0),(8,18),(13,18),(13,22),(4,22),(3,21)]),
 'double-counterbore-spacer':('Double-counterbore spacer',[(6,0),(11,0),(11,24),(6,24),(6,19),(3,19),(3,5),(6,5)]),
 'chamfered-hub-sleeve':('Chamfered hub sleeve',[(5,0),(11,0),(12,1),(12,23),(11,24),(5,24),(4,23),(4,1)]),
 'thin-rim-cap':('Thin rim cap study',[(0,0),(14,0),(14,15),(17,15),(17,17),(12.5,17),(12.5,1.5),(0,1.5)]),
 'recessed-guide-roller':('Recessed guide roller blank',[(4,0),(18,0),(18,3),(13,3),(13,19),(18,19),(18,22),(10,22),(10,17),(4,17)]),
 'tapered-shoulder-sleeve':('Tapered shoulder sleeve',[(4,0),(14,0),(14,3),(9,3),(6,24),(4,24)]),
 'stepped-seat-ring':('Stepped seat ring blank',[(6,0),(17,0),(17,4),(13,4),(13,9),(9,9),(9,5),(6,5)]),
 'long-hollow-mandrel':('Long hollow mandrel blank',[(3,0),(10,0),(10,6),(7,6),(5,50),(3,50)]),
 'twin-rib-sleeve':('Twin-rib sleeve',[(4,0),(7,0),(7,5),(10,5),(10,8),(7,8),(7,22),(10,22),(10,25),(7,25),(7,30),(4,30)]),
 'rounded-seat-washer':('Rounded seat washer study',[(4,0),(14,0),(15,1),(15,3),(14,4),(11,5),(7,5),(4,2)]),
 'stepped-cable-eyelet':('Stepped cable eyelet study',[(3,0),(9,0),(9,2),(6,2),(6,8),(8,8),(8,10),(3,10)]),
 'flared-nozzle-sleeve':('Flared nozzle sleeve study',[(3,0),(5,0),(5,16),(10,24),(9,25),(3,17)]),
 'recessed-support-ring':('Recessed support ring blank',[(5,0),(19,0),(19,4),(16,4),(16,2),(9,2),(9,10),(5,10)]),
 'thin-bell-cap':('Thin bell cap study',[(0,0),(10,0),(11,5),(14,10),(18,14),(17,15),(13,11),(10,6),(9,1.5),(0,1.5)]),
 'stepped-flange-pin':('Stepped flange pin blank',[(0,0),(12,0),(12,4),(8,4),(8,12),(5,12),(5,30),(0,30)]),
 'wide-groove-drum':('Wide-groove drum blank',[(5,0),(22,0),(22,5),(14,9),(14,21),(22,25),(22,30),(5,30)]),
 'stepped-guide-boss':('Stepped guide boss blank',[(3,0),(15,0),(15,4),(10,4),(10,12),(7,12),(7,24),(3,24)]),
 'thin-flange-eyelet':('Thin-flange eyelet study',[(3,0),(10,0),(10,1),(5,1),(5,10),(3,10)]),
 'tapered-roller-hub':('Tapered roller hub blank',[(4,0),(12,0),(18,18),(10,18),(10,24),(4,24)]),
 'recessed-flange-spacer':('Recessed flange spacer',[(4,0),(16,0),(16,5),(12,5),(12,2),(8,2),(8,20),(4,20)]),
 'shouldered-bore-plug':('Shouldered bore plug blank',[(0,0),(14,0),(14,4),(9,4),(9,20),(4,20),(4,8),(0,8)]),
 'triple-collar-shaft':('Triple-collar shaft blank',[(0,0),(5,0),(5,5),(10,5),(10,8),(5,8),(5,18),(10,18),(10,21),(5,21),(5,31),(10,31),(10,34),(5,34),(5,39),(0,39)]),
 'conical-recess-disc':('Conical recess disc blank',[(0,0),(20,0),(20,8),(16,8),(8,3),(0,3)]),
 'long-tapered-ferrule':('Long tapered ferrule',[(4,0),(6,0),(9,30),(7,30)]),
 'flanged-thin-shroud':('Flanged thin shroud study',[(10,0),(18,0),(18,2),(12,2),(8,30),(6.5,30)]),
 'rounded-guide-bush':('Rounded guide bush blank',[(4,0),(9,0),(11,2),(11,4),(9,6),(7,6),(7,22),(4,22)]),
 'counterbored-hub':('Counterbored hub blank',[(4,0),(12,0),(12,20),(7,20),(7,14),(4,14)]),
 'stepped-dust-ring':('Stepped dust ring study',[(6,0),(18,0),(18,1.5),(12,1.5),(12,6),(9,6),(9,1.5),(6,1.5)]),
 'recessed-reel':('Recessed reel blank',[(4,0),(20,0),(20,3),(9,3),(9,23),(20,23),(20,26),(12,26),(12,24),(4,24)]),
 'tapered-pivot-bush':('Tapered pivot bush blank',[(4,0),(9,0),(13,20),(4,20)]),
 'flared-support-foot':('Flared support foot blank',[(3,0),(22,0),(22,3),(10,12),(7,12),(7,18),(3,18)]),
 'thin-domed-cap':('Thin domed cap study',[(0,0),(14,0),(14,12),(12,17),(7,21),(0,23),(0,21.5),(6.5,19.5),(10.5,16),(12.5,11.5),(12.5,1.5),(0,1.5)]),
 'stepped-collet-blank':('Stepped collet blank without slots',[(3,0),(8,0),(8,6),(10,6),(6,30),(3,30)]),
 'deep-counterbore-hub':('Deep counterbore hub blank',[(4,0),(15,0),(15,28),(10,28),(10,8),(4,8)]),
 'double-shoulder-sleeve':('Double-shoulder sleeve',[(4,0),(8,0),(8,6),(12,6),(12,10),(9,10),(9,22),(14,22),(14,26),(4,26)]),
 'thin-rimmed-cone':('Thin rimmed cone study',[(12,0),(20,0),(20,1.5),(14,1.5),(6,26),(4.5,26)]),
 'recessed-thrust-collar':('Recessed thrust collar blank',[(6,0),(18,0),(18,6),(14,6),(14,3),(10,3),(10,12),(6,12)]),
 'tapered-drum-hub':('Tapered drum hub blank',[(5,0),(24,0),(24,4),(14,10),(10,28),(5,28)]),
 'rounded-eyelet-ring':('Rounded eyelet ring study',[(3,0),(7,0),(10,2),(11,5),(10,8),(7,10),(3,10),(2,8),(2,2)]),
 'flanged-step-roller':('Flanged step roller blank',[(4,0),(20,0),(20,3),(13,3),(13,12),(10,12),(10,22),(20,22),(20,25),(4,25)]),
 'thin-reducer-cap':('Thin reducer cap study',[(0,0),(16,0),(16,6),(10,18),(8,18),(14,5),(14,2),(0,2)]),
 'long-neck-boss':('Long-neck boss blank',[(3,0),(17,0),(17,4),(7,4),(7,35),(3,35)]),
 'annular-groove-hub':('Annular groove hub blank',[(5,0),(15,0),(15,12),(13,12),(13,8),(10,8),(10,12),(8,12),(8,20),(5,20)]),
 'stepped-ferrule-eyelet':('Stepped ferrule eyelet study',[(3,0),(9,0),(9,2),(5,2),(5,14),(7,16),(7,18),(3,18)]),
 'conical-thrust-ring':('Conical thrust ring study',[(5,0),(17,0),(17,4),(10,10),(7,10),(5,8)]),
 'twin-recess-roller':('Twin-recess roller blank',[(4,4),(10,4),(10,0),(18,0),(18,24),(10,24),(10,20),(4,20)]),
 'thin-profiled-cover':('Thin profiled cover study',[(0,0),(13,0),(13,8),(16,12),(16,16),(14.5,16),(14.5,12.5),(11.5,8.5),(11.5,1.5),(0,1.5)]),
 'short-tapered-arbor':('Short tapered arbor blank',[(0,0),(12,0),(12,4),(7,4),(4,24),(0,24)]),
 'stepped-pulley-sleeve':('Stepped pulley sleeve',[(4,0),(10,0),(10,8),(14,8),(14,12),(8,12),(8,26),(4,26)]),
 'thin-hat-cover':('Thin hat cover study',[(0,0),(12,0),(12,18),(20,18),(20,20),(10,20),(10,2),(0,2)]),
 'recessed-bearing-ring':('Recessed bearing ring blank',[(6,0),(18,0),(18,8),(14,8),(14,5),(10,5),(10,12),(6,12)]),
 'rounded-shoulder-pin':('Rounded shoulder pin blank',[(0,0),(9,0),(11,2),(11,4),(9,6),(5,6),(5,26),(4,28),(0,28)]),
 'long-counterbore-bush':('Long counterbore bush',[(4,0),(10,0),(10,36),(7,36),(7,26),(4,26)]),
 'tapered-lip-ring':('Tapered lip ring study',[(5,0),(15,0),(15,3),(10,9),(9,9),(13,3),(5,3)]),
 'flanged-crowned-roller':('Flanged crowned roller blank',[(4,0),(19,0),(19,3),(12,3),(14,9),(15,15),(14,21),(12,27),(19,27),(19,30),(4,30)]),
 'hollow-stepped-arbor':('Hollow stepped arbor blank',[(3,0),(12,0),(12,6),(8,6),(8,24),(5,24),(5,40),(3,40)]),
 'thin-cable-funnel':('Thin cable funnel study',[(5,0),(7,0),(7,8),(18,24),(16.5,25),(5,9)]),
 'double-face-groove-ring':('Double-face groove ring',[(5,0),(9,0),(9,2),(12,2),(12,0),(17,0),(17,8),(12,8),(12,6),(9,6),(9,8),(5,8)]),
 'shouldered-reducer':('Shouldered reducer sleeve',[(4,0),(10,0),(10,4),(8,4),(8,14),(13,24),(11,24),(6,14),(4,14)]),
 'deep-lip-cap':('Deep lip cap study',[(0,0),(15,0),(15,22),(18,22),(18,25),(13,25),(13,2),(0,2)]),
 'twin-step-idler':('Twin-step idler blank',[(4,0),(10,0),(10,5),(14,5),(14,10),(18,10),(18,20),(14,20),(14,25),(10,25),(10,30),(4,30)]),
 'annular-mounting-boss':('Annular mounting boss blank',[(5,0),(20,0),(20,4),(11,4),(11,18),(8,18),(8,10),(5,10)]),
 'thin-conical-sleeve-flange':('Thin conical sleeve with flange',[(6,0),(15,0),(15,2),(8,2),(12,28),(10.5,28)]),
 'rounded-drum-blank':('Rounded drum blank',[(5,0),(16,0),(20,3),(22,7),(22,19),(20,23),(16,26),(5,26)]),
 'stepped-flange-roller':('Stepped flange roller blank',[(4,0),(21,0),(21,3),(14,3),(14,10),(11,10),(11,24),(21,24),(21,27),(4,27)]),
 'thin-shoulder-cap':('Thin shoulder cap study',[(0,0),(13,0),(13,10),(16,10),(16,19),(14.5,19),(14.5,11.5),(11.5,11.5),(11.5,1.5),(0,1.5)]),
 'long-flanged-eyelet':('Long flanged eyelet study',[(3,0),(11,0),(11,2),(5,2),(5,24),(3,24)]),
 'recessed-conical-hub':('Recessed conical hub blank',[(4,0),(18,0),(18,4),(11,22),(7,22),(7,15),(4,15)]),
 'rounded-thrust-collar':('Rounded thrust collar blank',[(5,0),(13,0),(16,2),(17,5),(16,8),(13,10),(9,10),(9,16),(5,16)]),
 'double-flare-sleeve':('Double-flare sleeve study',[(8,0),(10,0),(6,8),(6,22),(10,30),(8,30),(4,22),(4,8)]),
 'grooved-shoulder-pin':('Grooved shoulder pin blank',[(0,0),(10,0),(10,5),(6,5),(6,12),(4.5,12),(4.5,14),(6,14),(6,30),(0,30)]),
 'thin-annular-cover':('Thin annular cover study',[(5,0),(20,0),(20,10),(18.5,10),(18.5,1.5),(5,1.5)]),
 'tapered-bore-bush':('Tapered-bore bush blank',[(3,0),(10,0),(10,25),(7,25)]),
 'deep-recess-button':('Deep recess button blank',[(0,0),(14,0),(16,2),(16,12),(14,14),(8,14),(8,4),(0,4)]),
 'triple-step-hub':('Triple-step hub blank',[(4,0),(18,0),(18,6),(14,6),(14,14),(10,14),(10,24),(4,24)]),
 'rimmed-conical-wheel':('Rimmed conical wheel blank',[(4,0),(16,0),(16,3),(24,3),(24,8),(14,24),(4,24)]),
 'thin-necked-cover':('Thin necked cover study',[(0,0),(16,0),(16,12),(10,18),(10,25),(8.5,25),(8.5,17.5),(14.5,11.5),(14.5,1.5),(0,1.5)]),
 'counterbore-seat-ring':('Counterbore seat ring',[(4,0),(15,0),(15,12),(9,12),(9,7),(6,7),(6,3),(4,3)]),
 'hollow-flanged-arbor':('Hollow flanged arbor blank',[(3,0),(16,0),(16,4),(8,4),(6,35),(3,35)]),
 'recessed-double-collar':('Recessed double collar blank',[(5,0),(16,0),(16,4),(10,4),(10,18),(16,18),(16,22),(9,22),(9,16),(5,16)]),
}
for slug,(title,profile) in profiles.items():
    radius=max(p[0] for p in profile);height=max(p[1] for p in profile)
    dims=f'Max OD {radius*2:g} · height {height:g} mm · section dimensions in source'
    parts.append((slug,title,dims,revolve(profile),'// Section points: [radius, height], mm. Edit to change the profile.\nsection='+str([list(point) for point in profile])+';','rotate_extrude($fn=96) polygon(points=section);',radius*2,min(p[0] for p in profile)*2,height))
from industrial_parts import PARTS as INDUSTRIAL_PARTS
industrial_by_slug={part['slug']:part for part in INDUSTRIAL_PARTS}
for part in INDUSTRIAL_PARTS:
    data=(OUT/(part['slug']+'.stl')).read_bytes()
    count=struct.unpack_from('<I',data,80)[0]
    triangles=[]
    for i in range(count):
        values=struct.unpack_from('<12fH',data,84+i*50)
        a,b,c=tuple(values[3:6]),tuple(values[6:9]),tuple(values[9:12])
        u=[b[k]-a[k] for k in range(3)];v=[c[k]-a[k] for k in range(3)]
        cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        if sum(t*t for t in cross)>1e-18: triangles.append((a,b,c))
    parts.append((part['slug'],part['title'],part['dims'],triangles,part['params']+'\n$fn=64;',part['code'],0,0,0))
parts.sort(key=lambda part: 0 if part[0] in industrial_by_slug else 1)
cards=[]
for slug,title,dims,faces,params,model,od,inside,height in parts:
    stl(OUT/(slug+'.stl'),faces)
    (OUT/(slug+'.scad')).write_text('// Original MechIntel educational model. CC0-1.0. Units: mm.\n// Not a standardized or load-rated component.\n$fn=96;\n'+params+'\n'+model+'\n',encoding='utf-8')
    if slug in industrial_by_slug:
        drawing=mesh_preview(faces)
    elif slug in profiles:
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
html=html.replace('Circular sweeps use 96 segments; the rounded ring section uses 24 points.','Circular profile sweeps use 96 segments; the rounded ring section uses 24 points. Industrial boolean models use 64 segments for round features.')
html=html.replace('<p><label for="search">','<section class="card"><p class="eyebrow">NEW · INDUSTRIAL DESIGN STUDIES</p><h2>Brackets, housings, couplings and manifolds</h2><p>The first 8 models include subtractive features: mounting holes, counterbores, relief slots, intersecting passages, and reinforcing ribs. They are original educational designs, not supplier replacements. Hole fits, thread forms, load ratings, sealing and pressure performance are not specified.</p><p>Search “industrial” to show only these parts. Open each dimension page for hole coordinates and feature notes.</p></section><p><label for="search">')
for slug in industrial_by_slug:
    title=industrial_by_slug[slug]['title'].lower()
    html=html.replace('data-part="'+title+'"','data-part="industrial '+title+'"')
html=html.replace('The first 8 models','The first '+str(len(INDUSTRIAL_PARTS))+' models')
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
        if slug in industrial_by_slug:
            dimensions+='<h3>Feature layout and design notes</h3><p>'+escape(industrial_by_slug[slug]['notes'])+'</p>'
            notes='Edit the named dimensions, render the boolean geometry in OpenSCAD, and export a fresh STL. Fixed hole locations and offsets in the source may also need adjustment when changing overall sizes. Manufacturing feasibility, fit and performance must be evaluated separately.'
    metadata={'@context':'https://schema.org','@type':'TechArticle','headline':title+' CAD: dimensions, STL and OpenSCAD','url':part_url,'description':dims+'; original educational geometry with downloadable source.','datePublished':'2026-10-14','author':{'@type':'Organization','name':'MechIntel'}}
    detail='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' CAD Dimensions, STL & OpenSCAD | MechIntel</title><meta name="description" content="Download an original '+escape(title.lower())+' CAD study. '+escape(dims)+'. View exact source dimensions, editable OpenSCAD and STL files."><link rel="canonical" href="'+part_url+'"><meta name="robots" content="index,follow"><script type="application/ld+json">'+json.dumps(metadata)+'</script><style>'+css+'pre{overflow-x:auto;background:#0b161b;padding:18px;border-radius:12px}img{max-width:100%;height:auto}</style></head><body><header><a class="brand" href="../">MechIntel.ai</a><nav><a href="cad-library.html">All CAD parts</a><a href="mechanical-engineering-portfolio-planner.html">Project Planner</a></nav></header><main><p class="eyebrow">Original CAD geometry · millimetres</p><h1>'+escape(title)+'</h1><p class="intro">'+escape(dims)+'. Download the STL mesh for a geometry reference or edit the OpenSCAD source for your own dimensions.</p><img src="../assets/cad/'+slug+'.svg" alt="'+escape(title)+' illustrative geometry preview" width="600" height="380"><div class="actions"><a class="cta" download href="../assets/cad/'+slug+'.stl">Download STL</a><a class="cta secondary" download href="../assets/cad/'+slug+'.scad">Download editable source</a></div><section class="card">'+dimensions+'</section><section class="card"><h2>How to modify this model</h2><p>'+notes+'</p><h3>Included OpenSCAD source</h3><pre>'+escape('$fn=96;\n'+params+'\n'+model)+'</pre><h2>Use and limitations</h2><p>This is an original educational starting shape, not a manufacturer replacement or standards-compliant component. No fit, material, load, sealing, electrical insulation, fatigue, or wear performance is established. Thin sections and grooves need process-specific review before manufacture. STL contains no units: import as millimetres.</p><p>Use this model to practice changing dimensions, comparing sections, and documenting your design choices. Supplier-specific fits and certified performance require the actual supplier drawing and specifications.</p><h2>License and provenance</h2><p>Created by MechIntel on October 14, 2026 using procedural geometry. Released under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>. No supplier CAD was copied. Geometry and source are supplied without warranty.</p><p><a href="cad-library.html#'+slug+'">Return to the CAD library →</a></p></section></main></body></html>'
    (ROOT/'engineering-careers'/('cad-'+slug+'.html')).write_text(detail,encoding='utf-8')
