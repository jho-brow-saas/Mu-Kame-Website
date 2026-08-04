import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl text-gold">404</h1>
        <h2 className="mt-4 font-display text-xl text-ivory">Página não encontrada</h2>
        <p className="mt-2 text-sm text-mist">
          O caminho que você tentou acessar não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center justify-center bg-gold px-5 text-sm font-semibold text-[color:var(--primary-foreground)]"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  const isApiError = error.name === "MuKameApiError";
  const isNetworkError = isApiError && (error as any).kind === "network";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-obsidian">
      <div className="max-w-lg text-center stone-sheet p-8 border border-gold/20 plate-cut relative overflow-hidden">
        <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0 opacity-20" />
        <h1 className="font-display text-xl text-gold uppercase tracking-widest">
          {isApiError ? "Erro de Conexão com o Reino" : "Esta página não carregou"}
        </h1>
        <div className="mt-4 p-4 metal-sheet border border-gold/10 font-mono text-xs text-ash text-left overflow-auto max-h-48">
          <p className="text-gold-soft mb-2">&gt; DETALHES DO ERRO:</p>
          <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
          {error.stack && (
            <details className="mt-4 cursor-pointer">
              <summary className="text-bronze hover:text-gold-soft transition-colors underline">Ver rastreio técnico</summary>
              <pre className="mt-2 text-[10px] opacity-60 leading-relaxed">{error.stack}</pre>
            </details>
          )}
        </div>
        <p className="mt-6 text-sm text-mist leading-relaxed italic">
          {isApiError 
            ? "Parece que nosso portal de dados está enfrentando instabilidades mágicas ou bloqueios de rede. Verifique sua conexão ou tente novamente."
            : "Algo falhou do nosso lado durante a forja desta página."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-[44px] items-center justify-center bg-gold px-5 text-sm font-semibold text-[color:var(--primary-foreground)]"
          >
            Tentar novamente
          </button>
          
          {isNetworkError && (
            <button
              onClick={() => {
                window.localStorage.setItem("mukame_force_proxy", "true");
                window.location.reload();
              }}
              className="inline-flex min-h-[44px] items-center justify-center border border-blue-500/30 bg-blue-900/10 px-5 text-sm font-semibold text-blue-400 hover:bg-blue-900/20 transition-colors"
            >
              Usar Proxy de Emergência
            </button>
          )}

          <a
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center border border-white/15 px-5 text-sm font-semibold text-ivory"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MU Kame — Season 6.15 Medium" },
      {
        name: "description",
        content:
          "Reviva a era de ouro do MU Online no MU Kame. Season 6.15, progressão Medium, eventos clássicos, rankings, guilds e Castle Siege.",
      },
      { name: "author", content: "MU Kame" },
      { property: "og:site_name", content: "MU Kame" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@500;600;700&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MU Kame",
          url: "https://novo.mukame.online",
          slogan: "Reviva a lenda. Construa seu legado.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased font-sans">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
