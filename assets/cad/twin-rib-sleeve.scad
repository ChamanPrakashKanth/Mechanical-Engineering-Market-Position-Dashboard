// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [7, 0], [7, 5], [10, 5], [10, 8], [7, 8], [7, 22], [10, 22], [10, 25], [7, 25], [7, 30], [4, 30]];
rotate_extrude($fn=96) polygon(points=section);
