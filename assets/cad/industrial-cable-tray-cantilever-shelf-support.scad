// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
plate_height=90; plate_width=60; plate_thickness=8; arm_reach=120; arm_width=35; gusset=6; slot=8.5;
$fn=64;
difference(){
 union(){
  cube([plate_thickness,plate_width,plate_height]);
  translate([plate_thickness,0,plate_height-arm_width]) cube([arm_reach,plate_width,arm_width]);
  for(y=[0,plate_width-gusset]) translate([plate_thickness,y,plate_height-arm_width]) rotate([90,0,0]) linear_extrude(height=gusset) polygon([[0,0],[arm_reach,0],[0,plate_height-arm_width]]);
  translate([plate_thickness+arm_reach-18,0,plate_height-arm_width]) cube([18,plate_width,5]);
 }
 for(y=[plate_width/2-18,plate_width/2+18]) for(z=[16,plate_height-16]) translate([-1,y,z]) rotate([0,90,0]) cylinder(d=slot,h=plate_thickness+2);
 for(x=[plate_thickness+arm_reach-12]) for(y=[plate_width/2-12,plate_width/2+12]) translate([x,y,plate_height-arm_width-1]) cylinder(d=8.5,h=8);
}
