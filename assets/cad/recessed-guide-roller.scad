// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [18, 0], [18, 3], [13, 3], [13, 19], [18, 19], [18, 22], [10, 22], [10, 17], [4, 17]];
rotate_extrude($fn=96) polygon(points=section);
