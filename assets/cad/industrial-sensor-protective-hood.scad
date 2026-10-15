// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=70; depth=60; height=55; base=5; wall=4; clearance=24; hood_depth=45;
$fn=64;
difference(){
 union(){
 cube([width,depth,base]);
 translate([(width-clearance)/2-wall,0,base]) cube([wall,hood_depth,height-base]);
 translate([(width+clearance)/2,0,base]) cube([wall,hood_depth,height-base]);
 translate([(width-clearance)/2-wall,0,height-wall]) cube([clearance+2*wall,hood_depth,wall]);
 }
 for(x=[10,width-10]) hull(){translate([x,15,-1]) cylinder(d=5.5,h=base+2);translate([x,45,-1]) cylinder(d=5.5,h=base+2);}
 translate([width/2,53,-1]) cylinder(d=5.5,h=base+2);
}
