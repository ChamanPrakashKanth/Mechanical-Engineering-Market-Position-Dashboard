// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [12, 0], [14, 2], [14, 5], [12, 7], [9, 7], [9, 20], [5, 20]];
rotate_extrude($fn=96) polygon(points=section);
