import { DEMO_MODE, disabledError, endpoints, fail, httpRequest, offlineError } from "./api";
import { featureFlags } from "@/config/access";
import type { ApiResult, OperationEntry, Paginated, SupportTicket } from "@/types/api";
import type { AdminAccountRow, VipStatus } from "@/types/account";
import type { AdminCharacterRow } from "@/types/character";

export type AdminDashboard = {
  accounts: number;
  characters: number;
  online: number;
  pendingTickets: number;
  blockedAccounts: number;
  vipActive: number;
};

export type AdminOnlineRow = {
  id: string;
  characterName: string;
  accountLogin: string;
  map: string | null;
  connectedAt: string | null;
};

/**
 * Comando do Reino — camada administrativa.
 * Nenhuma mutação real é executada: todas passam por feature flags e,
 * quando habilitadas, a API DEVE revalidar papel/permissão, exigir
 * justificativa e reautenticação, e gravar auditoria no servidor.
 */
export const adminService = {
  async dashboard(): Promise<ApiResult<AdminDashboard>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<AdminDashboard>(endpoints.adminDashboard);
  },

  async accounts(params?: { search?: string; page?: number }): Promise<ApiResult<Paginated<AdminAccountRow>>> {
    if (DEMO_MODE) return fail(offlineError);
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return httpRequest<Paginated<AdminAccountRow>>(`${endpoints.adminAccounts}${suffix}`);
  },

  async characters(params?: { search?: string; page?: number }): Promise<ApiResult<Paginated<AdminCharacterRow>>> {
    if (DEMO_MODE) return fail(offlineError);
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return httpRequest<Paginated<AdminCharacterRow>>(`${endpoints.adminCharacters}${suffix}`);
  },

  async online(): Promise<ApiResult<AdminOnlineRow[]>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<AdminOnlineRow[]>(endpoints.adminOnline);
  },

  async tickets(): Promise<ApiResult<SupportTicket[]>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<SupportTicket[]>(endpoints.adminTickets);
  },

  async audit(params?: { page?: number }): Promise<ApiResult<Paginated<OperationEntry>>> {
    if (DEMO_MODE) return fail(offlineError);
    const suffix = params?.page ? `?page=${params.page}` : "";
    return httpRequest<Paginated<OperationEntry>>(`${endpoints.adminAudit}${suffix}`);
  },

  /* ---------------- adaptadores de mutação (desligados) ---------------- */

  async setAccountBlocked(input: { accountId: string; blocked: boolean; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminAccounts}/${input.accountId}/block`, {
      method: "POST",
      body: { blocked: input.blocked, reason: input.reason },
    });
  },

  async updateAccount(input: { accountId: string; fields: Record<string, unknown>; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminAccounts}/${input.accountId}`, {
      method: "PATCH",
      body: input,
    });
  },

  async updateCharacter(input: { characterId: string; fields: Record<string, unknown>; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminCharacters}/${input.characterId}`, {
      method: "PATCH",
      body: input,
    });
  },

  async moveCharacter(input: { characterId: string; targetAccount: string; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminCharacters}/${input.characterId}/move`, {
      method: "POST",
      body: input,
    });
  },

  async disconnectUser(input: { accountId: string; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminOnline}/${input.accountId}/disconnect`, {
      method: "POST",
      body: input,
    });
  },

  async setVip(input: { accountId: string; tier: VipStatus["tier"]; expiresAt: string | null; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminAccounts}/${input.accountId}/vip`, {
      method: "POST",
      body: input,
    });
  },

  async adjustWallet(input: {
    accountId: string;
    wcoinC?: number;
    wcoinP?: number;
    goblinPoints?: number;
    reason: string;
  }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableWalletAdjustments) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminAccounts}/${input.accountId}/wallet`, {
      method: "POST",
      body: input,
    });
  },

  async deleteAccount(input: { accountId: string; reason: string }): Promise<ApiResult<OperationEntry>> {
    if (!featureFlags.enableAccountDeletion) return fail(disabledError);
    return httpRequest<OperationEntry>(`${endpoints.adminAccounts}/${input.accountId}`, {
      method: "DELETE",
      body: input,
    });
  },

  async replyTicket(input: { ticketId: string; message: string }): Promise<ApiResult<SupportTicket>> {
    if (!featureFlags.enableAdminMutations) return fail(disabledError);
    return httpRequest<SupportTicket>(`${endpoints.adminTickets}/${input.ticketId}/reply`, {
      method: "POST",
      body: input,
    });
  },
};
