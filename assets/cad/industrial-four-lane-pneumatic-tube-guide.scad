// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=64;
width=32;
base=3;
rail_height=4;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([13,0,base]) cube([2,width,rail_height]);
translate([21.8,0,base]) cube([2,width,rail_height]);
translate([30.6,0,base]) cube([2,width,rail_height]);
translate([39.4,0,base]) cube([2,width,rail_height]);
translate([48.2,0,base]) cube([2,width,rail_height]);
}
translate([17.15,12,-1]) cube([2.5,8,base+2]);
translate([25.95,12,-1]) cube([2.5,8,base+2]);
translate([34.75,12,-1]) cube([2.5,8,base+2]);
translate([43.55,12,-1]) cube([2.5,8,base+2]);
translate([4,11,-1]) cube([5,10,base+2]);
translate([55,11,-1]) cube([5,10,base+2]);
}
