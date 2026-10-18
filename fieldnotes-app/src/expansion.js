export const moreSources = {
  pumps: { title: 'U.S. DOE · Improving pumping system performance', url: 'https://www.energy.gov/sites/default/files/2014/05/f16/pump.pdf' },
  capacity: { title: 'OpenStax · Heat and specific heat', url: 'https://openstax.org/books/physics/pages/11-2-heat-specific-heat-and-heat-transfer' },
};
export const moreTools = [
  {
    id: 'pipe-velocity', title: 'Pipe flow & velocity', category: 'Fluid mechanics', symbol: 'v̄',
    description: 'Turn volume flow and pipe bore into mean velocity and mass flow.',
    formula: 'v = Q / (πD²/4)', guide: 'pipe-velocity-from-flow-rate', source: 'doe',
    defaults: { flow: 60, diameter: 50, density: 1000 },
    fields: [['flow', 'Volume flow', 'L/min'], ['diameter', 'Internal diameter', 'mm'], ['density', 'Density', 'kg/m³']],
    metrics: [['Mean velocity', 'velocity', 'm/s'], ['Pipe area', 'area', 'm²'], ['Mass flow', 'massFlow', 'kg/s'], ['Volume flow', 'volumeFlow', 'm³/s']],
    assumptions: 'Full circular pipe, single fluid, uniform density. Velocity is a cross-sectional mean, not a local peak. Does not choose a safe pipe size, classify the regime or include compressibility. Use measured internal diameter rather than nominal size.',
  },
  {
    id: 'pump-power', title: 'Pump power', category: 'Fluid mechanics', symbol: 'P',
    description: 'Separate hydraulic power, shaft power and motor input at one duty point.',
    formula: 'Pₑ = ρgQH / (ηₚηₘ)', guide: 'pump-power-and-efficiency', source: 'pumps',
    defaults: { flow: 60, head: 20, density: 1000, pumpEfficiency: 70, motorEfficiency: 90 },
    fields: [['flow', 'Volume flow', 'L/min'], ['head', 'Total pump head', 'm'], ['density', 'Density', 'kg/m³'], ['pumpEfficiency', 'Pump efficiency', '%'], ['motorEfficiency', 'Motor efficiency', '%']],
    metrics: [['Electrical input', 'electrical', 'W'], ['Hydraulic power', 'hydraulic', 'W'], ['Shaft power', 'shaft', 'W'], ['Combined efficiency', 'combined', '%']],
    assumptions: 'Steady incompressible pumping at one specified duty point. Total head must already include system effects. Pump and motor efficiencies must each be greater than 0 and at most 100%. Uses g = 9.80665 m/s². Excludes drive losses, transients and motor-sizing margins. Zero duty power does not model real no-load electrical consumption.',
  },
  {
    id: 'sensible-heat', title: 'Sensible heating energy', category: 'Heat transfer', symbol: 'mcΔT',
    description: 'Estimate heating or cooling energy and ideal time at constant net power.',
    formula: 'E = mc (T₂ − T₁)', guide: 'sensible-heating-energy-example', source: 'capacity',
    defaults: { mass: 10, capacity: 4180, initial: 20, final: 60, power: 2000 },
    fields: [['mass', 'Mass', 'kg'], ['capacity', 'Specific heat capacity', 'J/(kg·K)'], ['initial', 'Initial temperature', '°C'], ['final', 'Final temperature', '°C'], ['power', 'Net heat transfer power', 'W']],
    metrics: [['Signed energy change', 'energyKj', 'kJ'], ['Energy magnitude', 'energyKwh', 'kWh'], ['Ideal duration', 'minutes', 'min'], ['Temperature change', 'delta', 'K']],
    assumptions: 'One lumped mass, constant specific heat, uniform temperature, no phase change or reaction. Power is the positive magnitude of constant net heat entering or leaving the mass, after losses. Direction follows temperature change. Duration is an ideal estimate, not a heater rating or a transient simulation.',
  },
];
function read(value, name, { zero = false, temperature = false } = {}) {
  if (value === '' || value == null || !Number.isFinite(Number(value))) throw new Error(`${name} must be a finite number.`);
  const n = Number(value);
  if (temperature ? n < -273.15 : zero ? n < 0 : n <= 0) throw new Error(temperature ? `${name} cannot be below absolute zero.` : `${name} must be ${zero ? 'zero or greater' : 'greater than zero'}.`);
  return n;
}
function finite(result) {
  if (Object.values(result).some(value => typeof value === 'number' && !Number.isFinite(value))) throw new Error('These inputs exceed the numerical range. Check your units.');
  return result;
}
export function pipeVelocity(input) {
  const flow = read(input.flow, 'Volume flow', { zero: true });
  const diameter = read(input.diameter, 'Internal diameter') / 1000;
  const density = read(input.density, 'Density');
  const area = Math.PI * diameter ** 2 / 4;
  if (area === 0) throw new Error('Diameter is too small for a stable calculation.');
  const volumeFlow = flow / 60000;
  return finite({ velocity: volumeFlow / area, area, volumeFlow, massFlow: density * volumeFlow });
}
export function pumpPower(input) {
  const flow = read(input.flow, 'Volume flow', { zero: true }) / 60000;
  const head = read(input.head, 'Total pump head', { zero: true });
  const density = read(input.density, 'Density');
  const pump = read(input.pumpEfficiency, 'Pump efficiency');
  const motor = read(input.motorEfficiency, 'Motor efficiency');
  if (pump > 100 || motor > 100) throw new Error('Pump and motor efficiencies cannot exceed 100%.');
  const hydraulic = density * 9.80665 * flow * head;
  const shaft = hydraulic / (pump / 100);
  return finite({ hydraulic, shaft, electrical: shaft / (motor / 100), combined: pump * motor / 100 });
}
export function sensibleHeat(input) {
  const mass = read(input.mass, 'Mass');
  const capacity = read(input.capacity, 'Specific heat capacity');
  const initial = read(input.initial, 'Initial temperature', { temperature: true });
  const final = read(input.final, 'Final temperature', { temperature: true });
  const power = read(input.power, 'Net heat transfer power');
  const delta = final - initial;
  const joules = mass * capacity * delta;
  return finite({ delta, energyKj: joules / 1000, energyKwh: Math.abs(joules) / 3600000, minutes: Math.abs(joules) / power / 60, direction: delta === 0 ? 'No temperature change' : delta > 0 ? 'Heating · energy added' : 'Cooling · energy removed' });
}
export const extraCalculators = { 'pipe-velocity': pipeVelocity, 'pump-power': pumpPower, 'sensible-heat': sensibleHeat };
export const moreGuides = [
  {
    slug: 'pipe-velocity-from-flow-rate', title: 'From litres per minute to pipe velocity', category: 'Worked example', minutes: 4, tool: 'pipe-velocity', source: 'doe',
    intro: 'A volume flow tells you how much passes through. The bore tells you how quickly it must move. Here is a conversion you can reproduce.',
    sections: [
      ['Start with the units', 'Set volume flow to 60 L/min and internal diameter to 50 mm. One litre is 0.001 m³, so volume flow is 0.001 m³/s. Diameter is 0.05 m. Area is π × 0.05² / 4 ≈ 0.0019635 m².'],
      ['Calculate mean speed', 'v = 0.001 / 0.0019635 ≈ 0.5093 m/s. At an assumed density of 1,000 kg/m³, mass flow is 1 kg/s. These are mean values, not a prediction of the detailed velocity profile.'],
      ['Compare a smaller bore', 'Pin the default result as a baseline, then halve diameter to 25 mm while keeping flow fixed. Area falls to one quarter and mean velocity rises fourfold to about 2.037 m/s. Holding speed fixed instead would reduce flow. The constraint changes the answer.'],
      ['Continue into friction', 'Use the calculated speed in the Reynolds tool, with suitable density and viscosity. Then explore straight-pipe loss. Actual pipe selection also requires pressure, noise, erosion and service-condition checks.'],
    ],
  },
  {
    slug: 'pump-power-and-efficiency', title: 'Why hydraulic power is not motor input', category: 'Worked example', minutes: 5, tool: 'pump-power', source: 'pumps',
    intro: 'Useful energy transferred to a fluid differs from electrical energy drawn by its motor. Separating these quantities avoids counting losses twice.',
    sections: [
      ['Define a fictional duty', 'Use flow 60 L/min, total head 20 m and density 1,000 kg/m³. Flow converts to 0.001 m³/s. At g = 9.80665 m/s², hydraulic power is 1,000 × 9.80665 × 0.001 × 20 = 196.133 W.'],
      ['Apply efficiencies once', 'Assume pump efficiency 70% and motor efficiency 90%. Shaft demand is 196.133/0.70 ≈ 280.19 W. Electrical input is 280.19/0.90 ≈ 311.32 W. Combined efficiency is 0.70 × 0.90 = 63%.'],
      ['Try a controlled comparison', 'Pin the result as a baseline, then change pump efficiency alone to 80%. Electrical input falls to about 272.41 W. This assumes the same duty point and motor efficiency; it is not a prediction for a replacement pump.'],
      ['Understand the boundary', 'Real equipment selection needs pump curves, suction conditions, operating range and suitable margins. Efficiencies depend on the duty point. This tool is an energy balance, not motor selection software.'],
    ],
  },
  {
    slug: 'sensible-heating-energy-example', title: 'Heating a mass: energy first, time second', category: 'Worked example', minutes: 4, tool: 'sensible-heat', source: 'capacity',
    intro: 'Energy and power are related but not interchangeable. Work out the energy change before asking how long a heater will need.',
    sections: [
      ['Define the exercise', 'Take a uniform 10 kg mass with constant specific heat 4,180 J/(kg·K), initially at 20 °C and finally at 60 °C. These are exercise inputs; use actual material data for other cases. Temperature difference is 40 K.'],
      ['Calculate energy', 'E = mcΔT = 10 × 4,180 × 40 = 1,672,000 J, or 1,672 kJ. Divide by 3,600,000 to get approximately 0.46444 kWh. Kilowatt-hours describe energy rather than power.'],
      ['Calculate ideal duration', 'At constant net heat input 2,000 W, time is 1,672,000/2,000 = 836 seconds, about 13.93 minutes. A nameplate electrical rating needs efficiency and heat-loss corrections before being used as net heat input.'],
      ['Reverse the process', 'Swap initial and final temperatures. Signed energy becomes −1,672 kJ, indicating removal. Duration stays positive for cooling at the entered net removal power. Phase change, boiling and temperature-dependent properties require a different model.'],
    ],
  },
];
