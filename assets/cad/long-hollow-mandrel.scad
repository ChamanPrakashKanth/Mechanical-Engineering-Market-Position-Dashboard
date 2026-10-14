// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [10, 0], [10, 6], [7, 6], [5, 50], [3, 50]];
rotate_extrude($fn=96) polygon(points=section);
