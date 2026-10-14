// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [9, 0], [9, 2], [12, 2], [12, 0], [17, 0], [17, 8], [12, 8], [12, 6], [9, 6], [9, 8], [5, 8]];
rotate_extrude($fn=96) polygon(points=section);
