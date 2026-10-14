// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [13, 0], [13, 10], [11, 10], [11, 7], [8, 7], [8, 10], [5, 10]];
rotate_extrude($fn=96) polygon(points=section);
