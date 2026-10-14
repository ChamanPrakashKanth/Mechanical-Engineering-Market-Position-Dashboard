// Original MechIntel educational model. CC0-1.0. Units: mm.
// Not a standardized or load-rated component.
$fn=96;
// Section points: [radius, height], mm. Edit to change the profile.
section=[[0, 0], [5, 0], [5, 20], [4.903926402016152, 20.97545161008064], [4.619397662556434, 21.91341716182545], [4.157348061512726, 22.77785116509801], [3.5355339059327378, 23.535533905932738], [2.7778511650980113, 24.157348061512728], [1.9134171618254492, 24.619397662556434], [0.9754516100806416, 24.903926402016154], [0, 25]];
rotate_extrude($fn=96) polygon(points=section);
