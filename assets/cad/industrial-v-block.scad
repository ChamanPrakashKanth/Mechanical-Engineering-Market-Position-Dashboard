// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=90; width=60; height=45; groove_depth=20;
$fn=64;
difference(){
 cube([length,width,height]);
 translate([-1,width/2,height-groove_depth]) rotate([90,0,90]) linear_extrude(height=length+2)
 polygon([[0,0],[groove_depth+2,groove_depth+2],[-groove_depth-2,groove_depth+2]]);
 for(x=[12,length-12]) for(y=[8,width-8]) translate([x,y,-1]) cylinder(d=6.5,h=height+2);
}
