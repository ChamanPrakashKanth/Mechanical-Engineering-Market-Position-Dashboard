// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [6.5, 0], [6.5, 15], [11, 23], [9.5, 23], [5, 15]];
rotate_extrude($fn=96) polygon(points=section);
