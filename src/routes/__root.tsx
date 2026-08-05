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
import { AuthProvider } from "../components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

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

  const isApiError = error.name === "MuKameApiError" || error.name === "MukameAuthError";
  const isNetworkError = error.message.includes("Failed to fetch") || error.message.includes("Não foi possível alcançar a API");

  const toggleProxy = () => {
    const current = localStorage.getItem("mukame_force_proxy") === "true";
    localStorage.setItem("mukame_force_proxy", current ? "false" : "true");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-obsidian text-stone-100 selection:bg-gold/30">
      <div className="max-w-lg w-full text-center stone-sheet p-8 border border-gold/20 plate-cut relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0 opacity-20" />
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gold/20 rounded-full animate-pulse" />
            <div className="relative w-16 h-16 border-2 border-gold/40 plate-cut flex items-center justify-center bg-obsidian">
              <span className="text-3xl text-gold font-bold">!</span>
            </div>
          </div>
        </div>

        <h1 className="font-display text-xl text-gold uppercase tracking-[0.2em]">
          {isApiError ? "Portal de Dados Instável" : "Falha na Forja da Página"}
        </h1>

        <div className="mt-6 p-4 metal-sheet border border-gold/10 font-mono text-[10px] sm:text-xs text-ash text-left overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-gold/20">
          <div className="flex items-center gap-2 text-gold-soft mb-2 opacity-70">
            <span className="w-2 h-2 rounded-full bg-ruby animate-pulse" />
            <p>&gt; REGISTRO DE FALHA CRÍTICA:</p>
          </div>
          <pre className="whitespace-pre-wrap break-all leading-relaxed">{error.message}</pre>
        </div>

        <p className="mt-6 text-sm text-mist/80 leading-relaxed italic font-serif">
          {isApiError 
            ? "As correntes de dados entre o reino e o servidor foram interrompidas. Verifique sua conexão ou tente novamente em instantes."
            : "Um erro inesperado ocorreu durante a reconstrução desta área. Nossos escribas já foram notificados."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-[48px] items-center justify-center bg-gold px-8 text-sm font-bold uppercase tracking-widest text-obsidian hover:bg-gold-soft active:scale-95 transition-all shadow-[0_4px_15px_rgba(199,154,69,0.2)]"
          >
            Tentar Restaurar
          </button>

          {isNetworkError && (
            <button
              onClick={toggleProxy}
              className="inline-flex min-h-[48px] items-center justify-center border border-ruby/30 bg-ruby/10 px-8 text-sm font-semibold text-ruby-soft hover:bg-ruby/20 transition-colors uppercase tracking-wider"
            >
              Alternar Modo de Conexão
            </button>
          )}
          
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center border border-white/10 bg-white/5 px-8 text-sm font-semibold text-ivory hover:bg-white/10 transition-colors uppercase tracking-wider"
          >
            Voltar ao Início
          </Link>
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
      { property: "og:title", content: "MU Kame — Season 6.15 Medium" },
      { name: "twitter:title", content: "MU Kame — Season 6.15 Medium" },
      { property: "og:description", content: "Reviva a era de ouro do MU Online no MU Kame. Season 6.15, progressão Medium, eventos clássicos, rankings, guilds e Castle Siege." },
      { name: "twitter:description", content: "Reviva a era de ouro do MU Online no MU Kame. Season 6.15, progressão Medium, eventos clássicos, rankings, guilds e Castle Siege." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe805b42-9558-4637-8ed2-517032c0952e/id-preview-5df42730--00ddf391-00e2-4e98-98d4-318eb4868405.lovable.app-1785884752038.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe805b42-9558-4637-8ed2-517032c0952e/id-preview-5df42730--00ddf391-00e2-4e98-98d4-318eb4868405.lovable.app-1785884752038.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@500;600;700&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "icon",
        href: "/favicon.ico?v=5",
        sizes: "any"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png?v=5"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png?v=5"
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png?v=5"
      },
      {
        rel: "manifest",
        href: "/site.webmanifest?v=5"
      },
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
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" theme="dark" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
