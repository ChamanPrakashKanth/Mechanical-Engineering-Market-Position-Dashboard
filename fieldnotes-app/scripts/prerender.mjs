import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { render } from '../dist-ssr/entry-server.js';
import { tools, guides } from '../src/engineering.js';

const base = process.env.BASE_PATH || '/';
if (!base.startsWith('/') || !base.endsWith('/') || base.includes('..') || base.includes('?') || base.includes('#')) throw new Error('BASE_PATH must be an absolute path ending in /, e.g. /fieldnotes/.');
let site;
if (process.env.SITE_URL) {
  site = new URL(process.env.SITE_URL);
  if (!['https:', 'http:'].includes(site.protocol) || site.username || site.password || site.search || site.hash) throw new Error('SITE_URL must be a public HTTP(S) URL without credentials, query or fragment.');
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  if (site.pathname !== base) throw new Error('SITE_URL pathname must match BASE_PATH.');
}
const pages = [
  { file: 'index.html', title: 'Free Engineering Calculators & Fieldnotes | MechIntel', description: 'Free calculators and original worked examples for Reynolds number, pipe pressure drop and wall heat conduction. No account or paywall.' },
  ...tools.map(t=>({file:`tools/${t.id}.html`,title:`${t.title} Calculator — Formula & Example | MechIntel`,description:t.description,tool:t})),
  ...guides.map(g=>({file:`guides/${g.slug}.html`,title:`${g.title} | MechIntel`,description:g.intro,guide:g})),
  {file:'reference.html',title:'Free Engineering Formula Sheet — Fluids & Heat | MechIntel',description:'Eight engineering formulas, model assumptions and useful unit conversions in a printable reference sheet.'},
  {file:'units.html',title:'Engineering Unit Converter — Pressure, Flow, Energy & Temperature | MechIntel',description:'Convert engineering units locally with transparent definitions: length, pressure difference, energy, volume flow and temperature.'},
  {file:'about.html',title:'About & Contact | MechIntel Fieldnotes',description:'About this free engineering notebook and how to report a correction.'},
  {file:'privacy.html',title:'Privacy | MechIntel Fieldnotes',description:'How this site processes calculations locally, without analytics or advertising tracking.'},
  {file:'methodology.html',title:'Calculation Methods & References | MechIntel',description:'Equations, assumptions, flow thresholds, validity limits and educational references for MechIntel calculators.'},
  {file:'404.html',title:'Page Not Found | MechIntel',description:'Find your way back to the free engineering toolbox.',notFound:true},
];
const template=await readFile('dist/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for (const p of pages) {
  let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(p.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(p.description)}" />`);
  const url=site?new URL(p.file==='index.html'?'':p.file,site).href:null;
  const data={'@context':'https://schema.org','@type':p.tool?'WebApplication':p.guide?'Article':'WebPage',name:p.title,description:p.description,...(url?{url}:{}),...(p.tool?{applicationCategory:'EducationalApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'INR'}}:{}),...(p.guide?{headline:p.guide.title,datePublished:'2026-10-18',author:{'@type':'Organization',name:'MechIntel editorial'}}:{})};
  const extra=`<meta property="og:title" content="${escape(p.title)}"/><meta property="og:description" content="${escape(p.description)}"/><meta property="og:type" content="${p.guide?'article':'website'}"/>${url&&!p.notFound?`<link rel="canonical" href="${escape(url)}"/>`:''}${p.notFound?'<meta name="robots" content="noindex"/>':`<script type="application/ld+json">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`}`;
  html=html.replace('</head>',`${extra}</head>`).replace('<div id="root"></div>',`<div id="root">${render(`${base}${p.file==='index.html'?'':p.file}`)}</div>`);
  const target=resolve('dist',p.file); await mkdir(dirname(target),{recursive:true}); await writeFile(target,html);
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${site?`Sitemap: ${new URL('sitemap.xml',site).href}\n`:''}`);
if(site) await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>!p.notFound).map(p=>`<url><loc>${escape(new URL(p.file==='index.html'?'':p.file,site).href)}</loc></url>`).join('')}</urlset>`);
console.log(`Prerendered ${pages.length} pages. ${site?'Canonical URLs and sitemap enabled.':'Set SITE_URL for canonical URLs and sitemap; no domain has been invented.'}`);
