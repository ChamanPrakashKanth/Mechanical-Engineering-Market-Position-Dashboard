// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
outer_diameter=24;
inner_diameter=10;
height=2;
difference(){ cylinder(d=outer_diameter,h=height); translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }
