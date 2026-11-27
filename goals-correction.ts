import {env} from 'cloudflare:workers';
import {hellenGoals} from './hellen-goals.mjs';
import {marianaGoals} from './mariana-goals.mjs';
const marker='correction:goal-measurements-20261123';
export async function ensureGoalMeasurements(){
 if(await env.DB.prepare('SELECT id FROM events WHERE id=?').bind(marker).first())return;
 const rows=await env.DB.prepare('SELECT id,data,version FROM goals').all();
 const commands:any[]=[];
 for(const member of ['hellen','mariana']){
  const row:any=rows.results.find((r:any)=>r.id===member);const before=row?JSON.parse(row.data):null;const next=structuredClone(before||(member==='hellen'?hellenGoals:marianaGoals));
  if(member==='hellen')Object.assign(next.okrs[1].groups[1],{target:100,completed:96.27,metric:'percent',items:[]});
  else{Object.assign(next.okrs[1].groups[0],{target:10,completed:4,metric:'count',items:[]});Object.assign(next.okrs[2].groups[1],{target:10,completed:0,metric:'count',items:[]});}
  // Only apply to the revision read; a concurrent edit is never overwritten.
  if(row)commands.push(env.DB.prepare('UPDATE goals SET data=?,version=version+1 WHERE id=? AND version=? AND NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(JSON.stringify(next),member,row.version,marker));
  else commands.push(env.DB.prepare('INSERT OR IGNORE INTO goals (id,data,version) SELECT ?,?,1 WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(member,JSON.stringify(next),marker));
  commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(marker+':'+member,JSON.stringify({id:marker+':'+member,actor:'Ajuste das metas',at:new Date().toISOString(),action:'ajustou',title:'Indicadores de '+member+' conforme prints de 23/11/2026',before,after:next}),marker));
 }
 commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) VALUES (?,?)').bind(marker,JSON.stringify({id:marker,actor:'Ajuste das metas',at:new Date().toISOString(),action:'conferiu',title:'Bases de medição dos OKRs'})));
 await env.DB.batch(commands);
}
