// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [20, 0], [20, 6], [16, 6], [16, 3], [0, 3]];
rotate_extrude($fn=96) polygon(points=section);
