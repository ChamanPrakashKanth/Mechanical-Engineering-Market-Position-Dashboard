# GATE Mechanical Thermal & Fluid Sciences — Free Revision Book

Original MechIntel first edition · 15 October 2026 · CC BY 4.0.
AI-assisted educational material. Original questions, not official previous-year questions.
Official syllabus: https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/ME_GATE2027_Syllabus.pdf

## Coverage and further study
First law, flow energy, thermal resistance and ideal cycles. Pure-substance tables, entropy, exergy, compressible flow, boundary layers, convection correlations, radiation networks, refrigeration, psychrometry and turbomachinery need additional study.

## 1. Thermodynamics: closed-system energy balance

Define the system boundary before applying the first law. In a closed system mass stays inside, but energy can cross the boundary as heat or work. Use the sign convention explicitly: heat into the system is positive and work done by the system is positive here. Internal energy is a state property, while heat and work depend on the path. A cycle returns every state property to its initial value, so its net internal-energy change is zero. For an ideal gas with constant specific heat, internal-energy change depends only on temperature. Boundary work is the integral of pressure with respect to volume for the appropriate quasi-equilibrium path; constant pressure is only one special case. Include kinetic and potential energy when their changes are relevant. A steady-flow device such as a turbine instead requires an open-system balance.

### Key relations
Closed system: ΔU+ΔKE+ΔPE=Q−W. Ideal gas, constant cv: ΔU=mcv(T2−T1). Constant-pressure boundary work: W=p(V2−V1).

### Worked example
A closed stationary gas receives 120 kJ of heat and performs 45 kJ of work. Find its internal-energy change.

Solution: Kinetic and potential energy changes are zero. With heat in and work out both positive, ΔU=Q−W=120−45=75 kJ. The gas stores the part of the energy input that did not leave as work.

### Common mistakes
Heat is not a property stored in a system. Do not use cp for ideal-gas internal-energy change; use cv under the stated constant-specific-heat approximation.

### Practice
1. A closed system rejects 20 kJ of heat and receives 35 kJ of work. Find ΔU when other energy changes vanish.
Answer: +15 kJ. Here Q=−20 and W=−35, so Q−W=15.

2. For a complete closed-system cycle, Qnet=80 kJ. Find Wnet.
Answer: 80 kJ, since the total energy change over a cycle is zero.

## 2. Fluid mechanics: continuity and Bernoulli

Continuity expresses mass conservation. In steady incompressible flow through a single streamtube, area times mean velocity is constant. A smaller area therefore means a larger mean speed. Bernoulli’s equation relates pressure, velocity and elevation along a streamline under its ideal assumptions. For real pipe systems, use an extended mechanical-energy equation that includes pump head, turbine head and irreversible losses. A constant pipe diameter does not imply constant pressure: friction, elevation change and devices can still alter pressure. Specify whether pressure is gauge or absolute; differences can use gauge values consistently, while cavitation and gas calculations need absolute pressure. Before substituting, identify whether a pressure difference is caused by velocity change, elevation change or a loss term.

### Key relations
Steady incompressible continuity: A1V1=A2V2. Ideal Bernoulli: p/(ρg)+V²/(2g)+z=constant. Reynolds number: Re=ρVD/μ.

### Worked example
Water flows through a horizontal ideal contraction from diameter 100 mm at 2 m/s to diameter 50 mm. Find outlet speed and p1−p2. Use ρ=1000 kg/m³.

Solution: The area ratio is (100/50)²=4, so V2=8 m/s. With equal elevation and negligible losses, p1−p2=ρ(V2²−V1²)/2=1000(64−4)/2=30000 Pa=30 kPa.

### Common mistakes
Area scales with the square of diameter. Bernoulli without a loss term is not a general frictional-pipe formula.

### Practice
1. A pipe area halves in steady incompressible flow. How does mean speed change?
Answer: It doubles, assuming no branch flow.

2. Find Re for ρ=1000 kg/m³, V=1 m/s, D=0.02 m and μ=0.001 Pa·s.
Answer: 20000. Compute 1000×1×0.02/0.001.

## 3. Heat transfer: conduction and thermal resistance

Thermal resistance converts a heat-transfer problem into temperature difference divided by resistance. For one-dimensional steady conduction through a plane wall with constant conductivity and no internal generation, resistance is thickness divided by conductivity times area. At a convecting surface, the resistance is one divided by heat-transfer coefficient times area. Layers in series carry the same heat rate, so their resistances add. Parallel heat-flow paths share a temperature difference and their conductances add. The wall formula is not suitable for a cylinder whose conduction area varies with radius; use the logarithmic cylindrical expression instead. Distinguish total heat rate in watts from heat flux in watts per square metre. Contact resistance and radiation can change the network and should be included when the problem specifies them.

### Key relations
Plane wall: Rcond=L/(kA), Rconv=1/(hA), Q̇=ΔT/Rtotal. Cylinder: Rcond=ln(ro/ri)/(2πkL). Heat flux q″=Q̇/A.

### Worked example
A plane wall is 0.1 m thick, has k=0.5 W/(m·K) and area 2 m². Its face temperatures differ by 40 K. Find steady heat flow.

Solution: Rcond=0.1/(0.5×2)=0.1 K/W. Q̇=40/0.1=400 W, flowing from the hotter face to the colder face. The corresponding heat flux is 400/2=200 W/m².

### Common mistakes
Temperature differences in K and °C have the same numerical value, but radiation requires absolute temperatures. Do not mistake W for W/m².

### Practice
1. Two series resistances are 0.2 and 0.3 K/W with ΔT=100 K. Find heat rate.
Answer: 200 W. Total resistance is 0.5 K/W.

2. At h=25 W/(m²·K) and A=2 m², find convection resistance.
Answer: 0.02 K/W, from 1/(25×2).

## 4. Power cycles: Carnot limit and Otto efficiency

A heat engine receives energy from a hot source, rejects energy to a colder sink and delivers net work. Thermal efficiency compares work output with heat input. A reversible engine between two constant-temperature reservoirs sets an upper bound for engines operating between those reservoirs. Reservoir temperatures must be absolute. The air-standard Otto cycle models two isentropic and two constant-volume processes with an ideal working gas; the constant-specific-heat efficiency formula is a model result rather than a prediction of a real engine’s efficiency. It increases with compression ratio when the ratio of specific heats is fixed. Real engines face combustion, heat-transfer, mechanical and operating constraints. In cycle calculations, first identify process types and then evaluate state relationships before adding heat and work terms.

### Key relations
ηth=Wnet/Qin. Carnot: η=1−Tc/Th. Constant-γ air-standard Otto: η=1−1/r^(γ−1), where r=Vmax/Vmin.

### Worked example
Find the maximum reversible heat-engine efficiency between 600 K and 300 K, and its work output for heat input of 100 kJ.

Solution: ηCarnot=1−300/600=0.5, or 50%. Work is ηQin=50 kJ, and heat rejection is 100−50=50 kJ. These values apply to the stated reversible engine, not automatically to an actual engine.

### Common mistakes
Never insert Celsius reservoir temperatures into the Carnot ratio. Compression ratio is a volume ratio, not a pressure ratio.

### Practice
1. Find Carnot efficiency between 800 K and 400 K.
Answer: 50%, from 1−400/800.

2. An engine receives 200 kJ and rejects 140 kJ per cycle. Find efficiency.
Answer: 30%. Net work is 60 kJ, and 60/200=0.30.
