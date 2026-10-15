// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=60; width=35; thickness=10; belt_width=15; pitch=5; groove_width=2.5; groove_depth=1.5;
$fn=64;
difference(){
 cube([length,width,thickness]);
 for(x=[10:pitch:length-10]) translate([x-groove_width/2,(width-belt_width)/2,thickness-groove_depth]) cube([groove_width,belt_width,groove_depth+1]);
 for(x=[10,length-10]) for(y=[5,width-5]) translate([x,y,-1]) cylinder(d=5.5,h=thickness+2);
}
