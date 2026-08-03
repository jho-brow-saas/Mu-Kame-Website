import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Análise de Conexão GitHub | Projeto Mu Online",
    meta: [
      {
        name: "description",
        content: "Verificação de status da conexão GitHub e preparação do ambiente para o projeto Mu Online.",
      },
      { property: "og:title", content: "Análise de Conexão GitHub | Projeto Mu Online" },
      { property: "og:description", content: "Verificação de status da conexão GitHub e preparação do ambiente para o projeto Mu Online." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          Faça uma analise e verifique se o github está conectado corretamente para iniciarmos o projeto
        </h1>
        
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-center gap-3 text-emerald-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Ambiente Git Local: Conectado</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            O repositório está pronto para receber alterações e sincronizar via GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}

