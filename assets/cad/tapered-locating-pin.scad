// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [8, 0], [8, 4], [5, 4], [5, 24], [3, 27], [0, 27]];
rotate_extrude($fn=96) polygon(points=section);
