// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=80; depth=30; height=55; passage=12; seat=22; seat_depth=7;
$fn=64;
difference(){
 union(){cube([width,depth,8]);translate([20,0,8]) cube([40,depth,height-8]);}
 translate([40,-1,32]) rotate([-90,0,0]) cylinder(d=passage,h=depth+2);
 translate([40,depth-seat_depth,32]) rotate([-90,0,0]) cylinder(d=seat,h=seat_depth+1);
 for(x=[10,70]) translate([x,15,-1]) cylinder(d=6.5,h=10);
}
