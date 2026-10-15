// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=110; depth=55; height=50; wall=8; blade_slot=9; travel=25; clamp_hole=6.5;
$fn=64;
difference(){
 union(){
  cube([width,depth,wall]);
  translate([0,depth-wall,wall]) cube([width,wall,height-wall]);
  for(x=[10,width-18]) translate([x,depth-wall-10,wall]) rotate([0,90,0]) linear_extrude(height=8) polygon([[0,0],[28,0],[0,25]]);
 }
 translate([width/2,depth-wall-10,height/2]) cube([width+2,blade_slot,27],center=true);
 for(x=[20,width-20]) hull(){translate([x,depth/2,-1]) cylinder(d=clamp_hole,h=wall+2);translate([x,depth/2+travel,-1]) cylinder(d=clamp_hole,h=wall+2);}
 for(x=[25,width-25]) translate([x,depth-wall-1,height-10]) rotate([-90,0,0]) cylinder(d=5.5,h=wall+2);
}
