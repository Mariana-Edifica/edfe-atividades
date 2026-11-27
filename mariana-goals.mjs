const item=(text,done=false,units=1)=>({text,done,units});
export const marianaGoals={okrs:[
{name:'OKR1',groups:[{title:'Atendimento ao checklist do PDE para entrega do BE01',weight:20,items:[item('Manuais'),item('Entrega para clientes'),item('Unidade decorada'),item('Contratos da obra'),item('Instituição e averbação do condomínio')]}]},
{name:'OKR2',groups:[{title:'Otimizações do CRM',weight:20,items:[item('Parametrização do acesso corretor'),item('Incluir as plantas demonstrativas no Portal do Cliente',true),item('Banners do portal',true),item('Alteração da comissão para geral manual',true),item('Mais 6 otimizações',false,6)]}]},
{name:'OKR3',groups:[{title:'Desenvolver projeto do site de produto',weight:15,items:[item('Empreendimentos (50%)',true,50),item('Certificação (30%)',true,30),item('Conceito (20%)',false,20)]},{title:'Desenvolver projeto de otimizações do comitê',weight:15,items:[item('Site de comitê de vendas',true)]}]},
{name:'OKR4',groups:[{title:'Treinamentos de produto',weight:10,target:9,completed:6,items:[]},{title:'Garantir entrega do comitê de vendas',weight:10,target:3,completed:2,items:[]},{title:'Garantir qualidade do DV',weight:10,target:3,completed:2,items:[]}]}
]};
