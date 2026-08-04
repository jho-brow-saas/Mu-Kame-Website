import logoAsset from "@/assets/logo-mukame.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <img 
        src={logoAsset.url} 
        alt="MU Kame" 
        className={cn(
          "w-auto object-contain transition-transform duration-300 hover:scale-105",
          // Alturas agressivamente aumentadas para compensar as grandes margens internas do asset PNG
          "h-[70px] md:h-[85px] lg:h-[100px]",
          compact && "h-[50px] md:h-[65px] lg:h-[75px]"
        )}
      />
    </div>
  );
}
