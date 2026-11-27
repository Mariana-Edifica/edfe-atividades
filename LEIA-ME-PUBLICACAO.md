# Pacote reduzido para envio pelo GitHub

Este ZIP tem menos de 100 arquivos. Extraia e envie os arquivos e pastas, não o ZIP. O package.json já está na raiz. Foram retirados somente componentes de interface, hooks e exemplos de demonstração sem uso no aplicativo.

O código continua dependendo de Cloudflare; a adaptação para Vercel descrita abaixo continua necessária.

# Daily EDFE | Pacote completo do código-fonte

Exportado em 27/11/2026 da versão publicada, commit d584ab4183b76e105d99829551b20303f176bb1c.

## O que está no ZIP

Este pacote contém todos os arquivos versionados do projeto: telas, estilos, imagens, ícone da BE-e, APIs, dependências declaradas, lockfile e migrações SQL. O código inclui observações compartilhadas e percentuais manuais dos OKRs. Não inclui node_modules, Git, senhas, arquivos .env, banco de produção ou documentos anexados pelos usuários. As atividades de importação e metas iniciais existentes no código estão incluídas; elas não equivalem ao estado atual do banco.

## Atenção antes de publicar na Vercel

Este é o código original completo, NÃO uma conversão pronta para a Vercel. O servidor atual usa Vinext/Vite, Cloudflare Workers, D1 e R2, além da proteção de acesso da hospedagem atual. Subir esses arquivos sem adaptação na Vercel não mantém o site funcionando. Os serviços gerenciados e a proteção privada não são transferidos com o ZIP.

## 1. Colocar no GitHub

1. Extraia o ZIP no computador.
2. Crie um repositório privado no GitHub para o Daily.
3. Envie os arquivos extraídos deste ZIP para a raiz do repositório. O arquivo package.json deve estar na raiz, não dentro de uma pasta adicional. Inclua também os arquivos ocultos versionados, como .gitignore e .openai/hosting.json.
4. Não envie o ZIP como único arquivo do repositório: ele deve ser extraído.
5. Não coloque senhas, tokens ou arquivos .env no repositório.

O GitHub guarda o código. GitHub Pages sozinho não executa as APIs e o banco deste aplicativo.

## 2. O que precisa ser adaptado para a Vercel

Uma pessoa de desenvolvimento precisará:

- Migrar a execução de Vinext/Cloudflare para Next.js no runtime Node da Vercel, ou escolher e validar outro adaptador compatível.
- Ajustar os comandos de desenvolvimento, build e start no package.json e regenerar o lockfile. No Next.js convencional, seriam `next dev`, `next build` e `next start`. Só trocar os comandos não resolve as dependências abaixo.
- Substituir os imports `cloudflare:workers`, `env.DB` e `env.BUCKET` por integrações disponíveis no novo ambiente. Eles existem nas APIs e nos arquivos de importação/correção do banco.
- Configurar um banco persistente e adaptar as consultas, transações, controle de versões e migrações. As tabelas atuais são tasks, events, labels e goals. A tabela goals também guarda as observações com id team-observations.
- Configurar armazenamento privado para anexos, com upload e download autenticados. Não gravar os anexos no disco temporário da função.
- Implementar autenticação e autorização de leitura e escrita. O seletor Hellen/Mariana na tela identifica a autoria, mas NÃO é login. O site atual depende também da barreira privada da plataforma, que não acompanha uma publicação externa.
- Adaptar ou retirar os componentes e endpoints específicos da plataforma, por exemplo app/chatgpt-auth.ts e a integração de build em scripts/vite/ e worker/.
- Configurar credenciais do novo banco, armazenamento e autenticação nas variáveis de ambiente da Vercel. Os nomes exatos dependerão das integrações escolhidas; não há credenciais prontas neste pacote.

## 3. Depois da adaptação

1. Crie uma conta/projeto na Vercel e conecte o repositório GitHub.
2. Importe o repositório e selecione o framework correspondente à versão adaptada.
3. Adicione as variáveis de ambiente de banco, armazenamento e autenticação.
4. Execute as migrações do novo banco.
5. Faça o primeiro deploy em ambiente de teste.
6. Confira login, edição concorrente, quadro, drag-and-drop, etiquetas, anexos, observações, metas manuais, calendário, histórico, resumo WhatsApp e desempenho mensal.
7. Só use em produção depois de confirmar que o acesso continua privado e que os dados persistem após novos deploys.

## 4. Preservar os dados atuais

Este ZIP é uma exportação de código, não um backup dos dados vivos. Antes de trocar o endereço em uso, exporte o banco de produção (tarefas, etiquetas, metas, observações e histórico) e copie os documentos do armazenamento de anexos. Depois importe os dados no destino preservando ids, versões e referências. A publicação atual continua intacta.

## Estrutura principal

- app/page.tsx: tela principal e quadro de atividades.
- app/goals.tsx e app/goals-math.mjs: metas e percentuais.
- app/observations.tsx: observações compartilhadas.
- app/performance.tsx: desempenho mensal.
- app/api/: rotas de dados e anexos.
- public/: fotos, imagens e ícones.
- drizzle/: migrações do esquema original.
- package.json e package-lock.json: dependências e comandos originais.
- vite.config.ts, worker/ e scripts/: execução e build originais.

## Referências oficiais

- https://vercel.com/docs/git
- https://nextjs.org/docs/app/getting-started/deploying

Não é necessário publicar nada para consultar ou guardar este pacote. Nenhuma conta externa foi criada ou alterada nesta exportação.
