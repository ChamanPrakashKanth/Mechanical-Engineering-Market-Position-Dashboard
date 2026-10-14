// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [15, 0], [15, 10], [12, 10], [12, 6], [9, 6], [9, 10], [6, 10]];
rotate_extrude($fn=96) polygon(points=section);
