// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [20, 0], [20, 3], [9, 3], [9, 23], [20, 23], [20, 26], [12, 26], [12, 24], [4, 24]];
rotate_extrude($fn=96) polygon(points=section);
