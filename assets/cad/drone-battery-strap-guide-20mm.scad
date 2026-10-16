// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=30;
strap_width=20;
wall=2;
gap=2;
roof=3;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([length,strap_width+2*wall,gap+roof]);
 }
 translate([-1,wall,-1]) cube([length+2,strap_width,gap+1]);
}
