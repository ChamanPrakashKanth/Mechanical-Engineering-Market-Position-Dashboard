// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 2], [12, 2], [12, 0], [20, 0], [20, 8], [12, 8], [12, 6], [0, 6]];
rotate_extrude($fn=96) polygon(points=section);
