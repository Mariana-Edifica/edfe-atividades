export function gardenProgress(tasks){
 const list=tasks.filter(t=>t.kind!=='reminder'&&t.garden?.project==='BE Garden');
 const weight=t=>Number.isFinite(Number(t.garden.weight))?Math.max(0,Number(t.garden.weight)):0;
 const target=list.filter(t=>t.garden.target&&t.garden.quarter==='2026-Q4');
 const total=list.reduce((n,t)=>n+weight(t),0),goal=target.reduce((n,t)=>n+weight(t),0),done=target.filter(t=>t.status==='Concluída').reduce((n,t)=>n+weight(t),0);
 return {count:list.length,total,goal,done,goalPercent:total?goal/total*100:0,donePercent:total?done/total*100:0,progress:goal?done/goal*100:0};
}
