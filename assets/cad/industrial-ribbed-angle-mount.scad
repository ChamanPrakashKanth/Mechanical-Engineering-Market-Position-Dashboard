// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=90; depth=65; height=75; wall=8; slot=7;
$fn=64;
difference(){
 union(){
 cube([width,depth,wall]);cube([width,wall,height]);
 for(x=[8,width-14]) translate([x,wall,wall]) rotate([90,0,90]) linear_extrude(height=6) polygon([[0,0],[40,0],[0,50]]);
 }
 for(x=[28,62]) hull(){
 translate([x,-1,30]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);
 translate([x,-1,58]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);
 }
 for(x=[28,62]) for(y=[30,50]) translate([x,y,-1]) cylinder(d=8.5,h=wall+2);
}
