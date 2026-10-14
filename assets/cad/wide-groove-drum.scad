// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [22, 0], [22, 5], [14, 9], [14, 21], [22, 25], [22, 30], [5, 30]];
rotate_extrude($fn=96) polygon(points=section);
