"""Original printable machine-routing studies; CPU-only rectangular CSG."""
from pathlib import Path
from html import escape
import struct, math
from drone_parts import mesh, validate
ROOT=Path(__file__).resolve().parent
REF=('icotek: cable and pneumatic tubing organization','https://www.icotek.com/en-us/products/strain-relief/zl-32222')
PARTS=[]
def add(slug,title,dims,values,solid,cut,notes):
 def box(b):return 'translate(['+','.join(map(str,b[:3]))+']) cube(['+','.join(map(str,b[3:]))+']);'
 PARTS.append(dict(slug=slug,title=title,dims=dims,values=values,solid=solid,cut=cut,published='2026-10-17',params='\n'.join(f'{k}={v};' for k,v in values.items()),code='difference(){union(){\n'+'\n'.join(map(box,solid))+'\n}\n'+'\n'.join(map(box,cut))+'\n}',notes=notes+' Print flat with the base on the bed, open features upward. All mounting apertures are rectangular slots, not modeled screw threads. Start with a fit coupon and deburr cable-contact edges. These are untested bench layout studies: no physical print, pull-out, fatigue, flame, electrical insulation or pressure validation. Use separate soft ties; do not crush cable jackets or pneumatic tubing. No supplier compatibility or standards compliance is claimed.'))
add('industrial-four-lane-cable-tie-comb','Four-lane cable tie comb for machine wiring','70 × 28 × 8 mm; four 10 mm channels; 3 × 8 mm tie slots',dict(length=70,width=28,base=3,rail_height=5),
 [('0','0','0','length','width','base')]+[(str(x),'0','base','2','width','rail_height') for x in [12,24,36,48,60]],
 [(str(x),'10','-1','3','8','base+2') for x in [17,29,41,53]]+[('3','10','-1','5','8','base+2'),('62','10','-1','5','8','base+2')],
 'Four open channels separate cables during machine-panel layout. Channel centerlines X18,30,42,54 mm; channel width 10 mm. Two mounting slots at X3–8 and X62–67, Y10–18 mm. Each channel has a tie passage through the base. Does not establish rated strain relief.')
add('industrial-four-lane-pneumatic-tube-guide','Four-lane pneumatic tube routing guide for 6 mm tubing','64 × 32 × 7 mm; four 6.8 mm open channels',dict(length=64,width=32,base=3,rail_height=4),
 [('0','0','0','length','width','base')]+[(str(x),'0','base','2','width','rail_height') for x in [13,21.8,30.6,39.4,48.2]],
 [(str(x),'12','-1','2.5','8','base+2') for x in [17.15,25.95,34.75,43.55]]+[('4','11','-1','5','10','base+2'),('55','11','-1','5','10','base+2')],
 'Open routing lanes offer 0.8 mm total nominal lateral allowance around measured 6 mm outside-diameter tubing. This is an organizer, not a fluid fitting, sealed manifold or pressure clamp. Check actual tube bend radius and avoid kinks. Channel centers X18.4,27.2,36,44.8 mm. Soft ties are supplied separately.')
add('industrial-drag-chain-tie-anchor-plate','Cable carrier tie anchor plate with six passages','80 × 36 × 4 mm; six 3 × 14 mm tie passages',dict(length=80,width=36,base=4),
 [('0','0','0','length','width','base')],
 [(str(x),'11','-1','3','14','base+2') for x in [15,24,33,42,51,60]]+[('4','12','-1','5','12','base+2'),('71','12','-1','5','12','base+2')],
 'Flat six-passage anchor for exploring tie-wrap routing near a separately selected cable-carrier end. It has no chain interface, pivot or DIN-rail latch. Mounting-slot centers are 67 mm apart. Review moving-axis travel, jacket compression and the cable supplier strain-relief instructions; this model is not a validated dynamic strain-relief device.')
add('industrial-rectangular-sensor-strap-tray','Rectangular sensor strap tray with cable exit','48 × 28 × 10 mm; 40 × 20 mm pocket; 10 mm cable exit',dict(inner_x=40,inner_y=20,wall=4,base=3,rim=7),
 [('0','0','0','inner_x+2*wall','inner_y+2*wall','base+rim')],
 [('wall','wall','base','inner_x','inner_y','rim+1'),('inner_x+wall-1','9','base+1','wall+2','10','rim'),('10','7','-1','3','14','base+2'),('35','7','-1','3','14','base+2')],
 'Bench positioning tray for a measured rectangular sensor envelope smaller than 40 × 20 mm. Two floor slots accept separate retention straps; no screws or electronics are included. The open short-wall exit allows cable routing. Check sensor sensing-face requirements, connector space, operating temperature and insulation. Not for safeguarding or safety-rated sensing.')
SOURCE_REFERENCES={p['slug']:[REF,('igus: strain relief installation context','https://www.igus.com/cable-carriers/resources/energy-chains-designing-strainrelief-com')] for p in PARTS}
def generate_meshes():
 out=ROOT/'assets/cad'
 for p in PARTS:
  faces=mesh(p);volume=validate(faces)
  with (out/(p['slug']+'.stl')).open('wb') as f:
   f.write(b'MechIntel original industrial routing; mm; CC0'.ljust(80,b'\0'));f.write(struct.pack('<I',len(faces)))
   for a,b,c in faces:
    u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)]
    n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];norm=math.sqrt(sum(x*x for x in n));n=[x/norm for x in n]
    f.write(struct.pack('<12fH',*(n+list(a)+list(b)+list(c)),0))
  print(p['slug'],len(faces),'facets;',round(volume,1),'mm3; closed connected mesh')
if __name__=='__main__':generate_meshes()
