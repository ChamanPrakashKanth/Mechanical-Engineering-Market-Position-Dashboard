"""Generate industrial, AI and supply-chain evidence pages from reviewed sources."""
import json
import re
import runpy
from html import escape as esc
from intelligence_common import ROOT,BASE,DATE,metadata,shell,source_html,latest,country_record,capability_pages,href

industrial=json.loads((ROOT/'industrial/reviewed-records.json').read_text(encoding='utf-8'))
(ROOT/'industrial/data.json').write_text(json.dumps(industrial,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
industrial_paths,directory=capability_pages(industrial,'industrial')
static=[]
for cap in industrial['capabilities']:
    static.append('<section><h3>'+esc(cap['name'])+'</h3><p>'+esc(cap['definition'])+'</p>')
    static.extend(country_record(industrial,c,cap,'industrial/index.html').replace('<h3>'+esc(c['name'])+'</h3>','<h4>'+esc(c['name'])+'</h4>') for c in industrial['countries'])
    static.append('</section>')
template=(ROOT/'industrial/template.html').read_text(encoding='utf-8')
template=template.replace('<!-- STATIC_RECORDS -->',directory+'<details><summary>Read all 69 country-capability records and citations</summary>'+''.join(static)+'</details>')
template=template.replace('<!-- SEO_METADATA -->',metadata('Industrial Capability Control Room | MechIntel','Manufacturing evidence across 23 definitions in India, China and the US, with scoped quantities, publication dates, source citations and recorded history.','industrial/index.html',[('Home',''),('Industrial intelligence','industrial/')],'industrial/data.json'))
(ROOT/'industrial/index.html').write_text(template,encoding='utf-8')
runpy.run_path(str(ROOT/'scripts/generate-ai-intelligence.py'),run_name='__main__')

data=json.loads((ROOT/'supply-chain-intelligence/reviewed-chains.json').read_text(encoding='utf-8'))
data['industrialAssessmentAsOf']=industrial['asOf']
(ROOT/'supply-chain-intelligence/data.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
sources={s['id']:s for s in data['sources']}
chains=data['chains']
paths=[]

def chain_content(chain,path):
    body='<p class="intro">'+esc(chain['summary'])+'</p><h2>Process map and evidence boundaries</h2><p>Arrows below are an editorial engineering model informed by the cited sources. They are not verified commercial supplier contracts, a complete bill of materials or evidence of exclusive dependency.</p><div class="chain-flow">'
    body+=' → '.join('<a href="'+href(path,'industrial/capabilities/'+n['capability']+'.html')+'">'+esc(n['name'])+'</a>' if n.get('capability') else '<span>'+esc(n['name'])+' · country record not covered</span>' for n in chain['nodes'])+'</div>'
    body+='<p>The ordered display is a reading aid; the directed relationships used by the sandbox are listed below. Parallel inputs are not a serial production sequence.</p><ul>'
    names={n['id']:n['name'] for n in chain['nodes']}
    body+=''.join('<li>'+esc(names[e['fromNode']]+' → '+names[e['toNode']])+' — '+esc(e['basis'])+'</li>' for e in chain['edges'])+'</ul>'
    body+='<h2>'+esc(chain['question'])+'</h2><p>'+esc(chain['answer'])+'</p><h2>Country manufacturing evidence</h2><p>These records come from the industrial assessment baseline '+industrial['asOf']+'. Manufacturing in a country does not establish local ownership or upstream independence. Source metadata was corrected '+DATE+'.</p>'
    for node in chain['nodes']:
        if not node.get('capability'):continue
        cap=next(c for c in industrial['capabilities'] if c['id']==node['capability'])
        body+='<h3>'+esc(cap['name'])+'</h3><div class="comparison"><table><thead><tr><th>Country</th><th>Entered record</th><th>Measure and scope</th></tr></thead><tbody>'
        for country in industrial['countries']:
            event=latest(industrial,country['id'],cap['id'])
            desc=(event.get('stageRationale') or event.get('milestone')) if event else 'No qualifying record entered; not verified absent.'
            body+='<tr><th scope="row">'+esc(country['name'])+'</th><td><a href="'+href(path,'industrial/capabilities/'+cap['id']+'.html')+'#'+country['id']+'-'+cap['id']+'">'+esc(desc)+'</a></td><td>'+esc((event.get('capacity') or event.get('industrialScale') or 'Quantity not established') if event else 'Unassessed')+'</td></tr>'
        body+='</tbody></table></div>'
    body+='<h2>Source context and dates</h2>'+''.join('<p>'+source_html(sources[id])+'</p><p>'+esc(sources[id]['summary'])+'</p>' for id in chain['sourceIds'])
    body+='<h2>What remains unassessed?</h2><ul>'+''.join('<li>'+esc(x)+'</li>' for x in chain['unknowns'])+'</ul><p>No inventory, trade exposure, national output loss or recovery duration is estimated. A missing capability record never breaks a model dependency or proves resilience.</p>'
    return body

directory='<ul>'
for chain in chains:
    path='supply-chain-intelligence/chains/'+chain['id']+'.html'
    body='<h1>'+esc(chain['name'])+'</h1>'+chain_content(chain,path)+'<p><a href="../?chain='+chain['id']+'#workspace">Explore this chain in the sandbox</a> · <a href="'+href(path,'ai-intelligence/')+'">Related AI capability evidence</a></p>'
    title=chain['name']+' — process map and country evidence | MechIntel'
    target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(shell(title,chain['summary'],path,body,[('Home',''),('Supply-chain intelligence','supply-chain-intelligence/'),(chain['name'],path)]),encoding='utf-8')
    directory+='<li><a href="chains/'+chain['id']+'.html">'+esc(chain['name'])+'</a> — '+esc(chain['summary'])+'</li>'
    paths.append(path)
directory+='</ul>'
intro='<h1>Supply-chain intelligence</h1><p class="intro">Explore eight manufacturing process models alongside source-linked industrial evidence for India, China and the United States.</p><p>Free access · Curated '+DATE+' · Industrial assessment baseline '+industrial['asOf']+' · No live trade or inventory feed</p><div class="assessment-note"><h2>What this intelligence can establish</h2><p>Manufacturing evidence, technical process relationships and unassessed supplier exposure are separate layers. Company names do not establish buyer-supplier contracts. Source publication and access dates remain separate.</p></div>'
workspace='''<section id="workspace"><h2>Dependency workspace</h2><p>Choose a chain, country evidence overlay and input disruption. This structural scenario does not change the manufacturing evidence.</p><div class="controls"><label>Supply chain<select id="chain"></select></label><label>Country overlay<select id="country"><option value="IN">India</option><option value="CN">China</option><option value="US">United States</option></select></label><label>Disrupt input<select id="disrupt"><option value="">No disruption</option></select></label><label><input id="substitute" type="checkbox">Assume immediate complete substitution for disrupted node</label><button id="reset">Reset</button><button id="share">Copy scenario URL</button><button id="export">Export scenario JSON</button></div><p id="status" role="status">Interactive data loading. Static chain pages and citations below work without JavaScript.</p><div id="graph" class="graph"></div><div id="chain-detail"></div></section>'''
body=intro+workspace+'<section><h2>Supply-chain maps and direct answers</h2>'+directory+'</section><section><h2>How does a dependency scenario differ from a risk forecast?</h2><p>The scenario follows the model\'s directed edges. Exposure is conditional on assumed input use and disruption; it is not a probability, output-loss estimate or statement that a country lacks substitutes. Unknown evidence is never interpreted as resilience.</p><h2>Does local production mean supply-chain independence?</h2><p>No. The origin of inputs, equipment, qualification and supplier contracts requires separate evidence. Nameplate capacity, installed capacity and actual output are different measures.</p><h2>Can these records identify a live shortage?</h2><p>No. Reports describe their cited periods. Current shortage, price and lead-time claims require fresh product-specific sources.</p></section>'
for chain in chains:
    body+='<details><summary>'+esc(chain['name'])+' — read process context without JavaScript</summary>'+chain_content(chain,'supply-chain-intelligence/index.html')+'</details>'
html=shell('Supply-chain Intelligence — India, China and US Evidence | MechIntel','Explore eight manufacturing supply chains with process maps, country evidence, dated sources, unknown dependencies and browser-local disruption scenarios.','supply-chain-intelligence/index.html',body,[('Home',''),('Supply-chain intelligence','supply-chain-intelligence/')],'supply-chain-intelligence/data.json')
html=html.replace('</head>','<script defer src="../industrial/core.js?v=20261107-industrial"></script><script defer src="app.js?v=20261107"></script></head>')
(ROOT/'supply-chain-intelligence/index.html').write_text(html,encoding='utf-8')
(ROOT/'supply-chain-intelligence/page-manifest.json').write_text(json.dumps(paths,indent=2)+'\n',encoding='utf-8')
allpaths=['industrial/','ai-intelligence/','supply-chain-intelligence/']+industrial_paths+json.loads((ROOT/'ai-intelligence/page-manifest.json').read_text(encoding='utf-8'))+paths
(ROOT/'intelligence-pages.json').write_text(json.dumps(allpaths,indent=2)+'\n',encoding='utf-8')

def update_sitemap(text):
    for path in allpaths:
        url=BASE+path
        text=re.sub(r'\s*<url>\s*<loc>'+re.escape(url)+r'</loc>.*?</url>','',text,flags=re.S)
    entries='\n'.join('<url><loc>'+BASE+p+'</loc><lastmod>'+DATE+'</lastmod></url>' for p in allpaths)
    return text.replace('</urlset>',entries+'\n</urlset>')
sitemap=ROOT/'sitemap.xml';sitemap.write_text(update_sitemap(sitemap.read_text(encoding='utf-8')),encoding='utf-8')
print('Generated industrial evidence, eight supply chains and',len(allpaths),'intelligence sitemap URLs')
