// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [12, 0], [12, 18], [20, 18], [20, 20], [10, 20], [10, 2], [0, 2]];
rotate_extrude($fn=96) polygon(points=section);
