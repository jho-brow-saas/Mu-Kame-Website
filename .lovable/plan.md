# Plano de Otimização da Favicon — MU Kame

O usuário solicitou o aumento do tamanho da favicon, relatando que ela está pequena demais na aba do navegador. Isso geralmente ocorre devido a margens transparentes excessivas no asset original ou no processo de redimensionamento anterior.

## Ações Técnicas

1. **Processamento de Imagem (Python + PIL):**
   - Utilizar a imagem original do escudo (`ChatGPT_Image_4_de_ago._de_2026_20_19_56.png`).
   - Aplicar `getbbox()` para detectar e remover qualquer espaço vazio/transparente ao redor do escudo.
   - Garantir que o escudo ocupe 100% da área do canvas (crop agressivo).
   - Gerar novamente os assets em `public/` com preenchimento total:
     - `favicon-16x16.png`
     - `favicon-32x32.png`
     - `apple-touch-icon.png` (180x180)
     - `android-chrome-192x192.png`
     - `android-chrome-512x512.png`
     - `favicon.ico` (container com 16, 32 e 48px)

2. **Verificação de Metadados:**
   - Confirmar se o `src/routes/__root.tsx` já possui as tags corretas (confirmado na análise prévia).
   - O foco será puramente na qualidade e no enquadramento dos arquivos binários.

## Critérios de Sucesso
- O escudo "K" deve tocar ou chegar muito perto das bordas do ícone na aba do navegador.
- Resolução nítida em telas Retina/High-DPI.
