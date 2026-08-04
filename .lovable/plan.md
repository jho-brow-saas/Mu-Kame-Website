---
name: Alteração de Favicon
description: Plano para substituir a favicon atual pela nova imagem fornecida, otimizando as dimensões para preenchimento total e alta qualidade em múltiplos formatos.
type: design
---

## Objetivo
Substituir a favicon atual do projeto pela nova imagem do escudo "K" dourado enviada pelo usuário, garantindo que ela ocupe todo o espaço disponível e seja renderizada com clareza em todas as plataformas (browsers, bookmarks, mobile).

## Análise Técnica
- O projeto atualmente usa uma URL externa para a favicon no `src/routes/__root.tsx`.
- O arquivo físico `public/favicon.ico` existe no sistema de arquivos.
- A imagem enviada pelo usuário (`user-uploads://ChatGPT_Image_4_de_ago._de_2026_20_19_56.png`) é o novo escudo oficial.

## Ações Propostas

### 1. Processamento da Imagem
- Copiar a imagem original para o diretório `public/` para processamento.
- Gerar versões redimensionadas (16x16, 32x32, 180x180 para Apple Touch, e 192x192 para Android) a partir da imagem original.
- Garantir que não haja margens transparentes excessivas no corte para que o escudo preencha o ícone.

### 2. Atualização dos Arquivos Estáticos (`public/`)
- Substituir o arquivo `public/favicon.ico` (container multiresolução).
- Adicionar `public/apple-touch-icon.png` (180x180).
- Adicionar `public/favicon-32x32.png` e `public/favicon-16x16.png`.

### 3. Ajuste no Root Route (`src/routes/__root.tsx`)
- Remover o link da favicon que aponta para uma URL externa.
- Implementar a nova estrutura de links apontando para os arquivos locais na pasta `public/`:
  - `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`
  - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`
  - `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />`
  - `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />`

## Validação
- Verificar a renderização do ícone na aba do navegador.
- Validar via DevTools se as diferentes resoluções estão sendo carregadas corretamente.
- Garantir que o ícone do "escudo dourado" não apresente distorções ou cortes indevidos.
