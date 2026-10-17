// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=24;
length=24;
thickness=5;
groove_depth=0.6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([width,length,thickness]);
}
translate([7,6,-1]) cube([10,3,thickness+2]);
translate([7,15,-1]) cube([10,3,thickness+2]);
translate([2,3,thickness-groove_depth]) cube([width-4,0.8,groove_depth+1]);
translate([2,11.6,thickness-groove_depth]) cube([width-4,0.8,groove_depth+1]);
translate([2,20,thickness-groove_depth]) cube([width-4,0.8,groove_depth+1]);
}
