// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [16, 0], [16, 6], [11, 10], [11, 16], [16, 20], [16, 26], [5, 26]];
rotate_extrude($fn=96) polygon(points=section);
