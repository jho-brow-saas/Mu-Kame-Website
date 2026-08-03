import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader } from "@/components/private/PrivateShell";
import { ActionLink } from "@/components/ui-kit/Buttons";
import { HardDriveDownload, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/conta/downloads")({
  component: AccountDownloadsPage,
});

const items = [
  { title: "Cliente completo", description: "Instalação integral do MU Kame Season 6.15.", tag: "full" },
  { title: "Patch mais recente", description: "Atualização incremental aplicada sobre o cliente existente.", tag: "patch" },
  { title: "Launcher", description: "Verificador de arquivos e atalho oficial de entrada.", tag: "launcher" },
];

function AccountDownloadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-04"
        title="Downloads"
        description="Arquivos oficiais do servidor. Os links definitivos são publicados pela equipe na página pública de downloads."
      />

      <ModuleBlock title="Pacotes oficiais" hint="espelhos gerenciados pela equipe">
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 border border-gold/20 bg-obsidian/60 p-4">
              <span className="label-text flex items-center gap-2 text-gold-soft">
                <HardDriveDownload className="size-3.5 text-bronze" aria-hidden="true" />
                {item.tag}
              </span>
              <h3 className="card-title uppercase text-bone">{item.title}</h3>
              <p className="text-sm leading-relaxed text-parchment/80">{item.description}</p>
              <span className="data-text text-[0.68rem] text-ash">Link publicado na página pública.</span>
            </li>
          ))}
        </ul>
        <ActionLink to="/downloads" variant="secondary" className="mt-5 self-start">
          Abrir central de downloads
        </ActionLink>
      </ModuleBlock>

      <p className="flex items-start gap-2 border border-mana/50 bg-mana/15 px-4 py-3 font-mono text-[0.68rem] leading-relaxed text-arcane">
        <ShieldCheck className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        Baixe apenas dos espelhos oficiais. A equipe nunca envia arquivos por mensagem privada.
      </p>
    </div>
  );
}
