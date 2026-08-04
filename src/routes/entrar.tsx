import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/entrar")({
  loader: () => {
    throw redirect({ to: "/login", replace: true });
  },
});
