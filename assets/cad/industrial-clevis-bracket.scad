// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=80; depth=60; height=65; base=10; ear=10; gap=32; pin=12;
$fn=64;
difference(){
 union(){
  cube([length,depth,base]);
  for(x=[(length-gap)/2-ear,(length+gap)/2]) translate([x,8,base]) cube([ear,depth-16,height-base]);
 }
 translate([-1,depth/2,45]) rotate([0,90,0]) cylinder(d=pin,h=length+2);
 for(x=[10,length-10]) for(y=[12,depth-12]) translate([x,y,-1]) cylinder(d=8.5,h=base+2);
}
