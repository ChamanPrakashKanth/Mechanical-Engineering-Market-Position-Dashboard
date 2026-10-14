// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [5, 0], [6, 1], [6, 29], [5, 30], [0, 30]];
rotate_extrude($fn=96) polygon(points=section);
