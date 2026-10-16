// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
inner_x=20.4;
inner_y=12.4;
wall=2;
floor=2;
rim=4;
slot=2.4;
$fn=64;
difference(){
 union(){
  translate([0,0,0]) cube([inner_x+2*wall,inner_y+2*wall,floor+rim]);
 }
 translate([wall,wall,floor]) cube([inner_x,inner_y,rim+1]);
 translate([wall+inner_x/2-4,-1,floor+1]) cube([8,wall+2,rim]);
 translate([wall+inner_x/2-4,inner_y+wall-1,floor+1]) cube([8,wall+2,rim]);
 translate([4,4,-1]) cube([slot,inner_y-4,floor+1]);
 translate([inner_x+2*wall-4-slot,4,-1]) cube([slot,inner_y-4,floor+1]);
}
