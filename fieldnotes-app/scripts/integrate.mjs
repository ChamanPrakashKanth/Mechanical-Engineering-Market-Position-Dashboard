import {cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const app=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const repo=resolve(app,'..');
const output=resolve(repo,'_site');
await mkdir(output,{recursive:true});
await cp(resolve(app,'dist'),resolve(output,'fieldnotes'),{recursive:true});
const child=await readFile(resolve(app,'dist/sitemap.xml'),'utf8');
let root=await readFile(resolve(output,'sitemap.xml'),'utf8');
const existing=new Set([...root.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]));
const entries=[...child.matchAll(/<url>.*?<\/url>/gs)].map(m=>m[0]);
let count=0;
for(const entry of entries){const url=entry.match(/<loc>(.*?)<\/loc>/)?.[1];if(url&&!existing.has(url)){root=root.replace('</urlset>',`${entry}\n</urlset>`);existing.add(url);count++;}}
await writeFile(resolve(output,'sitemap.xml'),root);
console.log(`Published Fieldnotes build into _site/fieldnotes; added ${count} page URLs to the main sitemap.`);
