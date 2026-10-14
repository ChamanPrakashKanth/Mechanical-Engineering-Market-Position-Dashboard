// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [12, 0], [11, 6], [8, 14], [4, 21], [0, 25]];
rotate_extrude($fn=96) polygon(points=section);
