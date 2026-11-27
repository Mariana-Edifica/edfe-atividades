import {env} from 'cloudflare:workers';
import dataset from './garden-data.json';
const marker='import:garden-r06-planner-2026-q4';
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
// D1 batch is atomic: every mutation checks the marker, written last. Concurrent
// first loads cannot import twice; later edits/deletions remain untouched.
export async function ensureGardenImport(){
 if(await env.DB.prepare('SELECT id FROM events WHERE id=?').bind(marker).first())return;
 const [taskRows,labelRows]=await Promise.all([env.DB.prepare('SELECT id,data FROM tasks').all(),env.DB.prepare('SELECT id,data FROM labels').all()]);
 const existing=taskRows.results.map((r:any)=>({...JSON.parse(r.data),id:r.id}));
 const labels=labelRows.results.map((r:any)=>({...JSON.parse(r.data),id:r.id}));
 const labelMap=new Map(dataset.labels.map(l=>[l.id,labels.find(x=>normalize(x.name)===normalize(l.name))?.id||l.id]));
 const commands:any[]=[];let matched=0;
 for(const l of dataset.labels){const id=labelMap.get(l.id);commands.push(env.DB.prepare('INSERT OR IGNORE INTO labels (id,data) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(id,JSON.stringify({...l,id}),marker));}
 for(const source of dataset.tasks){
  const candidates=existing.filter(t=>normalize(t.title||'')===normalize(source.title));
  const match=candidates.length===1?candidates[0]:null;
  const ids=source.labelIds.map(id=>labelMap.get(id));
  if(match){matched++;commands.push(env.DB.prepare(`UPDATE tasks SET data=json_set(data,'$.garden',json(?),'$.labelIds',json((SELECT json_group_array(value) FROM (SELECT DISTINCT value FROM json_each(COALESCE(json_extract(tasks.data,'$.labelIds'),'[]')) UNION SELECT value FROM json_each(?))))),version=version+1 WHERE id=? AND NOT EXISTS (SELECT 1 FROM events WHERE id=?)`).bind(JSON.stringify(source.garden),JSON.stringify(ids),match.id,marker));}
  else commands.push(env.DB.prepare('INSERT OR IGNORE INTO tasks (id,data,version) SELECT ?,?,1 WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(source.id,JSON.stringify({...source,labelIds:ids}),marker));
 }
 commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) VALUES (?,?)').bind(marker,JSON.stringify({id:marker,actor:'Importação da planilha',at:new Date().toISOString(),action:'importou',title:`BE Garden: ${dataset.tasks.length} atividades (${matched} vinculadas a existentes)`,before:null,after:null})));
 await env.DB.batch(commands);
}
