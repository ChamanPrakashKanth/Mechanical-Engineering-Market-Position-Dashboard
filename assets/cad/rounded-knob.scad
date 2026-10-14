// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [8, 0], [8, 5], [12, 7], [14, 11], [14, 16], [12, 20], [8, 22], [0, 22]];
rotate_extrude($fn=96) polygon(points=section);
