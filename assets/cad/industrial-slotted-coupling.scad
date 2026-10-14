// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
outer_diameter=36; length=45; bore=12; slot_width=1.5; slot_depth=19; radial_hole=4.2;
$fn=64;
difference(){
 cylinder(d=outer_diameter,h=length);
 translate([0,0,-1]) cylinder(d=bore,h=length+2);
 translate([-outer_diameter/2-1,-slot_width/2,-1]) cube([outer_diameter+2,slot_width,slot_depth+1]);
 translate([-slot_width/2,-outer_diameter/2-1,length-slot_depth]) cube([slot_width,outer_diameter+2,slot_depth+1]);
 for(z=[8,length-8]) translate([0,0,z]) rotate([0,90,0]) cylinder(d=radial_hole,h=outer_diameter/2+1);
}
