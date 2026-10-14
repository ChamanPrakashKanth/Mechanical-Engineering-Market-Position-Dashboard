// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [11, 0], [12, 1], [12, 23], [11, 24], [5, 24], [4, 23], [4, 1]];
rotate_extrude($fn=96) polygon(points=section);
