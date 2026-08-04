import type { AccountLevel, RatesPayload, RateServer, ResetSettings } from "@/types/mukame-api";

/**
 * Normaliza o payload de rates para garantir que o frontend nunca quebre
 * caso a API retorne objetos onde se espera arrays ou vice-versa.
 */
export function normalizeRates(input: unknown): RatesPayload {
  const source = input && typeof input === "object" ? (input as any) : {};

  // Normalização de AccountLevels (raiz)
  const accountLevels =
    source.accountLevels && typeof source.accountLevels === "object" && !Array.isArray(source.accountLevels)
      ? (source.accountLevels as Record<AccountLevel, string>)
      : ({} as Record<AccountLevel, string>);

  // Normalização de Servers
  const rawServers = Array.isArray(source.servers) ? source.servers : [];
  const servers: RateServer[] = rawServers.map((s: any) => {
    const serverObj = s && typeof s === "object" ? s : {};
    return {
      name: String(serverObj.name || "Desconhecido"),
      normalExp: serverObj.normalExp ?? serverObj.experience?.normal ?? null,
      masterExp: serverObj.masterExp ?? serverObj.masterExperience?.normal ?? null,
      itemDrop: serverObj.itemDrop ?? serverObj.itemDropPercent?.normal ?? null,
      zenDrop: serverObj.zenDrop ?? serverObj.zenDropPercent?.normal ?? null,
      accountLevels:
        serverObj.accountLevels && typeof serverObj.accountLevels === "object" && !Array.isArray(serverObj.accountLevels)
          ? serverObj.accountLevels
          : {},
    };
  });

  // Normalização de Reset Settings
  const resetSource = source.reset && typeof source.reset === "object" ? source.reset : {};
  const reset: ResetSettings = {
    command: String(resetSource.command || "/reset"),
    requiredLevel: Number(resetSource.requiredLevel ?? (resetSource.requiredLevel?.normal || 400)),
    zenCost: resetSource.zenCost ?? (resetSource.zenCost?.normal || 0),
    autoReset: !!(resetSource.autoReset ?? resetSource.automaticAvailable),
    levelAfterReset: Number(resetSource.levelAfterReset ?? resetSource.startLevel ?? 1),
    inventoryPreserved: !!(resetSource.inventoryPreserved ?? !resetSource.clearsInventory),
    skillsPreserved: !!(resetSource.skillsPreserved ?? !resetSource.clearsSkills),
    questRequired: !!(resetSource.questRequired ?? resetSource.requiresQuest),
  };

  // Normalização de LevelUpPoints (O ponto crítico que estava quebrando)
  // Se vier objeto { darkWizard: 5, ... }, normalizamos.
  const rawLevelUpPoints = source.levelUpPoints;
  let levelUpPoints: Record<string, number> = {};

  if (rawLevelUpPoints && typeof rawLevelUpPoints === "object" && !Array.isArray(rawLevelUpPoints)) {
    levelUpPoints = rawLevelUpPoints;
  } else if (Array.isArray(rawLevelUpPoints)) {
    // Caso a API mude para array no futuro, mantemos compatibilidade
    rawLevelUpPoints.forEach((item: any) => {
      if (item && item.className) {
        levelUpPoints[item.className] = item.pointsPerLevel;
      }
    });
  }

  // Normalização de Notes
  const notes = Array.isArray(source.notes) ? source.notes.map(String) : [];

  return {
    accountLevels,
    servers,
    reset,
    levelUpPoints,
    notes,
  };
}

/** Mapeamento de labels amigáveis para as classes do jogo */
export const CLASS_LABELS: Record<string, string> = {
  darkWizard: "Dark Wizard",
  darkKnight: "Dark Knight",
  fairyElf: "Fairy Elf",
  magicGladiator: "Magic Gladiator",
  darkLord: "Dark Lord",
  summoner: "Summoner",
  rageFighter: "Rage Fighter",
};
