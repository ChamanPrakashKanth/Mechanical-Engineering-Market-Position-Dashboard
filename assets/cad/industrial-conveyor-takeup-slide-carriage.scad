// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=90; depth=70; height=55; seat=30; seat_depth=12; passage=16; rail_width=12; rail_depth=8;
$fn=64;
difference(){
 union(){
  cube([width,depth,height]);
  translate([width/2,depth/2,height]) cylinder(d=56,h=8);
 }
 translate([width/2,depth/2,-1]) cylinder(d=passage,h=height+10);
 translate([width/2,depth/2,height-seat_depth]) cylinder(d=seat,h=seat_depth+9);
 for(x=[0,width-rail_width]) translate([x,-1,8]) cube([rail_width,depth+2,rail_depth]);
 translate([-1,depth/2,20]) rotate([0,90,0]) cylinder(d=10,h=width+2);
 translate([-1,depth/2,20]) rotate([0,90,0]) cylinder(d=16,h=12);
 translate([width-11,depth/2,20]) rotate([0,90,0]) cylinder(d=16,h=12);
 for(x=[15,width-15]) for(y=[12,depth-12]) translate([x,y,-1]) cylinder(d=7,h=height+2);
}
