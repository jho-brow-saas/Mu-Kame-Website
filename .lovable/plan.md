---
name: Correção de Tamanho e Enquadramento da Logo
description: Plano para ajustar as dimensões da logo no cabeçalho, garantindo visibilidade e proporções corretas em diferentes dispositivos, lidando com margens excessivas do asset.
type: design
---

## Objetivo
Ajustar o tamanho da logo no cabeçalho para que ela tenha presença visual adequada (legível e clara), respeitando as restrições de altura do header e corrigindo o impacto das margens internas do arquivo de imagem original.

## Análise do Estado Atual
- A logo está sendo renderizada via componente `Logo.tsx` usando um asset PNG.
- A altura atual está limitada por classes `max-h-12` ou `max-h-16`.
- O usuário relata que a logo parece pequena devido a margens transparentes excessivas no próprio arquivo PNG.

## Ações Propostas

### 1. Ajuste Dimensional no Componente Logo (`src/components/layout/Logo.tsx`)
- Remover limites restritivos genéricos (`max-h-12`, `max-h-16`).
- Implementar classes responsivas específicas para a altura visual desejada, compensando as margens internas do asset:
  - **Desktop (lg):** `h-[50px]` (para atingir visualmente 46px-50px).
  - **Tablet (md):** `h-[44px]` (para atingir visualmente 40px-44px).
  - **Mobile:** `h-[38px]` (para atingir visualmente 34px-38px).
- Manter `w-auto` e `object-contain` para preservar a proporção.
- Garantir alinhamento vertical centralizado.

### 2. Ajuste de Layout no Header (`src/components/layout/Header.tsx`)
- Garantir que o container da logo no header (`Link`) tenha a classe `shrink-0` para não ser espremido pelos itens de menu.
- Verificar se há espaço suficiente no bloco esquerdo.

### 3. Testes de Responsividade
- Validar visualmente nas resoluções especificadas:
  - 320px, 375px (Mobile)
  - 768px (Tablet)
  - 1024px, 1366px, 1920px (Desktop)

## Notas Técnicas
- Não utilizaremos ferramentas de edição de imagem externas para "recortar" o asset, mas sim técnicas de dimensionamento CSS (`padding` negativo ou aumento proporcional de `height`) se o asset ainda apresentar margens internas que o tornem pequeno.
- O objetivo é a legibilidade sem aumentar a altura total do cabeçalho (que hoje é `h-16`).
