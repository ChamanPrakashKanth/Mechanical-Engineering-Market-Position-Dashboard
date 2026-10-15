// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=90; depth=55; height=60; wall=8; slot=10; axle_height=35;
$fn=64;
difference(){
 union(){cube([width,depth,wall]);cube([wall,depth,height]);translate([width-wall,0,0]) cube([wall,depth,height]);}
 for(x=[-1,width-wall-1]){
 translate([x,depth/2,axle_height]) rotate([0,90,0]) cylinder(d=slot,h=wall+2);
 translate([x,depth/2-slot/2,axle_height]) cube([wall+2,slot,height-axle_height+1]);
 }
 for(x=[25,65]) for(y=[12,43]) translate([x,y,-1]) cylinder(d=6.5,h=wall+2);
}
