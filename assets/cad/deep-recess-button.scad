// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [14, 0], [16, 2], [16, 12], [14, 14], [8, 14], [8, 4], [0, 4]];
rotate_extrude($fn=96) polygon(points=section);
