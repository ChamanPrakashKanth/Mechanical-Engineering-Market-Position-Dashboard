// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[8, 0], [9, 0], [12, 5], [9, 10], [12, 15], [9, 20], [12, 25], [9, 30], [8, 30], [11, 25], [8, 20], [11, 15], [8, 10], [11, 5]];
rotate_extrude($fn=96) polygon(points=section);
