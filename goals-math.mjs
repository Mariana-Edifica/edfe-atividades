/** Group weights are points out of 100; items share their group's weight. */
export function calculateGoals(data) {
  const okrs = data.okrs.map(okr => {
    const groups = okr.groups.map(group => {
      const weight = Number(group.weight ?? 20);
      const total = group.target != null ? Number(group.target) : group.items.reduce((sum,item)=>sum+Number(item.units??1),0);
      const completed = group.target != null ? Math.max(0,Math.min(total,Number(group.completed||0))) : group.items.reduce((sum,item)=>sum+(item.done?Number(item.units??1):0),0);
      const progress = total > 0 ? completed / total * 100 : 0;
      return {...group,weight,total,completed,progress,points:progress/100*weight};
    });
    const points=groups.reduce((sum,group)=>sum+group.points,0);
    const weight=groups.reduce((sum,group)=>sum+group.weight,0);
    const manualProgress=Math.max(0,Math.min(100,Number(okr.manualProgress ?? (weight?points/weight*100:0))));
    return {...okr,groups,weight,manualProgress,points:manualProgress/100*weight,progress:manualProgress};
  });
  return {...data,okrs,score:okrs.reduce((sum,okr)=>sum+okr.points,0)};
}
