// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [6, 0], [6, 20], [9, 20], [9, 23], [4, 23]];
rotate_extrude($fn=96) polygon(points=section);
