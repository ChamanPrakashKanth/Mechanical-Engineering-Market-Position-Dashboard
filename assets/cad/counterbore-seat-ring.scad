// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [15, 0], [15, 12], [9, 12], [9, 7], [6, 7], [6, 3], [4, 3]];
rotate_extrude($fn=96) polygon(points=section);
