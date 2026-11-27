import {hellenGoals} from './hellen-goals.mjs';
import {marianaGoals} from './mariana-goals.mjs';
export function sharedMarianaGoals(mariana=marianaGoals,hellen=hellenGoals){
 const sources=[hellen.okrs[0].groups[0],hellen.okrs[1].groups[0],hellen.okrs[1].groups[1]];
 return {...mariana,okrs:mariana.okrs.map(okr=>okr.name==='OKR4'?{...okr,groups:sources.map((group,i)=>({title:group.title,...(group.target!=null?{target:group.target,completed:group.completed,metric:group.metric}:{}),weight:marianaGoals.okrs[3].groups[i].weight,items:group.items.map(item=>({...item})),linkedMember:'hellen',linkedGroup:i}))}:okr)};
}
