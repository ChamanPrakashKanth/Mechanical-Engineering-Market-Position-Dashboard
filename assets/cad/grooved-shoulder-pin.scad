// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [10, 0], [10, 5], [6, 5], [6, 12], [4.5, 12], [4.5, 14], [6, 14], [6, 30], [0, 30]];
rotate_extrude($fn=96) polygon(points=section);
