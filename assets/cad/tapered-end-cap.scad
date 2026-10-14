// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [12, 0], [9, 18], [7.5, 18], [10.2, 2], [0, 2]];
rotate_extrude($fn=96) polygon(points=section);
