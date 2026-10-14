// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [12, 0], [12, 1], [11, 1], [11, 7], [10, 8], [9, 8], [10, 6], [10, 2], [5, 2]];
rotate_extrude($fn=96) polygon(points=section);
