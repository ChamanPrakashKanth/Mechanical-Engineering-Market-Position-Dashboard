// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=24;
width=30;
base=6;
fence=4;
height=20;
slot_width=6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([0,0,base]) cube([fence,width,height-base]);
}
translate([10,4,-1]) cube([slot_width,22,base+2]);
}
