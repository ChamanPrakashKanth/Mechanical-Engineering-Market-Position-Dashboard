# GATE Mechanical Applied Mechanics & Design — Free Revision Book

Original MechIntel first edition · 15 October 2026 · CC BY 4.0.
AI-assisted educational material. Original questions, not official previous-year questions.
Official syllabus: https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/ME_GATE2027_Syllabus.pdf

## Coverage and further study
Equilibrium, axial loading, torsion and vibration. Friction, trusses, rigid-body dynamics, beam shear and bending, stress transformation, columns, mechanisms, gears, fatigue, machine elements, forced vibration and control systems need additional study.

## 1. Engineering mechanics: free-body diagrams

Start statics by isolating a body and showing every external force and couple. Replace supports with reactions appropriate to the idealization. A pin in a plane can supply two reaction components but no reaction moment; a smooth roller supplies a reaction normal to its surface. Choose a moment center that eliminates unknown forces and reduces algebra. A couple is a free moment and does not need a lever arm. For distributed loads, replace the load by its resultant at the centroid of the distribution before solving reactions. After calculating, check vertical and horizontal force balance and take moments about a second point. A negative reaction indicates a direction opposite to the initial assumption; whether the support can provide it is a separate physical question.

### Key relations
Planar rigid-body equilibrium: ΣFx=0, ΣFy=0, ΣMz=0. Uniform distributed load: resultant W=wL at the midpoint of the loaded length.

### Worked example
A simply supported 4 m beam carries a downward 10 kN point load 1 m from its left support. Find both vertical reactions.

Solution: Take moments about the left support: RB×4−10×1=0, hence RB=2.5 kN upward. Vertical balance gives RA=10−2.5=7.5 kN upward. Checking moments about the right: 7.5×4−10×3=0.

### Common mistakes
A pin support is not a fixed support. Use the distance perpendicular to a force line when calculating its moment.

### Practice
1. A 6 m simply supported beam carries a central 12 kN load. Find the reactions.
Answer: 6 kN upward at each support by symmetry and force balance.

2. A 3 m beam carries a uniform 2 kN/m load over its full length. What is the equivalent load and location?
Answer: 6 kN downward, acting 1.5 m from either end.

## 2. Mechanics of materials: axial stress and extension

Normal stress is an internal force per unit area. The familiar uniform axial formula describes a straight prismatic bar sufficiently far from load application and geometric discontinuities. Engineering strain is extension divided by original length. Within linear elasticity, stress and strain are proportional through Young’s modulus. If a bar has multiple segments, calculate each segment’s extension using its own length, area and modulus, then sum compatible deformations. Thermal expansion produces strain even without mechanical stress; a freely expanding bar can change length without a thermal force. Restraint can create stress, so the support conditions matter. State whether the quoted modulus uses Pa, GPa or N/mm², and use a consistent length and force system throughout.

### Key relations
σ=P/A; ε=δ/L; σ=Eε; δ=PL/(AE). Free thermal extension: δth=αLΔT.

### Worked example
A 1000 mm long bar has area 200 mm² and E=200000 N/mm². Find stress and extension under a 20 kN tensile force.

Solution: Convert 20 kN to 20000 N. Stress is 20000/200=100 N/mm²=100 MPa. Extension is (20000×1000)/(200×200000)=0.5 mm. Strain is 0.5/1000=0.0005, consistent with σ/E.

### Common mistakes
Do not insert E=200 with forces in N and areas in mm²; 200 GPa equals 200000 N/mm². Stress concentration and plastic behavior need separate models.

### Practice
1. A 10 kN force acts on 100 mm². Find nominal stress.
Answer: 100 MPa, because 10000 N/100 mm²=100 N/mm².

2. A free 2 m bar has α=12×10⁻⁶/K and is heated by 50 K. Find its extension.
Answer: 1.2 mm. Compute 12×10⁻⁶×2×50 m = 0.0012 m.

## 3. Torsion of a circular shaft

A circular shaft under elastic torsion develops shear stress that increases with radius. For a solid shaft it is zero at the center and largest at the surface. The polar second moment of area is a geometric quantity with length to the fourth power; it is not the mass moment of inertia. The simple torsion relation assumes a circular prismatic shaft, linear elastic material, small deformation and suitable torque application. Hollow shafts use the difference between outer and inner fourth powers. Calculate torque consistently: N·m must be converted to N·mm if the diameter is in mm. Angular twist from TL/(GJ) is in radians. For stepped shafts, add signed twists and ensure the internal torque in each segment is correct.

### Key relations
Solid circular shaft: J=πd⁴/32; τmax=16T/(πd³); θ=TL/(GJ). Hollow shaft: J=π(D⁴−d⁴)/32.

### Worked example
A solid 40 mm diameter shaft transmits 500 N·m. Find its nominal maximum shear stress.

Solution: T=500000 N·mm. Therefore τmax=16×500000/(π×40³)=39.79 N/mm², approximately 39.8 MPa. Doubling diameter at unchanged torque reduces this nominal stress by a factor of eight.

### Common mistakes
Polar area moment uses d⁴, while maximum stress scales with d³. Keyways and shoulders introduce local effects absent from this formula.

### Practice
1. At fixed torque, what happens to shear stress when diameter doubles?
Answer: It becomes one eighth of the original stress because τmax is proportional to 1/d³.

2. Convert 250 N·m into N·mm.
Answer: 250000 N·mm; one metre equals 1000 millimetres.

## 4. Vibrations: natural frequency and damping

An ideal spring-mass system stores energy alternately in spring deformation and mass motion. Its undamped natural frequency depends on stiffness divided by mass. Increasing stiffness raises the frequency; increasing mass lowers it. Damping dissipates energy and reduces free-response amplitude. The damping ratio compares the actual viscous damping coefficient with its critical value. An underdamped system oscillates while its envelope decays; critically damped and overdamped systems do not oscillate in this ideal model. The damped oscillation frequency is below the undamped natural frequency. Natural angular frequency is in radians per second, whereas ordinary frequency is cycles per second. Keep them separate when comparing excitation to a machine speed given in rpm. Forced response and isolation require additional analysis beyond this free-vibration chapter.

### Key relations
ωn=√(k/m); fn=ωn/(2π); cc=2√(km); ζ=c/cc. For 0≤ζ<1: ωd=ωn√(1−ζ²).

### Worked example
A 4 kg mass is attached to a 1600 N/m spring. Find its undamped frequency and critical viscous damping coefficient.

Solution: ωn=√(1600/4)=20 rad/s. Hence fn=20/(2π)=3.183 Hz. Critical damping is 2√(1600×4)=160 N·s/m. A damper with c=16 N·s/m would give ζ=0.1.

### Common mistakes
Do not label 20 rad/s as 20 Hz. Stiffness in N/mm must be converted to N/m when mass is in kg and time in seconds.

### Practice
1. If mass is quadrupled at fixed stiffness, how does natural frequency change?
Answer: It halves, since frequency scales with 1/√m.

2. For c=40 N·s/m and cc=200 N·s/m, find ζ and response class.
Answer: ζ=0.2, so the free response is underdamped.
