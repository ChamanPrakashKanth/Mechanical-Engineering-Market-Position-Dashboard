// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=34;
width=18;
base=2;
rail=2;
rail_height=3;
slot=2.5;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([length,width,base]);
  translate([0,0,base]) cube([length,rail,rail_height]);
  translate([0,width-rail,base]) cube([length,rail,rail_height]);
 }
 translate([6,4,-1]) cube([slot,width-8,base+1]);
 translate([length-6-slot,4,-1]) cube([slot,width-8,base+1]);
}
