import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { featureFlags } from "@/config/access";
import { disabledError, fail } from "@/services/api";
import { Image, Link2 } from "lucide-react";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminContentPage,
});

const socialSlots = ["WhatsApp", "Discord", "Instagram", "YouTube", "Facebook"];
const mediaSlots = ["Fundo do herói", "Fundo do Castle Siege", "Selo do reino", "Capa de notícias", "Banner do VIP"];

function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-09"
        title="Conteúdo e mídia"
        description="Links de redes sociais, imagens e planos de fundo usados nas páginas públicas."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Redes sociais" hint="links públicos">
        <ul className="grid gap-px bg-gold/10 sm:grid-cols-2">
          {socialSlots.map((slot) => (
            <li key={slot} className="flex items-center gap-3 bg-obsidian/70 px-4 py-3">
              <Link2 className="size-4 shrink-0 text-bronze" aria-hidden="true" />
              <span className="label-text flex-1 text-ash">{slot}</span>
              <span className="data-text text-[0.68rem] text-gold-soft">não configurado</span>
            </li>
          ))}
        </ul>
      </ModuleBlock>

      <ModuleBlock title="Imagens e fundos" hint="slots de mídia">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaSlots.map((slot) => (
            <li key={slot} className="flex flex-col gap-2 border border-gold/20 bg-obsidian/60 p-4">
              <span
                aria-hidden="true"
                className="silver-sheet flex h-24 items-center justify-center border border-gold/25"
              >
                <Image className="size-6 text-bronze" aria-hidden="true" />
              </span>
              <span className="label-text text-ash">{slot}</span>
              <span className="data-text text-[0.68rem] text-gold-soft">sem arquivo definido</span>
            </li>
          ))}
        </ul>
      </ModuleBlock>

      <PermissionGate permission="content.write">
        <ModuleBlock title="Aplicar alterações" hint="escrita desativada">
          <CriticalActionButton
            label="Publicar conteúdo"
            title="Publicar alterações de conteúdo"
            description="Atualiza links e mídias exibidos nas páginas públicas do MU Kame."
            destructive={false}
            disabled={!featureFlags.enableAdminMutations}
            disabledHint="Publicação desativada até a API segura entrar em produção."
            className="sm:max-w-xs"
            onConfirm={async () => fail(disabledError)}
          />
        </ModuleBlock>
      </PermissionGate>
    </div>
  );
}
