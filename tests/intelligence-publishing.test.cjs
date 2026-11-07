"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const core=require("../industrial/core.js");
const industrial=require("../industrial/data.json");
const supply=require("../supply-chain-intelligence/data.json");
const root=path.resolve(__dirname,"..");

test("industrial undated sources cannot look fresh and original history is retained",()=>{
    assert.equal(core.validate(industrial),true);
    assert.equal(industrial.events.length,68);
    const unknown=industrial.evidence.filter(s=>s.publishedUnknown);
    assert.equal(unknown.length,44);
    for(const source of unknown)assert.equal(source.published,null);
    const event=industrial.events.find(e=>unknown.some(s=>s.id===e.source));
    assert.equal(core.assessment(industrial,event.country,event.capability,industrial.asOf).publicationUnknown,true);
    assert.equal(core.assessment(industrial,"IN","osat","2026-07-03").stage,2);
    assert.equal(core.assessment(industrial,"IN","osat","2026-07-04").stage,3);
});

test("all intelligence URLs have static answers, unique canonicals and matching structured data",()=>{
    const paths=require("../intelligence-pages.json");
    assert.equal(paths.length,70);
    const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
    const titles=new Set();
    for(const target of paths){
        const file=target.endsWith("/")?target+"index.html":target;
        const html=fs.readFileSync(path.join(root,file),"utf8");
        const title=html.match(/<title>(.*?)<\/title>/s)[1];
        assert.ok(!titles.has(title),"Duplicate title: "+title);titles.add(title);
        const canonical="https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/"+target;
        assert.ok(html.includes('rel="canonical" href="'+canonical+'"'));
        assert.ok(sitemap.includes("<loc>"+canonical+"</loc>"));
        const script=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
        assert.ok(script,"Missing structured data: "+target);
        const graph=JSON.parse(script[1])["@graph"];
        assert.ok(graph.some(n=>n["@type"]==="BreadcrumbList"));
        assert.equal(graph.find(n=>n["@type"]==="WebPage").url,canonical);
        assert.match(html,/<h1>/);
        assert.match(html,/source|Source/);
        if(target.includes("/capabilities/")){
            assert.match(html,/id="IN-/);assert.match(html,/id="CN-/);assert.match(html,/id="US-/);
        }
    }
});

test("chain models have valid endpoints and contextual sources rather than invented transactions",()=>{
    assert.equal(supply.chains.length,8);
    const sources=new Set(supply.sources.map(s=>s.id));
    for(const chain of supply.chains){
        const nodes=new Set(chain.nodes.map(n=>n.id));
        for(const edge of chain.edges){
            assert.ok(nodes.has(edge.fromNode)&&nodes.has(edge.toNode));
            assert.match(edge.basis,/not a verified commercial supply contract/);
            assert.ok(edge.sourceIds.every(id=>sources.has(id)));
        }
        assert.ok(chain.unknowns.some(x=>/recovery/.test(x)));
        assert.ok(chain.sourceIds.every(id=>sources.has(id)));
    }
    const solar=supply.chains.find(c=>c.id==="solar");
    assert.ok(!solar.nodes.some(n=>n.capability==="cells"),"Do not confuse PV cells with battery cells");
});

async function app(search=""){
    const nodes=new Map();const initial={country:"IN"};let blob,shared;
    const el=id=>{if(!nodes.has(id))nodes.set(id,{value:initial[id]||"",checked:false,innerHTML:"",textContent:""});return nodes.get(id);};
    class FakeURL extends URL{static createObjectURL(value){blob=value;return "blob:test";}static revokeObjectURL(){}}
    const context={window:{IndustrialCore:core},document:{getElementById:el,createElement:()=>({click(){}})},fetch:async url=>({ok:true,json:async()=>structuredClone(url.startsWith("../")?industrial:supply)}),URL:FakeURL,URLSearchParams,Blob,Set,Date,location:{search,href:"https://example.test/supply-chain-intelligence/"+search},navigator:{clipboard:{writeText:async value=>{shared=value;}}},setTimeout:fn=>fn()};
    await vm.runInNewContext(fs.readFileSync(path.join(root,"supply-chain-intelligence/app.js"),"utf8"),context);
    return {el,blob:()=>blob,shared:()=>shared};
}

test("supply-chain scenarios preserve unknown exposure and exports contain evidence provenance",async()=>{
    const ui=await app("?chain=semiconductors&country=IN&disrupt=lithography");
    assert.match(ui.el("status").textContent,/4 structurally exposed nodes/);
    assert.match(ui.el("graph").innerHTML,/No qualifying record entered/);
    ui.el("country").value="US";ui.el("country").onchange();
    assert.match(ui.el("status").textContent,/4 structurally exposed nodes/);
    ui.el("export").onclick();
    const payload=JSON.parse(await ui.blob().text());
    assert.ok(payload.evidence.some(s=>s.publishedUnknown && s.published===null));
    assert.equal(payload.scenario.structurallyExposed.length,4);
    ui.el("substitute").checked=true;ui.el("substitute").onchange();
    assert.match(ui.el("status").textContent,/0 structurally exposed nodes/);
    await ui.el("share").onclick();
    assert.equal(new URL(ui.shared()).searchParams.get("chain"),"semiconductors");
    assert.equal(new URL(ui.shared()).searchParams.get("substitute"),"1");
});
