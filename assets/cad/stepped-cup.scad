// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [15, 0], [15, 8], [12, 8], [12, 22], [10, 22], [10, 6], [13, 6], [13, 2], [0, 2]];
rotate_extrude($fn=96) polygon(points=section);
