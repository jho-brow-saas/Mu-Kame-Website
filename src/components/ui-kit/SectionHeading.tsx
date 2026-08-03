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
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-jade">{eyebrow}</span>
      ) : null}
      <h2 className="section-title text-ivory">{title}</h2>
      {description ? <p className="body-text max-w-2xl text-mist">{description}</p> : null}
    </header>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("surface-card p-6 sm:p-8", className)}>{children}</div>;
}

export function Divider() {
  return <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />;
}
