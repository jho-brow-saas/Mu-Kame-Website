import { useMemo, useState } from "react";
import { useRankings } from "@/hooks/use-rankings";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { characterClasses } from "@/lib/classes";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { PlateHeader } from "@/components/ui-kit/Cards";
import { RANKING_TYPES, type RankingApiItem, type RankingType } from "@/types/mukame-api";

export type RankingViewProps = {
  /** Identificador da categoria. Quando corresponde a um tipo da API, os dados são reais. */
  kind: string;
  title: string;
  description: string;
  valueLabel: string;
};

type NormalizedEntry = {
  position: number;
  name: string;
  guild: string | null;
  className: string | null;
  value: number | null;
};

const fieldClasses =
  "min-h-[46px] border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.85rem] text-bone placeholder:text-ash focus-visible:border-gold";

function isApiRankingType(kind: string): kind is RankingType {
  return (RANKING_TYPES as readonly string[]).includes(kind);
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalize(items: RankingApiItem[]): NormalizedEntry[] {
  return items
    .map((item, index) => ({
      position: item.position ?? item.rank ?? index + 1,
      name: (item.name ?? item.character ?? "").trim(),
      guild: item.guild ?? item.guildName ?? null,
      className: item.className ?? item.class ?? null,
      value:
        toNumber(item.value) ??
        toNumber(item.score) ??
        toNumber(item.resets) ??
        toNumber(item.masterResets) ??
        toNumber(item.level) ??
        toNumber(item.pkCount) ??
        toNumber(item.kills) ??
        toNumber(item.members),
    }))
    .filter((entry) => entry.name !== "");
}

export function RankingView({ kind, title, description, valueLabel }: RankingViewProps) {
  const supported = isApiRankingType(kind);
  const apiType: RankingType = supported ? kind : "reset";
  const query = useRankings(apiType, 10);
  const enabled = supported;

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const entries = useMemo(
    () => (enabled && query.data ? normalize(query.data.items) : []),
    [enabled, query.data],
  );

  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const matchSearch = entry.name.toLowerCase().includes(search.trim().toLowerCase());
        const matchClass = classFilter === "all" || entry.className === classFilter;
        return matchSearch && matchClass;
      }),
    [entries, search, classFilter],
  );

  const apiMessage = query.data?.message ?? null;
  const showList = enabled && query.isSuccess && filtered.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Ranking" title={title} description={description} className="mb-8" />

      {showList ? (
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
      ) : null}

      {!enabled ? (
        <EmptyState
          title="Classificação ainda não publicada"
          description="Esta categoria não é fornecida pela API oficial nesta fase. A disputa começa em 01 de setembro de 2026."
        />
      ) : query.isPending ? (
        <LoadingState label="Carregando classificação…" />
      ) : query.isError ? (
        <ErrorState
          description="Não foi possível carregar o ranking agora."
          onRetry={() => void query.refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum jogador classificado ainda."
          description={apiMessage ?? "A disputa começa em 01 de setembro de 2026."}
        />
      ) : null}

      {showList ? (
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
                    className={
                      entry.position <= 3
                        ? "border-b border-gold/20 bg-bronze-dark/25 last:border-0"
                        : "border-b border-white/5 last:border-0 hover:bg-bronze-dark/30"
                    }
                  >
                    <td className="data-text px-4 py-3 text-gold">{String(entry.position).padStart(2, "0")}</td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-ui text-[0.95rem] font-600 uppercase tracking-[0.06em] text-bone"
                    >
                      {entry.name}
                    </th>
                    <td className="px-4 py-3 text-parchment/80">{entry.guild ?? "—"}</td>
                    <td className="px-4 py-3 text-parchment/80">{entry.className ?? "—"}</td>
                    <td className="data-text px-4 py-3 text-gold-soft">
                      {entry.value === null ? "—" : entry.value.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-2 md:hidden">
            {filtered.map((entry) => (
              <li
                key={`${entry.position}-${entry.name}`}
                className={
                  entry.position <= 3
                    ? "plate plate-cut-soft flex flex-col gap-1 border-gold/40 p-4"
                    : "plate plate-cut-soft flex flex-col gap-1 p-4"
                }
              >
                <span className="flex items-center gap-2">
                  <span className="data-text text-[0.75rem] text-gold">
                    {String(entry.position).padStart(2, "0")}
                  </span>
                  <span className="font-ui text-[0.95rem] font-600 uppercase tracking-[0.06em] text-bone">
                    {entry.name}
                  </span>
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                  {entry.className ?? "classe —"} · {entry.guild ?? "sem guild"}
                </span>
                <span className="data-text text-sm text-gold-soft">
                  {valueLabel}: {entry.value === null ? "—" : entry.value.toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
