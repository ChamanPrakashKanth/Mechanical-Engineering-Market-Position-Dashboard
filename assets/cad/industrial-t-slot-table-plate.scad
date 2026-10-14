// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=120; width=90; thickness=20; neck=8; cavity=16;
$fn=64;
difference(){
 cube([length,width,thickness]);
 for(y=[20,45,70]){
  translate([-1,y-neck/2,12]) cube([length+2,neck,9]);
  translate([-1,y-cavity/2,8]) cube([length+2,cavity,5]);
 }
 for(x=[12,108]) for(y=[7,83]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
}
