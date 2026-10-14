// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [15, 0], [15, 12], [13, 12], [13, 8], [10, 8], [10, 12], [8, 12], [8, 20], [5, 20]];
rotate_extrude($fn=96) polygon(points=section);
