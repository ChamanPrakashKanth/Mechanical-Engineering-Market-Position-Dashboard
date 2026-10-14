// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [8, 0], [8, 6], [12, 6], [12, 10], [9, 10], [9, 22], [14, 22], [14, 26], [4, 26]];
rotate_extrude($fn=96) polygon(points=section);
