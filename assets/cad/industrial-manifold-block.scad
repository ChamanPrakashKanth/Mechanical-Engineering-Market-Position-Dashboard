// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=80; width=50; height=40; passage=8; branch=6; mounting_hole=5.5;
$fn=64;
difference(){
 cube([length,width,height]);
 translate([-1,width/2,height/2]) rotate([0,90,0]) cylinder(d=passage,h=length+2);
 for(x=[20,40,60]) translate([x,width/2,height/2]) cylinder(d=branch,h=height/2+1);
 for(x=[10,length-10]) for(y=[8,width-8]){
  translate([x,y,-1]) cylinder(d=mounting_hole,h=height+2);
  translate([x,y,height-5]) cylinder(d=10,h=6);
 }
}
