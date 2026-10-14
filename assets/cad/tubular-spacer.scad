// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
outer_diameter=16;
inner_diameter=8;
height=20;
difference(){ cylinder(d=outer_diameter,h=height); translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }
