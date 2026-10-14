// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[12, 0], [20, 0], [20, 1.5], [14, 1.5], [6, 26], [4.5, 26]];
rotate_extrude($fn=96) polygon(points=section);
