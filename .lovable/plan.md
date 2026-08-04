---
name: Correção Final Baseada em Teste Real no Domínio Publicado
description: Plano para eliminar chamadas duplicadas de autenticação, corrigir erro de hidratação no contador e ajustar redirecionamentos canônicos.
type: feature
---

## 1. Eliminar Chamadas Duplicadas para auth/me
- **Problema**: Foram observadas 6 chamadas simultâneas para `auth/me` em páginas públicas.
- **Causa provável**: `AuthProvider` ou instâncias do `QueryClient` sendo recriadas ou disparadas por múltiplos hooks sem cache/debounce adequado.
- **Lógica de Correção**:
  - Em `src/router.tsx`, garantir que `QueryClient` seja estável (embora `getRouter` pareça ok, vamos verificar se é chamado múltiplas vezes).
  - Em `src/hooks/use-auth-session.ts`, configurar `retry: false`, `refetchOnWindowFocus: false`, `refetchOnMount: false`, e `staleTime: 1000 * 60 * 5` (5 minutos).
  - Em `src/components/auth/AuthProvider.tsx`, garantir que o estado `isAuthenticated` seja derivado apenas da `queryData` estável.
  - Verificar se componentes como `Header` ou `ProtectedRoute` estão disparando `refetch` manuais desnecessários.

## 2. Corrigir React Error #418 (Hydration Mismatch)
- **Problema**: Hydration mismatch na Home, provavelmente no `Countdown`.
- **Causa**: `Date.now()` sendo usado no render inicial ou durante a definição do estado inicial, o que difere entre Servidor (SSR) e Cliente.
- **Lógica de Correção**:
  - Em `src/components/common/Countdown.tsx`, implementar um estado `mounted` via `useEffect`.
  - Enquanto `!mounted`, renderizar um placeholder estável (ex: "--").
  - Iniciar o `setInterval` e o cálculo de tempo real apenas após a montagem no cliente.
  - Garantir que `formatBrDateTime` e outros utilitários de data sejam consistentes (America/Sao_Paulo).

## 3. Redirecionamentos Canônicos Reais
- **Problema**: `/cadastro` e `/login` apenas renderizam o componente, mas não alteram a URL para a versão canônica (`/criar-conta` e `/entrar`).
- **Lógica de Correção**:
  - Modificar `src/routes/cadastro.tsx` e `src/routes/login.tsx` para usar `loader` com `redirect({ to: '...', replace: true })` apontando para as rotas canônicas.
  - Garantir que `src/routes/entrar.tsx` e `src/routes/criar-conta.tsx` contenham os componentes reais da página.
  - **Nota**: Inverter a lógica atual se necessário para que `/entrar` e `/criar-conta` sejam as rotas que contém o código, e `/login`/`/cadastro` sejam os aliases de redirecionamento.

## 4. Validação e Segurança
- **Ação**: Garantir que erros 401 em `auth/me` não gerem logs de erro ou toasts, tratando-os como estado "desconectado" padrão.
- **Ação**: Limpeza de tokens na URL em `redefinir-senha.tsx` após sucesso.
- **Ação**: Executar `bun run build` para validar a ausência de erros de compilação.

## 5. Testes Manuais (Simulados via Código)
- **Ação**: Validar a quantidade de requests no console/network simulado.
- **Ação**: Verificar a estabilidade do HTML gerado pelo SSR vs Cliente no Countdown.
