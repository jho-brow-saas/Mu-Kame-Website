import { createFileRoute } from "@tanstack/react-router";
import { PrivateShell } from "@/components/private/PrivateShell";
import { privateHead } from "@/lib/private-head";

export const Route = createFileRoute("/conta")({
  head: () =>
    privateHead(
      "Central do Aventureiro",
      "Painel privado da sua conta MU Kame: personagens, VIP, moedas, chamados e segurança.",
      "/conta",
    ),
  component: () => <PrivateShell area="player" />,
});
