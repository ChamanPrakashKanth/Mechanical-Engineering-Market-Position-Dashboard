// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
width=100; depth=70; height=30; wall=6; slot=4.5;
$fn=64;
difference(){
 union(){
 cube([26,depth,wall]);translate([74,0,0]) cube([26,depth,wall]);
 translate([20,0,0]) cube([wall,depth,height]);translate([74,0,0]) cube([wall,depth,height]);
 translate([20,0,height-wall]) cube([60,depth,wall]);
 }
 for(x=[10,90]) for(y=[15,55]) translate([x,y,-1]) cylinder(d=6.5,h=wall+2);
 for(x=[40,60]) hull(){translate([x,15,height-wall-1]) cylinder(d=slot,h=wall+2);translate([x,55,height-wall-1]) cylinder(d=slot,h=wall+2);}
 for(x=[19,73]) translate([x,25,8]) cube([wall+2,20,12]);
}
