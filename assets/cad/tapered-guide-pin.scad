// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [7, 0], [7, 5], [5, 5], [5, 20], [2, 28], [0, 28]];
rotate_extrude($fn=96) polygon(points=section);
