// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=110; width=90; thickness=8; slot_width=11; slot_length=24; pad_seat=34; seat_depth=2;
$fn=64;
difference(){cube([length,width,thickness]);
 for(x=[20,length-20]) for(y=[20,width-20]) hull(){translate([x-slot_length/2+slot_width/2,y,-1]) cylinder(d=slot_width,h=thickness+2);translate([x+slot_length/2-slot_width/2,y,-1]) cylinder(d=slot_width,h=thickness+2);}
 translate([length/2,width/2,thickness-seat_depth]) cylinder(d=pad_seat,h=seat_depth+1);
}
