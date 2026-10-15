// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=100; depth=60; height=70; base=10; body_width=50; bore=28; recess=40; recess_depth=5;
$fn=64;
difference(){
 union(){cube([width,depth,base]);translate([(width-body_width)/2,0,base]) cube([body_width,depth,height-base]);}
 translate([width/2,-1,40]) rotate([-90,0,0]) cylinder(d=bore,h=depth+2);
 translate([width/2,-1,40]) rotate([-90,0,0]) cylinder(d=recess,h=recess_depth+1);
 for(x=[33,67]) for(z=[23,57]) translate([x,-1,z]) rotate([-90,0,0]) cylinder(d=5.5,h=9);
 for(x=[10,90]) for(y=[15,45]) translate([x,y,-1]) cylinder(d=8.5,h=base+2);
}
