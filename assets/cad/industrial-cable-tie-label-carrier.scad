// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=56;
width=20;
thickness=3;
label_length=36;
label_width=14;
recess=0.6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,thickness]);
}
translate([(length-label_length)/2,(width-label_width)/2,thickness-recess]) cube([label_length,label_width,recess+1]);
translate([3,5,-1]) cube([3,10,thickness+2]);
translate([length-6,5,-1]) cube([3,10,thickness+2]);
}
