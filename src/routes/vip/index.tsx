import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { Star, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/vip/")({
  head: () => ({
    title: "VIP | MU Kame - Vantagens Exclusivas",
    meta: [
      { name: "description", content: "Conheça os planos VIP do MU Kame e ganhe vantagens únicas no jogo." },
    ],
  }),
  component: VIP,
});

function VIP() {
  const plans = [
    { title: "VIP Bronze", price: "R$ 15", perks: ["+10% EXP", "Sem tempo de espera em resets", "Acesso aos mapas especiais"] },
    { title: "VIP Prata", price: "R$ 30", perks: ["+25% EXP", "Comando /resetar automático", "Pet exclusivo +10% de Zen"] },
    { title: "VIP Ouro", price: "R$ 50", perks: ["+50% EXP", "Acesso ao servidor exclusivo", "Título VIP Gold + Comandos especiais"] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
        <div className="text-center mb-16">
          <Star className="h-16 w-16 text-mu-gold mx-auto mb-4" />
          <h1 className="text-4xl font-black text-stone-100 uppercase tracking-tighter">PLANOS VIP</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div key={i} className="glass-card p-8 rounded-xl border-mu-gold/20 flex flex-col">
              <h2 className="text-xl font-black text-mu-gold mb-2">{p.title}</h2>
              <div className="text-3xl font-black text-stone-100 mb-6">{p.price}<span className="text-sm text-stone-500 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {p.perks.map((pe, idx) => (
                  <li key={idx} className="text-sm text-stone-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-mu-gold" /> {pe}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-mu-gold py-3 rounded font-black text-mu-stone-dark hover:scale-105 transition-all">ASSINAR</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
