// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[8, 0], [10, 0], [6, 8], [6, 22], [10, 30], [8, 30], [4, 22], [4, 8]];
rotate_extrude($fn=96) polygon(points=section);
