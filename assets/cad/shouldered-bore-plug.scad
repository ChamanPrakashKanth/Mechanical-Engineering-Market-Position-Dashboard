// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [14, 0], [14, 4], [9, 4], [9, 20], [4, 20], [4, 8], [0, 8]];
rotate_extrude($fn=96) polygon(points=section);
