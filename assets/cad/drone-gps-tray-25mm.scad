// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
inner=25.4;
wall=2;
floor=2;
rim=7;
slot=2.4;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([inner+2*wall,inner+2*wall,floor+rim]);
 }
 translate([wall,wall,floor]) cube([inner,inner,rim+1]);
 translate([inner/2+wall-4,-1,floor+2]) cube([8,wall+2,rim]);
 translate([wall+2,(inner+2*wall-18)/2,-1]) cube([slot,18,floor+1]);
 translate([inner+wall-2-slot,(inner+2*wall-18)/2,-1]) cube([slot,18,floor+1]);
}
