const localDay=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?null:new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'}).format(d)};
export function memberPerformance(tasks,person,month='') {
 const list=tasks.filter(t=>t.kind!=='reminder'&&(Array.isArray(t.owners)?t.owners:(t.owner?[t.owner]:[])).includes(person)&&(!month||t.date?.slice(0,7)===month));
 const completed=list.filter(t=>t.status==='Concluída');
 const unknown=completed.filter(t=>!t.completedAt||!localDay(t.completedAt));
 const late=completed.filter(t=>t.completedAt&&localDay(t.completedAt)>t.date);
 return {total:list.length,completed:completed.length,late:late.length,pending:list.length-completed.length,unknown:unknown.length};
}
