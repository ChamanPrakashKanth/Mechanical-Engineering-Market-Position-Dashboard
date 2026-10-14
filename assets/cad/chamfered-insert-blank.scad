// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [6, 0], [7, 1], [7, 11], [6, 12], [3, 12]];
rotate_extrude($fn=96) polygon(points=section);
