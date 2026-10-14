// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [7, 0], [7, 8], [18, 24], [16.5, 25], [5, 9]];
rotate_extrude($fn=96) polygon(points=section);
