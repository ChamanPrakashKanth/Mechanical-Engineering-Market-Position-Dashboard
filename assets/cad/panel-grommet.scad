// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [9, 0], [9, 2], [7, 2], [7, 4], [9, 4], [9, 6], [4, 6]];
rotate_extrude($fn=96) polygon(points=section);
