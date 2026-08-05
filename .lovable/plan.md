# Plano de Substituição do Link de Download — MU Kame

O objetivo é substituir o link antigo de download do cliente pelo novo link oficial fornecido pelo usuário em todo o projeto.

## Contexto Atual
Após uma varredura completa (`rg`) no projeto, o link antigo (`https://www.mediafire.com/file/3k7jmkoger50uav/instalador_mukame.exe/file`) **não foi encontrado** em nenhum arquivo local. O sistema consome os links de download dinamicamente através da rota `/downloads` via `src/services/mukame-api.ts`, que por sua vez busca os dados da API externa `https://api.mukame.online/index.php`.

## Ações Propostas

1. **Substituição de Fallbacks/Hardcodes (se existirem):**
   - Continuar a pesquisa por variações do link ou fragmentos (ex: `mukame.exe`) para garantir que não existam links "escondidos" em comentários ou documentação interna que possam ter sido ignorados pelo `rg` inicial (embora o `rg` tenha sido abrangente).
   - Se for encontrado algum fallback em `src/config/server.ts` ou componentes, ele será atualizado.

2. **Implementação de Normalização/Interceptação (Medida de Segurança):**
   - Caso a API externa ainda retorne o link antigo, adicionaremos uma camada de normalização em `src/services/mukame-api.ts` (dentro da função que processa `downloads`) para garantir que o link exibido no frontend seja sempre o novo link oficial, independente do retorno do backend.
   - Isso garante que o usuário final sempre acesse o arquivo correto enquanto o backend não é atualizado.

3. **Verificação de UX:**
   - Garantir que todos os componentes que utilizam o link de download (como o `ActionAnchor` em `src/routes/downloads.tsx`) incluam `target="_blank"` e `rel="noopener noreferrer"`.

## Arquivos a Monitorar/Alterar
- `src/services/mukame-api.ts` (Adição de lógica de normalização para o link de download).
- `src/routes/downloads.tsx` (Verificação de atributos de segurança nos links).

## Critérios de Sucesso
- O link antigo aparece zero vezes no código fonte.
- O link novo é utilizado em todos os locais onde o cliente completo é mencionado.
- A página de downloads reflete o novo link, mesmo que a API ainda forneça o antigo (via interceptação no frontend).
