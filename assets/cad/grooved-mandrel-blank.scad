// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [8, 0], [8, 8], [6, 8], [6, 10], [8, 10], [8, 24], [6, 24], [6, 26], [8, 26], [8, 34], [0, 34]];
rotate_extrude($fn=96) polygon(points=section);
