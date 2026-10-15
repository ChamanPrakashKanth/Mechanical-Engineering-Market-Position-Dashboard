// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
outer_diameter=64; height=24; pocket_diameter=42; pocket_depth=16; center_bore=14; hole_circle=52; hole_diameter=6.5;
$fn=64;
difference(){cylinder(d=outer_diameter,h=height);
 translate([0,0,height-pocket_depth]) cylinder(d=pocket_diameter,h=pocket_depth+1);
 translate([0,0,-1]) cylinder(d=center_bore,h=height+2);
 for(a=[45:90:315]) translate([hole_circle/2*cos(a),hole_circle/2*sin(a),-1]) cylinder(d=hole_diameter,h=height+2);
}
