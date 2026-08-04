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
          // Mobile: 34-38px
          // Tablet: 40-44px
          // Desktop: 46-50px
          // Using slightly larger values if the asset has internal margins
          "h-[36px] md:h-[42px] lg:h-[48px]",
          compact && "h-[32px] md:h-[38px] lg:h-[44px]"
        )}
      />
    </div>
  );
}
