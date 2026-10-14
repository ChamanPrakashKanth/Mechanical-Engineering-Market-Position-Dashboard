// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [22, 0], [22, 3], [10, 3], [10, 27], [22, 27], [22, 30], [4, 30]];
rotate_extrude($fn=96) polygon(points=section);
