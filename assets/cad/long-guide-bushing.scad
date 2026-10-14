// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [7, 0], [7, 35], [10, 35], [10, 38], [3, 38]];
rotate_extrude($fn=96) polygon(points=section);
