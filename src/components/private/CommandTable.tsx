import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  mono?: boolean;
  render: (row: T) => ReactNode;
};

/** Tabela de comando: placa metálica com inscrições e linhas técnicas. */
export function CommandTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  emptyLabel = "Sem registros para exibir.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  emptyLabel?: string;
}) {
  return (
    <div className="plate plate-cut-slot overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        {caption ? (
          <caption className="label-text border-b border-gold/25 bg-obsidian/60 px-4 py-2.5 text-left text-gold-soft">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="metal-sheet">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "border-b border-gold/25 px-4 py-2.5 font-ui text-[0.66rem] font-600 uppercase tracking-[0.2em] text-ash",
                  column.align === "right" && "text-right",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ash"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-gold/10 transition-colors hover:bg-bronze-dark/25">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-parchment/90",
                      column.align === "right" && "text-right",
                      column.mono && "data-text text-gold-soft",
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Bloco de dados em slots, para pares rótulo/valor. */
export function SlotList({ items }: { items: { label: string; value: ReactNode; hint?: string }[] }) {
  return (
    <dl className="grid gap-px bg-gold/10 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="bg-obsidian/70 px-4 py-3">
          <dt className="label-text text-ash">{item.label}</dt>
          <dd className="data-text mt-1 text-base text-gold-soft">{item.value}</dd>
          {item.hint ? <p className="mt-1 font-mono text-[0.66rem] text-ash">{item.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
