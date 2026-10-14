// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [6, 0], [6, 8], [11, 8], [11, 12], [6, 12], [6, 28], [11, 28], [11, 32], [6, 32], [6, 40], [0, 40]];
rotate_extrude($fn=96) polygon(points=section);
