// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [20, 0], [20, 1], [8, 1], [8, 8], [6, 8]];
rotate_extrude($fn=96) polygon(points=section);
