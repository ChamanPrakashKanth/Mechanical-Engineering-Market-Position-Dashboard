// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4, 0], [12, 0], [12, 4], [18, 4], [18, 18], [12, 18], [12, 22], [4, 22]];
rotate_extrude($fn=96) polygon(points=section);
