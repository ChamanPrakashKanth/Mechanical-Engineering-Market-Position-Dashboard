// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [16, 0], [20, 3], [22, 7], [22, 19], [20, 23], [16, 26], [5, 26]];
rotate_extrude($fn=96) polygon(points=section);
