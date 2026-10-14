// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
flange=80; flange_thickness=10; hub=40; hub_length=30; bore=16; bolt_circle=60;
$fn=64;
difference(){
 union(){cylinder(d=flange,h=flange_thickness);translate([0,0,flange_thickness]) cylinder(d=hub,h=hub_length);}
 translate([0,0,-1]) cylinder(d=bore,h=flange_thickness+hub_length+2);
 for(a=[0,90,180,270]) rotate([0,0,a]) translate([bolt_circle/2,0,-1]) cylinder(d=8.5,h=flange_thickness+2);
 translate([0,0,25]) rotate([0,90,0]) cylinder(d=5,h=hub/2+1);
}
