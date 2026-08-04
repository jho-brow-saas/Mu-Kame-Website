# Plano de Implementação Final da Autenticação — MU Kame API 2.1.1

Este plano detalha as etapas para a transição completa do sistema de autenticação para a versão 2.1.1 da API oficial, garantindo segurança máxima (HttpOnly cookies), persistência de sessão e novas funcionalidades como recuperação de senha.

## 1. Definições de Tipos e Contratos (`src/types/mukame-auth.ts`)
- [ ] Atualizar `AuthAccount` e `AuthSession` para refletir exatamente o payload da API 2.1.1.
- [ ] Adicionar interfaces para `ForgotPasswordResponse` e `ResetPasswordResponse`.
- [ ] Mapear todos os códigos de erro listados (ex: `INVALID_RESET_TOKEN`, `AUTH_DATABASE_UNAVAILABLE`).

## 2. Camada de Serviço e Segurança (`src/services/mukame-auth-api.ts`)
- [ ] Refatorar `authRequest` para ser a função central definitiva.
- [ ] Garantir `credentials: "include"` em todas as chamadas.
- [ ] Implementar tratamento rigoroso de respostas (verificar `ok: true` no payload).
- [ ] Adicionar exportação da classe `MukameAuthError` com suporte a códigos específicos.
- [ ] Remover qualquer lógica de proxy em produção; chamar `https://api.mukame.online/index.php`.

## 3. Gestão de Estado Global (`src/components/auth/AuthProvider.tsx`)
- [ ] Adicionar `forgotPassword` e `resetPassword` ao contexto.
- [ ] Garantir que `isLoading` reflita o estado de verificação inicial da sessão (`auth/me`).
- [ ] Implementar `refreshSession` chamando `refetch()` da query de sessão.
- [ ] Validar que nenhum dado de sessão seja persistido no `localStorage`.

## 4. Hooks de Autenticação e TanStack Query (`src/hooks/use-auth-session.ts`)
- [ ] Centralizar as keys `["auth", "me"]` e `["account", "characters"]`.
- [ ] Configurar `retry: false` para erros 401.
- [ ] Criar novos hooks:
    - `useForgotPassword()`
    - `useResetPassword()`
- [ ] Garantir que `useAccountCharacters` tenha `enabled: isAuthenticated`.
- [ ] Normalizar personagens usando `Array.isArray` como medida defensiva.

## 5. Fluxos de Interface (UI/UX)

### Cadastro (`/criar-conta`)
- [ ] Adicionar campos `confirmGamePassword` e `confirmPassword`.
- [ ] Implementar medidor de requisitos de senha para a Área do Jogador (mínimo 12 chars).
- [ ] Adicionar botões mostrar/ocultar senha.
- [ ] Melhorar mensagens de erro específicas para cada campo.
- [ ] Redirecionar para `/entrar` após sucesso, sem login automático.

### Login (`/entrar`)
- [ ] Adicionar link "Esqueci minha senha" redirecionando para `/esqueci-minha-senha`.
- [ ] Garantir `autocomplete` correto nos campos.
- [ ] Manter mensagem de erro genérica ("Login ou senha inválidos").

### Recuperação de Senha (`/esqueci-minha-senha` e `/redefinir-senha`)
- [ ] Criar rota `/esqueci-minha-senha` com formulário de envio de e-mail.
- [ ] Criar rota `/redefinir-senha` que lê o `token` da URL.
- [ ] Implementar validação de token hexadecimal de 64 caracteres.
- [ ] Exibir mensagem de sucesso orientando o login manual após a troca.

### Área do Jogador (`/area-do-jogador`)
- [ ] Garantir proteção da rota (redirecionar se deslogado).
- [ ] Exibir lista de personagens real mapeando IDs de classe para nomes usando `CLASS_LABELS`.
- [ ] Mascarar e-mail exibido.
- [ ] Remover qualquer exibição de dados técnicos sensíveis.

## 6. Verificação e Build
- [ ] Rodar `bun run typecheck` para garantir integridade dos tipos.
- [ ] Rodar `bun run build` para validar bundle de produção.
- [ ] Instruir teste manual no domínio `novo.mukame.online`.

## Arquivos Afetados:
- `src/types/mukame-auth.ts`
- `src/services/mukame-auth-api.ts`
- `src/hooks/use-auth-session.ts`
- `src/components/auth/AuthProvider.tsx`
- `src/routes/cadastro.tsx`
- `src/routes/login.tsx`
- `src/routes/area-do-jogador.tsx`
- `src/routes/esqueci-minha-senha.tsx` (Novo)
- `src/routes/redefinir-senha.tsx` (Novo)
- `src/routes/__root.tsx` (Injeção de Toaster/AuthProvider se necessário)
