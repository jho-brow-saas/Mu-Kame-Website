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
          // Alturas aumentadas para compensar margens internas do asset e atingir altura visual desejada
          "h-[48px] md:h-[58px] lg:h-[72px]",
          compact && "h-[40px] md:h-[48px] lg:h-[56px]"
        )}
      />
    </div>
  );
}
