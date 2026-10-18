import { moreSources, moreTools, moreGuides, extraCalculators } from './expansion.js';
import { mechanicsSources, mechanicsTools, mechanicsGuides, mechanicsCalculators } from './mechanics.js';

export const sources = {
  ...moreSources,
  ...mechanicsSources,
  nasa: { title: 'NASA Glenn · Reynolds number', url: 'https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html' },
  doe: { title: 'U.S. DOE · Fluid Flow, Volume 3', url: 'https://www.energy.gov/documents/doe-hdbk-1012-92vol3' },
  heat: { title: 'OpenStax · Mechanisms of heat transfer', url: 'https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer' },
};

export const tools = [
  { id: 'reynolds', title: 'Reynolds number', category: 'Fluid mechanics', symbol: 'Re', description: 'Explore the balance between inertia and viscosity in a circular pipe.', formula: 'Re = ρvD / μ', guide: 'understanding-reynolds-number', source: 'nasa', defaults: { density: 998, velocity: 1, diameter: 50, viscosity: 1.002 }, fields: [['density', 'Density', 'kg/m³'], ['velocity', 'Mean velocity', 'm/s'], ['diameter', 'Internal diameter', 'mm'], ['viscosity', 'Dynamic viscosity', 'mPa·s']], assumptions: 'Steady, single-phase Newtonian flow. The pipe diameter is the characteristic length. The 2,000–4,000 transition band is a convention for internal pipe flow, not a universal boundary.' },
  { id: 'pressure-drop', title: 'Pipe pressure drop', category: 'Fluid mechanics', symbol: 'Δp', description: 'Estimate straight-pipe friction with Darcy–Weisbach and Colebrook.', formula: 'Δp = f (L/D) ρv² / 2', guide: 'pipe-pressure-drop-worked-example', source: 'doe', defaults: { density: 998, velocity: 1, diameter: 50, viscosity: 1.002, length: 10, roughness: 0.045 }, fields: [['density', 'Density', 'kg/m³'], ['velocity', 'Mean velocity', 'm/s'], ['diameter', 'Internal diameter', 'mm'], ['viscosity', 'Dynamic viscosity', 'mPa·s'], ['length', 'Pipe length', 'm'], ['roughness', 'Absolute roughness', 'mm']], assumptions: 'Fully developed, steady, incompressible Newtonian flow in a full circular pipe. Straight-pipe friction only: fittings, elevation, entrance effects and equipment are excluded. Darcy friction factor, not Fanning. No estimate is given in the transition band or outside the stated model range.' },
  { id: 'conduction', title: 'Wall heat conduction', category: 'Heat transfer', symbol: 'Q̇', description: 'Calculate steady heat flow through a single flat material layer.', formula: 'Q̇ = kA (T₁ − T₂) / L', guide: 'wall-conduction-worked-example', source: 'heat', defaults: { conductivity: 0.04, area: 10, thickness: 100, hot: 30, cold: 10 }, fields: [['conductivity', 'Conductivity', 'W/(m·K)'], ['area', 'Area', 'm²'], ['thickness', 'Thickness', 'mm'], ['hot', 'Face 1 temperature', '°C'], ['cold', 'Face 2 temperature', '°C']], assumptions: 'One-dimensional steady conduction, constant conductivity and uniform face temperatures. One flat layer only, without internal heat generation, contact resistance, convection or radiation. Enter material surface temperatures, not surrounding air temperatures.' },
];

tools.push(...moreTools);
tools.push(...mechanicsTools);

function number(value, label, allowZero = false, temperature = false) {
  if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value))) throw new Error(`${label} must be a finite number.`);
  const n = Number(value);
  if (temperature ? n < -273.15 : allowZero ? n < 0 : n <= 0) throw new Error(temperature ? `${label} cannot be below absolute zero.` : `${label} must be ${allowZero ? 'zero or greater' : 'greater than zero'}.`);
  return n;
}
export function reynolds(input) {
  const rho = number(input.density, 'Density');
  const v = number(input.velocity, 'Velocity', true);
  const d = number(input.diameter, 'Diameter') / 1000;
  const mu = number(input.viscosity, 'Viscosity') / 1000;
  const re = rho * v * d / mu;
  if (!Number.isFinite(re)) throw new Error('These inputs exceed the numerical range. Check your units.');
  const regime = re === 0 ? 'Stationary' : re < 2000 ? 'Laminar' : re <= 4000 ? 'Transitional' : 'Turbulent';
  return { re, regime, rho, v, d, mu };
}
export function pressureDrop(input) {
  const flow = reynolds(input);
  const length = number(input.length, 'Length');
  const epsilon = number(input.roughness, 'Roughness', true) / 1000;
  const relative = epsilon / flow.d;
  if (relative > 0.05) throw new Error('Relative roughness must be at most 0.05 for this tool. Check diameter and roughness.');
  if (flow.regime === 'Transitional' || flow.re > 1e8) return { ...flow, friction: null, drop: null, head: null, relative, reason: flow.regime === 'Transitional' ? 'Transition flow: friction is uncertain. No pressure-drop estimate is reported.' : 'Re exceeds this tool’s 100 million model limit. No estimate is reported.' };
  if (flow.re === 0) return { ...flow, friction: null, drop: 0, head: 0, relative };
  let friction = 64 / flow.re;
  if (flow.regime === 'Turbulent') {
    let x = 7;
    for (let i = 0; i < 80; i++) {
      const next = -2 * Math.log10(relative / 3.7 + 2.51 * x / flow.re);
      if (Math.abs(next - x) < 1e-12) { x = next; break; }
      x = next;
    }
    friction = 1 / (x * x);
  }
  const drop = friction * (length / flow.d) * flow.rho * flow.v ** 2 / 2;
  const head = drop / (flow.rho * 9.80665);
  if (![friction, drop, head].every(Number.isFinite)) throw new Error('These inputs exceed the numerical range. Check your units.');
  return { ...flow, friction, drop, head, relative };
}
export function conduction(input) {
  const k = number(input.conductivity, 'Conductivity');
  const area = number(input.area, 'Area');
  const thickness = number(input.thickness, 'Thickness') / 1000;
  const hot = number(input.hot, 'Face 1 temperature', false, true);
  const cold = number(input.cold, 'Face 2 temperature', false, true);
  const delta = hot - cold;
  const resistance = thickness / (k * area);
  const heat = delta / resistance;
  if (![resistance, heat, heat / area].every(Number.isFinite) || resistance === 0) throw new Error('These inputs exceed the numerical range. Check your units.');
  return { heat, resistance, flux: heat / area, delta, direction: delta === 0 ? 'No net heat flow' : delta > 0 ? 'Face 1 → Face 2' : 'Face 2 → Face 1' };
}
export function calculate(id, input) {
  try { return { value: ({ reynolds, 'pressure-drop': pressureDrop, conduction, ...extraCalculators, ...mechanicsCalculators })[id](input), error: null }; }
  catch (error) { return { value: null, error: error.message }; }
}

export const guides = [
  { slug: 'understanding-reynolds-number', title: 'What does Reynolds number actually tell you?', category: 'Start here', minutes: 4, tool: 'reynolds', source: 'nasa', intro: 'A flow can look calm and still carry a large amount of fluid. Reynolds number helps you reason about its behaviour before choosing a pressure-loss model.', sections: [
    ['Build the ratio', 'Re = ρvD/μ compares inertial and viscous effects. Use mean pipe velocity, internal diameter and fluid properties at the operating temperature. Density is in kg/m³, velocity in m/s, diameter in m and dynamic viscosity in Pa·s. The units cancel.'],
    ['Work one example', 'Take a hypothetical liquid with density 1,000 kg/m³ and dynamic viscosity 0.001 Pa·s in a 20 mm pipe at 0.05 m/s. Re = 1,000 × 0.05 × 0.020 / 0.001 = 1,000. Increase velocity tenfold to 0.5 m/s and Re becomes 10,000, with everything else fixed. Try both cases in the calculator.'],
    ['Interpret the result carefully', 'This site uses below 2,000 as laminar, 2,000–4,000 inclusive as transition, and above 4,000 as turbulent for circular internal flow. The transition is sensitive to disturbances. These bands do not classify every external flow, open channel or non-Newtonian fluid.'],
    ['A useful self-check', 'Halve the diameter while holding velocity fixed: Reynolds number halves. Holding volume flow fixed is a different experiment because velocity changes too. Write down which quantity stays constant before comparing two designs.'],
  ] },
  { slug: 'pipe-pressure-drop-worked-example', title: 'Pipe pressure drop, one step at a time', category: 'Worked example', minutes: 5, tool: 'pressure-drop', source: 'doe', intro: 'Pressure loss is easier to understand when the geometry, flow and friction model are kept separate. Here is a reproducible calculation you can check by hand.', sections: [
    ['Set up a laminar case', 'Use a hypothetical fluid with density 1,000 kg/m³, viscosity 0.001 Pa·s and speed 0.1 m/s. The straight pipe is 10 m long with a 10 mm internal diameter. Reynolds number is 1,000, so the Darcy friction factor is 64/1,000 = 0.064.'],
    ['Substitute the numbers', 'Darcy–Weisbach gives Δp = f(L/D)ρv²/2. For this case, Δp = 0.064 × (10/0.010) × 1,000 × 0.1²/2 = 320 Pa. The equivalent head loss is 320/(1,000 × 9.80665) ≈ 0.03263 m. Set roughness to zero and reproduce this in the tool.'],
    ['Move into turbulent flow', 'For turbulent cases the tool solves the Colebrook relation: 1/√f = −2 log₁₀[ε/(3.7D) + 2.51/(Re√f)]. Both roughness and diameter must use the same length unit. It reports no estimate for transitional flow.'],
    ['Know what is missing', 'This is a straight-pipe friction result. A complete system calculation also needs fittings, equipment losses and elevation changes. Check the actual internal diameter: a nominal pipe size is not a measured bore.'],
  ] },
  { slug: 'dynamic-vs-kinematic-viscosity', title: 'Dynamic vs. kinematic viscosity: fix the units first', category: 'Fundamentals', minutes: 3, tool: 'reynolds', source: 'nasa', intro: 'Two numbers both called viscosity can describe different quantities. Mixing them silently changes a Reynolds-number calculation.', sections: [
    ['Read the property symbol', 'Dynamic viscosity μ uses Pa·s. Kinematic viscosity ν uses m²/s, with ν = μ/ρ. The calculator takes dynamic viscosity in mPa·s; multiply a value in Pa·s by 1,000 before entering it.'],
    ['Convert a hypothetical sample', 'Suppose μ = 0.002 Pa·s and ρ = 800 kg/m³. Then ν = 0.0000025 m²/s, or 2.5 mm²/s. Enter 2 mPa·s and 800 kg/m³ in the tool. Do not enter 2.5 into the dynamic-viscosity field.'],
    ['Check the temperature', 'A property value without a temperature is an incomplete input. Use a property source for the actual fluid and operating condition. The default inputs are a learning example, not a fluid-property database.'],
  ] },
  { slug: 'wall-conduction-worked-example', title: 'Heat through a wall: an 80 W worked example', category: 'Worked example', minutes: 4, tool: 'conduction', source: 'heat', intro: 'A simple slab model connects material choice, thickness and temperature difference. Its most useful lesson is what the boundary temperatures mean.', sections: [
    ['Define a fictional insulation panel', 'Let conductivity be 0.04 W/(m·K), area 10 m² and thickness 100 mm. Set one face to 30 °C and the other to 10 °C. These values describe a calculation exercise, not a specified commercial insulation product.'],
    ['Calculate the result', 'Convert thickness to 0.1 m. Q̇ = 0.04 × 10 × (30 − 10)/0.1 = 80 W. Heat flux is 80/10 = 8 W/m². Thermal resistance for the whole panel is 0.1/(0.04 × 10) = 0.25 K/W.'],
    ['Change one input', 'Double thickness to 200 mm while keeping all other inputs fixed. Heat flow falls to 40 W and resistance doubles. Double area instead and heat flow doubles, but heat flux remains unchanged. These comparisons are quick error checks.'],
    ['Use surface temperatures', 'Air on either side can have different temperatures from the wall faces. To start with air temperatures, add the appropriate convection resistances. This tool does not model those boundaries or a multi-layer wall.'],
  ] },
  { slug: 'heat-rate-vs-heat-flux', title: 'Watts or watts per square metre?', category: 'Fundamentals', minutes: 3, tool: 'conduction', source: 'heat', intro: 'A total heat rate and a heat flux answer different questions. Keeping the distinction clear makes comparisons between panels much easier.', sections: [
    ['Name the quantity', 'Heat rate Q̇ is energy transferred per unit time, in watts. Heat flux q″ is heat rate per area, in W/m². Neither is the temperature of the material.'],
    ['Compare two panels', 'For the exercise values k = 0.04 W/(m·K), L = 0.1 m and ΔT = 20 K, heat flux is 8 W/m². A 2 m² panel transfers 16 W; a 10 m² panel transfers 80 W. Increasing area increases total transfer without changing transfer per square metre.'],
    ['Distinguish rate from energy', 'If the 80 W rate stays constant for two hours, the transferred energy is 80 × 2 = 160 Wh, or 576 kJ. A changing boundary temperature requires a time-dependent model; do not assume the rate stays constant without checking.'],
  ] },
  { slug: 'engineering-calculation-checklist', title: 'Five checks before trusting a calculator', category: 'Practice', minutes: 3, tool: 'pressure-drop', source: 'doe', intro: 'A plausible number is not automatically a useful answer. A short calculation record makes your result easier to reproduce and question.', sections: [
    ['1. State the question', 'Write down what you need: straight-pipe friction, total system pressure, surface heat flow or something else. A correct answer to the wrong model can still mislead.'],
    ['2. Put units beside every input', 'Record the source and condition for each property. Distinguish internal from nominal diameter, mPa·s from Pa·s, and a material face temperature from ambient air temperature.'],
    ['3. Check the model limits', 'Identify the flow regime and excluded effects. For the pipe tool, the transition band deliberately has no pressure estimate. An omitted result is more informative than an unjustified precise number.'],
    ['4. Change one variable', 'Predict the direction of change first. If you double a laminar pipe length at fixed diameter and speed, straight-pipe pressure loss should double. If the result does something else, inspect the inputs.'],
    ['5. Save a reproducible record', 'Use the result download to keep inputs, units, model and output together. Compare important calculations with another method and obtain appropriate engineering review before using them in real equipment.'],
  ] },
];
guides.push(...moreGuides);
guides.push(...mechanicsGuides);
