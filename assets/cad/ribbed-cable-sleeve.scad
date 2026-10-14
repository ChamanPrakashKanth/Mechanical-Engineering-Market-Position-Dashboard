// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [7, 0], [7, 3], [6, 3], [6, 6], [7, 6], [7, 9], [6, 9], [6, 12], [7, 12], [7, 15], [6, 15], [6, 18], [7, 18], [7, 21], [4, 21]];
rotate_extrude($fn=96) polygon(points=section);
