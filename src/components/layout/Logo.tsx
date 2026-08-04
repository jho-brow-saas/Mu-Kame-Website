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
          "h-[38px] md:h-[44px] lg:h-[50px]",
          compact && "h-[32px] md:h-[38px] lg:h-[42px]"
        )}
      />
    </div>
  );
}
