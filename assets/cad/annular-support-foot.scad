// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [20, 0], [20, 3], [14, 8], [9, 8], [9, 15], [4, 15]];
rotate_extrude($fn=96) polygon(points=section);
