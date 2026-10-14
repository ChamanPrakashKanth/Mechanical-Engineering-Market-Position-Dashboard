// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [6, 0], [6, 15], [7, 19], [10, 23], [14, 25], [13, 26], [9, 24], [5, 20], [4, 16]];
rotate_extrude($fn=96) polygon(points=section);
