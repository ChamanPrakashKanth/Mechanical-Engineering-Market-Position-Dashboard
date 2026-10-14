// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [9, 0], [9, 3], [7, 3], [7, 25], [9, 25], [9, 28], [5, 28]];
rotate_extrude($fn=96) polygon(points=section);
