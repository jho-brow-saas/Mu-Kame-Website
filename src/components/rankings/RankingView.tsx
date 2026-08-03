import { useEffect, useMemo, useState } from "react";
import { api, type RankingEntry } from "@/services/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { characterClasses } from "@/lib/classes";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { PlateHeader } from "@/components/ui-kit/Cards";

export type RankingViewProps = {
  kind: string;
  title: string;
  description: string;
  valueLabel: string;
};

const fieldClasses =
  "min-h-[46px] border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.85rem] text-bone placeholder:text-ash focus-visible:border-gold";

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
          <label htmlFor="ranking-search" className="label-text text-ash">
            Buscar personagem
          </label>
          <input
            id="ranking-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome do personagem"
            className={fieldClasses}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ranking-class" className="label-text text-ash">
            Classe
          </label>
          <select
            id="ranking-class"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            className={fieldClasses}
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
          <div className="plate plate-cut-slot hidden overflow-hidden md:block">
            <PlateHeader right={`${filtered.length} registros`}>{title}</PlateHeader>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-gold/20 bg-obsidian/50">
                  <th scope="col" className="label-text px-4 py-3 text-ash">#</th>
                  <th scope="col" className="label-text px-4 py-3 text-ash">Personagem</th>
                  <th scope="col" className="label-text px-4 py-3 text-ash">Guild</th>
                  <th scope="col" className="label-text px-4 py-3 text-ash">Classe</th>
                  <th scope="col" className="label-text px-4 py-3 text-ash">{valueLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr
                    key={`${entry.position}-${entry.name}`}
                    className="border-b border-white/5 last:border-0 hover:bg-bronze-dark/30"
                  >
                    <td className="data-text px-4 py-3 text-gold">{String(entry.position).padStart(2, "0")}</td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-ui text-[0.95rem] font-600 uppercase tracking-[0.06em] text-bone"
                    >
                      {entry.name}
                    </th>
                    <td className="px-4 py-3 text-parchment/80">{entry.guild ?? "—"}</td>
                    <td className="px-4 py-3 text-parchment/80">{entry.className}</td>
                    <td className="data-text px-4 py-3 text-gold-soft">{entry.value.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-2 md:hidden">
            {filtered.map((entry) => (
              <li key={`${entry.position}-${entry.name}`} className="plate plate-cut-soft flex flex-col gap-1 p-4">
                <span className="flex items-center gap-2">
                  <span className="data-text text-[0.75rem] text-gold">
                    {String(entry.position).padStart(2, "0")}
                  </span>
                  <span className="font-ui text-[0.95rem] font-600 uppercase tracking-[0.06em] text-bone">
                    {entry.name}
                  </span>
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                  {entry.className} · {entry.guild ?? "sem guild"}
                </span>
                <span className="data-text text-sm text-gold-soft">
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
