// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [8, 0], [8, 5], [5, 5], [5, 25], [3, 25], [3, 31], [0, 31]];
rotate_extrude($fn=96) polygon(points=section);
