// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=100; thickness=12; bore=32; bolt_spacing=47; hole=6.5;
$fn=64;
difference(){
 translate([-width/2,-width/2,0]) cube([width,width,thickness]);
 translate([0,0,-1]) cylinder(d=bore,h=thickness+2);
 translate([0,0,thickness-3]) cylinder(d=40,h=4);
 for(x=[-bolt_spacing/2,bolt_spacing/2]) for(y=[-bolt_spacing/2,bolt_spacing/2]) translate([x,y,-1]) cylinder(d=hole,h=thickness+2);
 for(x=[-40,40]) for(y=[-40,40]) translate([x,y,-1]) cylinder(d=8.5,h=thickness+2);
}
