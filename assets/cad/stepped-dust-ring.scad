// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [18, 0], [18, 1.5], [12, 1.5], [12, 6], [9, 6], [9, 1.5], [6, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
