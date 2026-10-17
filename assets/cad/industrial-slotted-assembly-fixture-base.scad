// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=100;
width=70;
base=6;
fence=4;
height=20;
slot_width=6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([0,0,base]) cube([fence,width,height-base]);
}
translate([12,15,-1]) cube([76,slot_width,base+2]);
translate([12,45,-1]) cube([76,slot_width,base+2]);
}
