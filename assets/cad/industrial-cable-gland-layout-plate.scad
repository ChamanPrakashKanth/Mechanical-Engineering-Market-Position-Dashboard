// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
length=150; width=90; thickness=4; corner=5; entry_diameters=[16.5,20.5,25.5];
$fn=64;
difference(){
 hull(){for(x=[corner,length-corner]) for(y=[corner,width-corner]) translate([x,y,0]) cylinder(r=corner,h=thickness);}
 for(i=[0:2]) for(y=[27,63]) translate([35+40*i,y,-1]) cylinder(d=entry_diameters[i],h=thickness+2);
 for(x=[10,length-10]) for(y=[10,width-10]) translate([x,y,-1]) cylinder(d=5.5,h=thickness+2);
}
