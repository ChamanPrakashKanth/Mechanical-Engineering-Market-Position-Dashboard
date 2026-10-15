// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
base_length=120; base_depth=70; base_thickness=8; mast_width=70; mast_height=90; wall=8; slot=7; sensor_bore=18;
$fn=64;
difference(){
 union(){
  cube([base_length,base_depth,base_thickness]);
  translate([(base_length-mast_width)/2,0,0]) cube([mast_width,wall,mast_height]);
  for(x=[18,base_length-24]) translate([x,wall,base_thickness]) rotate([90,0,90]) linear_extrude(height=6) polygon([[0,0],[38,0],[0,52]]);
  translate([(base_length-48)/2,wall,68]) cube([48,22,8]);
 }
 for(x=[20,base_length-20]) hull(){translate([x,22,-1]) cylinder(d=slot,h=base_thickness+2);translate([x,48,-1]) cylinder(d=slot,h=base_thickness+2);}
 for(x=[base_length/2-20,base_length/2+20]) hull(){translate([x,-1,36]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);translate([x,-1,68]) rotate([-90,0,0]) cylinder(d=slot,h=wall+2);}
 translate([base_length/2,wall+11,67]) rotate([90,0,0]) cylinder(d=sensor_bore,h=24);
 for(x=[base_length/2-12,base_length/2+12]) translate([x,wall+10,67]) rotate([90,0,0]) cylinder(d=5.5,h=24);
}
