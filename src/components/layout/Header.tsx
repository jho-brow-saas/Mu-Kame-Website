import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ActionAnchor, ActionLink } from "@/components/ui-kit/Buttons";
import { serverConfig } from "@/config/server";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/cadastro", label: "Cadastro" },
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-white/10 bg-[color:var(--void)]/92 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="MU Kame — página inicial">
          <Logo />
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-mist transition-colors hover:text-ivory data-[status=active]:text-jade"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ActionLink to="/login" variant="ghost" className="px-4 py-2">
            Entrar
          </ActionLink>
          <ActionAnchor href={serverConfig.pcDownloadUrl} className="px-5 py-2">
            Jogar agora
          </ActionAnchor>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-ivory lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[color:var(--void)]/80 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-6 border-l border-white/10 bg-[color:var(--realm)] p-6 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-ivory"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação mobile">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex min-h-[52px] items-center rounded-xl px-4 font-display text-base tracking-wide text-mist transition-colors hover:bg-white/5 hover:text-ivory data-[status=active]:bg-jade/10 data-[status=active]:text-jade"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <ActionLink to="/login" variant="secondary" onClick={onClose}>
            Entrar
          </ActionLink>
          <ActionAnchor href={serverConfig.pcDownloadUrl}>Jogar agora</ActionAnchor>
        </div>
      </aside>
    </div>
  );
}
