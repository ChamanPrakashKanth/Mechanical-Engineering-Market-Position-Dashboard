// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [18, 0], [18, 3], [13, 6], [18, 9], [18, 12], [13, 15], [18, 18], [18, 21], [4, 21]];
rotate_extrude($fn=96) polygon(points=section);
