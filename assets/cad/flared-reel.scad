// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [20, 0], [20, 2], [9, 6], [9, 18], [20, 22], [20, 24], [3, 24]];
rotate_extrude($fn=96) polygon(points=section);
