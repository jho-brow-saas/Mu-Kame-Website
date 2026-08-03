import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { RoleBadge } from "@/components/private/RoleBadge";
import { BlockedState } from "@/components/private/ResourceGate";
import { can, featureFlags, roleLabels } from "@/config/access";
import { adminNav, playerNav, type PrivateNavItem } from "@/config/private-nav";
import { useSession } from "@/hooks/use-session";
import { DEMO_MODE } from "@/services/api";
import type { ReactNode } from "react";
import { CircleSlash2, Radar, ShieldAlert } from "lucide-react";

/** Cabeçalho de módulo interno (inscrição + código técnico). */
export function ModuleHeader({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-gold/20 pb-5">
      <span className="flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.28em] text-gold">
        <span aria-hidden="true" className="h-px w-6 bg-bronze" />
        {code}
      </span>
      <h1 className="section-title text-bone">{title}</h1>
      {description ? <p className="body-text max-w-3xl text-parchment/85">{description}</p> : null}
      {children}
    </header>
  );
}

export function ModuleBlock({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("plate plate-cut-soft", className)}>
      <div className="metal-sheet flex items-center justify-between gap-4 border-b border-gold/25 px-4 py-2.5">
        <h2 className="label-text flex items-center gap-2 text-gold-soft">
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-bronze" />
          {title}
        </h2>
        {hint ? <span className="data-text text-[0.68rem] text-ash">{hint}</span> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/** Aviso permanente: mutações desligadas até a API segura existir. */
export function MutationsNotice({ scope }: { scope: "player" | "admin" }) {
  const on = scope === "player" ? featureFlags.enablePlayerMutations : featureFlags.enableAdminMutations;
  if (on) return null;
  return (
    <p className="flex items-start gap-2 border border-gold/35 bg-bronze-dark/40 px-4 py-3 font-mono text-[0.7rem] leading-relaxed text-parchment">
      <CircleSlash2 className="mt-px size-3.5 shrink-0 text-gold" aria-hidden="true" />
      Operações de escrita estão desativadas nesta fase. A interface está pronta; a execução será liberada quando a
      API segura entrar em produção — e toda permissão será revalidada no servidor.
    </p>
  );
}

function NavList({ items, role }: { items: PrivateNavItem[]; role: Parameters<typeof can>[0] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const visible = items.filter((item) => !item.permission || can(role, item.permission) || DEMO_MODE);

  return (
    <nav aria-label="Navegação interna" className="plate plate-cut-slot overflow-hidden">
      <div className="metal-sheet border-b border-gold/25 px-4 py-2.5">
        <span className="label-text flex items-center gap-2 text-gold-soft">
          <Radar className="size-3.5 text-bronze" aria-hidden="true" />
          Mesa de comando
        </span>
      </div>
      <ul className="flex flex-col">
        {visible.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-[46px] items-center gap-3 border-b border-gold/10 px-4 py-2.5 font-ui text-[0.8rem] font-600 uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "bg-bronze-dark/60 text-gold-soft"
                    : "text-parchment/80 hover:bg-bronze-dark/30 hover:text-bone",
                )}
              >
                <Icon className={cn("size-4", active ? "text-gold" : "text-bronze")} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                <span className="data-text text-[0.62rem] text-ash">{item.code}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Casca das áreas privadas: mesa de comando lateral + módulo ativo.
 * O gate abaixo é apenas visual — a API é a fonte de verdade de acesso.
 */
export function PrivateShell({ area }: { area: "player" | "admin" }) {
  const { session, phase, error, refetch } = useSession();
  const items = area === "player" ? playerNav : adminNav;
  const role = session.role;

  const heading =
    area === "player"
      ? { eyebrow: "Central do Aventureiro", title: "Sua conta no MU Kame" }
      : { eyebrow: "Comando do Reino", title: "Operação e moderação" };

  const denied = area === "admin" && phase === "ready" && !can(role, "admin.view");

  return (
    <SiteLayout>
      <section className="stone-sheet relative isolate overflow-hidden edge-rule-bottom py-10">
        <span aria-hidden="true" className="topo-lines pointer-events-none absolute inset-0 opacity-60" />
        <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <span className="flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.3em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-bronze" />
            {heading.eyebrow}
          </span>
          <h2 className="section-title text-bone">{heading.title}</h2>
          <div className="flex flex-wrap items-center gap-3">
            {role ? <RoleBadge role={role} /> : null}
            <span className="inline-flex items-center gap-2 border border-gold/25 bg-obsidian/70 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment">
              <span aria-hidden="true" className={cn("size-1.5 rotate-45", session.user?.online ? "bg-arcane" : "bg-stone")} />
              {session.user?.online ? "Sessão ativa" : "Sessão inativa"}
            </span>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ash">
              {session.user ? session.user.displayName : "visitante"}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <NavList items={items} role={role} />
          <p className="border border-gold/20 bg-obsidian/60 px-4 py-3 font-mono text-[0.66rem] leading-relaxed text-ash">
            Papéis: {Object.values(roleLabels).join(" · ")}. Ações fora do seu papel ficam ocultas na interface e são
            recusadas pela API.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {denied ? (
            <BlockedState
              title="Papel sem acesso ao comando"
              description="Sua conta não possui papel administrativo. Solicite elevação ao Guardião do Reino."
            />
          ) : phase === "blocked" || phase === "error" ? (
            <>
              <BlockedState
                title={phase === "error" ? "Falha ao validar a sessão" : "Área privada aguardando a API oficial"}
                description={
                  error?.message ??
                  "A autenticação real será habilitada com a API segura na VPS. Nenhum dado de conta é simulado aqui."
                }
              />
              <button
                type="button"
                onClick={refetch}
                className="self-start font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold hover:text-gold-soft"
              >
                [ revalidar sessão ]
              </button>
              <p className="flex items-start gap-2 border border-mana/50 bg-mana/15 px-4 py-3 font-mono text-[0.68rem] leading-relaxed text-arcane">
                <ShieldAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                A estrutura completa dos módulos permanece navegável abaixo para validação visual.
              </p>
              <Outlet />
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
