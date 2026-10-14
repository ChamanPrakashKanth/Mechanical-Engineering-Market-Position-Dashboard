// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [20, 0], [20, 3], [13, 3], [13, 12], [10, 12], [10, 22], [20, 22], [20, 25], [4, 25]];
rotate_extrude($fn=96) polygon(points=section);
