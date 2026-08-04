export const serverConfig = {
  name: "MU Kame",
  slogan: "Reviva a lenda. Construa seu legado.",
  tagline: "A era de ouro está de volta.",
  season: "6.15",
  mode: "Medium",
  launchDate: "2026-09-01T00:00:00-03:00",
  launchLabel: "01 de setembro de 2026 às 00:00",
  timezone: "America/Sao_Paulo",
  masterLevel: 400,
  maxStats: 65000,
  classesCount: 7,
  platform: "PC",
  supportWhatsApp: "5531990866048",
  supportWhatsAppLabel: "+55 31 99086-6048",
  supportMessage: "Olá, preciso de suporte no MU Kame.",
  socialHandle: "@mukame",
  instagramUrl: "https://instagram.com/mukame",
  tiktokUrl: "https://tiktok.com/@mukame",
  pcDownloadUrl: "http://mukame.online/downloads.php",
  patchDownloadUrl: "http://mukame.online/downloads.php",
  androidAvailable: false,
  castleSiegeSchedule: null as string | null,
  siteUrl: "https://novo.mukame.online",
} as const;

export const whatsappLink = `https://wa.me/${serverConfig.supportWhatsApp}?text=${encodeURIComponent(
  serverConfig.supportMessage,
)}`;

export type VipPlan = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  experience: string;
  drop: string;
  featured?: boolean;
  note: string;
};

export const vipPlans: VipPlan[] = [
  {
    id: "bronze",
    name: "VIP Bronze",
    price: 29.9,
    durationDays: 30,
    experience: "1100x",
    drop: "70%",
    note: "Acesso aos benefícios Bronze",
  },
  {
    id: "silver",
    name: "VIP Prata",
    price: 39.9,
    durationDays: 30,
    experience: "1300x",
    drop: "80%",
    featured: true,
    note: "Acesso aos benefícios Prata",
  },
  {
    id: "gold",
    name: "VIP Ouro",
    price: 49.9,
    durationDays: 30,
    experience: "1500x",
    drop: "90%",
    note: "Experiência VIP máxima",
  },
];

export const serverRates = [
  { id: "normal", name: "Conta Normal", experience: "900x", drop: "60%" },
  { id: "bronze", name: "VIP Bronze", experience: "1100x", drop: "70%" },
  { id: "silver", name: "VIP Prata", experience: "1300x", drop: "80%" },
  { id: "gold", name: "VIP Ouro", experience: "1500x", drop: "90%" },
];

export const serverHighlights = [
  { label: "Season", value: "6.15" },
  { label: "Progressão", value: "Medium" },
  { label: "Master Level", value: "400" },
  { label: "Status máximo", value: "65.000" },
  { label: "Classes", value: "7" },
  { label: "Plataforma", value: "PC no lançamento" },
];

export const differentials = [
  "Progressão Medium equilibrada",
  "Reset e Master Reset",
  "Master Level 400",
  "Auto Reset",
  "Off Attack",
  "Salas Iniciante, PvP e VIP",
  "Rankings gerais, semanais e mensais",
  "Sistema de guilds",
  "Castle Siege",
  "Eventos clássicos",
  "Invasões personalizadas",
  "Suporte brasileiro",
];

export type GameEvent = {
  name: string;
  type: "Clássico" | "Invasão" | "PvP" | "Guild" | "Personalizado";
  description: string;
};

export const gameEvents: GameEvent[] = [
  { name: "Blood Castle", type: "Clássico", description: "Corrida contra o tempo para libertar o arcanjo e reivindicar sua recompensa." },
  { name: "Devil Square", type: "Clássico", description: "Arena fechada com ondas de criaturas e disputa por pontuação." },
  { name: "Chaos Castle", type: "PvP", description: "Sobrevivência em arena reduzida onde apenas um permanece de pé." },
  { name: "Illusion Temple", type: "PvP", description: "Confronto por equipes em um templo instável de energia arcana." },
  { name: "Doppelganger", type: "Clássico", description: "Espelhos de batalha com salas temáticas e recompensas variáveis." },
  { name: "Imperial Guardian", type: "Clássico", description: "Desafio progressivo de sala em sala contra guardiões imperiais." },
  { name: "Golden Invasion", type: "Invasão", description: "Criaturas douradas surgem nos mapas com drops diferenciados." },
  { name: "Crywolf", type: "Guild", description: "Defesa da fortaleza contra as forças que avançam sobre o continente." },
  { name: "Kanturu", type: "Clássico", description: "Sequência de ruínas, refúgio e o núcleo da máquina desperta." },
  { name: "Raklion", type: "Guild", description: "Enfrentamento coletivo contra o senhor das profundezas." },
  { name: "Castle Siege", type: "Guild", description: "A grande guerra de guilds pela posse do castelo e seus tributos." },
  { name: "Eventos personalizados", type: "Personalizado", description: "Invasões e desafios exclusivos criados para a comunidade MU Kame." },
];

export const faqItems = [
  {
    q: "Quando o MU Kame será lançado?",
    a: "O lançamento oficial acontece em 01 de setembro de 2026, à meia-noite, no horário de Brasília (America/Sao_Paulo).",
  },
  { q: "Qual é a Season?", a: "O MU Kame roda a Season 6.15." },
  { q: "O servidor é Easy, Medium ou Hard?", a: "A progressão é Medium, com experiência de 900x na conta normal e até 1500x no VIP Ouro." },
  { q: "O cliente funciona em Android?", a: "Ainda não. A versão Android está em desenvolvimento e não possui data divulgada." },
    { q: "Temos envio de e-mail gratuito?", a: "Sim! O MU Kame fornece envio de e-mails transacionais (como recuperação de senha e confirmação de cadastro) sem custos para o jogador." },
    { q: "Como faço para criar uma conta?", a: "Acesse a página de cadastro, escolha usuário e senha, informe um e-mail válido e aceite as regras do servidor." },
  { q: "Onde baixo o cliente?", a: "O cliente completo para Windows e o patch de atualização estão na página de downloads." },
  { q: "Como entrar em contato com o suporte?", a: `O suporte oficial é feito pelo WhatsApp ${serverConfig.supportWhatsAppLabel}.` },
  { q: "Quando será o primeiro Castle Siege?", a: "A data e o horário do primeiro Castle Siege ainda serão divulgados." },
];

export type RulesSection = { title: string; items: string[] };

export const rulesSections: RulesSection[] = [
  {
    title: "1. Conduta geral",
    items: [
      "Respeite todos os jogadores e a equipe do servidor.",
      "É proibido usar nomes ofensivos, discriminatórios ou que imitem membros da equipe.",
      "Divulgação de outros servidores nos canais oficiais resulta em banimento.",
    ],
  },
  {
    title: "2. Programas de terceiros",
    items: [
      "Bots externos, macros de terceiros, hacks e speed são terminantemente proibidos.",
      "Exploração de falhas (bugs) deve ser comunicada ao suporte, não utilizada.",
      "Contas envolvidas em duplicação de itens ou Zen são removidas permanentemente.",
    ],
  },
  {
    title: "3. Contas e comércio",
    items: [
      "Cada jogador é responsável pela segurança da própria senha.",
      "A equipe nunca solicita senha por WhatsApp, chat do jogo ou redes sociais.",
      "Negociações feitas fora dos sistemas oficiais do jogo não têm suporte.",
    ],
  },
  {
    title: "4. Guilds e Castle Siege",
    items: [
      "Acordos entre guilds para manipular resultados de eventos são proibidos.",
      "Contas secundárias usadas para sabotar eventos serão punidas.",
      "A administração pode ajustar regras do Castle Siege para manter o equilíbrio.",
    ],
  },
  {
    title: "5. Punições",
    items: [
      "As punições variam de advertência e silenciamento a banimento permanente.",
      "A gravidade e a reincidência definem a punição aplicada.",
      "Decisões da administração são finais, com direito a recurso pelo suporte oficial.",
    ],
  },
];

