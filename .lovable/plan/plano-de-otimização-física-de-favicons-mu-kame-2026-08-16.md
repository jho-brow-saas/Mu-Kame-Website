# Plano de Otimização Física de Favicons - MU Kame

O objetivo deste plano é realizar uma modificação física agressiva nos arquivos de imagem do favicon para que o escudo dourado ocupe 96% da área disponível, eliminando quase totalmente as margens transparentes.

## Ações Propostas

### 1. Processamento Digital de Imagem (Scripts)
- Utilizar um script Python com a biblioteca `Pillow` para:
    - Identificar os limites reais (bounding box) dos pixels visíveis nos arquivos atuais.
    - Realizar um crop (corte) exato nesses limites.
    - Redimensionar o escudo resultante para preencher 96% da largura e altura das dimensões alvo (16, 32, 48, 180, 192, 512).
    - Centralizar o escudo com margem mínima (1px em resoluções baixas).
- Salvar fisicamente os novos arquivos em `public/`.

### 2. Validação de Integridade e Tamanho
- Comparar o tamanho em bytes e dimensões dos novos arquivos com os antigos para garantir que a mudança física ocorreu.
- Listar as propriedades finais de cada arquivo.

### 3. Atualização de Metadados e Cache-Busting
- Atualizar `src/routes/__root.tsx` para usar a versão `v=7` em todos os links de favicon.
- Remover quaisquer referências duplicadas detectadas no `head`.

### 4. Publicação
- Acionar o deploy para produção.

## Arquivos Afetados
- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon-48x48.png`
- `public/apple-touch-icon.png`
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `src/routes/__root.tsx`
