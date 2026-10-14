// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[13, 0], [15, 0], [15, 6], [8, 25], [8, 32], [6, 32], [6, 25], [13, 6]];
rotate_extrude($fn=96) polygon(points=section);
