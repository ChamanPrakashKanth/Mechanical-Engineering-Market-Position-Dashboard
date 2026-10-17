// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=70;
width=28;
base=3;
rail_height=5;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([12,0,base]) cube([2,width,rail_height]);
translate([24,0,base]) cube([2,width,rail_height]);
translate([36,0,base]) cube([2,width,rail_height]);
translate([48,0,base]) cube([2,width,rail_height]);
translate([60,0,base]) cube([2,width,rail_height]);
}
translate([17,10,-1]) cube([3,8,base+2]);
translate([29,10,-1]) cube([3,8,base+2]);
translate([41,10,-1]) cube([3,8,base+2]);
translate([53,10,-1]) cube([3,8,base+2]);
translate([3,10,-1]) cube([5,8,base+2]);
translate([62,10,-1]) cube([5,8,base+2]);
}
