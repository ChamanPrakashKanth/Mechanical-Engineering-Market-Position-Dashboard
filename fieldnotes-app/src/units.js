export const quantities={
  length:{title:'Length',units:{m:[1,0],mm:[.001,0],cm:[.01,0],in:[.0254,0],ft:[.3048,0]}},
  pressure:{title:'Pressure difference',units:{Pa:[1,0],kPa:[1000,0],MPa:[1e6,0],bar:[1e5,0],psi:[6894.757,0]}},
  energy:{title:'Energy',units:{J:[1,0],kJ:[1000,0],MJ:[1e6,0],Wh:[3600,0],kWh:[3600000,0]}},
  flow:{title:'Volume flow',units:{'m³/s':[1,0],'m³/h':[1/3600,0],'L/min':[1/60000,0],'L/s':[.001,0]}},
  temperature:{title:'Temperature',units:{'°C':[1,273.15],K:[1,0],'°F':[5/9,255.3722222222222]}},
};
export function convert(quantity,value,from,to){
  const units=quantities[quantity]?.units;
  if(!units||!Object.hasOwn(units,from)||!Object.hasOwn(units,to))throw new Error('Select compatible units.');
  if(value===''||value==null||!Number.isFinite(Number(value)))throw new Error('Enter a finite numeric value.');
  const [a,b]=units[from], [c,d]=units[to];
  const si=Number(value)*a+b;
  if(quantity==='temperature'&&si< -1e-10)throw new Error('Temperature cannot be below absolute zero.');
  const output=(si-d)/c;
  if(!Number.isFinite(output))throw new Error('Conversion exceeds the numeric range.');
  return quantity==='temperature'&&to==='K'&&output<0&&output> -1e-10?0:output;
}
