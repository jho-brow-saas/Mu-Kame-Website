import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { HelpCircle, MessageSquare, BookOpen, Mail } from "lucide-react";

export const Route = createFileRoute("/suporte/")({
  head: () => ({
    title: "Suporte | MU Kame - Central de Ajuda",
    meta: [
      { name: "description", content: "Precisa de ajuda? Entre em contato com a equipe do MU Kame." },
    ],
  }),
  component: Suporte,
});

function Suporte() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16">
        <div className="text-center mb-16">
          <HelpCircle className="h-16 w-16 text-mu-gold mx-auto mb-4" />
          <h1 className="text-4xl font-black text-stone-100 uppercase tracking-tighter">CENTRAL DE SUPORTE</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-xl border-white/10">
            <h2 className="text-xl font-black text-stone-100 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-mu-gold" /> Abrir Ticket
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-md py-3 px-4 text-stone-200 outline-none" placeholder="Assunto" />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-md py-3 px-4 text-stone-200 outline-none h-32" placeholder="Descreva seu problema..."></textarea>
              <button className="w-full bg-mu-gold py-3 rounded font-black text-mu-stone-dark">ENVIAR TICKET</button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl border-white/10">
              <h3 className="text-lg font-black text-stone-100 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-mu-gold" /> Wiki & Tutoriais
              </h3>
              <p className="text-sm text-stone-400 mb-4">Consulte nossos guias detalhados sobre itens, mapas e eventos.</p>
              <a href="#" className="text-xs font-bold text-mu-gold uppercase">Acessar Wiki →</a>
            </div>
            
            <div className="glass-card p-6 rounded-xl border-white/10">
              <h3 className="text-lg font-black text-stone-100 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-mu-gold" /> E-mail Direto
              </h3>
              <p className="text-sm text-stone-400">Tempo de resposta: até 24h úteis.</p>
              <p className="text-sm text-mu-gold font-bold">contato@mukame.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
