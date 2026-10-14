// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [20, 0], [20, 4], [11, 4], [11, 18], [8, 18], [8, 10], [5, 10]];
rotate_extrude($fn=96) polygon(points=section);
