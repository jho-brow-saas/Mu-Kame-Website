import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/criar-conta")({
  loader: () => {
    throw redirect({ to: "/cadastro", replace: true });
  },
});
