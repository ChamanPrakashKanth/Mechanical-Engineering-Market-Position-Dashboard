// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [12, 0], [12, 5], [9, 5], [9, 12], [6, 12], [6, 20], [3, 20]];
rotate_extrude($fn=96) polygon(points=section);
