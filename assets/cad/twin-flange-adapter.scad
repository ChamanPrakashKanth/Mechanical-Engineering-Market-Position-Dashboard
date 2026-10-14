// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [16, 0], [16, 4], [8, 4], [8, 18], [16, 18], [16, 22], [6, 22], [6, 12], [4, 12]];
rotate_extrude($fn=96) polygon(points=section);
