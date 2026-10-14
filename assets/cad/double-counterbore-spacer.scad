// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [11, 0], [11, 24], [6, 24], [6, 19], [3, 19], [3, 5], [6, 5]];
rotate_extrude($fn=96) polygon(points=section);
