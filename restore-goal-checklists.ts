import {env} from 'cloudflare:workers';
import {hellenGoals} from './hellen-goals.mjs';
import {marianaGoals} from './mariana-goals.mjs';
const marker='restore:goal-checklists-20261123';
export async function ensureGoalChecklists(){
 if(await env.DB.prepare('SELECT id FROM events WHERE id=?').bind(marker).first())return;
 const commands:any[]=[];
 for(const member of ['hellen','mariana']){
  const row:any=await env.DB.prepare('SELECT data,version FROM goals WHERE id=?').bind(member).first();
  const backup:any=await env.DB.prepare('SELECT data FROM events WHERE id=?').bind('correction:goal-measurements-20261123:'+member).first();
  const defaults=member==='hellen'?hellenGoals:marianaGoals;
  const historical=backup?JSON.parse(backup.data).before:null;
  const before=row?JSON.parse(row.data):defaults,next=structuredClone(before);
  const indexes=member==='hellen'?[[1,1]]:[[1,0],[2,1]];
  for(const [oi,gi] of indexes){const original=historical?.okrs?.[oi]?.groups?.[gi];const source=original?.items?.length?original:defaults.okrs[oi].groups[gi];const group=next.okrs[oi].groups[gi];group.items=structuredClone(source.items);for(const key of ['target','completed','metric','progress','points','total'])delete group[key];}
  if(row)commands.push(env.DB.prepare('UPDATE goals SET data=?,version=version+1 WHERE id=? AND version=? AND NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(JSON.stringify(next),member,row.version,marker));
  else commands.push(env.DB.prepare('INSERT OR IGNORE INTO goals (id,data,version) SELECT ?,?,1 WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(member,JSON.stringify(next),marker));
  commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM events WHERE id=?)').bind(marker+':'+member,JSON.stringify({id:marker+':'+member,actor:'Ajuste das metas',at:new Date().toISOString(),action:'restaurou',title:'Checklists de '+member,before,after:next}),marker));
 }
 commands.push(env.DB.prepare('INSERT OR IGNORE INTO events (id,data) VALUES (?,?)').bind(marker,JSON.stringify({id:marker,actor:'Ajuste das metas',at:new Date().toISOString(),action:'restaurou',title:'Formato de checklist das três metas solicitadas'})));
 await env.DB.batch(commands);
}
