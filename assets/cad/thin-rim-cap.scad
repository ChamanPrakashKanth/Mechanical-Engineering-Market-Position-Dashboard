// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [14, 0], [14, 15], [17, 15], [17, 17], [12.5, 17], [12.5, 1.5], [0, 1.5]];
rotate_extrude($fn=96) polygon(points=section);
