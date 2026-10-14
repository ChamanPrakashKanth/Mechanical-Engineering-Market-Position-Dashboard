// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [5, 0], [5, 8], [8, 12], [10, 24], [8, 36], [5, 40], [0, 40]];
rotate_extrude($fn=96) polygon(points=section);
