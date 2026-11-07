"""Shared static intelligence pages, citations and search metadata (standard library)."""
import json
import posixpath
from html import escape as esc
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE='https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/'
DATE='2026-11-07'

def href(current,target):
    result=posixpath.relpath(target or '.',posixpath.dirname(current) or '.')
    return result+'/' if target.endswith('/') and not result.endswith('/') else result

def canonical(path):
    return BASE+(path[:-10] if path.endswith('index.html') else path)

def metadata(title,description,path,crumbs,data=None):
    url=canonical(path)
    graph=[{'@type':'WebPage','@id':url+'#page','url':url,'name':title,'description':description,'inLanguage':'en','isAccessibleForFree':True,'dateModified':DATE,'publisher':{'@type':'Organization','name':'MechIntel','url':BASE}},
        {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':name,'item':BASE+target} for i,(name,target) in enumerate(crumbs)]}]
    if data:
        graph.append({'@type':'Dataset','@id':url+'#dataset','name':title+' evidence dataset','description':description,'url':url,'creator':{'@type':'Organization','name':'MechIntel','url':BASE},'isAccessibleForFree':True,'dateModified':DATE,'distribution':{'@type':'DataDownload','encodingFormat':'application/json','contentUrl':BASE+data},'spatialCoverage':[{'@type':'Country','name':n} for n in ['India','China','United States']]})
    structured=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('</','<\\/')
    return '\n'.join(['<meta name="robots" content="index,follow,max-image-preview:large">','<meta property="og:type" content="website">','<meta property="og:title" content="'+esc(title,quote=True)+'">','<meta property="og:description" content="'+esc(description,quote=True)+'">','<meta property="og:url" content="'+url+'">','<meta property="og:image" content="'+BASE+'assets/mechintel-social-cover.png">','<meta name="twitter:card" content="summary_large_image">','<meta name="twitter:title" content="'+esc(title,quote=True)+'">','<meta name="twitter:description" content="'+esc(description,quote=True)+'">','<meta name="twitter:image" content="'+BASE+'assets/mechintel-social-cover.png">','<script type="application/ld+json">'+structured+'</script>'])

def shell(title,description,path,body,crumbs,data=None):
    nav=' · '.join('<a href="'+href(path,target)+'">'+label+'</a>' for label,target in [('MechIntel',''),('Industrial','industrial/'),('AI intelligence','ai-intelligence/'),('Supply chains','supply-chain-intelligence/')])
    trail=' → '.join('<a href="'+href(path,target)+'">'+esc(name)+'</a>' for name,target in crumbs)
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description,quote=True)+'"><link rel="canonical" href="'+canonical(path)+'"><link rel="stylesheet" href="'+href(path,'industrial/styles.css')+'"><link rel="stylesheet" href="'+href(path,'industrial/records.css')+'">'+metadata(title,description,path,crumbs,data)+'</head><body><header>'+nav+'</header><main><nav class="breadcrumbs" aria-label="Breadcrumb">'+trail+'</nav>'+body+'</main><footer>MechIntel · Free access · Source-reported evidence with explicit scope · Reviewed '+DATE+'</footer></body></html>'

def source_html(source):
    publication='date not recorded' if source.get('publishedUnknown') else ('on or before ' if source.get('publishedIsUpperBound') else '')+(source.get('published') or 'date not recorded')
    return '<a href="'+esc(source['url'],quote=True)+'" rel="noopener noreferrer">'+esc(source['title'])+'</a><br>'+esc(source.get('kind','Source record'))+' · Publication: '+esc(publication)+' · Accessed: '+esc(source.get('accessedOn') or 'not recorded')

def latest(data,country,capability):
    events=[e for e in data['events'] if e['country']==country and e['capability']==capability and e['knownOn']<=data['asOf'] and e['date']<=data['asOf'] and e['verification']=='verified']
    return sorted(events,key=lambda e:(e['knownOn'],e['id']))[-1] if events else None

def country_record(data,country,cap,current):
    state=latest(data,country['id'],cap['id'])
    review=next((r for r in reversed(data.get('reviews',[])) if r['country']==country['id'] and r['capability']==cap['id']),{})
    body='<article class="static-record" id="'+country['id']+'-'+cap['id']+'"><h3>'+esc(country['name'])+'</h3>'
    if state:
        body+='<p><strong>Stage '+str(state['stage'])+' · '+esc(state.get('recordType') or 'Source-reported evidence')+'</strong></p><p>'+esc(state.get('stageRationale') or state.get('milestone'))+'</p>'
        m=state.get('metric')
        quantity=str(m['value'])+' '+m['unit']+' — '+m['scope'] if m else state.get('capacity') or state.get('industrialScale') or 'Quantity not established; no estimate substituted.'
        body+='<p><strong>Recorded measure:</strong> '+esc(quantity)+'</p><p>'+esc(state.get('corroboration') or 'Independent corroboration is not entered for this claim.')+'</p><p>Assessment entered '+state['knownOn']+'. This does not date a new factory opening unless the record explicitly reports one.</p>'
        ids=state.get('sourceIds') or [state['source']]
    else:
        body+='<p><strong>'+esc(review.get('evidenceState','No qualifying record entered').replace('-',' '))+'</strong></p><p>'+esc(review.get('notes') or 'No qualifying record entered; this is not verified absence.')+'</p>'
        ids=review.get('sourceIds',[])
    sources={s['id']:s for s in data['evidence']}
    body+=''.join('<p>'+source_html(sources[id])+'</p>' for id in ids)
    hub=current.split('/')[0]+'/'
    return body+'<p><a href="'+href(current,hub)+'?selectedCountry='+country['id']+'&amp;capability='+cap['id']+'#detail">Open interactive record</a></p></article>'

def capability_pages(data,section):
    manifest=[];links=[]
    label='AI' if section=='ai-intelligence' else 'Industrial'
    for cap in data['capabilities']:
        path=section+'/capabilities/'+cap['id']+'.html'
        title=cap['name']+' — '+label+' evidence in India, China and US | MechIntel'
        description=cap['definition']+' Compare scoped country records, quantities, source dates and evidence gaps.'
        body='<h1>'+esc(cap['name'])+'</h1><p class="intro">'+esc(cap['definition'])+'</p><p>Assessment baseline: '+esc(data.get('assessmentBaseline') or data['asOf'])+'. Metadata review: '+DATE+'. Free access.</p><h2>What does the evidence establish?</h2><p>These records describe the exact definition above. Manufacturing location or organizational origin is separate from ownership, adoption, value-add, import exposure and national independence. Source counts are research coverage, not country rankings.</p>'
        if cap.get('attribution'):body+='<p><strong>Attribution:</strong> '+esc(cap['attribution'])+'</p>'
        body+=''.join(country_record(data,c,cap,path) for c in data['countries'])
        chains=json.loads((ROOT/'supply-chain-intelligence/reviewed-chains.json').read_text(encoding='utf-8'))['chains']
        related=[c for c in chains if any(n.get('capability')==cap['id'] for n in c['nodes'])] if section=='industrial' else [c for c in chains if c['id'] in ({'semiconductors','grid-transformers'} if cap['id'] in {'accelerator-design','logic-fab','hbm','packaging','cloud','supercomputing','training','power-cooling','networking'} else {'robotics'} if cap['id']=='embodied' else set())]
        if related:
            body+='<h2>Related supply-chain process maps</h2><ul>'+''.join('<li><a href="'+href(path,'supply-chain-intelligence/chains/'+c['id']+'.html')+'">'+esc(c['name'])+'</a> — process context; supplier exposure remains separately assessed.</li>' for c in related)+'</ul>'
        body+='<h2>Questions about '+esc(cap['name'].lower())+'</h2><h3>Can the stages be used as a country ranking?</h3><p>No. Read the source scope, record type and quantity together. Facility output, nameplate capacity, model parameters and research demonstrations measure different things.</p><h3>What does missing evidence mean?</h3><p>A research gap does not establish absence. A verified-absence statement would require a dated source and explicit scope.</p><h3>How should source dates be read?</h3><p>Publication and access dates are separate. Undated publications have unknown freshness. An access date does not independently verify continued operation.</p>'
        target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(shell(title,description,path,body,[('Home',''),(label+' intelligence',section+'/'),(cap['name'],path)]),encoding='utf-8')
        manifest.append(path);links.append('<li><a href="capabilities/'+cap['id']+'.html">'+esc(cap['name'])+'</a> — '+esc(cap['definition'])+'</li>')
    (ROOT/section/'page-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    return manifest,'<ul>'+''.join(links)+'</ul>'
