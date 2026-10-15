// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=60; depth=40; height=55; wall=5; aperture=12.5; slot=5.5; travel=20;
$fn=64;
difference(){
 union(){cube([width,depth,wall]);cube([width,wall,height]);}
 translate([width/2,-1,35]) rotate([-90,0,0]) cylinder(d=aperture,h=wall+2);
 for(x=[12,width-12]) hull(){
 translate([x,12,-1]) cylinder(d=slot,h=wall+2);
 translate([x,12+travel,-1]) cylinder(d=slot,h=wall+2);}
}
