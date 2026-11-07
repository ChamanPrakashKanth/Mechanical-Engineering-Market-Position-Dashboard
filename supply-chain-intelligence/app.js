"use strict";
(async function () {
    const $=id=>document.getElementById(id);
    const esc=value=>String(value ?? "Unassessed").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    let data,industrial;
    try {
        [data,industrial]=await Promise.all(["data.json?v=20261107","../industrial/data.json?v=20261107-industrial"].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error("Evidence unavailable");return r.json();}));
        window.IndustrialCore.validate(industrial);
    } catch(error) {$("status").textContent="Interactive evidence unavailable. Read the static chain pages below. "+error.message;return;}
    const core=window.IndustrialCore;
    const params=new URLSearchParams(location.search);
    $("chain").innerHTML=data.chains.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join("");
    $("chain").value=data.chains.some(c=>c.id===params.get("chain")) ? params.get("chain") : data.chains[0].id;
    if(industrial.countries.some(c=>c.id===params.get("country")))$("country").value=params.get("country");
    $("substitute").checked=params.get("substitute")==="1";
    let requested=params.get("disrupt") || "";
    function chain(){return data.chains.find(c=>c.id===$("chain").value);}
    function assessment(node){return node.capability ? core.assessment(industrial,$("country").value,node.capability,industrial.asOf) : null;}
    function exposed(){return core.propagate(chain().edges.map(e=>({from:e.fromNode,to:e.toNode})),$("disrupt").value ? [$("disrupt").value] : [],$("substitute").checked ? [$("disrupt").value] : []);}
    function render(change=false){
        const c=chain();
        if(change){
            $("disrupt").innerHTML='<option value="">No disruption</option>'+c.nodes.map(n=>'<option value="'+n.id+'">'+esc(n.name)+'</option>').join("");
            $("disrupt").value=c.nodes.some(n=>n.id===requested) ? requested : "";requested="";
        }
        const country=industrial.countries.find(c=>c.id===$("country").value);
        const affected=exposed();
        $("status").textContent=c.name+" · "+country.name+" manufacturing-evidence overlay · "+affected.length+" structurally exposed nodes. Unknown evidence does not stop propagation. No national loss or recovery time is estimated.";
        $("graph").innerHTML=c.nodes.map(n=>{
            const a=assessment(n);
            const label=!a ? "Country evidence not covered in this dataset" : !a.stage ? "No qualifying record entered; not verified absent" : "Stage "+a.stage+" · source-reported manufacturing scope";
            return '<span class="node '+(affected.includes(n.id)?"affected":"")+'">'+esc(n.name)+'<br><small>'+esc(label)+'</small><br><small>'+esc(a?.capacity || a?.industrialScale || "Quantity and supplier exposure unassessed")+'</small><br><small>'+esc(!a?.stage ? "No supporting country publication entered" : a?.publicationUnknown ? "Publication date unknown; freshness undetermined" : a?.stale ? "Publication over 180 days old" : "Read the dated source record")+'</small><br>'+(n.capability ? '<a href="../industrial/capabilities/'+n.capability+'.html#'+country.id+'-'+n.capability+'">Country sources and scope</a>' : "")+'</span>';
        }).join("")+'<p>'+c.edges.map(e=>esc(c.nodes.find(n=>n.id===e.fromNode).name+" → "+c.nodes.find(n=>n.id===e.toNode).name)).join("<br>")+'</p>';
        $("chain-detail").innerHTML='<h3>'+esc(c.question)+'</h3><p>'+esc(c.answer)+'</p><p><a href="chains/'+c.id+'.html">Read '+esc(c.name)+' — complete static process map, sources and country evidence</a></p><h3>Unassessed exposure</h3><ul>'+c.unknowns.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><h3>Context sources</h3><ul>'+c.sourceIds.map(id=>{const s=data.sources.find(s=>s.id===id);return '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a> · Publication '+esc(s.published || "date not recorded")+' · Accessed '+esc(s.accessedOn)+'</li>';}).join("")+'</ul>';
    }
    $("chain").onchange=()=>{requested="";render(true);};
    for(const id of ["country","disrupt","substitute"])$(id).onchange=()=>render();
    $("reset").onclick=()=>{$("disrupt").value="";$("substitute").checked=false;render();};
    $("share").onclick=async()=>{
        const url=new URL(location.href);url.search="";url.hash="workspace";
        for(const id of ["chain","country","disrupt"])if($(id).value)url.searchParams.set(id,$(id).value);
        if($("substitute").checked)url.searchParams.set("substitute","1");
        try{await navigator.clipboard.writeText(url.href);$("status").textContent="Scenario URL copied.";}catch{$("status").textContent="Copy this scenario URL: "+url.href;}
    };
    $("export").onclick=()=>{
        const c=chain();
        const records=c.nodes.filter(n=>n.capability).map(n=>({node:n.id,assessment:assessment(n)}));
        const ids=new Set(records.map(r=>r.assessment.source));
        const payload={curatedOn:data.asOf,industrialAssessmentAsOf:industrial.asOf,chain:c,country:$("country").value,scenario:{disrupted:$("disrupt").value || null,assumeImmediateCompleteSubstitution:$("substitute").checked,structurallyExposed:exposed(),scope:"Illustrative process exposure; not verified transactions, national losses or recovery forecasts"},records,evidence:industrial.evidence.filter(s=>ids.has(s.id)),contextSources:data.sources.filter(s=>c.sourceIds.includes(s.id))};
        const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="supply-chain-"+c.id+"-"+$("country").value+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    render(true);
})();
