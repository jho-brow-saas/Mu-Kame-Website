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
        verifique se estamos conectador no github
      </h1>
      <div className="max-w-4xl w-full text-left space-y-6 bg-card p-6 rounded-lg border shadow-sm">
        <p className="text-lg">
          Nessa tela do terminal (PowerShell), você está gerando o seu <strong>par de chaves SSH</strong>. Esse é o "segredo" que permitirá ao GitHub entrar na sua VPS de forma segura sem usar sua senha principal.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">O que fazer agora:</h2>
          
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
            <li>
              <span className="text-foreground font-medium">Pressione ENTER</span>: Ele está perguntando onde salvar o arquivo. O local padrão <code className="bg-muted px-1 rounded">C:\Users\Administrator/.ssh/id_ed25519</code> está correto.
            </li>
            <li>
              <span className="text-foreground font-medium">Defina uma senha (opcional)</span>: Ele pedirá uma "passphrase". Você pode apenas apertar <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">ENTER</kbd> duas vezes para deixar sem senha (mais fácil para automação).
            </li>
            <li>
              <span className="text-foreground font-medium">Localize as chaves</span>: Vá até a pasta <code className="bg-muted px-1 rounded">C:\Users\Administrator\.ssh\</code>. Você verá dois arquivos:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><code className="text-primary font-mono">id_ed25519</code>: Sua <strong>Chave Privada</strong> (NUNCA compartilhe, você vai colocar ela nos <em>Secrets</em> do GitHub).</li>
                <li><code className="text-primary font-mono">id_ed25519.pub</code>: Sua <strong>Chave Pública</strong> (Você vai copiar o conteúdo dela para dentro da sua VPS).</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Próximo passo:</strong> Depois de gerar, você precisa adicionar o conteúdo do arquivo <code className="font-mono">.pub</code> no arquivo <code className="font-mono">~/.ssh/authorized_keys</code> da sua VPS para que ela reconheça essa chave.
          </p>
        </div>
      </div>
    </div>
  );
}

