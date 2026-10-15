// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
pad_diameter=60; pad_height=12; stud_diameter=16; stud_length=70; seat_diameter=24; seat_depth=5; washer_diameter=28; locknut_height=8;
$fn=64;
// Geometry layout only: nominal stud is an envelope cylinder, not a modeled thread.
module pad(){difference(){cylinder(d=pad_diameter,h=pad_height);translate([0,0,pad_height-seat_depth]) sphere(d=seat_diameter);}}
module stud(){translate([0,0,pad_height-seat_depth+stud_length/2]) cylinder(d=stud_diameter,h=stud_length,center=true);}
module locknut(){translate([0,0,pad_height-seat_depth+stud_length-18]) difference(){cylinder(d=washer_diameter,h=locknut_height,$fn=6);translate([0,0,-1]) cylinder(d=stud_diameter+1,h=locknut_height+2);}}
pad(); stud(); locknut();
