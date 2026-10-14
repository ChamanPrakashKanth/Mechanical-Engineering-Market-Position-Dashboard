// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [10, 0], [10, 8], [7, 8], [7, 30], [4, 30], [4, 45], [0, 45]];
rotate_extrude($fn=96) polygon(points=section);
