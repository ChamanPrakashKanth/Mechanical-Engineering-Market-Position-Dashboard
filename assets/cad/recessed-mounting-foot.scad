// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [18, 0], [18, 4], [10, 4], [10, 16], [4, 16], [4, 5], [0, 5]];
rotate_extrude($fn=96) polygon(points=section);
