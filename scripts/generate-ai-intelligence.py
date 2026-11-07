"""Build the reviewed AI baseline. Edit source claims here; never infer missing capability.

Run: python scripts/generate-ai-intelligence.py
Observation dates on undated living documentation are not original publication dates.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATE = '2026-11-06'
REVISION_DATE = '2026-11-07'
layers = [
 ('01 · Silicon', [('accelerator-design','AI accelerator design','Organization-origin accelerator IP; does not establish fabrication location.'),('logic-fab','Advanced logic fabrication','Operating wafer fabrication at 16 nm class or below, physically inside the country.'),('hbm','HBM manufacturing','Physical domestic fabrication and stacking of high-bandwidth memory; headquarters alone do not qualify.')]),
 ('02 · Systems and facilities', [('packaging','Advanced AI packaging','Domestic 2.5D/3D semiconductor integration; conventional assembly alone does not qualify.'),('networking','AI cluster networking','Locally developed high-speed accelerator interconnect systems.'),('power-cooling','AI power and cooling','Documented domestic operation of AI-specific power and liquid-cooling infrastructure.')]),
 ('03 · Compute access', [('cloud','Accelerator cloud access','Operational accelerator compute services accessible through a national ecosystem; imported GPUs may qualify for access only.'),('supercomputing','Large-scale AI computing','Documented multi-accelerator training or serving operation; budgets and proposed clusters do not qualify.'),('edge','Edge AI deployment stack','Locally developed software or chips supporting device-side inference; release is distinct from fleet adoption.')]),
 ('04 · Data', [('datasets','Public training datasets','Locally originated, released datasets for AI training, with access and license scope checked separately.'),('annotation','Annotation and curation tools','Locally originated tools for collecting, labeling or curating AI datasets.'),('multilingual-data','Multilingual corpora','Locally originated language datasets spanning multiple languages; not a claim to ownership of those languages.')]),
 ('05 · Model development', [('training','Foundation-model training','Documented original pre-training by organizations originating in the country; fine-tuning alone is insufficient.'),('reasoning','Reasoning and post-training','Released reasoning models or documented reinforcement-learning/post-training research.'),('open-weights','Open-weight models','Downloadable model weights; open weights do not imply unrestricted licenses or fully open training data.')]),
 ('06 · Modalities', [('speech','Speech and translation','Locally originated speech recognition, synthesis or multilingual translation models.'),('vision','Vision and multimodal AI','Locally originated released vision-language or document-understanding models.'),('generation','Image and video generation','Locally originated generative image/video model releases; recognition alone does not qualify.')]),
 ('07 · Software stack', [('framework','Training frameworks','Locally originated general training frameworks; global contributors and foreign adoption remain separate.'),('distributed','Distributed training','Documented multi-device training software or original training-system engineering.'),('inference','Inference runtimes','Locally originated runtime, kernel or serving optimization implementations.')]),
 ('08 · Serving and retrieval', [('apis','Model API services','Operational model-serving APIs from locally originated providers; underlying hardware origin is separate.'),('retrieval','Embeddings and retrieval','Locally originated embedding, ranking or retrieval software/models for RAG.'),('mlops','MLOps and observability','Locally originated tools for model lifecycle tracking, evaluation, monitoring or deployment operations.')]),
 ('09 · Agents and applications', [('agents','Agent frameworks','Locally originated released agent orchestration or tool-use implementations; not proof of autonomous reliability.'),('applications','Deployed AI applications','Named operational AI products; no inference about national adoption or commercial success.'),('embodied','Embodied AI and robotics','Released AI robot-policy or embodied-simulation systems; demonstration is distinct from industrial fleet deployment.')]),
 ('10 · Evaluation and safety', [('benchmarks','Evaluation benchmarks','Locally originated public evaluation suites, datasets or reproducible harnesses.'),('safety','Safety evaluation','Published technical risk-testing methods or implementation; policy alone does not establish test execution.'),('security','AI security tooling','Released tools specifically testing AI vulnerabilities; general cybersecurity does not qualify.')]),
 ('11 · Research and ecosystem', [('research','Research institutions and talent','Named institutions producing original AI research; not a national workforce estimate.'),('community','Open-source AI community','Public locally originated AI projects; international contributions do not imply exclusive national ownership.'),('commercial','AI commercialization','Operational AI product providers; financing announcements alone do not establish sales or profitability.')]),
 ('12 · Governance and diffusion', [('governance','Published AI governance','Published governmental AI governance instruments; maturity measures publication, not policy quality or compliance.'),('public-sector','Public-sector AI deployment','Named operational publicly supported AI service; a planned mission alone does not qualify.'),('standards','AI standards and interoperability','Published public technical frameworks or implementation guidance; not a completeness assessment of national standards.')]),
]

# Primary-source registry. Dated documents preserve their publication dates. Living
# pages use the review observation bound, explicitly labeled rather than backdated.
sources = {}
def source(id, title, url, published=None):
    sources[id] = dict(id=id, title=title, url=url, published=published, publishedUnknown=published is None,
        kind='Primary source', accessedOn=DATE,
        dateBasis='Dated primary publication' if published else 'Publication date not recorded; accessedOn is access only')

source('netra','Netrasemi company news','https://www.netrasemi.com/news')
source('indiaai','PIB: IndiaAI compute and data coverage','https://www.pib.gov.in/FactsheetDetails.aspx?Id=150860&lang=3&reg=3')
source('sarvam','Sarvam: 30B and 105B release','https://www.sarvam.ai/blogs/sarvam-30b-105b','2026-03-06')
source('sarvam-models','Sarvam model catalog','https://www.sarvam.ai/models')
source('indic','AI4Bharat IndicTrans2','https://github.com/AI4Bharat/IndicTrans2')
source('indicvoices','AI4Bharat IndicVoices-R','https://github.com/AI4Bharat/IndicVoices-R')
source('ai4bharat','IIT Madras AI4Bharat','https://ai4bharat.iitm.ac.in/')
source('india-policy','Principal Scientific Adviser: AI mission and governance','https://www.psa.gov.in/ai-mission')
source('blackwell','NVIDIA Blackwell architecture','https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/')
source('tsmc','TSMC 2024 annual report','https://investor.tsmc.com/static/annualReports/2024/english/index.html')
source('intel','Intel opens Fab 9 in New Mexico','https://download.intel.com/newsroom/archive/2025/en-us-2024-01-24-intel-opens-fab-9-in-new-mexico.pdf','2024-01-24')
source('aws','AWS accelerator instance specifications','https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html')
source('dolma','Allen Institute for AI: Dolma','https://github.com/allenai/dolma')
source('llama','Meta Llama 3','https://github.com/meta-llama/llama3')
source('llama-models','Meta Llama models','https://github.com/meta-llama/llama-models')
source('pytorch','PyTorch framework','https://github.com/pytorch/pytorch')
source('tensorrt','NVIDIA TensorRT-LLM','https://github.com/NVIDIA/TensorRT-LLM')
source('autogen','Microsoft AutoGen','https://github.com/microsoft/autogen')
source('mlflow','MLflow project','https://github.com/mlflow/mlflow')
source('helm','Stanford CRFM HELM','https://github.com/stanford-crfm/helm')
source('garak','NVIDIA garak','https://github.com/NVIDIA/garak')
source('sana','NVIDIA SANA','https://github.com/NVlabs/Sana')
source('groot','NVIDIA Isaac GR00T','https://github.com/NVIDIA/Isaac-GR00T')
source('nist','NIST AI Risk Management Framework','https://www.nist.gov/itl/ai-risk-management-framework')
source('cloudmatrix','Huawei CloudMatrix384 engineering paper','https://arxiv.org/abs/2506.12708','2025-06-15')
source('huawei-cloud','Huawei: Pangu and AI cloud service','https://www.huaweicloud.com/intl/en-us/news/20250620192415143.html','2025-06-20')
source('deepseek','DeepSeek V3 model and systems report','https://github.com/deepseek-ai/DeepSeek-V3')
source('r1','DeepSeek R1 technical paper','https://arxiv.org/abs/2501.12948','2025-01-22')
source('paddle','Baidu PaddlePaddle','https://github.com/PaddlePaddle/Paddle')
source('mindspore','Huawei MindSpore','https://github.com/mindspore-ai/mindspore')
source('qwen-vl','Alibaba Qwen vision-language models','https://github.com/QwenLM/Qwen3-VL')
source('qwen-image','Alibaba Qwen Image','https://github.com/QwenLM/Qwen-Image')
source('qwen-agent','Alibaba Qwen Agent','https://github.com/QwenLM/Qwen-Agent')
source('qwen-speech','Alibaba Qwen3 TTS','https://github.com/QwenLM/Qwen3-TTS')
source('nemo-speech','NVIDIA NeMo Speech','https://github.com/NVIDIA-NeMo/Speech')
source('bge','BAAI FlagEmbedding','https://github.com/FlagOpen/FlagEmbedding')
source('opencompass','OpenCompass evaluation platform','https://github.com/open-compass/opencompass')
source('intern','InternUtopia embodied simulation','https://github.com/InternRobotics/InternUtopia')
source('cac','CAC: 2023 generative AI service measures','https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm','2023-07-13')
source('smic','SMIC 2019 Hong Kong Exchange filing','https://www1.hkexnews.hk/listedco/listconews/sehk/2019/1212/2019121200789.pdf','2019-12-12')
source('labelu','OpenDataLab LabelU','https://github.com/opendatalab/LabelU')
source('frontier','Oak Ridge: Frontier system','https://www.olcf.ornl.gov/frontier/')
source('nemotron','NVIDIA reasoning implementation guidance','https://docs.nvidia.com/rag/latest/enable-nemotron-thinking.html')
source('bedrock','AWS Bedrock overview','https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html')
source('graphrag','Microsoft GraphRAG','https://github.com/microsoft/graphrag')
source('copilot','Microsoft 365 Copilot product','https://www.microsoft.com/en-us/microsoft-365-copilot')

# country, capability, stage, source, narrow supported claim. These are editorial
# evidence stages, not comparable benchmark scores or national league tables.
claims = []
def add(country, cap, stage, src, claim):
    claims.append((country,cap,stage,src,claim))

add('IN','accelerator-design',2,'netra','Netrasemi reports a production-ready A2000 edge-AI design; domestic fabrication and shipment volume are unestablished here.')
add('IN','edge',2,'netra','Netrasemi offers an edge-inference chip design; customer deployment volume is not established by the company news record.')
add('IN','cloud',3,'indiaai','IndiaAI reports shared accelerator access; this establishes compute access, not Indian GPU manufacturing.')
add('IN','supercomputing',3,'sarvam','Sarvam reports training its released models on IndiaAI compute physically in India; national cluster capacity is not inferred.')
add('IN','datasets',3,'indiaai','AIKosh provides a public dataset and model catalog; individual licenses still govern reuse.')
add('IN','annotation',3,'ai4bharat','AI4Bharat publishes data-collection and annotation tools; national annotation-market scale is unassessed.')
add('IN','multilingual-data',3,'indicvoices','IndicVoices-R releases a multilingual Indian speech corpus; coverage does not establish complete demographic representation.')
add('IN','training',3,'sarvam','Sarvam documents original pre-training of 30B and 105B models in India.')
add('IN','reasoning',3,'sarvam','Sarvam releases reasoning models with post-training; provider benchmark results are not a national quality ranking.')
add('IN','open-weights',3,'sarvam','Sarvam releases model weights; model licenses and training-data openness remain separate questions.')
add('IN','speech',3,'indic','IndicTrans2 provides released translation models covering Indian scheduled languages.')
add('IN','vision',3,'sarvam-models','Sarvam catalogs vision/document models; this does not establish general image-generation capability.')
add('IN','distributed',2,'sarvam','Sarvam describes training-system optimization; ecosystem-wide adoption of a standalone framework is not established.')
add('IN','apis',3,'sarvam-models','Sarvam provides model products through its developer platform; coming-soon models are excluded from this assessment.')
add('IN','applications',3,'sarvam','Sarvam names operational Samvaad and Indus products; usage and revenue are unestablished here.')
add('IN','benchmarks',2,'indic','IndicTrans2 publishes evaluation procedures and benchmark data; scope is translation, not general AI safety.')
add('IN','research',3,'ai4bharat','IIT Madras AI4Bharat produces original language-AI research; this is not a national talent count.')
add('IN','community',3,'indicvoices','AI4Bharat maintains a public speech-data project; contributors and downstream users can be international.')
add('IN','commercial',3,'sarvam-models','Sarvam offers operational model products; profitability and national AI-market size are unassessed.')
add('IN','governance',3,'india-policy','The PSA publishes AI governance guidance; publication does not prove compliance or policy effectiveness.')
add('IN','public-sector',3,'indiaai','IndiaAI operates shared compute and data services; proposed additional infrastructure is excluded.')
add('IN','standards',2,'india-policy','Published governance guidance provides a public reference; technical interoperability implementation is not demonstrated here.')

add('CN','accelerator-design',3,'cloudmatrix','Huawei documents Ascend 910C accelerators in a working serving system; chip-fabrication origin is a separate assessment.')
add('CN','logic-fab',3,'smic','SMIC reports 14 nm production in its Chinese foundry operations; this does not establish frontier-node parity or the origin of any specific accelerator.')
add('CN','annotation',3,'labelu','OpenDataLab releases multimodal annotation tooling; national annotation capacity is unassessed.')
add('CN','networking',3,'cloudmatrix','CloudMatrix384 documents an implemented multi-accelerator interconnect; this is one system, not national network capacity.')
add('CN','cloud',3,'huawei-cloud','Huawei offers an AI cloud service using CloudMatrix; regional access conditions require provider checks.')
add('CN','supercomputing',3,'cloudmatrix','The paper describes a working 384-accelerator serving system; no national fleet size is inferred.')
add('CN','edge',3,'mindspore','MindSpore supplies mobile, edge and cloud inference software; released support is distinct from deployed fleet volume.')
add('CN','training',3,'deepseek','DeepSeek V3 documents original model pre-training and its engineering implementation.')
add('CN','reasoning',3,'r1','DeepSeek R1 documents reinforcement-learning reasoning methods and released models; benchmark superiority is not assumed.')
add('CN','open-weights',3,'deepseek','DeepSeek publishes downloadable model weights under stated terms; data openness must be checked independently.')
add('CN','speech',3,'qwen-speech','Qwen releases speech-synthesis implementations and model weights; deployed speech-service volume is unassessed.')
add('CN','vision',3,'qwen-vl','Qwen releases vision-language models; task accuracy depends on model version and evaluation conditions.')
add('CN','generation',3,'qwen-image','Qwen Image releases image-generation software and weights; commercial deployment scale is unestablished here.')
add('CN','framework',3,'paddle','PaddlePaddle provides a released training framework originating at Baidu; international contributions remain visible separately.')
add('CN','distributed',3,'deepseek','DeepSeek V3 describes distributed model-training engineering; availability of every production component is not assumed.')
add('CN','inference',3,'mindspore','MindSpore supplies released inference implementations for multiple deployment environments.')
add('CN','apis',3,'huawei-cloud','Huawei provides model cloud services; service availability does not imply domestic manufacturing of every input.')
add('CN','retrieval',3,'bge','BAAI FlagEmbedding releases embedding and reranking implementations for retrieval.')
add('CN','mlops',3,'huawei-cloud','Huawei documents model cloud lifecycle services; national enterprise adoption is not established.')
add('CN','agents',3,'qwen-agent','Qwen Agent provides released tool-use and orchestration implementations; autonomous reliability is not established by release.')
add('CN','applications',3,'huawei-cloud','Huawei offers industry-facing model services; provider descriptions do not establish industry-wide adoption.')
add('CN','embodied',2,'intern','InternUtopia provides an embodied-AI simulation research platform; real-world fleet deployment is not established.')
add('CN','benchmarks',3,'opencompass','OpenCompass supplies a public model-evaluation harness; results require model/version-specific interpretation.')
add('CN','safety',2,'opencompass','OpenCompass includes safety evaluation tasks; a harness does not certify any model as safe.')
add('CN','research',3,'r1','DeepSeek publishes original reasoning research; this record does not estimate national researcher numbers.')
add('CN','community',3,'paddle','PaddlePaddle maintains a public AI software project with a global contributor base.')
add('CN','commercial',3,'huawei-cloud','Huawei sells AI cloud products; this is not a national market-size or profitability estimate.')
add('CN','governance',3,'cac','CAC published generative-AI service measures in 2023; this historical instrument is not a complete current legal survey.')

add('US','accelerator-design',3,'blackwell','NVIDIA offers Blackwell accelerator designs; US corporate origin does not establish US wafer fabrication.')
add('US','logic-fab',3,'tsmc','TSMC reports N4 volume production in Arizona from Q4 2024; facility location is US, corporate origin is Taiwan.')
add('US','packaging',3,'intel','Intel opened Fab 9 for advanced packaging in New Mexico; this does not prove all US AI chips are packaged domestically.')
add('US','networking',3,'blackwell','NVIDIA supplies accelerator interconnect technology; manufacturing geography is not inferred from design origin.')
add('US','cloud',3,'aws','AWS catalogs operational accelerator instances; hardware sourcing remains a separate dependency.')
add('US','supercomputing',3,'frontier','Oak Ridge operates Frontier for GPU-accelerated scientific and AI workloads; this is one US facility, not total national compute.')
add('US','reasoning',3,'nemotron','NVIDIA documents usable Nemotron reasoning modes; comparative model quality is not inferred.')
add('US','apis',3,'bedrock','AWS Bedrock offers operational foundation-model APIs; provider origin does not determine every hosted model\'s origin.')
add('US','retrieval',3,'graphrag','Microsoft releases GraphRAG retrieval-augmented generation software; operational adoption is unquantified.')
add('US','applications',3,'copilot','Microsoft offers an operational productivity AI application; national adoption and revenue are not inferred.')
add('US','edge',3,'llama-models','Meta releases smaller Llama models for constrained deployments; actual device fleet adoption is unassessed.')
add('US','datasets',3,'dolma','Ai2 releases Dolma pre-training data and tools; component licenses and provenance require individual review.')
add('US','annotation',3,'dolma','Dolma supplies curation and inspection tools; this does not measure the national annotation industry.')
add('US','training',3,'llama','Meta documents original Llama model development; training hardware location is not inferred from company origin.')
add('US','open-weights',3,'llama','Meta releases Llama weights under its model license; open weights do not mean unrestricted use.')
add('US','vision',3,'llama-models','Meta releases multimodal Llama models; this is not a general vision-accuracy ranking.')
add('US','speech',3,'nemo-speech','NVIDIA provides released speech recognition and synthesis implementations; national language coverage is not inferred.')
add('US','generation',3,'sana','NVIDIA SANA releases generative-image research software; adoption and commercial scale are unassessed.')
add('US','framework',3,'pytorch','PyTorch is an operational training framework with US organizational origins and global contributors.')
add('US','distributed',3,'pytorch','PyTorch includes distributed-training implementations; framework origin does not imply exclusively domestic development.')
add('US','inference',3,'tensorrt','TensorRT-LLM provides released optimized inference software; speed depends on workload and hardware.')
add('US','mlops',3,'mlflow','MLflow provides released model-lifecycle tooling; the project serves a global ecosystem.')
add('US','agents',3,'autogen','Microsoft AutoGen releases multi-agent orchestration tooling; release does not establish reliable autonomous operation.')
add('US','embodied',2,'groot','NVIDIA releases robot-policy research tools; industrial deployment scale is not established here.')
add('US','benchmarks',3,'helm','Stanford HELM provides a public model-evaluation framework; benchmark coverage is bounded.')
add('US','safety',3,'helm','HELM supports reproducible risk-relevant model evaluation; it does not certify models as safe.')
add('US','security',3,'garak','NVIDIA garak releases AI vulnerability testing software; passing scans is not a security guarantee.')
add('US','research',3,'helm','Stanford CRFM produces original evaluation research; national talent totals are not assessed.')
add('US','community',3,'pytorch','PyTorch maintains a global public AI software community; national attribution denotes organizational origin only.')
add('US','commercial',3,'aws','AWS offers accelerator compute commercially; market share and profitability are not measured.')
add('US','governance',3,'nist','NIST publishes a voluntary AI risk framework; this is not a claim that all AI regulation is covered.')
add('US','standards',3,'nist','NIST provides published AI risk implementation guidance; international interoperability is not guaranteed.')

caps = [dict(id=id,name=name,domain=layer,definition=definition) for layer, items in layers for id,name,definition in items]
lookup = {(c,k):(stage,src,claim) for c,k,stage,src,claim in claims}
reviews, events = [], []
for country in ['IN','CN','US']:
    for cap in caps:
        key=(country,cap['id'])
        if key in lookup:
            stage,src,claim=lookup[key]
            events.append(dict(id=f"{country}-{cap['id']}-review-20261106",country=country,capability=cap['id'],
                date=DATE,knownOn=DATE,evidenceAsOf=sources[src]['published'],stage=stage,previousStage=0,
                source=src,milestone=claim,verification='verified',kind='evidence review',
                dependencies=[],notes='Country attribution follows this capability definition. No supplier concentration or replacement timing has been established.',
                quantitativeChange=None,stageRationale=claim))
            notes=claim; source_ids=[src]; outcome='supported'
        else:
            notes='No qualifying primary-source record entered for this definition in this baseline. This is an evidence gap, not evidence of absence or a claim that the country lacks the capability.'
            if cap['id']=='hbm': notes+=' A company headquarters or overseas HBM output does not establish domestic HBM manufacturing.'
            if cap['id']=='packaging': notes+=' Conventional OSAT announcements alone do not meet the advanced AI-packaging definition.'
            source_ids=[]; outcome='insufficient evidence'
        reviews.append(dict(country=country,capability=cap['id'],reviewedOn=DATE,outcome=outcome,sourceIds=source_ids,notes=notes,evidenceState='supported' if outcome=='supported' else 'no-qualifying-record',researchStatus='baseline source pass; not an exhaustive country search'))

edges=[('logic-fab','packaging'),('packaging','cloud'),('accelerator-design','packaging'),('hbm','packaging'),('accelerator-design','cloud'),('hbm','cloud'),('networking','cloud'),('power-cooling','cloud'),('cloud','training'),('datasets','training'),('framework','training'),('distributed','training'),('training','open-weights'),('open-weights','inference'),('inference','apis'),('apis','agents'),('retrieval','agents'),('agents','applications'),('inference','embodied')]
nodeids={id for edge in edges for id in edge}
data=dict(schemaVersion=1,asOf=DATE,stageLabels=['Insufficient verified evidence','Research / limited demonstration','Pilot / early deployment','Released / operational capability','Documented repeated scale'],
    coverageNote='AI stack baseline: 36 definitions across 12 layers. Evidence gaps remain visible. Colors assess narrow documented capabilities, not national AI rankings.',
    countries=[dict(id='IN',name='India'),dict(id='CN',name='China'),dict(id='US',name='United States')],
    capabilities=caps,evidence=list(sources.values()),events=events,reviews=reviews,
    nodes=[dict(id=c['id'],name=c['name'],type='Illustrative AI dependency') for c in caps if c['id'] in nodeids],edges=[dict(zip(['from','to'],e)) for e in edges],
    stageCriteria=[
        '0 — No qualifying evidence entered for the exact definition. Never interpret this as proof of absence.',
        '1 — Documented research or limited demonstration; no usable release or operational service established.',
        '2 — Research implementation, pilot, early deployment or bounded demonstration; operational scale unestablished.',
        '3 — Released usable implementation or documented operational capability within the stated scope. This does not imply widespread adoption, frontier leadership or self-sufficiency.',
        '4 — Primary evidence establishes repeated production/deployment at meaningful scale. A benchmark score, budget, announcement or software repository alone cannot establish this stage. No stage-4 claims are made in this baseline.'],
    researchMethod='Manually reviewed primary-source baseline. Software/model/IP attribution follows originating organization, with global contributions acknowledged. Physical fabrication/packaging/infrastructure require in-country operations. Compute access can rely on imported hardware. All records enter knowledge history on the review date; older publication dates are not fabricated historical assessment dates. Missing quantities and dependencies remain null/unassessed. No automated daily research or national score is claimed.')
out=ROOT/'ai-intelligence';out.mkdir(exist_ok=True)
# Publication dates are nullable. Access dates must never make an undated source fresh.
source('netra-interview','EE Times: original Netrasemi interview','https://www.eetimes.com/netrasemi-brings-up-a2000-ai-chip-begins-customer-evaluation-phase/','2026-06-04')
sources['netra-interview']['kind']='Independent reporting / original vendor interview'
source('sarvam-report','Indian Express: Sarvam release reporting','https://indianexpress.com/article/technology/artificial-intelligence/sarvam-releases-open-weight-models-ai-summit-deepseek-gemini-10571340/','2026-03-10')
sources['sarvam-report']['kind']='Independent reporting; training claims attributed to vendor'
sources['sarvam-report']['dateBasis']='Dated report update; training statements attributed to vendor'
source('sarvam-eval','Artificial Analysis: Sarvam 105B evaluation','https://artificialanalysis.ai/models/sarvam-105b')
sources['sarvam-eval']['kind']='Independent evaluator; model/version-specific, not a training audit'
source('frontier-guide','OLCF Frontier user guide','https://docs.olcf.ornl.gov/systems/frontier_user_guide.html')

for source_id in ['netra-interview','sarvam-report','sarvam-eval','frontier-guide']:
    sources[source_id]['accessedOn']=REVISION_DATE

def metric(value,unit,label,scope,src):
    return dict(value=value,unit=unit,label=label,scope=scope,source=src,observedOn=REVISION_DATE)

metrics={
 ('IN','training'):metric(105,'billion parameters','Released model size','Sarvam 105B total parameters; not compute capacity or national model total','sarvam'),
 ('IN','open-weights'):metric(105,'billion parameters','Released model size','Sarvam 105B, not an adoption count','sarvam'),
 ('CN','training'):metric(671,'billion total parameters','Released model size','DeepSeek V3 main MoE model; 37B activated per token. Excludes MTP weights; not a quality or national ranking','deepseek'),
 ('CN','open-weights'):metric(671,'billion total parameters','Released model size','DeepSeek V3 main MoE model; not an adoption count or dense-model equivalent','deepseek'),
 ('US','training'):metric(70,'billion parameters','Documented release size','Original Llama 3 70B release; not the largest US model or a quality ranking','llama'),
 ('US','open-weights'):metric(70,'billion parameters','Documented release size','Original Llama 3 70B release; license terms apply; not an adoption count','llama'),
 ('IN','accelerator-design'):metric(12,'nm','Contract fabrication process','A2000 manufactured by TSMC overseas; not an Indian fab','netra-interview'),
 ('US','logic-fab'):metric(4,'nm class','Documented operating process','TSMC Arizona N4; not a claim to the best US node','tsmc'),
 ('CN','logic-fab'):metric(14,'nm class','Documented operating process','SMIC 2019 filing; not a claim to the best current Chinese node','smic'),
 ('CN','supercomputing'):metric(384,'NPUs','Disclosed system size','One CloudMatrix384 configuration; not national installed compute','cloudmatrix'),
 ('CN','networking'):metric(384,'NPUs','Interconnected system size','One CloudMatrix384 configuration; not national network capacity','cloudmatrix'),
 ('US','supercomputing'):metric(4,'MI250X packages / node','Per-node accelerator configuration','Frontier; each package contains two compute dies. Not a national GPU total','frontier-guide'),
}
operational={'cloud','apis','applications','commercial','logic-fab','packaging','supercomputing','public-sector'}
for cap in caps:
    cap['attribution']='Physical operation in country' if cap['id'] in {'logic-fab','hbm','packaging','power-cooling','supercomputing'} else ('Access through ecosystem; hardware origin separate' if cap['id']=='cloud' else 'Domestic-origin supply / organization origin; global contributions acknowledged')
    cap['adoptionScope']='Adoption of foreign-origin and shared global tools is not measured by the origin assessment.'
for event in events:
    key=(event['country'],event['capability'])
    event['metric']=metrics.get(key)
    event['recordType']='Pilot / bounded research implementation' if event['stage']==2 else ('Documented operation / service' if event['capability'] in operational else 'Released artifact / published research')
    event['sourceIds']=[event['source']]
    event['corroboration']='Single primary source; no independent corroboration entered for this claim.'
    event['adoption']='Not separately assessed; foreign-origin software may be available and used.'
    if event['source']=='netra':
        event['sourceIds'].append('netra-interview')
        event['corroboration']='Original external interview confirms engineering samples and evaluation; statements remain vendor-attributed, not a factory audit.'
        event['milestone']=event['stageRationale']='A2000 silicon is in engineering-sample/customer evaluation, not commercial volume production. Design origin is India; fabrication is TSMC overseas.'
    if event['country']=='IN' and event['capability'] in {'training','open-weights','reasoning','supercomputing'}:
        event['sourceIds'].append('sarvam-report')
        event['corroboration']='External release reporting added; training-location claims are attributed to Sarvam, not independently audited.'
        if event['capability'] in {'reasoning','open-weights'}:
            event['sourceIds'].append('sarvam-eval')
            event['corroboration']+=' Independent evaluator lists the model; no benchmark score is promoted to a national ranking.'
    if event['metric'] and event['metric']['source'] not in event['sourceIds']:
        event['sourceIds'].append(event['metric']['source'])
    event['supportingReferences']=[dict(source=id,knownOn=DATE if id==event['source'] else REVISION_DATE) for id in event['sourceIds']]
    event['corroborationKnownOn']=REVISION_DATE
    event['confidence']='Source scope: '+('public artifact or institutional document' if event['recordType'].startswith('Released') else 'provider/institution statement; scale unassessed')

# The baseline did not perform targeted searches for every missing cell. Preserve
# that distinction instead of claiming a completed investigation or verified absence.
targeted_gaps={('IN','logic-fab'),('IN','hbm'),('IN','packaging'),('CN','hbm'),('CN','packaging'),('US','hbm')}
for review in reviews:
    event=next((e for e in events if e['country']==review['country'] and e['capability']==review['capability']),None)
    if event:
        review['sourceIds']=event['sourceIds']
    else:
        review['evidenceState']='no-qualifying-record' if (review['country'],review['capability']) in targeted_gaps else 'not-researched'
        review['researchStatus']='Limited source check; not an exhaustive absence determination' if review['evidenceState']=='no-qualifying-record' else 'Targeted research not completed'

data['evidence']=list(sources.values())
data['schemaVersion']=2
data['presentation']='origin-evidence'
data['asOf']=REVISION_DATE
data['metadataReviewedOn']=REVISION_DATE
data['assessmentBaseline']=DATE
data['assessmentReviewDates']=[DATE]
data['evidenceStates']={'supported':'Documented record','no-qualifying-record':'No qualifying record entered','not-researched':'Targeted research pending','verified-absent':'Verified absent within dated scope'}
data['coverageNote']='Domestic-origin evidence coverage, not national capability rankings. Publication dates, access dates, record types and quantities are shown separately.'
data['researchMethod']+=' Origin evidence does not measure adoption. Verified absence requires explicit dated evidence and scope; none is asserted here. Single-source claims remain visibly labeled.'
data['notableRecords']=[dict(country='IN',capability='training',date='2026-03-06',title='Sarvam 105B trained in India and released',scope='Notable documented release, not a verified national first or a score increase.',sourceIds=['sarvam','sarvam-report'])]

# Emit all records into served HTML, with durable country-capability anchors.
for cap in caps:
    if cap['id'] in {'framework','inference','retrieval','mlops','agents','distributed'}:
        cap['name']='Domestic-origin '+cap['name'].lower()

from html import escape
def source_html(id):
    s=sources[id]
    return '<a href="'+escape(s['url'],quote=True)+'">'+escape(s['title'])+'</a> — '+escape(s['kind'])+'; publication: '+escape(s['published'] or 'date not recorded')+'; accessed: '+s['accessedOn']
records=[]
for cap in caps:
    records.append('<section><h3>'+escape(cap['name'])+'</h3><p>'+escape(cap['definition'])+'</p><p>'+escape(cap['attribution'])+'</p>')
    for country in data['countries']:
        review=next(r for r in reviews if r['country']==country['id'] and r['capability']==cap['id'])
        event=next((e for e in events if e['country']==country['id'] and e['capability']==cap['id']),None)
        records.append('<article class="static-record" id="'+country['id']+'-'+cap['id']+'"><h4>'+escape(country['name']+' / '+cap['name'])+'</h4>')
        if event:
            m=event['metric']
            records.append('<p>'+escape('Stage '+str(event['stage'])+' — '+event['recordType'])+'</p><p>'+escape(event['stageRationale'])+'</p>')
            records.append('<p>'+escape(str(m['value'])+' '+m['unit']+' — '+m['label']+'. '+m['scope'] if m else 'Quantity not established for this record; no estimate substituted.')+'</p>')
            records.append('<p>'+escape(event['corroboration'])+'</p>')
        else:
            records.append('<p>'+escape(data['evidenceStates'][review['evidenceState']])+'</p><p>'+escape(review['notes'])+'</p>')
        records.append('<p>Review: '+DATE+'. '+escape(review['researchStatus'])+'</p>')
        records.extend('<p>'+source_html(id)+'</p>' for id in review['sourceIds'])
        records.append('<a href="?selectedCountry='+country['id']+'&amp;capability='+cap['id']+'#detail">Open interactive record</a></article>')
    records.append('</section>')
template=(out/'template.html').read_text(encoding='utf-8')
(out/'index.html').write_text(template.replace('<!-- STATIC_RECORDS -->','\n'.join(records)),encoding='utf-8')

(out/'data.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f"Generated {len(caps)} capabilities, {len(reviews)} reviews, {len(events)} supported records, {len(sources)} sources")
