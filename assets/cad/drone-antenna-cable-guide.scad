// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=32;
width=16;
base=2;
rail=2;
height=5;
slot=2.4;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([length,width,base]);
  translate([0,0,base]) cube([length,rail,height]);
  translate([0,7,base]) cube([length,rail,height]);
  translate([0,14,base]) cube([length,rail,height]);
 }
 translate([6,2,-1]) cube([slot,12,base+1]);
 translate([length-6-slot,2,-1]) cube([slot,12,base+1]);
}
