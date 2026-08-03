import { createFileRoute } from "@tanstack/react-router";
import { PrivateShell } from "@/components/private/PrivateShell";
import { privateHead } from "@/lib/private-head";

export const Route = createFileRoute("/admin")({
  head: () =>
    privateHead(
      "Comando do Reino",
      "Área administrativa do MU Kame: contas, personagens, VIP, moedas, chamados, conteúdo e auditoria.",
      "/admin",
    ),
  component: () => <PrivateShell area="admin" />,
});
