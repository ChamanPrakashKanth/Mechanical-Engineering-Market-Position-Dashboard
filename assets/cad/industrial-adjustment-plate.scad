// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=120; width=70; thickness=10; slot_width=9; travel=50;
$fn=64;
difference(){
 cube([length,width,thickness]);
 for(y=[20,50]) hull(){
  translate([35,y,-1]) cylinder(d=slot_width,h=thickness+2);
  translate([35+travel,y,-1]) cylinder(d=slot_width,h=thickness+2);
 }
 for(x=[12,length-12]) for(y=[10,width-10]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
 translate([length/2,width/2,-1]) cylinder(d=12,h=thickness+2);
}
