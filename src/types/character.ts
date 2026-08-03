export type CharacterClassName =
  | "Blade Knight"
  | "Soul Master"
  | "Muse Elf"
  | "Magic Gladiator"
  | "Dark Lord"
  | "Rage Fighter"
  | "Summoner";

export type CharacterSlot = {
  id: string;
  name: string;
  className: CharacterClassName | string;
  level: number;
  masterLevel: number;
  resets: number;
  masterResets: number;
  kills: number;
  deaths: number;
  zen: number;
  statPoints: number;
  online: boolean;
  guild: string | null;
  map: string | null;
};

export type CharacterStats = {
  strength: number;
  agility: number;
  vitality: number;
  energy: number;
  command: number | null;
};

export type CharacterAction =
  | "distribuir-pontos"
  | "resetar"
  | "limpar-inventario"
  | "limpar-bau"
  | "alterar-avatar"
  | "abrir-chamado";

export type CharacterActionSpec = {
  action: CharacterAction;
  label: string;
  description: string;
  destructive: boolean;
  requiresReason: boolean;
};

/** Linha da tabela de comando administrativa de personagens. */
export type AdminCharacterRow = CharacterSlot & {
  accountLogin: string;
  lastLoginAt: string | null;
};
