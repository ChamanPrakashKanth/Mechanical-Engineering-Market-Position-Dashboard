// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [22, 0], [22, 3], [10, 12], [7, 12], [7, 18], [3, 18]];
rotate_extrude($fn=96) polygon(points=section);
