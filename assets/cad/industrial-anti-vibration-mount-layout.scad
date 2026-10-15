// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
base_diameter=70; base_height=8; elastomer_diameter=52; elastomer_height=24; top_plate_diameter=58; top_plate_height=8; passage=12; bolt_circle=52; bolt_hole=8.5;
$fn=64;
// Exploded-free geometry layout; elastomer is represented as a plain cylinder.
module annulus(d,h){difference(){cylinder(d=d,h=h);translate([0,0,-1]) cylinder(d=passage,h=h+2);}}
difference(){union(){cylinder(d=base_diameter,h=base_height);translate([0,0,base_height]) annulus(elastomer_diameter,elastomer_height);translate([0,0,base_height+elastomer_height]) cylinder(d=top_plate_diameter,h=top_plate_height);}translate([0,0,-1]) cylinder(d=passage,h=base_height+elastomer_height+top_plate_height+2);for(a=[45:90:315]) translate([bolt_circle/2*cos(a),bolt_circle/2*sin(a),-1]) cylinder(d=bolt_hole,h=base_height+2);}
