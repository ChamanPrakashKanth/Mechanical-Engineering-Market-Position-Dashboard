// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [17, 0], [17, 4], [13, 4], [13, 9], [9, 9], [9, 5], [6, 5]];
rotate_extrude($fn=96) polygon(points=section);
