// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [16, 0], [16, 4], [8, 4], [6, 35], [3, 35]];
rotate_extrude($fn=96) polygon(points=section);
