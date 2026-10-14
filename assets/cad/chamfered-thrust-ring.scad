// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [15, 0], [16, 1], [16, 5], [15, 6], [6, 6], [5, 5], [5, 1]];
rotate_extrude($fn=96) polygon(points=section);
