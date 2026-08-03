/**
 * Contratos genéricos da API v2 do MU Kame.
 *
 * IMPORTANTE (segurança): o frontend NUNCA fala com o SQL Server.
 * Toda leitura/escrita passa por uma API HTTPS na VPS, que é a única
 * responsável por autenticar, autorizar e auditar. As permissões
 * calculadas aqui servem apenas para ocultar UI — a API DEVE revalidar
 * todas elas no servidor.
 */

export type ApiOk<T> = { ok: true; data: T };
export type ApiFail = { ok: false; error: ApiError };
export type ApiResult<T> = ApiOk<T> | ApiFail;

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "disabled"
  | "offline"
  | "unknown";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
};

export type LoadPhase = "loading" | "empty" | "error" | "blocked" | "ready";

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** Registro de operação exibido em históricos e na auditoria. */
export type OperationEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  reason: string | null;
  result: "sucesso" | "erro" | "pendente";
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: "conta" | "personagem" | "pagamento" | "bug" | "outro";
  status: "aberto" | "em-analise" | "respondido" | "encerrado";
  openedAt: string;
  lastReplyAt: string | null;
  messages: number;
};

export type ApiHealth = {
  reachable: boolean;
  baseUrl: string;
  latencyMs: number | null;
  checkedAt: string;
};
