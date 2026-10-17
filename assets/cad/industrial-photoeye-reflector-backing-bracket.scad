// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=70;
depth=30;
height=60;
wall=4;
slot_width=6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([width,depth,wall]);
translate([0,0,wall]) cube([width,wall,height-wall]);
}
translate([15,-1,32]) cube([40,wall+2,slot_width]);
translate([12,12,-1]) cube([slot_width,12,wall+2]);
translate([52,12,-1]) cube([slot_width,12,wall+2]);
}
