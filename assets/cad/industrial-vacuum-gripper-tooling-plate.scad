// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=120; width=80; thickness=8; passage=20; slot=8.5;
$fn=64;
difference(){
 cube([length,width,thickness]);
 translate([60,40,-1]) cylinder(d=passage,h=thickness+2);
 for(y=[20,60]) for(pair=[[15,40],[80,105]]) hull(){
 translate([pair[0],y,-1]) cylinder(d=slot,h=thickness+2);translate([pair[1],y,-1]) cylinder(d=slot,h=thickness+2);}
 for(x=[45,75]) for(y=[25,55]) translate([x,y,-1]) cylinder(d=5.5,h=thickness+2);
}
