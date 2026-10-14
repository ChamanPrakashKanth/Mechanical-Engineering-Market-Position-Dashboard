// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [10, 0], [10, 22], [7, 22], [7, 12], [4, 12]];
rotate_extrude($fn=96) polygon(points=section);
