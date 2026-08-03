import type { EventCategory, ServerState } from "@/types/mukame-api";

/** Rótulos das categorias de evento devolvidas pela API. */
const eventCategoryLabels: Record<EventCategory, string> = {
  classic: "Clássico",
  pvp: "PvP",
  invasion: "Invasão",
  guild: "Guild",
  custom: "Personalizado",
};

export function eventCategoryLabel(category: string): string {
  return eventCategoryLabels[category as EventCategory] ?? "Evento";
}

export function isGuildCategory(category: string): boolean {
  return category === "guild";
}

/** Rótulo de estado do servidor. `preparing` nunca aparece como online. */
export function serverStateLabel(state: ServerState | undefined): string {
  if (state === "online") return "Online";
  if (state === "offline") return "Offline";
  if (state === "maintenance") return "Em manutenção";
  return "Em preparação";
}

const brDateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

const brDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
});

/**
 * Converte `publishedAt` da API, que pode chegar como ISO 8601 ou como
 * timestamp Unix (em segundos ou milissegundos, numérico ou string).
 */
export function parseApiDate(input: string | number | null | undefined): Date | null {
  if (input === null || input === undefined) return null;

  if (typeof input === "number") return fromEpoch(input);

  const trimmed = input.trim();
  if (trimmed === "") return null;

  if (/^\d+$/.test(trimmed)) return fromEpoch(Number(trimmed));

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function fromEpoch(value: number): Date | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const ms = value > 1e12 ? value : value * 1000;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Data + hora no fuso de Brasília, ou null quando a data é inválida. */
export function formatBrDateTime(input: string | number | null | undefined): string | null {
  const date = parseApiDate(input);
  return date ? brDateTime.format(date) : null;
}

/** Data longa no fuso de Brasília, ou null quando a data é inválida. */
export function formatBrDate(input: string | number | null | undefined): string | null {
  const date = parseApiDate(input);
  return date ? brDate.format(date) : null;
}

/**
 * Remove qualquer marcação do conteúdo vindo da API e devolve texto puro.
 * Nesta fase o site nunca usa dangerouslySetInnerHTML.
 */
export function toPlainText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Resumo curto para cartões de notícia. */
export function excerpt(input: string | null | undefined, max = 180): string {
  const text = toPlainText(input);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/** Somente URLs http(s) absolutas são consideradas válidas para download. */
export function isSafeExternalUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Link do WhatsApp a partir do número cru da API (apenas dígitos). */
export function whatsappUrl(rawNumber: string | undefined, message?: string): string | null {
  const digits = (rawNumber ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Formata 5531990866048 como +55 31 99086-6048 para exibição. */
export function formatWhatsappLabel(rawNumber: string | undefined): string {
  const digits = (rawNumber ?? "").replace(/\D/g, "");
  if (digits.length < 12) return rawNumber ?? "";
  const country = digits.slice(0, 2);
  const area = digits.slice(2, 4);
  const rest = digits.slice(4);
  const middle = rest.length > 8 ? rest.slice(0, 5) : rest.slice(0, 4);
  const end = rest.slice(middle.length);
  return `+${country} ${area} ${middle}-${end}`;
}
