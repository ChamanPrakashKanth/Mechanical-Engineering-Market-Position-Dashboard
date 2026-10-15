"""Original industrial-style CAD studies, exported with installed OpenSCAD."""
from pathlib import Path
import subprocess

PARTS = [
 dict(slug='industrial-gusset-bracket',title='Gusseted mounting bracket',dims='100 × 70 × 80 mm · 8 mm walls · Ø8.5 mounting holes',
 params='width=100; depth=70; height=80; wall=8; hole=8.5; gusset=6;',
 code='''difference(){
 union(){
  cube([width,depth,wall]);
  cube([width,wall,height]);
  for(x=[12,width-12-gusset]) translate([x,wall,wall])
   rotate([90,0,90]) linear_extrude(height=gusset)
    polygon([[0,0],[depth-wall-12,0],[0,height-wall-12]]);
 }
 for(x=[25,width-25]) for(y=[30,depth-15]) translate([x,y,-1]) cylinder(d=hole,h=wall+2);
 for(x=[25,width-25]) for(z=[30,height-15]) translate([x,-1,z]) rotate([-90,0,0]) cylinder(d=hole,h=wall+2);
}''',
 notes='Two triangular ribs connect the upright to the base. Four clearance holes are on each mounting face. Base-hole centers: X 25/75, Y 30/55 mm. Upright-hole centers: X 25/75, Z 30/65 mm. Confirm fastener clearance and bending loads; no bend radius or weld specification is included.'),
 dict(slug='industrial-bearing-housing',title='One-piece bearing housing blank',dims='100 × 50 × 68 mm · Ø32 axial bore · four Ø9 base holes',
 params='length=100; depth=50; base=10; center_height=38; outer_diameter=60; bore=32; mounting_hole=9;',
 code='''difference(){
 union(){
  cube([length,depth,base]);
  translate([length/2,0,center_height]) rotate([-90,0,0]) cylinder(d=outer_diameter,h=depth);
  translate([length/2-24,0,base]) cube([48,depth,center_height-base]);
 }
 translate([length/2,-1,center_height]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 for(x=[12,length-12]) for(y=[12,depth-12]){
  translate([x,y,-1]) cylinder(d=mounting_hole,h=base+2);
  translate([x,y,base-4]) cylinder(d=15,h=5);
 }
}''',
 notes='Horizontal through bore is centered at X 50, Z 38 mm. Mounting-hole centers are X 12/88, Y 12/38 mm, with Ø15 × 4 mm counterbores from the base top. No bearing shoulders, seals, retention, fit class, or lubrication features are specified; Ø32 is a nominal geometry study dimension.'),
 dict(slug='industrial-slotted-coupling',title='Slotted shaft coupling study',dims='Ø36 × 45 mm · Ø12 through bore · two relief slots',
 params='outer_diameter=36; length=45; bore=12; slot_width=1.5; slot_depth=19; radial_hole=4.2;',
 code='''difference(){
 cylinder(d=outer_diameter,h=length);
 translate([0,0,-1]) cylinder(d=bore,h=length+2);
 translate([-outer_diameter/2-1,-slot_width/2,-1]) cube([outer_diameter+2,slot_width,slot_depth+1]);
 translate([-slot_width/2,-outer_diameter/2-1,length-slot_depth]) cube([slot_width,outer_diameter+2,slot_depth+1]);
 for(z=[8,length-8]) translate([0,0,z]) rotate([0,90,0]) cylinder(d=radial_hole,h=outer_diameter/2+1);
}''',
 notes='Opposed axial relief slots are rotated 90 degrees relative to each other and leave a 7 mm central web. Two radial pilot passages open from the bore to the exterior. These holes are not threaded. This is not a torque-rated flexible coupling: stiffness, fatigue, balance, retention, and shaft-fit behavior are unvalidated.'),
 dict(slug='industrial-manifold-block',title='Cross-drilled manifold block study',dims='80 × 50 × 40 mm · Ø8 longitudinal passage · three Ø6 branches',
 params='length=80; width=50; height=40; passage=8; branch=6; mounting_hole=5.5;',
 code='''difference(){
 cube([length,width,height]);
 translate([-1,width/2,height/2]) rotate([0,90,0]) cylinder(d=passage,h=length+2);
 for(x=[20,40,60]) translate([x,width/2,height/2]) cylinder(d=branch,h=height/2+1);
 for(x=[10,length-10]) for(y=[8,width-8]){
  translate([x,y,-1]) cylinder(d=mounting_hole,h=height+2);
  translate([x,y,height-5]) cylinder(d=10,h=6);
 }
}''',
 notes='Main passage is on Y 25, Z 20 mm and is open at both X end faces. Three top branches at X 20/40/60, Y 25 intersect it. Four Ø5.5 through mounting holes are at X 10/70, Y 8/42, with Ø10 × 5 mm counterbores. Ports have no threads, plugs, seals, or pressure rating. Do not use as a pressure-containing design without engineering review.'),
 dict(slug='industrial-motor-mount-plate',title='Motor mounting plate study',dims='100 × 100 × 12 mm · Ø32 center bore · four Ø6.5 mount holes',
 params='width=100; thickness=12; bore=32; bolt_spacing=47; hole=6.5;',
 code='''difference(){
 translate([-width/2,-width/2,0]) cube([width,width,thickness]);
 translate([0,0,-1]) cylinder(d=bore,h=thickness+2);
 translate([0,0,thickness-3]) cylinder(d=40,h=4);
 for(x=[-bolt_spacing/2,bolt_spacing/2]) for(y=[-bolt_spacing/2,bolt_spacing/2]) translate([x,y,-1]) cylinder(d=hole,h=thickness+2);
 for(x=[-40,40]) for(y=[-40,40]) translate([x,y,-1]) cylinder(d=8.5,h=thickness+2);
}''',
 notes='Centered XY plate with a Ø32 through aperture and Ø40 × 3 mm top recess. Four Ø6.5 holes use a 47 mm square pattern; four Ø8.5 frame holes use an 80 mm square pattern. This is a custom layout, not a certified NEMA or vendor motor interface. Confirm the actual motor drawing and shaft clearance.'),
 dict(slug='industrial-shaft-clamp-block',title='Slotted shaft clamp block study',dims='60 × 40 × 45 mm · Ø20 shaft bore · 1.5 mm relief slit',
 params='length=60; depth=40; height=45; bore=20; slit=1.5;',
 code='''difference(){
 cube([length,depth,height]);
 translate([length/2,-1,24]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 translate([length/2-slit/2,-1,24]) cube([slit,depth+2,height-24+1]);
 translate([-1,depth/2,40]) rotate([0,90,0]) cylinder(d=5.5,h=length+2);
 translate([-1,depth/2,40]) rotate([0,90,0]) cylinder(d=9,h=7);
 for(x=[10,length-10]) for(y=[8,depth-8]) translate([x,y,-1]) cylinder(d=6.5,h=height+2);
}''',
 notes='Horizontal shaft bore runs along Y, centered at X 30, Z 24. The relief slit connects the bore to the top face. An unthreaded Ø5.5 cross passage at Y 20, Z 40 has a Ø9 counterbore from the X-min face. Four mounting holes are at X 10/50, Y 8/32. Clamp force, fastener access, fit and fatigue are unvalidated.'),
 dict(slug='industrial-adjustment-plate',title='Slotted adjustment plate',dims='120 × 70 × 10 mm · two 9 mm slots · 50 mm slot travel',
 params='length=120; width=70; thickness=10; slot_width=9; travel=50;',
 code='''difference(){
 cube([length,width,thickness]);
 for(y=[20,50]) hull(){
  translate([35,y,-1]) cylinder(d=slot_width,h=thickness+2);
  translate([35+travel,y,-1]) cylinder(d=slot_width,h=thickness+2);
 }
 for(x=[12,length-12]) for(y=[10,width-10]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
 translate([length/2,width/2,-1]) cylinder(d=12,h=thickness+2);
}''',
 notes='Slot end centers are X 35/85 at Y 20 and 50 mm. Each slot is 59 mm overall by 9 mm wide, with 50 mm center travel. Four Ø6.5 mounting holes are at X 12/108, Y 10/60; a Ø12 center aperture is at X 60, Y 35. Account for washer overlap, edge distances and friction before using as a loaded adjustment joint.'),
 dict(slug='industrial-clevis-bracket',title='Clevis mounting bracket study',dims='80 × 60 × 65 mm · 32 mm fork gap · Ø12 cross pin holes',
 params='length=80; depth=60; height=65; base=10; ear=10; gap=32; pin=12;',
 code='''difference(){
 union(){
  cube([length,depth,base]);
  for(x=[(length-gap)/2-ear,(length+gap)/2]) translate([x,8,base]) cube([ear,depth-16,height-base]);
 }
 translate([-1,depth/2,45]) rotate([0,90,0]) cylinder(d=pin,h=length+2);
 for(x=[10,length-10]) for(y=[12,depth-12]) translate([x,y,-1]) cylinder(d=8.5,h=base+2);
}''',
 notes='Ear inner faces are X 24 and 56 mm, giving a 32 mm fork gap. Ears are 10 mm thick. Coaxial Ø12 pin holes are centered on Y 30, Z 45. Base mounting holes are at X 10/70, Y 12/48. Pin retention, bearing stress, ear bending, tolerances and fatigue require separate design work.'),
 dict(slug='industrial-v-block',title='V-block fixture study',dims='90 × 60 × 45 mm · 90° V groove · four Ø6.5 holes',
 params='length=90; width=60; height=45; groove_depth=20;',
 code='''difference(){
 cube([length,width,height]);
 translate([-1,width/2,height-groove_depth]) rotate([90,0,90]) linear_extrude(height=length+2)
 polygon([[0,0],[groove_depth+2,groove_depth+2],[-groove_depth-2,groove_depth+2]]);
 for(x=[12,length-12]) for(y=[8,width-8]) translate([x,y,-1]) cylinder(d=6.5,h=height+2);
}''',
 notes='V groove runs along X with its apex at Y 30, Z 25 mm; its included angle is 90°. Four vertical Ø6.5 through holes are at X 12/78, Y 8/52. No clamp strap, hardened surfaces, alignment tolerances or holding-force rating is supplied.'),
 dict(slug='industrial-four-bolt-flange',title='Four-bolt pipe flange study',dims='Ø100 × 12 mm plate · Ø32 bore · Ø56 × 18 mm hub',
 params='diameter=100; thickness=12; hub=56; hub_height=18; bore=32; bolt_circle=76;',
 code='''difference(){
 union(){cylinder(d=diameter,h=thickness);translate([0,0,thickness]) cylinder(d=hub,h=hub_height);}
 translate([0,0,-1]) cylinder(d=bore,h=thickness+hub_height+2);
 for(a=[0,90,180,270]) rotate([0,0,a]) translate([bolt_circle/2,0,-1]) cylinder(d=11,h=thickness+2);
}''',
 notes='Four Ø11 through holes are equally spaced on a Ø76 bolt circle. Nominal bore is Ø32 and total height is 30 mm. This custom geometry is not an ASME, EN or pressure-class flange. Gasket seating, bolt preload, material and pressure suitability are unspecified.'),
 dict(slug='industrial-pocketed-fixture-plate',title='Pocketed fixture plate',dims='120 × 90 × 16 mm · 70 × 40 × 6 mm pocket · six Ø6.5 holes',
 params='length=120; width=90; thickness=16; pocket_length=70; pocket_width=40; pocket_depth=6;',
 code='''difference(){
 cube([length,width,thickness]);
 translate([(length-pocket_length)/2,(width-pocket_width)/2,thickness-pocket_depth]) cube([pocket_length,pocket_width,pocket_depth+1]);
 for(x=[15,60,105]) for(y=[12,78]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
 for(x=[35,85]) translate([x,width/2,-1]) cylinder(d=5,h=thickness+2);
}''',
 notes='Centered rectangular pocket has sharp internal corners in the model: actual milling requires corner radii or relief. Six Ø6.5 through holes are at X 15/60/105, Y 12/78. Two Ø5 locating-hole blanks are at X 35/85, Y 45. No dowel-fit tolerances or clamping scheme is established.'),
 dict(slug='industrial-ribbed-angle-mount',title='Ribbed angle mount with slots',dims='90 × 65 × 75 mm · 8 mm walls · two upright slots',
 params='width=90; depth=65; height=75; wall=8; slot=7;',
 code='''difference(){
 union(){
 cube([width,depth,wall]);cube([width,wall,height]);
 for(x=[8,width-14]) translate([x,wall,wall]) rotate([90,0,90]) linear_extrude(height=6) polygon([[0,0],[40,0],[0,50]]);
 }
 for(x=[28,62]) hull(){
 translate([x,-1,30]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);
 translate([x,-1,58]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);
 }
 for(x=[28,62]) for(y=[30,50]) translate([x,y,-1]) cylinder(d=8.5,h=wall+2);
}''',
 notes='Two upright slots are 7 mm wide, with endpoint centers at Z 30/58 and X 28/62, giving 28 mm center travel. Four base Ø8.5 holes are at X 28/62, Y 30/50. Side ribs are 6 mm thick. Load capacity, weld details and manufacturing radii are not specified.'),
 dict(slug='industrial-t-slot-table-plate',title='T-slot table plate study',dims='120 × 90 × 20 mm · three longitudinal T-slots',
 params='length=120; width=90; thickness=20; neck=8; cavity=16;',
 code='''difference(){
 cube([length,width,thickness]);
 for(y=[20,45,70]){
  translate([-1,y-neck/2,12]) cube([length+2,neck,9]);
  translate([-1,y-cavity/2,8]) cube([length+2,cavity,5]);
 }
 for(x=[12,108]) for(y=[7,83]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
}''',
 notes='Three slots run along X at Y 20/45/70 mm. Each has an 8 mm neck from Z 12 to the top and a 16 mm cavity spanning Z 8–13, leaving an 8 mm floor. Four Ø6.5 mounting holes are at X 12/108, Y 7/83. This is a custom T-section, not a standardized T-nut interface; cutter access, radii, tolerances and clamping loads need review.'),
 dict(slug='industrial-pillow-support',title='Pillow support with bolt pattern',dims='110 × 55 × 60 mm · Ø26 shaft passage · four base slots',
 params='length=110; depth=55; base=10; height=60; bore=26;',
 code='''difference(){
 union(){cube([length,depth,base]);translate([30,0,base]) cube([50,depth,height-base]);}
 translate([length/2,-1,35]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 for(x=[13,97]) for(y=[14,41]) hull(){
  translate([x-3,y,-1]) cylinder(d=8.5,h=base+2);
  translate([x+3,y,-1]) cylinder(d=8.5,h=base+2);
 }
 for(x=[38,72]) translate([x,depth/2,height-10]) cylinder(d=5,h=11);
}''',
 notes='Bore axis runs along Y at X 55, Z 35 mm. Four base slots have 6 mm endpoint-center travel, 8.5 mm width and centers X 13/97, Y 14/41. Two Ø5 blind pilot holes are 10 mm deep from the top at X 38/72, Y 27.5. No bearing retention, threads, lubrication or fit specification is included.'),
 dict(slug='industrial-shaft-flange-coupler',title='Shaft flange coupler blank',dims='Ø80 flange × 10 mm · Ø40 hub × 30 mm · Ø16 bore',
 params='flange=80; flange_thickness=10; hub=40; hub_length=30; bore=16; bolt_circle=60;',
 code='''difference(){
 union(){cylinder(d=flange,h=flange_thickness);translate([0,0,flange_thickness]) cylinder(d=hub,h=hub_length);}
 translate([0,0,-1]) cylinder(d=bore,h=flange_thickness+hub_length+2);
 for(a=[0,90,180,270]) rotate([0,0,a]) translate([bolt_circle/2,0,-1]) cylinder(d=8.5,h=flange_thickness+2);
 translate([0,0,25]) rotate([0,90,0]) cylinder(d=5,h=hub/2+1);
}''',
 notes='Four Ø8.5 flange holes lie on a Ø60 bolt circle. Total height is 40 mm. A Ø5 radial pilot hole opens to the Ø16 bore at Z 25 mm. No keyway, thread, shaft fit, balance specification or torque capacity is established. Do not interpret the plain bore and pilot hole as a verified shaft-retention system.'),
 dict(slug='industrial-pocketed-sensor-bracket',title='Pocketed sensor mounting bracket',dims='80 × 50 × 60 mm · 8 mm walls · Ø18 upright aperture',
 params='length=80; depth=50; height=60; wall=8;',
 code='''difference(){
 union(){cube([length,depth,wall]);cube([length,wall,height]);}
 translate([length/2,-1,35]) rotate([-90,0,0]) cylinder(d=18,h=wall+2);
 for(x=[20,60]) translate([x,-1,35]) rotate([-90,0,0]) cylinder(d=5.5,h=wall+2);
 translate([20,18,wall-3]) cube([40,20,4]);
 for(x=[12,68]) for(y=[20,40]) translate([x,y,-1]) cylinder(d=6.5,h=wall+2);
}''',
 notes='The upright Ø18 aperture is centered at X 40, Z 35; adjacent Ø5.5 holes are at X 20/60, Z 35. A 40 × 20 × 3 mm top pocket occupies X 20–60, Y 18–38. Base mounting holes are X 12/68, Y 20/40. This is a custom geometry study, not a specified sensor interface; pocket corners and manufacturing radii are idealized.'),
 dict(published='2026-10-15',slug='industrial-adjustable-m12-sensor-bracket',title='Adjustable M12 sensor bracket study',dims='60 × 40 × 55 mm · Ø12.5 aperture · 20 mm base slot travel',
 params='width=60; depth=40; height=55; wall=5; aperture=12.5; slot=5.5; travel=20;',
 code='''difference(){
 union(){cube([width,depth,wall]);cube([width,wall,height]);}
 translate([width/2,-1,35]) rotate([-90,0,0]) cylinder(d=aperture,h=wall+2);
 for(x=[12,width-12]) hull(){
 translate([x,12,-1]) cylinder(d=slot,h=wall+2);
 translate([x,12+travel,-1]) cylinder(d=slot,h=wall+2);}
}''',
 notes='Original angle bracket for studying a nominal 12 mm cylindrical sensor envelope. The upright aperture is Ø12.5 at X30/Z35; it is smooth, not threaded. Two base slots lie at X12/48 with endpoint centers Y12/32 and width5.5, allowing 20 mm center travel. Confirm sensor body, locknut envelope, cable exit, material and mounting clearance against your selected sensor; no manufacturer compatibility is claimed.'),
 dict(published='2026-10-15',slug='industrial-drag-chain-slotted-mount',title='Cable drag chain slotted mounting bracket',dims='70 × 50 × 30 mm · 5 mm walls · base and upright slots',
 params='width=70; depth=50; height=30; wall=5; slot=5.5;',
 code='''difference(){
 union(){cube([width,depth,wall]);cube([width,wall,height]);}
 for(x=[15,55]) hull(){translate([x,18,-1]) cylinder(d=slot,h=wall+2);translate([x,40,-1]) cylinder(d=slot,h=wall+2);}
 for(x=[22,48]) hull(){translate([x,-1,15]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);translate([x,-1,23]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);}
}''',
 notes='Generic cable-carrier end mounting study with two base slots at X15/55, Y18–40 (22 mm endpoint travel) and two upright slots at X22/48, Z15–23 (8 mm travel). All slots are 5.5 mm wide. Attach a separately selected chain end fitting; this model has no chain pivot pins or proprietary snap interface. Check bend radius, moving-axis collisions, fasteners and strain relief. Square internal corners are idealized.'),
 dict(published='2026-10-15',slug='industrial-vacuum-gripper-tooling-plate',title='Vacuum gripper adjustable tooling plate',dims='120 × 80 × 8 mm · Ø20 central passage · four radial slots',
 params='length=120; width=80; thickness=8; passage=20; slot=8.5;',
 code='''difference(){
 cube([length,width,thickness]);
 translate([60,40,-1]) cylinder(d=passage,h=thickness+2);
 for(y=[20,60]) for(pair=[[15,40],[80,105]]) hull(){
 translate([pair[0],y,-1]) cylinder(d=slot,h=thickness+2);translate([pair[1],y,-1]) cylinder(d=slot,h=thickness+2);}
 for(x=[45,75]) for(y=[25,55]) translate([x,y,-1]) cylinder(d=5.5,h=thickness+2);
}''',
 notes='Mechanical tooling plate only: no internal pneumatic passages, sealing surfaces or suction cups. Four horizontal slots have endpoint pairs X15–40 and X80–105 at Y20/60, width8.5 and 25 mm endpoint travel. Four Ø5.5 holes are on a 30 × 30 mm square at X45/75/Y25/55. Central Ø20 opening is a clearance passage. Confirm cup stems, hose routing, payload, robot flange interface and fasteners separately; no vacuum or lifting rating.'),
 dict(published='2026-10-15',slug='industrial-floating-bearing-support-block',title='Floating bearing support block study',dims='80 × 30 × 55 mm · Ø22 seat × 7 mm depth · Ø12 passage',
 params='width=80; depth=30; height=55; passage=12; seat=22; seat_depth=7;',
 code='''difference(){
 union(){cube([width,depth,8]);translate([20,0,8]) cube([40,depth,height-8]);}
 translate([40,-1,32]) rotate([-90,0,0]) cylinder(d=passage,h=depth+2);
 translate([40,depth-seat_depth,32]) rotate([-90,0,0]) cylinder(d=seat,h=seat_depth+1);
 for(x=[10,70]) translate([x,15,-1]) cylinder(d=6.5,h=10);
}''',
 notes='Concept housing with Y-axis passage centered X40/Z32. The smooth Ø22 recess opens from Y30 and extends 7 mm to a shoulder at Y23; the Ø12 passage continues through the block. Base holes Ø6.5 are at X10/70/Y15. Nominal seat dimensions are editable geometry, not a specified bearing fit. Axial sliding clearance, bearing selection, retention, shaft alignment and thermal expansion must be engineered before use; no completed floating-bearing assembly is supplied.'),
]

if __name__ == '__main__':
 root=Path(__file__).absolute().parent
 out=root/'assets'/'cad'
 for part in PARTS:
  source=out/(part['slug']+'.scad')
  source.write_text('// Original MechIntel educational geometry. CC0-1.0. Units: mm.\n$fn=64;\n'+part['params']+'\n'+part['code']+'\n',encoding='utf-8')
  subprocess.run(['C:/Program Files/OpenSCAD/openscad.com','--export-format','binstl','-o',str(out/(part['slug']+'.stl')),str(source)],check=True)
