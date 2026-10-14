// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [13, 0], [13, 8], [16, 12], [16, 16], [14.5, 16], [14.5, 12.5], [11.5, 8.5], [11.5, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
