"""Original drone accessory studies. Box geometry is shared by STL and SCAD exporters."""
from pathlib import Path
import math
import struct

ROOT = Path(__file__).absolute().parent
PRINT_REF = ('Prusa flexible filament guidance', 'https://help.prusa3d.com/article/flexible-materials_2057')
GPS_REF = ('ArduPilot GPS and compass installation', 'https://ardupilot.org/copter/docs/common-installing-3dr-ublox-gps-compass-module.html')
ANTENNA_REF = ('ExpressLRS hardware and antenna selection', 'https://www.expresslrs.org/hardware/hardware-selection/')

def part(slug,title,dimensions,params,solid,cut,notes,printing,reference=PRINT_REF):
    def scad_box(box):
        values=[str(x) for x in box]
        return 'translate(['+','.join(values[:3])+']) cube(['+','.join(values[3:])+']);'
    code='difference(){\n union(){\n  '+'\n  '.join(map(scad_box,solid))+'\n }\n '+'\n '.join(map(scad_box,cut))+'\n}'
    return dict(slug=slug,title=title,dims=dimensions,params='\n'.join(f'{k}={v};' for k,v in params.items()),code=code,
                published='2026-10-16',notes=notes+' Print orientation: '+printing+' These original accessories have not been physically printed or flight-tested. Measure your hardware; do not assume compatibility with any named frame or module. Printed fit, retention, electrical clearance and propeller clearance must be checked on the actual assembly.',
                values=params,solid=solid,cut=cut,printing=printing,reference=reference)

PARTS = [
 part('drone-gps-tray-25mm','FPV drone GPS tray for a 25 mm module','29.4 × 29.4 × 9 mm · pocket 25.4 × 25.4 mm · 8 mm cable exit',
      dict(inner=25.4,wall=2,floor=2,rim=7,slot=2.4),
      [('0','0','0','inner+2*wall','inner+2*wall','floor+rim')],
      [('wall','wall','floor','inner','inner','rim+1'),('inner/2+wall-4','-1','floor+2','8','wall+2','rim'),('wall+2','(inner+2*wall-18)/2','-1','slot','18','floor+1'),('inner+wall-2-slot','(inner+2*wall-18)/2','-1','slot','18','floor+1')],
      'Open tray with two floor tie slots and a raised cable exit. The 25.4 mm pocket supplies 0.4 mm total nominal allowance for a measured 25 mm module; it is not a standardized GPS footprint. Keep a clear sky view and review compass magnetic interference. No mast, vibration isolator or enclosure lid is included.',
      'Base on the bed, pocket upward. A 0.2 mm layer and 0.4 mm nozzle are starting points; inspect tie-slot bridging. Try a fit coupon before a full print. PETG is a candidate for rigid fit trials; use the filament supplier profile.',GPS_REF),
 part('drone-capacitor-strap-cradle','FPV drone capacitor strap cradle','34 × 18 × 5 mm · 14 mm open channel · two 2.5 × 10 mm tie slots',
      dict(length=34,width=18,base=2,rail=2,rail_height=3,slot=2.5),
      [('0','0','0','length','width','base'),('0','0','base','length','rail','rail_height'),('0','width-rail','base','length','rail','rail_height')],
      [('6','4','-1','slot','width-8','base+1'),('length-6-slot','4','-1','slot','width-8','base+1')],
      'An open rectangular saddle for a small cylindrical capacitor held by separate soft ties. The 14 mm space between rails is not an interference-fit cylinder. Nominally leaves 2 mm total lateral clearance around a measured 12 mm body. No clamp or tie is included. Keep the pressure relief vent and terminals unobstructed; do not tighten ties onto leads.',
      'Flat base on the bed, rails upward. TPU is a candidate for flexible retention trials, using the supplier TPU profile. Start with a 0.2 mm layer and verify all tie passages after slicing.'),
 part('drone-antenna-cable-guide','FPV drone dual antenna cable guide','32 × 16 × 7 mm · two 5 mm open channels · two tie slots',
      dict(length=32,width=16,base=2,rail=2,height=5,slot=2.4),
      [('0','0','0','length','width','base'),('0','0','base','length','rail','height'),('0','7','base','length','rail','height'),('0','14','base','length','rail','height')],
      [('6','2','-1','slot','12','base+1'),('length-6-slot','2','-1','slot','12','base+1')],
      'Three rails form two open cable channels; use separate soft ties for retention. This guides insulated coax or antenna sleeves, not bare radiating elements. It does not set an antenna angle or improve radio range. Follow the receiver manufacturer guidance and keep the antenna active area clear of conductive carbon fibre and other obstructions.',
      'Base on the bed, channels upward. TPU is a candidate for compliant cable support. Start with 0.2 mm layers and confirm cable bend radius and connector access before installing.',ANTENNA_REF),
 part('drone-receiver-tray-20x12','FPV receiver tray for a 20 × 12 mm board','24.4 × 16.4 × 6 mm · pocket 20.4 × 12.4 mm · two cable exits',
      dict(inner_x=20.4,inner_y=12.4,wall=2,floor=2,rim=4,slot=2.4),
      [('0','0','0','inner_x+2*wall','inner_y+2*wall','floor+rim')],
      [('wall','wall','floor','inner_x','inner_y','rim+1'),('wall+inner_x/2-4','-1','floor+1','8','wall+2','rim'),('wall+inner_x/2-4','inner_y+wall-1','floor+1','8','wall+2','rim'),('4','4','-1','slot','inner_y-4','floor+1'),('inner_x+2*wall-4-slot','4','-1','slot','inner_y-4','floor+1')],
      'Open receiver board tray with two floor tie slots and exits at both short walls. The nominal pocket leaves 0.4 mm total allowance in each axis for a measured 20 × 12 mm board outline. Component heights, solder joints, antenna clearance and insulation are not represented. No receiver brand compatibility is claimed.',
      'Floor on the bed, opening upward. PETG or TPU may be evaluated for fit trials. Start at 0.2 mm layers; inspect the narrow floor webs and leave room for solder joints.',ANTENNA_REF),
 part('drone-arm-wire-cover-14mm','Drone arm wire protector with a 14 mm tunnel','48 × 18 × 8 mm · tunnel 14 × 6 mm · two roof tie slots',
      dict(length=48,inner_width=14,wall=2,clear_height=6,roof=2,slot=3),
      [('0','0','0','length','inner_width+2*wall','clear_height+roof')],
      [('-1','wall','-1','length+2','inner_width','clear_height+1'),('8','wall+3','clear_height-1','slot','inner_width-6','roof+2'),('length-8-slot','wall+3','clear_height-1','slot','inner_width-6','roof+2')],
      'Open-ended U cover for an arm or wire bundle within a 14 × 6 mm rectangular envelope. Two roof slots accept separate ties. It is a cable cover, not a structural arm or impact-rated guard. Check the full moving propeller envelope and keep motor cooling paths clear.',
      'Flip the model 180 degrees in the slicer so its outside roof lies on the bed and the open tunnel faces upward. TPU may be evaluated for a compliant cover. Start at 0.2 mm layers; remove strings from the tie slots.'),
 part('drone-battery-strap-guide-20mm','Drone battery strap routing bridge for 20 mm webbing','30 × 24 × 5 mm · open passage 20 × 2 mm',
      dict(length=30,strap_width=20,wall=2,gap=2,roof=3),
      [('0','0','0','length','strap_width+2*wall','gap+roof')],
      [('-1','wall','-1','length+2','strap_width','gap+1')],
      'A simple open-bottom webbing routing bridge. The 20 mm passage is nominal and may be too tight for actual 20 mm webbing; increase strap_width for measured strap width plus process allowance. The 2 mm vertical passage excludes buckles and folded seams. It does not secure a battery by itself and is not a battery enclosure, fire barrier or load-rated clamp.',
      'Flip 180 degrees in the slicer, exterior roof on the bed. TPU is a candidate for a soft guide. Start at 0.2 mm layers; inspect edges and prevent strap abrasion.'),
]
SOURCE_REFERENCES={p['slug']:[p['reference'],PRINT_REF] if p['reference']!=PRINT_REF else [PRINT_REF] for p in PARTS}

def boxes(p,key):
    return [tuple(float(eval(str(v),{'__builtins__':{}},p['values'])) for v in box) for box in p[key]]

def mesh(p):
    """Exact exposed surface of a rectangular CSG grid, with shared split edges."""
    positive,negative=boxes(p,'solid'),boxes(p,'cut')
    low=[min(b[k] for b in positive) for k in range(3)]
    high=[max(b[k]+b[k+3] for b in positive) for k in range(3)]
    axes=[sorted({max(low[k],min(high[k],v)) for b in positive+negative for v in (b[k],b[k]+b[k+3])}) for k in range(3)]
    def contains(b,point):
        return all(b[k]<point[k]<b[k]+b[k+3] for k in range(3))
    cells=set()
    for i in range(len(axes[0])-1):
        for j in range(len(axes[1])-1):
            for k in range(len(axes[2])-1):
                center=[(axes[a][v]+axes[a][v+1])/2 for a,v in enumerate((i,j,k))]
                if any(contains(b,center) for b in positive) and not any(contains(b,center) for b in negative):cells.add((i,j,k))
    triangles=[]
    for i,j,k in sorted(cells):
        x,X=axes[0][i:i+2];y,Y=axes[1][j:j+2];z,Z=axes[2][k:k+2]
        points=[(x,y,z),(X,y,z),(X,Y,z),(x,Y,z),(x,y,Z),(X,y,Z),(X,Y,Z),(x,Y,Z)]
        faces=[((0,0,-1),(0,3,2,1)),((0,0,1),(4,5,6,7)),((0,-1,0),(0,1,5,4)),((1,0,0),(1,2,6,5)),((0,1,0),(2,3,7,6)),((-1,0,0),(3,0,4,7))]
        for (di,dj,dk),(a,b,c,d) in faces:
            if (i+di,j+dj,k+dk) not in cells:triangles.extend([(points[a],points[b],points[c]),(points[a],points[c],points[d])])
    return triangles

def validate(triangles):
    from collections import Counter,defaultdict
    edges=Counter();directed=Counter();adj=defaultdict(set);volume=0
    for a,b,c in triangles:
        u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)]
        normal=(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])
        assert sum(x*x for x in normal)>1e-16,'Degenerate triangle'
        for x,y in [(a,b),(b,c),(c,a)]:
            edges[tuple(sorted((x,y)))]+=1;directed[(x,y)]+=1;adj[x].add(y);adj[y].add(x)
        volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6
    assert all(count==2 for count in edges.values()),'Non-manifold or open edge'
    assert all(directed[(b,a)]==count for (a,b),count in directed.items()),'Inconsistent face orientation'
    seen=set();todo=[next(iter(adj))]
    while todo:
        v=todo.pop()
        if v not in seen:seen.add(v);todo.extend(adj[v]-seen)
    assert len(seen)==len(adj),'Disconnected mesh'
    assert volume>0,'Inverted mesh'
    return volume

def generate_meshes():
    out=ROOT/'assets/cad'
    for p in PARTS:
        triangles=mesh(p);volume=validate(triangles)
        with (out/(p['slug']+'.stl')).open('wb') as f:
            f.write(b'MechIntel original drone accessory; mm; CC0'.ljust(80,b'\0'));f.write(struct.pack('<I',len(triangles)))
            for a,b,c in triangles:
                u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)]
                n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];length=math.sqrt(sum(x*x for x in n));n=[x/length for x in n]
                f.write(struct.pack('<12fH',*(n+list(a)+list(b)+list(c)),0))
        print(p['slug'],len(triangles),'triangles; watertight; volume',round(volume,2),'mm3')

if __name__=='__main__':generate_meshes()
