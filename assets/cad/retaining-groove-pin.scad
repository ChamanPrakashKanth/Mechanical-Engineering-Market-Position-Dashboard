// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [5, 0], [5, 4], [4, 4], [4, 5.5], [5, 5.5], [5, 26], [4, 26], [4, 27.5], [5, 27.5], [5, 30], [0, 30]];
rotate_extrude($fn=96) polygon(points=section);
