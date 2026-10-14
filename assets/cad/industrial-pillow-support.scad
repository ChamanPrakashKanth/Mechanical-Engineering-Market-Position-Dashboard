// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=110; depth=55; base=10; height=60; bore=26;
$fn=64;
difference(){
 union(){cube([length,depth,base]);translate([30,0,base]) cube([50,depth,height-base]);}
 translate([length/2,-1,35]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 for(x=[13,97]) for(y=[14,41]) hull(){
  translate([x-3,y,-1]) cylinder(d=8.5,h=base+2);
  translate([x+3,y,-1]) cylinder(d=8.5,h=base+2);
 }
 for(x=[38,72]) translate([x,depth/2,height-10]) cylinder(d=5,h=11);
}
