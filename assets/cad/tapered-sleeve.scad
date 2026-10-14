// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[9, 0], [11, 0], [6, 30], [4, 30]];
rotate_extrude($fn=96) polygon(points=section);
