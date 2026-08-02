import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Como conectar VPS ao GitHub | Mu Online Setup",
    meta: [
      {
        name: "description",
        content: "Guia prático de como conectar seu site de Mu Online hospedado em VPS ao GitHub para automação de alterações.",
      },
      { property: "og:title", content: "Como conectar VPS ao GitHub | Mu Online Setup" },
      { property: "og:description", content: "Guia prático de como conectar seu site de Mu Online hospedado em VPS ao GitHub para automação de alterações." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
        como faço?
      </h1>
      <p className="max-w-[600px] text-lg text-muted-foreground">
        Tenho um site de um jogo Mu online, ta ativo junto com o servidor na vps, como faço para conectar pelo github os dois e fazer alterações no website por aqui?
      </p>
    </div>
  );
}

