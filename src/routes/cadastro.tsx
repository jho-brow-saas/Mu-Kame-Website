import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cadastro")({
  loader: () => {
    throw redirect({ to: "/criar-conta", replace: true });
  },
});
