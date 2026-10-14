// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [15, 0], [15, 22], [18, 22], [18, 25], [13, 25], [13, 2], [0, 2]];
rotate_extrude($fn=96) polygon(points=section);
