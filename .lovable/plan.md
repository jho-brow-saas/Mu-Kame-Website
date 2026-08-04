---
name: Correção e Validação Final da Autenticação
description: Plano para corrigir expiração VIP, formatação de data de lançamento, cabeçalho autenticado e melhorias de UX/Segurança.
type: feature
---

## 1. Correção de Expiração VIP (31/12/1899)
- **Local**: `src/routes/area-do-jogador.tsx`
- **Lógica**: Adicionar função helper para validar a data. Se `AccountLevel === 0`, `AccountExpireDate === null`, data inválida ou ano <= 1900, exibir "Não se aplica". Caso contrário, formatar via `Intl.DateTimeFormat`.

## 2. Formatação da Data de Lançamento
- **Local**: `src/components/layout/Header.tsx` e `src/components/common/Countdown.tsx`
- **Lógica**: Criar utilitário `src/lib/date-utils.ts` para centralizar a formatação pt-BR usando `Intl.DateTimeFormat` (ex: `01/09/2026 às 00:00`). Substituir o uso de `launchLabel` bruto.

## 3. Cabeçalho Autenticado
- **Local**: `src/components/layout/Header.tsx`
- **Ação**: Consumir `useAuth` no Header. Se `isAuthenticated` for true, substituir o botão "Entrar" por "Área do Jogador" apontando para `/area-do-jogador`. Adicionar um pequeno indicador visual (dot de status ou ícone).

## 4. Aliases de Rotas
- **Local**: Criar `src/routes/entrar.tsx` e `src/routes/criar-conta.tsx`.
- **Ação**: Usar `redirect` do TanStack Router para encaminhar `/entrar` -> `/login` e `/criar-conta` -> `/cadastro`. Atualizar todos os `ActionLink` e `Link` no projeto para usar as rotas canônicas (entrar/criar-conta).

## 5. Melhoria do Link "Esqueci minha senha"
- **Local**: `src/routes/login.tsx`
- **Ação**: Ajustar classes Tailwind para melhorar contraste, hover, focus e área clicável. Garantir suporte a teclado.

## 6. Área do Jogador (Refinamento)
- **Local**: `src/routes/area-do-jogador.tsx`
- **Ação**: 
  - Validar e-mail mascarado.
  - Atualizar card "Segurança" para apontar para `/esqueci-minha-senha` com label "Redefinir senha por e-mail".
  - Garantir que o card "Moedas" não exiba saldos fictícios (manter como acesso futuro/placeholder sem valores).

## 7. Token de Redefinição
- **Local**: `src/routes/redefinir-senha.tsx`
- **Ação**: Garantir que o token seja removido da URL via `history.replaceState` apenas após a chamada de sucesso da API. Limpar campos.

## 8. Verificação do Selo Lovable
- **Ação**: Orientar o usuário a verificar em aba anônima (como o selo é injetado pela plataforma para editores, ele não aparece na versão publicada para visitantes externos).

## 9. Testes e Relatório Final
- **Ação**: Executar `typecheck`, `build` e fornecer o relatório detalhado solicitado.
