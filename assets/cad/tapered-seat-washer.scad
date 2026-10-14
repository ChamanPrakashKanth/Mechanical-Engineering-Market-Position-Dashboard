// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [14, 0], [14, 3], [10, 7], [7, 7], [4, 4]];
rotate_extrude($fn=96) polygon(points=section);
