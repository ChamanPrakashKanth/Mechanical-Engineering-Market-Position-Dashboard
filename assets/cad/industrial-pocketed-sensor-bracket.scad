// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=80; depth=50; height=60; wall=8;
$fn=64;
difference(){
 union(){cube([length,depth,wall]);cube([length,wall,height]);}
 translate([length/2,-1,35]) rotate([-90,0,0]) cylinder(d=18,h=wall+2);
 for(x=[20,60]) translate([x,-1,35]) rotate([-90,0,0]) cylinder(d=5.5,h=wall+2);
 translate([20,18,wall-3]) cube([40,20,4]);
 for(x=[12,68]) for(y=[20,40]) translate([x,y,-1]) cylinder(d=6.5,h=wall+2);
}
