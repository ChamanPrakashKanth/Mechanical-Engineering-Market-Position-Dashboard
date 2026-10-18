export const mechanicsSources = {
  elasticity: { title: 'OpenStax · Stress, strain and elastic modulus', url: 'https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus' },
  expansion: { title: 'OpenStax · Thermal expansion', url: 'https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion' },
};
export const mechanicsTools = [
  { id:'axial-stress',title:'Axial stress & extension',category:'Solid mechanics',symbol:'σ',description:'Explore nominal stress, elastic strain and extension of a uniform bar.',formula:'σ = F/A · δ = FL/(AE)',guide:'axial-stress-worked-example',source:'elasticity',defaults:{force:10,area:100,length:1000,modulus:200},fields:[['force','Axial force','kN'],['area','Cross-sectional area','mm²'],['length','Original length','mm'],['modulus','Young’s modulus','GPa']],metrics:[['Nominal axial stress','stress','MPa'],['Elastic strain','strain',''],['Length change','extension','mm']],assumptions:'Uniform prismatic bar, centric axial load, small deformation and linear elastic material. Positive force is tension; negative is compression. Does not check yield, buckling, stress concentrations, fatigue or connection strength. Supply a valid elastic modulus; no material strength is assumed.' },
  { id:'thermal-expansion',title:'Linear thermal expansion',category:'Heat transfer',symbol:'αLΔT',description:'Estimate free expansion or contraction of an unrestrained member.',formula:'ΔL = αL₀(T₂ − T₁)',guide:'thermal-expansion-worked-example',source:'expansion',defaults:{length:1000,coefficient:12,initial:20,final:80},fields:[['length','Original length','mm'],['coefficient','Expansion coefficient','µm/(m·K)'],['initial','Initial temperature','°C'],['final','Final temperature','°C']],metrics:[['Length change','change','mm'],['Final length','finalLength','mm'],['Thermal strain','strain',''],['Temperature change','delta','K']],assumptions:'Free, unrestrained linear expansion with constant coefficient over a moderate temperature interval. The coefficient is entered in microstrain per kelvin. Not a restrained thermal-stress model. This educational approximation is limited to absolute thermal strain ≤ 1%; nonlinear and temperature-dependent behaviour needs another model.' },
];
function n(value,label,{signed=false,temperature=false,zero=false}={}){
  if(value===''||value==null||!Number.isFinite(Number(value)))throw new Error(`${label} must be a finite number.`);
  const result=Number(value);
  if(temperature&&result< -273.15)throw new Error(`${label} cannot be below absolute zero.`);
  if(!signed&&!temperature&&(zero?result<0:result<=0))throw new Error(`${label} must be ${zero?'zero or greater':'greater than zero'}.`);
  return result;
}
function checked(result){if(Object.values(result).some(v=>typeof v==='number'&&!Number.isFinite(v)))throw new Error('These inputs exceed the numerical range. Check your units.');return result;}
export function axialStress(input){
  const force=n(input.force,'Axial force',{signed:true})*1000;
  const area=n(input.area,'Area');
  const length=n(input.length,'Length');
  const modulus=n(input.modulus,'Young’s modulus')*1000;
  if(!Number.isFinite(modulus))throw new Error('Modulus exceeds the numeric range. Check the GPa units.');
  const stress=force/area;
  const strain=stress/modulus;
  if(Math.abs(strain)>.01)throw new Error('Strain exceeds this tool’s 1% small-strain limit. Check the elastic range and units.');
  return checked({stress,strain,extension:strain*length,direction:force===0?'No axial load':force>0?'Tension · extension':'Compression · shortening'});
}
export function thermalExpansion(input){
  const length=n(input.length,'Length');
  const coefficient=n(input.coefficient,'Expansion coefficient',{signed:true})*1e-6;
  const initial=n(input.initial,'Initial temperature',{temperature:true});
  const final=n(input.final,'Final temperature',{temperature:true});
  const delta=final-initial;
  const strain=coefficient*delta;
  if(Math.abs(strain)>.01)throw new Error('Thermal strain exceeds this tool’s 1% approximation limit. Use a temperature-dependent model.');
  const change=length*strain;
  return checked({change,finalLength:length+change,strain,delta,direction:change===0?'No length change':change>0?'Free expansion':'Free contraction'});
}
export const mechanicsCalculators={'axial-stress':axialStress,'thermal-expansion':thermalExpansion};
export const mechanicsGuides=[
  {slug:'axial-stress-worked-example',title:'A bar in tension: stress is not a strength rating',category:'Worked example',minutes:4,tool:'axial-stress',source:'elasticity',intro:'A simple bar model gives a useful estimate of deformation. It cannot establish whether the material or assembly is safe.',sections:[
    ['Set up a calculation exercise','Take a 1,000 mm long bar with area 100 mm², Young’s modulus 200 GPa and a centric tensile load of 10 kN. These are hypothetical inputs, not certified properties of a particular material. Convert force to 10,000 N and modulus to 200,000 MPa.'],
    ['Calculate nominal stress and extension','Stress is 10,000/100 = 100 MPa. Strain is 100/200,000 = 0.0005. Extension is 0.0005 × 1,000 = 0.5 mm. Since 1 MPa is 1 N/mm², the millimetre form is dimensionally consistent.'],
    ['Compare the geometry','Pin the default case, then double area to 200 mm². At the same load, both stress and extension halve. Doubling length instead doubles extension without changing stress. A negative load reverses the sign, but does not add a buckling check.'],
    ['Check what the model excludes','Real design needs material strength, load paths, stress concentrations, connections and appropriate load cases. The tool’s 1% strain bound is an approximation limit, not a yield criterion. Linear elasticity may cease to apply at much smaller strain for a given material.'],
  ]},
  {slug:'thermal-expansion-worked-example',title:'Thermal expansion: leave room for movement',category:'Worked example',minutes:4,tool:'thermal-expansion',source:'expansion',intro:'A free bar changes length when its temperature changes. A restrained bar is a different problem because its surroundings can create stress.',sections:[
    ['Define the example','Use original length 1,000 mm and an assumed constant linear expansion coefficient of 12 µm/(m·K). Raise temperature from 20 °C to 80 °C. The temperature difference is 60 K and the coefficient is 12 × 10⁻⁶/K.'],
    ['Find the movement','Thermal strain is 12 × 10⁻⁶ × 60 = 0.00072. Multiply by the original length to obtain 0.72 mm of expansion. Final length is 1,000.72 mm. Doubling the original length doubles the movement under the same temperature change.'],
    ['Try contraction','Set the final temperature to −20 °C while keeping the initial temperature at 20 °C. The difference becomes −40 K and length change is −0.48 mm. The tool also accepts negative coefficients for materials that contract when heated.'],
    ['Respect the assumptions','Use a coefficient suitable for the material and temperature interval. A uniform temperature and constant coefficient are simplifications. Restraints, thermal gradients, material phase changes and assembly clearances require additional analysis.'],
  ]},
];
