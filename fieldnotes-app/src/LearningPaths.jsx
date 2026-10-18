import { ArrowRight } from 'lucide-react';
const base=import.meta.env.BASE_URL;
const paths=[
  { title:'Follow the load', description:'Distinguish mechanical deformation from free thermal movement.', steps:[['axial-stress','Load a uniform bar'],['thermal-expansion','Explore thermal movement']] },
  { title:'Follow the fluid', description:'From flow rate to velocity, flow regime, friction and power.', steps:[['pipe-velocity','Find mean velocity'],['reynolds','Classify the flow'],['pressure-drop','Estimate pipe friction'],['pump-power','Explore pump power']] },
  { title:'Follow the heat', description:'Separate heat rate, total energy and ideal heating time.', steps:[['conduction','Heat through a wall'],['sensible-heat','Energy to heat a mass']] },
];
export default function LearningPaths(){return <section className="section learning-paths"><div className="section-heading"><div><span className="eyebrow">03 / CONNECT THE IDEAS</span><h2>One calculation leads to another.</h2></div><a className="text-link" href={`${base}reference.html`}>Open the formula sheet <ArrowRight size={16}/></a></div><div className="path-grid">{paths.map(path=><article className="path-card" key={path.title}><h3>{path.title}</h3><p>{path.description}</p><ol>{path.steps.map(([id,title])=><li key={id}><a href={`${base}tools/${id}.html`}>{title}<ArrowRight size={15}/></a></li>)}</ol></article>)}</div></section>;}
