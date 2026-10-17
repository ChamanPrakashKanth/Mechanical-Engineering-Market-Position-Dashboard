// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=80;
width=80;
base=4;
fence=4;
height=20;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([0,0,base]) cube([fence,width,height-base]);
translate([0,0,base]) cube([length,fence,height-base]);
}
translate([0,0,base]) cube([fence+4,fence+4,height]);
translate([16,55,-1]) cube([6,14,base+2]);
translate([55,16,-1]) cube([14,6,base+2]);
}
