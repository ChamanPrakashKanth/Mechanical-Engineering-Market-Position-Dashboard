// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [18, 0], [18, 6], [14, 6], [14, 3], [10, 3], [10, 12], [6, 12]];
rotate_extrude($fn=96) polygon(points=section);
