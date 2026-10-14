// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [18, 0], [18, 3], [12, 3], [12, 22], [18, 22], [18, 25], [4, 25]];
rotate_extrude($fn=96) polygon(points=section);
