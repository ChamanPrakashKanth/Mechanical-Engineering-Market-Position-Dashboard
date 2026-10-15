// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=60; depth=36; height=35; bore=12; slit=2;
$fn=64;
difference(){
 cube([length,depth,height]);
 translate([length/2,-1,20]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 translate([length/2-slit/2,-1,20]) cube([slit,depth+2,height-19]);
 translate([-1,depth/2,30]) rotate([0,90,0]) cylinder(d=5.5,h=length+2);
 for(x=[10,length-10]) for(y=[8,depth-8]) translate([x,y,-1]) cylinder(d=5.5,h=height+2);
}
