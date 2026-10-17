// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=70;
width=35;
base=4;
holder_length=56;
holder_width=8;
holder_height=10;
card_gap=1.6;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([length,width,base]);
translate([(length-holder_length)/2,(width-holder_width)/2,base]) cube([holder_length,holder_width,holder_height]);
}
translate([(length-holder_length)/2+2,(width-card_gap)/2,base+2]) cube([holder_length-4,card_gap,holder_height]);
translate([4,12,-1]) cube([3,10,base+2]);
translate([63,12,-1]) cube([3,10,base+2]);
}
