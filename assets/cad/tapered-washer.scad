// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [18, 0], [12, 5], [5, 5]];
rotate_extrude($fn=96) polygon(points=section);
