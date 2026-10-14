// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [16, 0], [16, 4], [10, 4], [10, 18], [16, 18], [16, 22], [9, 22], [9, 16], [5, 16]];
rotate_extrude($fn=96) polygon(points=section);
