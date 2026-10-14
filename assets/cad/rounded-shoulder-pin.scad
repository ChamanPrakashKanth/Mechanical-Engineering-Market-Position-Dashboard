// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [9, 0], [11, 2], [11, 4], [9, 6], [5, 6], [5, 26], [4, 28], [0, 28]];
rotate_extrude($fn=96) polygon(points=section);
