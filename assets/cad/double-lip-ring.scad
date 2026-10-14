// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [12, 0], [12, 2], [10, 2], [10, 8], [9, 8], [9, 2], [7, 2], [7, 8], [6, 8], [6, 2], [5, 2]];
rotate_extrude($fn=96) polygon(points=section);
