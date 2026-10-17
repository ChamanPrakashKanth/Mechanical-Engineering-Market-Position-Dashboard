// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=100;
depth=16;
height=28;
wall=4;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,wall,height]);
translate([0,0,height-wall]) cube([length,depth,wall]);
}

}
