import { DEMO_MODE, disabledError, endpoints, fail, httpRequest, offlineError } from "./api";
import { featureFlags } from "@/config/access";
import type { ApiResult, OperationEntry, SupportTicket } from "@/types/api";
import type { AccountSummary, VipStatus, Wallet } from "@/types/account";
import type { CharacterActionSpec, CharacterSlot } from "@/types/character";

/** Ações do personagem já mapeadas na UI, mas sem execução real. */
export const characterActions: CharacterActionSpec[] = [
  {
    action: "distribuir-pontos",
    label: "Distribuir pontos",
    description: "Aplica pontos livres em força, agilidade, vitalidade, energia ou comando.",
    destructive: false,
    requiresReason: false,
  },
  {
    action: "resetar",
    label: "Resetar personagem",
    description: "Zera o nível e concede pontos de reset conforme as regras do servidor.",
    destructive: true,
    requiresReason: true,
  },
  {
    action: "limpar-inventario",
    label: "Limpar inventário",
    description: "Remove permanentemente todos os itens do inventário do personagem.",
    destructive: true,
    requiresReason: true,
  },
  {
    action: "limpar-bau",
    label: "Limpar baú",
    description: "Remove permanentemente todos os itens guardados no baú da conta.",
    destructive: true,
    requiresReason: true,
  },
  {
    action: "alterar-avatar",
    label: "Alterar avatar",
    description: "Define a imagem pública exibida nos rankings e no perfil.",
    destructive: false,
    requiresReason: false,
  },
  {
    action: "abrir-chamado",
    label: "Abrir chamado",
    description: "Envia uma solicitação ao suporte vinculada a este personagem.",
    destructive: false,
    requiresReason: false,
  },
];

function blocked<T>(): ApiResult<T> {
  return fail(offlineError);
}

export const playerService = {
  async account(): Promise<ApiResult<AccountSummary>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<AccountSummary>(endpoints.account);
  },

  async characters(): Promise<ApiResult<CharacterSlot[]>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<CharacterSlot[]>(endpoints.accountCharacters);
  },

  async wallet(): Promise<ApiResult<Wallet>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<Wallet>(endpoints.accountWallet);
  },

  async vip(): Promise<ApiResult<VipStatus>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<VipStatus>(endpoints.accountVip);
  },

  async tickets(): Promise<ApiResult<SupportTicket[]>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<SupportTicket[]>(endpoints.accountTickets);
  },

  async history(): Promise<ApiResult<OperationEntry[]>> {
    if (DEMO_MODE) return blocked();
    return httpRequest<OperationEntry[]>(`${endpoints.account}/history`);
  },

  /**
   * Adaptador de mutação. Desligado por feature flag.
   * AVISO: quando ligado, a API DEVE revalidar sessão, papel, posse do
   * personagem e registrar auditoria — a checagem do cliente é cosmética.
   */
  async runCharacterAction(input: {
    action: CharacterActionSpec["action"];
    characterId: string;
    reason?: string;
    payload?: Record<string, unknown>;
  }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enablePlayerMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.accountCharacters}/${input.characterId}/actions`, {
      method: "POST",
      body: { action: input.action, reason: input.reason ?? null, payload: input.payload ?? {} },
    });
  },

  async openTicket(input: { subject: string; category: SupportTicket["category"]; message: string }): Promise<ApiResult<SupportTicket>> {
    if (!featureFlags.enablePlayerMutations) return fail(disabledError);
    return httpRequest<SupportTicket>(endpoints.accountTickets, { method: "POST", body: input });
  },
};
