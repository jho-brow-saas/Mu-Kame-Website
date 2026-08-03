import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

/** Campo de busca das mesas de comando administrativas. */
export function CommandSearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2 border border-input bg-obsidian/70 px-3", className)}>
      <Search className="size-4 shrink-0 text-bronze" aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={80}
        className="min-h-[44px] w-full bg-transparent font-mono text-sm text-bone outline-none placeholder:text-ash"
      />
    </label>
  );
}
