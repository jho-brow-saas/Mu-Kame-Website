import { useEffect, useMemo, useState } from "react";
import { api, type RankingEntry } from "@/services/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { characterClasses } from "@/lib/classes";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";

export type RankingViewProps = {
  kind: string;
  title: string;
  description: string;
  valueLabel: string;
};

export function RankingView({ kind, title, description, valueLabel }: RankingViewProps) {
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  useEffect(() => {
    let active = true;
    setState("loading");
    api
      .getRanking(kind)
      .then((data) => {
        if (!active) return;
        setEntries(data);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, [kind]);

  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const matchSearch = entry.name.toLowerCase().includes(search.trim().toLowerCase());
        const matchClass = classFilter === "all" || entry.className === classFilter;
        return matchSearch && matchClass;
      }),
    [entries, search, classFilter],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Ranking" title={title} description={description} className="mb-8" />

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1">
          <label htmlFor="ranking-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-graylight">
            Buscar personagem
          </label>
          <input
            id="ranking-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome do personagem"
            className="min-h-[44px] rounded-xl border border-white/12 bg-[color:var(--surface)]/70 px-4 text-base text-ivory placeholder:text-graylight"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ranking-class" className="text-xs font-semibold uppercase tracking-[0.2em] text-graylight">
            Classe
          </label>
          <select
            id="ranking-class"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className="min-h-[44px] rounded-xl border border-white/12 bg-[color:var(--surface)]/70 px-4 text-base text-ivory"
          >
            <option value="all">Todas as classes</option>
            {characterClasses.flatMap((klass) =>
              klass.evolutions.map((evolution) => (
                <option key={evolution} value={evolution}>
                  {evolution}
                </option>
              )),
            )}
          </select>
        </div>
      </div>

      {state === "loading" ? <LoadingState label="Carregando classificação…" /> : null}
      {state === "error" ? <ErrorState description="Não foi possível carregar o ranking agora." /> : null}
      {state === "ready" && filtered.length === 0 ? (
        <EmptyState
          title="Nenhum jogador classificado ainda."
          description="A disputa começa em 01 de setembro de 2026."
        />
      ) : null}

      {state === "ready" && filtered.length > 0 ? (
        <>
          <div className="surface-card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-white/8 text-[0.65rem] uppercase tracking-[0.2em] text-graylight">
                  <th scope="col" className="px-5 py-4">#</th>
                  <th scope="col" className="px-5 py-4">Personagem</th>
                  <th scope="col" className="px-5 py-4">Guild</th>
                  <th scope="col" className="px-5 py-4">Classe</th>
                  <th scope="col" className="px-5 py-4">{valueLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={`${entry.position}-${entry.name}`} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-display text-gold-soft">{entry.position}</td>
                    <th scope="row" className="px-5 py-4 font-normal text-ivory">{entry.name}</th>
                    <td className="px-5 py-4 text-mist">{entry.guild ?? "—"}</td>
                    <td className="px-5 py-4 text-mist">{entry.className}</td>
                    <td className="px-5 py-4 text-jade">{entry.value.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {filtered.map((entry) => (
              <li key={`${entry.position}-${entry.name}`} className="surface-card flex flex-col gap-1 p-4">
                <span className="font-display text-gold-soft">#{entry.position} — {entry.name}</span>
                <span className="text-xs text-mist">{entry.className} • {entry.guild ?? "Sem guild"}</span>
                <span className="text-sm text-jade">
                  {valueLabel}: {entry.value.toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
