import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ActionAnchor, ActionLink } from "@/components/ui-kit/Buttons";
import { useSettings } from "@/hooks/use-settings";
import { useServerStatus } from "@/hooks/use-server-status";
import { serverConfig } from "@/config/server";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatBrDateTime } from "@/lib/date-utils";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/criar-conta", label: "Cadastro" },
  { to: "/downloads", label: "Downloads" },
  { to: "/rankings", label: "Rankings" },
  { to: "/eventos", label: "Eventos" },
  { to: "/vip", label: "VIP" },
  { to: "/noticias", label: "Notícias" },
  { to: "/suporte", label: "Suporte" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { data: statusData } = useServerStatus();
  const { data: settingsData } = useSettings();
  const { isAuthenticated } = useAuth();
  
  const server = statusData?.server;
  const settings = settingsData;
  const launchDate = settings?.launchDate ?? server?.launchDate;
  const launchLabel = launchDate ? formatBrDateTime(launchDate) : serverConfig.launchLabel;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barra técnica superior — leitura de servidor em mono, como um launcher de 2003 */}
      <div className="hidden border-b border-gold/20 bg-obsidian/95 lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between gap-6 px-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash sm:px-6 lg:px-8">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
            Season {settings?.season ?? server?.season ?? serverConfig.season} · {settings?.mode ?? server?.mode ?? serverConfig.mode} · ML {settings?.masterLevel ?? server?.masterLevel ?? serverConfig.masterLevel}
          </span>
          <span className="text-bronze">
            Lançamento {launchLabel}
            <span className="caret-blink ml-1 text-gold">_</span>
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative transition-colors duration-300",
          scrolled ? "metal-sheet border-b border-gold/30" : "bg-obsidian/80 backdrop-blur-md",
        )}
      >
        <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 md:gap-4 lg:px-8">
          <Link to="/" aria-label="MU Kame — página inicial" className="shrink-0 flex items-center min-w-[190px] lg:min-w-[210px] xl:min-w-[230px]">
            <Logo />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block overflow-hidden">
            <ul className="flex items-stretch">
              {navItems.map((item) => (
                <li key={item.to} className="border-l border-white/5 last:border-r">
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    className={cn(
                      "group relative inline-flex min-h-[44px] items-center px-2 xl:px-4 font-ui text-[0.8rem] xl:text-[0.82rem] font-600 uppercase tracking-[0.1em] xl:tracking-[0.14em] text-parchment/80 transition-colors whitespace-nowrap",
                      "hover:bg-bronze-dark/40 hover:text-gold-soft",
                      "data-[status=active]:bg-bronze-dark/60 data-[status=active]:text-gold",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-0 h-[2px] scale-x-0 bg-gold transition-transform duration-200 group-hover:scale-x-100 group-data-[status=active]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex shrink-0">
            {isAuthenticated ? (
              <ActionLink to="/area-do-jogador" variant="ghost" className="min-h-[40px] px-3 xl:px-4 py-2 flex items-center gap-2 whitespace-nowrap shrink-0">
                <span className="size-2 rounded-full bg-jade animate-pulse" aria-hidden="true" />
                Área do Jogador
              </ActionLink>
            ) : (
              <ActionLink to="/entrar" variant="ghost" className="min-h-[40px] px-3 xl:px-4 py-2 whitespace-nowrap shrink-0">
                Entrar
              </ActionLink>
            )}
            <ActionLink 
              to={isAuthenticated ? "/downloads" : "/criar-conta"} 
              className="min-h-[40px] px-5 py-2 w-auto min-w-max shrink-0 whitespace-nowrap"
            >
              Jogar agora
            </ActionLink>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="btn-cut metal-sheet flex size-11 items-center justify-center border border-gold/40 text-gold-soft lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/45 to-transparent" />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isAuthenticated={isAuthenticated} />
    </header>
  );
}

function MobileMenu({ open, onClose, isAuthenticated }: { open: boolean; onClose: () => void; isAuthenticated: boolean }) {
  return (
    <div
      className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-obsidian/90 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        className={cn(
          "stone-sheet absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col gap-6 border-l-2 border-gold/40 p-6 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
        <div className="relative flex items-center justify-between">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="btn-cut metal-sheet flex size-11 items-center justify-center border border-gold/40 text-gold-soft"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação mobile" className="relative">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.to} className="border-b border-white/5">
                <Link
                  to={item.to}
                  onClick={onClose}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex min-h-[54px] items-center gap-3 px-2 font-ui text-[0.95rem] font-600 uppercase tracking-[0.14em] text-parchment/85 transition-colors hover:text-gold-soft data-[status=active]:text-gold"
                >
                  <span aria-hidden="true" className="data-text text-[0.7rem] text-bronze">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative mt-auto flex flex-col gap-3">
          {isAuthenticated ? (
            <ActionLink to="/area-do-jogador" variant="secondary" onClick={onClose} className="flex items-center justify-center gap-2">
              <span className="size-2 rounded-full bg-jade animate-pulse" aria-hidden="true" />
              Área do Jogador
            </ActionLink>
          ) : (
            <ActionLink to="/entrar" variant="secondary" onClick={onClose}>
              Entrar
            </ActionLink>
          )}
          <ActionLink 
            to={isAuthenticated ? "/downloads" : "/criar-conta"}
            onClick={onClose}
          >
            Jogar agora
          </ActionLink>
        </div>
      </aside>
    </div>
  );
}
