// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [18, 0], [18, 25], [16.5, 25], [16.5, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
