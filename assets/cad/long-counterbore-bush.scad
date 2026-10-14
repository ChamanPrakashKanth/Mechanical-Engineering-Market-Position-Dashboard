// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [10, 0], [10, 36], [7, 36], [7, 26], [4, 26]];
rotate_extrude($fn=96) polygon(points=section);
