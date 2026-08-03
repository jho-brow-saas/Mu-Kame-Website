# Plano de Implementação - Novo Website Oficial MU Kame

O usuário solicitou a criação do website oficial para o "MU Kame", com uma estética inspirada na era de ouro do MU Online (anos 2000) mas com uma roupagem moderna e profissional. O desenvolvimento será focado apenas no frontend com dados demonstrativos, mantendo a integração atual com o GitHub.

## Visão Geral do Design (Mega-skill: frontend-mega)
- **Estética**: "Dark Fantasy" Medieval com toques sutis de anime dos anos 2000.
- **Paleta de Cores**: Tons profundos (preto, cinza grafite) com destaques em dourado, rubi ou ciano (remetendo a itens excelentes/joias).
- **Tipografia**: Fontes fortes e legíveis, possivelmente uma mistura de serifadas clássicas para títulos e sans-serif modernas para conteúdo.
- **Elementos**: Texturas de metal, pedra e brilhos sutis ("glow" de itens +13).

## Arquitetura de Rotas (Mega-skill: architecture-mega)
- `/` - Landing Page (Início)
- `/cadastro` - Formulário de criação de conta
- `/login` - Acesso à conta
- `/downloads` - Links para o cliente do jogo
- `/rankings` - Tabelas de classificação (Reset, PK, Guilds)
- `/personagens` - Wiki/Informações de classes
- `/vip` - Vantagens e planos
- `/suporte` - Central de ajuda

## Componentes a Desenvolver
- **Navbar & Footer**: Navegação responsiva com estética medieval.
- **Hero Section**: CTA principal (Jogar/Download), status do servidor (Online/Offline) e contador de jogadores.
- **Sidebar (Desktop)**: Rankings rápidos, notícias e widgets de redes sociais.
- **Grid de Notícias**: Layout de cards para eventos e atualizações.
- **Tabelas de Ranking**: Estilizadas e responsivas.

## Plano de Ação

### Fase 1: Fundação e Layout Base
1. Configurar o `src/routes/__root.tsx` com o layout global (Navbar, Sidebar, Footer).
2. Criar os tokens de design (cores e fontes) no `src/styles.css` usando variáveis do Tailwind v4.

### Fase 2: Roteamento
1. Criar os arquivos de rota para todas as páginas solicitadas.
2. Implementar o `head()` em cada rota com SEO otimizado.

### Fase 3: Landing Page (Home)
1. Desenvolver a Hero Section com o status do servidor em tempo real (simulado).
2. Implementar seções de Notícias e Rankings demonstrativos.

### Fase 4: Páginas de Conteúdo
1. Criar o formulário de Cadastro/Login com validação Zod.
2. Desenvolver a página de Downloads com guias de instalação.
3. Criar as páginas de VIP, Personagens e Suporte com conteúdo estático de alta qualidade.

### Fase 5: Polimento e Responsividade
1. Garantir que o layout "Mobile-first" esteja impecável.
2. Adicionar animações sutis (Framer Motion ou CSS Transitions) para a sensação "Premium".

## Verificação Técnica
- Validar se todos os links internos estão funcionando.
- Garantir que não há referências a marcas protegidas (Webzen, etc).
- Testar a performance (LCP e CLS).

Confirmar se a direção visual de "Dark Fantasy Medieval + 2000s Anime" está correta para iniciarmos a codificação.
