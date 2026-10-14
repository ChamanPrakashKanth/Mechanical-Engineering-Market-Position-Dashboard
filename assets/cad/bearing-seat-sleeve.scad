// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [11, 0], [11, 5], [9, 5], [9, 25], [7, 25], [7, 12], [5, 12]];
rotate_extrude($fn=96) polygon(points=section);
