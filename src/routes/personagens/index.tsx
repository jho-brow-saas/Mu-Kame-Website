import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { Users, Shield, Zap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/personagens/")({
  head: () => ({
    title: "Personagens | MU Kame - Guia de Classes",
    meta: [
      { name: "description", content: "Conheça as classes lendárias do MU Kame: Dark Knight, Soul Master, Muse Elf e muito mais." },
    ],
  }),
  component: Personagens,
});

function Personagens() {
  const classes = [
    { name: "Dark Knight", title: "O Guerreiro de Aço", desc: "Mestre do combate corpo a corpo, focado em força e defesa pesada.", icon: Shield, color: "text-mu-ruby" },
    { name: "Soul Master", title: "O Mago Supremo", desc: "Especialista em magias de longo alcance e controle de multidões.", icon: Zap, color: "text-mu-cyan" },
    { name: "Muse Elf", title: "A Guardiã da Floresta", desc: "Arqueria fatal e magias de suporte/buff para toda a equipe.", icon: Sparkles, color: "text-emerald-500" },
    { name: "Dark Lord", title: "O Senhor da Guerra", desc: "Líder natural com comando de feras e ataques devastadores de luz.", icon: Crown, color: "text-mu-gold" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
        <div className="text-center mb-16">
          <Users className="h-16 w-16 text-mu-gold mx-auto mb-4" />
          <h1 className="text-4xl font-black text-stone-100 uppercase tracking-tighter">CLASSES LENDÁRIAS</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((c, i) => (
            <div key={i} className="glass-card p-8 rounded-xl border-white/10 flex gap-6 items-start hover:border-mu-gold/20 transition-all">
              <div className={`p-4 rounded-lg bg-white/5 ${c.color}`}>
                <c.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-stone-100 tracking-tight">{c.name}</h2>
                <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${c.color}`}>{c.title}</h3>
                <p className="text-stone-400 leading-relaxed text-sm">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Crown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
