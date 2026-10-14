// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [10, 0], [11, 5], [14, 10], [18, 14], [17, 15], [13, 11], [10, 6], [9, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
