// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [8, 0], [8, 18], [13, 18], [13, 22], [4, 22], [3, 21]];
rotate_extrude($fn=96) polygon(points=section);
