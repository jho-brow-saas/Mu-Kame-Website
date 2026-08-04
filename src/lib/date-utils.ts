/**
 * Utilitários de formatação de data para o padrão pt-BR do MU Kame.
 */

/**
 * Formata uma data ISO para o padrão: dd/MM/yyyy às HH:mm
 */
export function formatBrDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date).replace(", ", " às ");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

/**
 * Valida e formata a data de expiração VIP.
 * Retorna "Não se aplica" para contas grátis ou datas inválidas/antigas.
 */
export function formatVipExpiration(dateInput: string | null | undefined, accountLevel: number = 0): string {
  if (accountLevel === 0 || !dateInput) return "Não se aplica";

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1900) {
      return "Não se aplica";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "Não se aplica";
  }
}
