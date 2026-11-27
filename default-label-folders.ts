import {env} from 'cloudflare:workers';
const marker='setup:label-folders-v1';
async function ensureDefaults(){
 if(await env.DB.prepare('SELECT id FROM events WHERE id=?').bind(marker).first())return;
 const rows=await env.DB.prepare('SELECT data FROM labels').all();const all=rows.results.map((r:any)=>JSON.parse(r.data));
 const groups=[{id:'folder:projects',name:'Empreendimentos',labels:['garden-project']},{id:'folder:activity-groups',name:'BE Garden',labels:['garden-manuals','garden-delivery','garden-decorated','garden-contracts','garden-legal']},{id:'folder:periods',name:'Trimestres',labels:['garden-2026-Q4','garden-2027-Q1']},{id:'folder:sectors',name:'Setores',labels:['garden-sector-edfe','garden-sector-csua']}];
 const commands:any[]=[];
 for(const group of groups){const id=all.find(l=>l.kind==='folder'&&l.name===group.name)?.id||group.id;commands.push(env.DB.prepare('INSERT OR IGNORE INTO labels (id,data) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(id,JSON.stringify({id,name:group.name,kind:'folder'}),marker));for(const labelId of group.labels)commands.push(env.DB.prepare("UPDATE labels SET data=json_set(data,'$.folderId',?) WHERE id=? AND COALESCE(json_extract(data,'$.folderId'),'')='' AND NOT EXISTS (SELECT 1 FROM events WHERE id=?)").bind(id,labelId,marker));}
 commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) VALUES (?,?)').bind(marker,JSON.stringify({id:marker,actor:'Organização de etiquetas',at:new Date().toISOString(),action:'organizou',title:'Pastas de etiquetas: Empreendimentos, Grupos de atividades, Trimestres e Setores'})));
 await env.DB.batch(commands);
}

export async function ensureLabelFolders(){
 await ensureDefaults();
 const key='setup:garden-label-folder-v2';
 if(await env.DB.prepare('SELECT id FROM events WHERE id=?').bind(key).first())return;
 await env.DB.batch([
  env.DB.prepare("UPDATE labels SET data=json_set(data,'$.name','BE Garden') WHERE id='folder:activity-groups' AND json_extract(data,'$.kind')='folder' AND NOT EXISTS (SELECT 1 FROM events WHERE id=?)").bind(key),
  env.DB.prepare('INSERT OR IGNORE INTO events (id,data) VALUES (?,?)').bind(key,JSON.stringify({id:key,actor:'Organização de etiquetas',at:new Date().toISOString(),action:'organizou',title:'Grupos de atividades na pasta BE Garden'}))
 ]);
}
