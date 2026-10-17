// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=24;
length=70;
body=8;
contact_length=24;
contact_height=12;
slot_width=4.5;
$fn=64;
difference(){union(){
translate([0,0,0]) cube([width,length,body]);
translate([0,length-contact_length,body]) cube([width,contact_length,contact_height]);
}
translate([5,6,-1]) cube([slot_width,20,body+2]);
translate([width-5-slot_width,6,-1]) cube([slot_width,20,body+2]);
translate([7,length-contact_length+6,-1]) cube([10,3,body+contact_height+2]);
translate([7,length-9,-1]) cube([10,3,body+contact_height+2]);
}
