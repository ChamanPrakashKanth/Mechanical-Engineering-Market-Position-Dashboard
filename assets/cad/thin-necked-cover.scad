// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [16, 0], [16, 12], [10, 18], [10, 25], [8.5, 25], [8.5, 17.5], [14.5, 11.5], [14.5, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
