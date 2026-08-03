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
      { to: "/conta", label: "Central do Aventureiro" },
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

const socials = [
  { href: whatsappLink, label: "Suporte no WhatsApp", icon: MessageCircle },
  { href: serverConfig.instagramUrl, label: "Instagram do MU Kame", icon: Instagram },
  { href: serverConfig.tiktokUrl, label: "TikTok do MU Kame", icon: Music2 },
];

export function Footer() {
  return (
    <footer className="stone-sheet relative isolate overflow-hidden edge-rule-top">
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-parchment/80">
            {serverConfig.slogan} Season {serverConfig.season}, progressão {serverConfig.mode} e uma comunidade
            brasileira construída para durar.
          </p>
          <div className="flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="btn-cut metal-sheet flex size-11 items-center justify-center border border-bronze/60 text-parchment transition-colors hover:border-gold hover:text-gold-soft"
              >
                <social.icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
            <h2 className="label-text flex items-center gap-2 text-gold">
              <span aria-hidden="true" className="size-1.5 rotate-45 bg-bronze" />
              {column.title}
            </h2>
            <span aria-hidden="true" className="h-px w-full bg-linear-to-r from-bronze/60 to-transparent" />
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-ui text-[0.85rem] uppercase tracking-[0.1em] text-parchment/75 transition-colors hover:text-gold-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="relative border-t border-gold/15 bg-obsidian/70 px-4 py-6 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash sm:px-6 lg:px-8">
        <p>
          © 2026 {serverConfig.name} · Projeto independente feito por fãs, sem vínculo com detentores de marcas de
          terceiros.
        </p>
      </div>
    </footer>
  );
}
