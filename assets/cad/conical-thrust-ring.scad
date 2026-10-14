// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[5, 0], [17, 0], [17, 4], [10, 10], [7, 10], [5, 8]];
rotate_extrude($fn=96) polygon(points=section);
