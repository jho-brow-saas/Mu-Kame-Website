import logoAsset from "@/assets/logo-mukame.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoAsset.url} 
        alt="MU Kame" 
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-300 hover:scale-105",
          compact ? "max-h-12" : "max-h-16"
        )}
      />
    </div>
  );
}
