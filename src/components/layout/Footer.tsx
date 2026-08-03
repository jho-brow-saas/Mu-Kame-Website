import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Music2 } from "lucide-react";
import { Logo } from "./Logo";
import { serverConfig, whatsappLink } from "@/config/server";

const columns = [
  {
    title: "Servidor",
    links: [
      { to: "/downloads", label: "Downloads" },
      { to: "/rankings", label: "Rankings" },
      { to: "/eventos", label: "Eventos" },
      { to: "/castle-siege", label: "Castle Siege" },
    ],
  },
  {
    title: "Conta",
    links: [
      { to: "/cadastro", label: "Criar conta" },
      { to: "/login", label: "Entrar" },
      { to: "/area-do-jogador", label: "Área do jogador" },
      { to: "/vip", label: "Planos VIP" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { to: "/noticias", label: "Notícias" },
      { to: "/regras", label: "Regras" },
      { to: "/suporte", label: "Suporte" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--realm)]/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            {serverConfig.slogan} Season {serverConfig.season}, progressão {serverConfig.mode} e uma comunidade
            brasileira construída para durar.
          </p>
          <div className="flex gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Suporte no WhatsApp"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-mist hover:border-jade/40 hover:text-jade"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <a
              href={serverConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do MU Kame"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-mist hover:border-jade/40 hover:text-jade"
            >
              <Instagram className="size-4" aria-hidden="true" />
            </a>
            <a
              href={serverConfig.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok do MU Kame"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-mist hover:border-jade/40 hover:text-jade"
            >
              <Music2 className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
            <h2 className="font-display text-sm tracking-[0.2em] text-gold-soft uppercase">{column.title}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-mist transition-colors hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/5 px-4 py-6 text-center text-xs text-graylight sm:px-6 lg:px-8">
        <p>
          © 2026 {serverConfig.name}. Projeto independente feito por fãs, sem vínculo com detentores de marcas de
          terceiros.
        </p>
      </div>
    </footer>
  );
}
