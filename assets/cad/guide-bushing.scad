// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[4.5, 0], [7.5, 0], [8, 0.5], [8, 18], [10, 18], [10, 21], [5.5, 21], [4.5, 20]];
rotate_extrude($fn=96) polygon(points=section);
