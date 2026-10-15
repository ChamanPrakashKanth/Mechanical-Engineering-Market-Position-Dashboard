// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=120; width=50; web=8; side_height=38; rod_spacing=80; rod_clearance=11;
$fn=64;
difference(){
 union(){
  cube([length,width,web]);
  cube([web,width,side_height]);
  translate([length-web,0,0]) cube([web,width,side_height]);
  for(y=[0,width-web]) translate([web,y,web]) rotate([0,90,0]) linear_extrude(height=length-2*web) polygon([[0,0],[side_height-web,0],[0,side_height-web]]);
 }
 for(x=[(length-rod_spacing)/2,(length+rod_spacing)/2]) translate([x,width/2,-1]) cylinder(d=rod_clearance,h=web+2);
 for(x=[web/2,length-web/2]) translate([x,-1,side_height-15]) rotate([-90,0,0]) cylinder(d=7,h=width+2);
}
