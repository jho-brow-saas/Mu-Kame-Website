import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  isH1?: boolean;
}) {
  const TitleTag = isH1 ? "h1" : "h2";
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-gold",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-bronze" />
          {eyebrow}
          <span aria-hidden="true" className="h-px w-8 bg-bronze" />
        </span>
      ) : null}
      <TitleTag className="section-title text-bone">{title}</TitleTag>
      <span
        aria-hidden="true"
        className={cn(
          "rule-draw h-[2px] w-24 bg-linear-to-r from-gold via-bronze to-transparent",
          align === "center" && "mx-auto",
        )}
      />
      {description ? (
        <p className={cn("body-text max-w-2xl text-parchment/85", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("plate plate-cut-soft inner-rule p-6 sm:p-8", className)}>{children}</div>;
}

export function Divider() {
  return (
    <div className="relative h-4 w-full" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-bronze/60 to-transparent" />
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold/60 bg-obsidian" />
    </div>
  );
}

/** Faixa de seção com material próprio: alterna a textura ao longo da home. */
export function MaterialSection({
  material,
  id,
  className,
  children,
}: {
  material: "iron" | "stone" | "parchment" | "map" | "fortress" | "launcher" | "void";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const sheet = {
    iron: "metal-sheet",
    stone: "stone-sheet",
    parchment: "parchment-sheet",
    map: "stone-sheet",
    fortress: "fortress-sheet",
    launcher: "launcher-sheet",
    void: "bg-obsidian",
  }[material];

  return (
    <section
      id={id}
      className={cn("relative isolate overflow-hidden edge-rule-top edge-rule-bottom", sheet, className)}
    >
      {material === "map" ? <span aria-hidden="true" className="map-grid absolute inset-0 opacity-70" /> : null}
      {material === "launcher" ? (
        <span aria-hidden="true" className="crt-lines crt-flicker pointer-events-none absolute inset-0" />
      ) : null}
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">{children}</div>
    </section>
  );
}
