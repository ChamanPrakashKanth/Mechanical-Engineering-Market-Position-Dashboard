// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
base_length=100; depth=60; base=10; ear=8; height=75; pivot=12; axle=16; arm=10;
$fn=64;
difference(){
 union(){
  cube([base_length,depth,base]);
  for(x=[0,base_length-ear]) translate([x,0,base]) cube([ear,depth,height-base]);
  hull(){translate([ear,depth/2,base+18]) rotate([0,90,0]) cylinder(d=30,h=arm);translate([base_length-ear-arm,depth/2,base+50]) rotate([0,90,0]) cylinder(d=28,h=arm);}
 }
 translate([-1,depth/2,base+18]) rotate([0,90,0]) cylinder(d=pivot,h=base_length+2);
 translate([-1,depth/2,base+50]) rotate([0,90,0]) cylinder(d=axle,h=base_length+2);
 for(x=[15,base_length-15]) for(y=[12,depth-12]) translate([x,y,-1]) cylinder(d=8.5,h=base+2);
 for(x=[ear/2,base_length-ear/2]) for(a=[-24:6:24]) translate([x,depth/2+26*cos(a),base+18+26*sin(a)]) rotate([0,90,0]) cylinder(d=7,h=ear+2);
}
