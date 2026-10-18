const format = n => new Intl.NumberFormat('en', { maximumSignificantDigits: 5 }).format(n);
export default function Comparison({ baseline, current }) {
  const metrics = current.filter(([,value]) => typeof value === 'number' && Number.isFinite(value));
  return <section className="comparison"><div className="panel-heading"><div><span className="eyebrow">WHAT IF?</span><h2>Baseline vs. current</h2></div><span className="comparison-legend"><i/> Baseline <i/> Current</span></div><p>Change one input to explore its effect. Bars show magnitudes; values retain their signs.</p><div className="comparison-grid">{metrics.map(([label,value,unit])=>{
    const before=baseline.metrics.find(([name])=>name===label)?.[1];
    if(typeof before!=='number') return null;
    const max=Math.max(Math.abs(before),Math.abs(value));
    const delta=value-before;
    const relative=before!==0?delta/Math.abs(before)*100:null;
    return <div className="comparison-metric" key={label}><h3>{label}</h3><div className="comparison-values"><span>{format(before)} {unit}</span><strong>{format(value)} {unit}</strong></div><div className="bar-track"><span style={{width:`${max?Math.abs(before)/max*100:0}%`}}/></div><div className="bar-track current"><span style={{width:`${max?Math.abs(value)/max*100:0}%`}}/></div><small>Change: {delta>0?'+':''}{format(delta)} {unit==='%'?'percentage points':unit}{relative!==null&&Number.isFinite(relative)?` (${relative>0?'+':''}${format(relative)}%)`:''}</small></div>;
  })}</div><details><summary>View baseline inputs</summary><dl className="baseline-inputs">{baseline.fields.map(([key,label,unit])=><div key={key}><dt>{label}</dt><dd>{baseline.inputs[key]} {unit}</dd></div>)}</dl></details><p className="input-hint">Baseline stays in this page’s memory and is cleared on reload. Download your result to keep a copy.</p></section>;
}
