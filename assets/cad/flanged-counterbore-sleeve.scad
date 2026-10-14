// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [14, 0], [14, 3], [8, 3], [8, 22], [5, 22], [5, 16], [3, 16]];
rotate_extrude($fn=96) polygon(points=section);
