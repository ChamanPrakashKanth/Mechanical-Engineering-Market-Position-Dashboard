// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[10, 0], [18, 0], [18, 2], [12, 2], [8, 30], [6.5, 30]];
rotate_extrude($fn=96) polygon(points=section);
