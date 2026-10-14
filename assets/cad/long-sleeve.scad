// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
outer_diameter=20;
inner_diameter=12;
height=50;
difference(){ cylinder(d=outer_diameter,h=height); if(inner_diameter>0) translate([0,0,-1]) cylinder(d=inner_diameter,h=height+2); }
