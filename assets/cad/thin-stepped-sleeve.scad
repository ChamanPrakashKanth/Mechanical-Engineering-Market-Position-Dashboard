// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [6, 0], [6, 12], [9, 12], [9, 24], [8, 24], [8, 13], [5, 13]];
rotate_extrude($fn=96) polygon(points=section);
