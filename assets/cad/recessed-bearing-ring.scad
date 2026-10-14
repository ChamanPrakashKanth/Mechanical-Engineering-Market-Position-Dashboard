// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [18, 0], [18, 8], [14, 8], [14, 5], [10, 5], [10, 12], [6, 12]];
rotate_extrude($fn=96) polygon(points=section);
