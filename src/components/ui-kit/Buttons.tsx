import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

const base =
  "btn-cut relative inline-flex min-h-[46px] items-center justify-center gap-2 px-6 py-3 font-ui text-[0.82rem] font-700 uppercase tracking-[0.16em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55";

export const primaryClasses = cn(
  base,
  "bronze-sheet border border-gold/55 text-bone shadow-[inset_0_1px_0_rgb(255_255_255_/_14%),0_10px_20px_-14px_#000]",
  "hover:border-gold hover:text-gold-soft hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_20%),0_0_0_1px_rgb(199_154_69_/_35%)]",
  "active:translate-y-px",
);

export const secondaryClasses = cn(
  base,
  "metal-sheet border border-bronze/60 text-parchment hover:border-gold/70 hover:text-gold-soft active:translate-y-px",
);

export const ghostClasses = cn(
  base,
  "border border-stone/50 bg-obsidian/40 text-ash hover:border-gold/50 hover:text-bone active:translate-y-px",
);

export const dangerClasses = cn(
  base,
  "border border-crimson/60 bg-wine/40 text-bone hover:border-crimson hover:bg-wine/60",
);

type Variant = "primary" | "secondary" | "ghost" | "danger";

function variantClass(variant: Variant) {
  if (variant === "primary") return primaryClasses;
  if (variant === "secondary") return secondaryClasses;
  if (variant === "danger") return dangerClasses;
  return ghostClasses;
}

export function ActionButton({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cn(variantClass(variant), className)} {...props}>
      {children}
    </button>
  );
}

export function ActionLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={cn(variantClass(variant), className)} {...props}>
      {children}
    </Link>
  );
}

export function ActionAnchor({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a className={cn(variantClass(variant), className)} {...props}>
      {children}
    </a>
  );
}

/** Link textual com colchetes, no estilo dos portais de guild de 2003. */
export const bracketClasses =
  "group inline-flex items-center gap-1 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-soft";

export function BracketMarks({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="text-bronze transition-colors group-hover:text-gold">
        [
      </span>
      {children}
      <span aria-hidden="true" className="text-bronze transition-colors group-hover:text-gold">
        ]
      </span>
    </>
  );
}

export function BracketLink({
  className,
  children,
  to,
}: {
  className?: string;
  children: ReactNode;
  to: string;
}) {
  return (
    <Link to={to} className={cn(bracketClasses, className)}>
      <BracketMarks>{children}</BracketMarks>
    </Link>
  );
}

