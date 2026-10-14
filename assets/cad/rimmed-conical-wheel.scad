// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [16, 0], [16, 3], [24, 3], [24, 8], [14, 24], [4, 24]];
rotate_extrude($fn=96) polygon(points=section);
