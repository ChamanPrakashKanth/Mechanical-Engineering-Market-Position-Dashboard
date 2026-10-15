// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=70; depth=50; height=30; wall=5; slot=5.5;
$fn=64;
difference(){
 union(){cube([width,depth,wall]);cube([width,wall,height]);}
 for(x=[15,55]) hull(){translate([x,18,-1]) cylinder(d=slot,h=wall+2);translate([x,40,-1]) cylinder(d=slot,h=wall+2);}
 for(x=[22,48]) hull(){translate([x,-1,15]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);translate([x,-1,23]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);}
}
