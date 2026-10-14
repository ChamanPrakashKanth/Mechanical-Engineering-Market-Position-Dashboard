// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [10, 0], [10, 3], [8, 3], [8, 7], [10, 7], [10, 10], [8, 10], [8, 14], [10, 14], [10, 17], [8, 17], [8, 21], [10, 21], [10, 24], [5, 24]];
rotate_extrude($fn=96) polygon(points=section);
