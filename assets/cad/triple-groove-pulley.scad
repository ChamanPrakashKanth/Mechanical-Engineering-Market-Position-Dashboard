// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [20, 0], [20, 2], [15, 5], [20, 8], [20, 10], [15, 13], [20, 16], [20, 18], [15, 21], [20, 24], [20, 26], [4, 26]];
rotate_extrude($fn=96) polygon(points=section);
