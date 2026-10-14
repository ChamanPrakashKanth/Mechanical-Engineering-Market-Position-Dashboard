// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
diameter=100; thickness=12; hub=56; hub_height=18; bore=32; bolt_circle=76;
$fn=64;
difference(){
 union(){cylinder(d=diameter,h=thickness);translate([0,0,thickness]) cylinder(d=hub,h=hub_height);}
 translate([0,0,-1]) cylinder(d=bore,h=thickness+hub_height+2);
 for(a=[0,90,180,270]) rotate([0,0,a]) translate([bolt_circle/2,0,-1]) cylinder(d=11,h=thickness+2);
}
