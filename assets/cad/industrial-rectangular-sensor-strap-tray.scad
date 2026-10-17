// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
inner_x=40;
inner_y=20;
wall=4;
base=3;
rim=7;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([inner_x+2*wall,inner_y+2*wall,base+rim]);
}
translate([wall,wall,base]) cube([inner_x,inner_y,rim+1]);
translate([inner_x+wall-1,9,base+1]) cube([wall+2,10,rim]);
translate([10,7,-1]) cube([3,14,base+2]);
translate([35,7,-1]) cube([3,14,base+2]);
}
