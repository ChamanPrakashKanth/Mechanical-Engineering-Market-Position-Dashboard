// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=80;
width=36;
base=4;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
}
translate([15,11,-1]) cube([3,14,base+2]);
translate([24,11,-1]) cube([3,14,base+2]);
translate([33,11,-1]) cube([3,14,base+2]);
translate([42,11,-1]) cube([3,14,base+2]);
translate([51,11,-1]) cube([3,14,base+2]);
translate([60,11,-1]) cube([3,14,base+2]);
translate([4,12,-1]) cube([5,12,base+2]);
translate([71,12,-1]) cube([5,12,base+2]);
}
