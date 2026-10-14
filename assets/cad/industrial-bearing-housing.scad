// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=100; depth=50; base=10; center_height=38; outer_diameter=60; bore=32; mounting_hole=9;
$fn=64;
difference(){
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
}
