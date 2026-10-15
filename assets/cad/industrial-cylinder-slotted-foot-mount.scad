// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=90; depth=65; height=65; wall=8; opening=30; hole_pitch=48; slot=8.5; travel=20;
$fn=64;
difference(){
 union(){cube([width,depth,wall]);cube([width,wall,height]);}
 translate([width/2,-1,38]) rotate([-90,0,0]) cylinder(d=opening,h=wall+2);
 for(x=[width/2-hole_pitch/2,width/2+hole_pitch/2]) for(z=[20,56]) translate([x,-1,z]) rotate([-90,0,0]) cylinder(d=5.5,h=wall+2);
 for(x=[16,width-16]) hull(){translate([x,30,-1]) cylinder(d=slot,h=wall+2);translate([x,30+travel,-1]) cylinder(d=slot,h=wall+2);}
}
