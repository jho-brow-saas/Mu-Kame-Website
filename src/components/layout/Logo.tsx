import logoAsset from "@/assets/logo-mukame.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <img 
        src={logoAsset.url} 
        alt="MU Kame" 
        className={cn(
          "w-auto object-contain transition-transform duration-300 hover:scale-110 origin-left",
          // Alturas agressivas para compensar as margens internas do asset e garantir presença visual (34px-50px reais)
          "h-[75px] md:h-[95px] lg:h-[115px]",
          compact && "h-[50px] md:h-[65px] lg:h-[75px]"
        )}
      />
    </div>
  );
}
