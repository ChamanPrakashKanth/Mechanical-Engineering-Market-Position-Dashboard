// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [10, 0], [10, 5], [8, 5], [8, 7], [10, 7], [10, 17], [8, 17], [8, 19], [10, 19], [10, 24], [4, 24]];
rotate_extrude($fn=96) polygon(points=section);
