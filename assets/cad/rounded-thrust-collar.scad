// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [13, 0], [16, 2], [17, 5], [16, 8], [13, 10], [9, 10], [9, 16], [5, 16]];
rotate_extrude($fn=96) polygon(points=section);
