// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [7, 0], [10, 2], [11, 5], [10, 8], [7, 10], [3, 10], [2, 8], [2, 2]];
rotate_extrude($fn=96) polygon(points=section);
