// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [14, 0], [14, 12], [12, 17], [7, 21], [0, 23], [0, 21.5], [6.5, 19.5], [10.5, 16], [12.5, 11.5], [12.5, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
