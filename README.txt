MU NEON DASHBOARD - ADMIN EDITION
Compatibilidade alvo: PHP 5.2.1 + extensão MSSQL antiga

INSTALAÇÃO
1. Envie todo o conteúdo da pasta para o servidor web.
2. Edite config.php e informe DB_HOST, DB_USER, DB_PASS e DB_NAME.
3. Garanta permissão de escrita nas pastas:
   - dados/
   - uploads/backgrounds/
4. Para acessar Administração, a conta precisa possuir MEMB_INFO.level = 1.

RECURSOS DO ADMIN
- Background do panel hero-card da index salvo em dados/hero_background.txt.
- Fundo da index com gradiente ou imagem + efeito fade salvo em dados/index_background.txt.
- Upload das imagens para uploads/backgrounds/.
- Cadastro, edição e exclusão de downloads salvos em dados/downloads.txt.
- Ativação/desativação e links de YouTube, Discord, Instagram, Facebook, LinkedIn e WhatsApp salvos em dados/socials.txt.

IDIOMAS
Seletor no topo: Português, Espanhol, Vietnamita, Chinês e Inglês.
A preferência é mantida em sessão/cookie.

LOGIN E CADASTRO
Os formulários são apresentados em modais modernos centralizados.
A autenticação continua usando a tabela MEMB_INFO e o cadastro cria também CashShopData quando necessário.

OBSERVAÇÃO
Os links iniciais de downloads usam # e devem ser alterados no painel Admin.
As redes sociais vêm desativadas por padrão e podem ser ativadas no painel Admin.
