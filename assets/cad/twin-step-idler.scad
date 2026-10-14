// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [10, 0], [10, 5], [14, 5], [14, 10], [18, 10], [18, 20], [14, 20], [14, 25], [10, 25], [10, 30], [4, 30]];
rotate_extrude($fn=96) polygon(points=section);
