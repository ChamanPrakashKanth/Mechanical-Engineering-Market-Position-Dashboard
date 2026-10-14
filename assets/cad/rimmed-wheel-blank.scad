// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [18, 0], [18, 3], [24, 3], [24, 10], [18, 10], [18, 13], [4, 13]];
rotate_extrude($fn=96) polygon(points=section);
