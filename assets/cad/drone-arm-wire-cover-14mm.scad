// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=48;
inner_width=14;
wall=2;
clear_height=6;
roof=2;
slot=3;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([length,inner_width+2*wall,clear_height+roof]);
 }
 translate([-1,wall,-1]) cube([length+2,inner_width,clear_height+1]);
 translate([8,wall+3,clear_height-1]) cube([slot,inner_width-6,roof+2]);
 translate([length-8-slot,wall+3,clear_height-1]) cube([slot,inner_width-6,roof+2]);
}
