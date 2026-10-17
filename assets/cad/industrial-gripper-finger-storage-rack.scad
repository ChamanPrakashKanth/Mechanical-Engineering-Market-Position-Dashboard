// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=90;
width=50;
height=25;
floor=4;
pocket_width=26;
pocket_depth=10;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,height]);
}
translate([3,20,floor]) cube([pocket_width,pocket_depth,height]);
translate([32,20,floor]) cube([pocket_width,pocket_depth,height]);
translate([61,20,floor]) cube([pocket_width,pocket_depth,height]);
translate([8,5,-1]) cube([5,8,height+2]);
translate([77,5,-1]) cube([5,8,height+2]);
}
