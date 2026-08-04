import { createFileRoute } from "@tanstack/react-router";

/**
 * Proxy somente-leitura da API pública do MU Kame.
 *
 * A API oficial (api.mukame.online) não envia cabeçalhos CORS, então o
 * navegador não pode chamá-la diretamente. Este endpoint apenas repassa
 * requisições GET com parâmetros validados por allowlist — nenhuma
 * credencial, nenhum corpo, nenhum método de escrita.
 */
const UPSTREAM = "https://api.mukame.online/index.php";

const ALLOWED_ROUTES = new Set([
  "health",
  "status",
  "news",
  "downloads",
  "events",
  "castle-siege",
  "rankings",
  "vip",
  "socials",
  "settings",
  "rates",
]);

const ALLOWED_RANKING_TYPES = new Set([
  "reset",
  "master-reset",
  "level",
  "pk",
  "kills",
  "guilds",
  "blood-castle",
  "devil-square",
  "chaos-castle",
]);

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/public/mukame")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const incoming = new URL(request.url);
        const route = incoming.searchParams.get("route") ?? "";
        if (!ALLOWED_ROUTES.has(route)) return jsonError("Rota não suportada.", 400);

        const target = new URL(UPSTREAM);
        target.searchParams.set("route", route);

        const limit = Number(incoming.searchParams.get("limit") ?? "");
        if (Number.isInteger(limit) && limit > 0 && limit <= 100) {
          target.searchParams.set("limit", String(limit));
        }

        if (route === "rankings") {
          const type = incoming.searchParams.get("type") ?? "";
          if (!ALLOWED_RANKING_TYPES.has(type)) return jsonError("Tipo de ranking inválido.", 400);
          target.searchParams.set("type", type);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12_000); // Aumentado para 12s no proxy
        try {
          const upstream = await fetch(target.toString(), {
            method: "GET",
            headers: { 
              Accept: "application/json",
              "User-Agent": "MU-Kame-Proxy/1.0",
            },
            signal: controller.signal,
          });

          if (!upstream.ok) {
            return jsonError(`Erro na API original (${upstream.status})`, upstream.status);
          }

          const body = await upstream.text();
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
              "X-Proxy-Source": "MU-Kame-Gateway",
            },
          });
        } catch (error) {
          const isTimeout = error instanceof Error && error.name === "AbortError";
          return jsonError(
            isTimeout ? "Tempo limite excedido na API (12s)." : "Não foi possível alcançar a API do servidor.",
            502
          );
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  },
});
