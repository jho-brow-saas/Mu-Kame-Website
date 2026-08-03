export type CharacterClassKey =
  | "dark-wizard"
  | "dark-knight"
  | "fairy-elf"
  | "magic-gladiator"
  | "dark-lord"
  | "summoner"
  | "rage-fighter";

export type CharacterClass = {
  key: CharacterClassKey;
  name: string;
  evolutions: string[];
  role: string;
  description: string;
};

export const characterClasses: CharacterClass[] = [
  {
    key: "dark-wizard",
    name: "Dark Wizard",
    evolutions: ["Dark Wizard", "Soul Master", "Grand Master"],
    role: "Dano mágico à distância",
    description: "Domina energia arcana bruta e converte conhecimento antigo em devastação em área.",
  },
  {
    key: "dark-knight",
    name: "Dark Knight",
    evolutions: ["Dark Knight", "Blade Knight", "Blade Master"],
    role: "Combate corpo a corpo resistente",
    description: "Linha de frente clássica, com alta vitalidade e golpes de impacto direto.",
  },
  {
    key: "fairy-elf",
    name: "Fairy Elf",
    evolutions: ["Fairy Elf", "Muse Elf", "High Elf"],
    role: "Ataque à distância e suporte",
    description: "Precisão com arco, bênçãos de grupo e controle de campo em batalhas longas.",
  },
  {
    key: "magic-gladiator",
    name: "Magic Gladiator",
    evolutions: ["Magic Gladiator", "Duel Master"],
    role: "Híbrido força e magia",
    description: "Alterna lâmina e feitiço, ideal para progressão rápida e duelos versáteis.",
  },
  {
    key: "dark-lord",
    name: "Dark Lord",
    evolutions: ["Dark Lord", "Lord Emperor"],
    role: "Comando e liderança de guild",
    description: "Conduz tropas, invoca sua montaria e amplifica o desempenho dos aliados.",
  },
  {
    key: "summoner",
    name: "Summoner",
    evolutions: ["Summoner", "Bloody Summoner", "Dimension Master"],
    role: "Maldições e dano contínuo",
    description: "Enfraquece inimigos com selos e maldições antes do golpe final.",
  },
  {
    key: "rage-fighter",
    name: "Rage Fighter",
    evolutions: ["Rage Fighter", "Fist Master"],
    role: "Combate marcial agressivo",
    description: "Sequências rápidas de golpes, mobilidade e pressão constante no PvP.",
  },
];

const CLASS_CODE_MAP: Record<number, string> = {
  0: "Dark Wizard",
  1: "Soul Master",
  3: "Grand Master",
  16: "Dark Knight",
  17: "Blade Knight",
  19: "Blade Master",
  32: "Fairy Elf",
  33: "Muse Elf",
  35: "High Elf",
  48: "Magic Gladiator",
  50: "Duel Master",
  64: "Dark Lord",
  66: "Lord Emperor",
  80: "Summoner",
  81: "Bloody Summoner",
  83: "Dimension Master",
  96: "Rage Fighter",
  98: "Fist Master",
};

/** Converte o código interno da classe em um nome amigável. Nunca exibe o número bruto. */
export function resolveClassName(code: number | string | null | undefined): string {
  if (code === null || code === undefined || code === "") return "Classe desconhecida";
  const numeric = typeof code === "number" ? code : Number(code);
  if (Number.isNaN(numeric)) return String(code);
  return CLASS_CODE_MAP[numeric] ?? "Classe desconhecida";
}
