// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[6, 0], [16, 0], [16, 3], [10, 3], [10, 18], [6, 18]];
rotate_extrude($fn=96) polygon(points=section);
