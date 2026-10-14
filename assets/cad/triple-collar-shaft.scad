// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [5, 0], [5, 5], [10, 5], [10, 8], [5, 8], [5, 18], [10, 18], [10, 21], [5, 21], [5, 31], [10, 31], [10, 34], [5, 34], [5, 39], [0, 39]];
rotate_extrude($fn=96) polygon(points=section);
