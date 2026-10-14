// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [15, 0], [15, 3], [10, 9], [9, 9], [13, 3], [5, 3]];
rotate_extrude($fn=96) polygon(points=section);
