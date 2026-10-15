// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=100; width=30; thickness=4; corner=3; slot=6.5; pitch=30;
$fn=64;
difference(){
 hull(){for(x=[corner,length-corner]) for(y=[corner,width-corner]) translate([x,y,0]) cylinder(r=corner,h=thickness);}
 for(x=[20,50,80]) hull(){translate([x-pitch/2, width/2,-1]) cylinder(d=slot,h=thickness+2);translate([x+pitch/2, width/2,-1]) cylinder(d=slot,h=thickness+2);}
}
