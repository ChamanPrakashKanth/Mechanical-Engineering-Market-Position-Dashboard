// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
span=70; foot=18; strap=8; rise=22; depth=40; slot=7;
$fn=64;
difference(){
 union(){
  cube([foot,depth,strap]);
  translate([span-foot,0,0]) cube([foot,depth,strap]);
  translate([foot,0,rise-strap]) cube([span-2*foot,depth,strap]);
  for(y=[0,depth-strap]) translate([foot,y,strap]) rotate([0,90,0]) linear_extrude(height=span-2*foot) polygon([[0,0],[rise-strap,0],[rise-strap,strap]]);
 }
 for(x=[foot/2,span-foot/2]) hull(){translate([x,depth/2-8,-1]) cylinder(d=slot,h=strap+2);translate([x,depth/2+8,-1]) cylinder(d=slot,h=strap+2);}
}
