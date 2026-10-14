// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [8, 0], [8, 12], [13, 12], [13, 16], [8, 16], [8, 28], [4, 28]];
rotate_extrude($fn=96) polygon(points=section);
