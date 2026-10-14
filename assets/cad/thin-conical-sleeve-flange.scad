// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [15, 0], [15, 2], [8, 2], [12, 28], [10.5, 28]];
rotate_extrude($fn=96) polygon(points=section);
