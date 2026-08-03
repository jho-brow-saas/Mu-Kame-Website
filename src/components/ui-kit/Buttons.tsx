import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60";

export const primaryClasses = cn(
  base,
  "bg-jade text-[color:var(--primary-foreground)] shadow-[0_0_24px_rgb(45_214_163_/_22%)] hover:bg-jade-glow hover:shadow-[0_0_32px_rgb(119_242_207_/_28%)]",
);

export const secondaryClasses = cn(
  base,
  "border border-gold/40 bg-transparent text-gold-soft hover:border-gold hover:bg-gold/10",
);

export const ghostClasses = cn(base, "border border-white/10 text-mist hover:border-white/25 hover:text-ivory");

type Variant = "primary" | "secondary" | "ghost";

function variantClass(variant: Variant) {
  if (variant === "primary") return primaryClasses;
  if (variant === "secondary") return secondaryClasses;
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
