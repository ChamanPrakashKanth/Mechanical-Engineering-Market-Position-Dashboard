// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[3, 0], [17, 0], [18, 1], [18, 3], [9, 3], [9, 21], [18, 21], [18, 23], [17, 24], [3, 24]];
rotate_extrude($fn=96) polygon(points=section);
