// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=120; width=90; thickness=16; pocket_length=70; pocket_width=40; pocket_depth=6;
$fn=64;
difference(){
 cube([length,width,thickness]);
 translate([(length-pocket_length)/2,(width-pocket_width)/2,thickness-pocket_depth]) cube([pocket_length,pocket_width,pocket_depth+1]);
 for(x=[15,60,105]) for(y=[12,78]) translate([x,y,-1]) cylinder(d=6.5,h=thickness+2);
 for(x=[35,85]) translate([x,width/2,-1]) cylinder(d=5,h=thickness+2);
}
