// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [19, 0], [19, 3], [12, 3], [14, 9], [15, 15], [14, 21], [12, 27], [19, 27], [19, 30], [4, 30]];
rotate_extrude($fn=96) polygon(points=section);
