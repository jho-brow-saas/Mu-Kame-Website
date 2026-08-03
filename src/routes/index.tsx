import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar";
import { Hero } from "../components/home/Hero";
import { Trophy, Newspaper, Flame, Crown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "MU Kame | Início - O Lendário MU Online",
    meta: [
      {
        name: "description",
        content: "O website oficial do MU Kame. Servidor de MU Online inspirado na era de ouro das lan houses. Jogue agora, suba nos rankings e torne-se o mestre kame.",
      },
      { property: "og:title", content: "MU Kame | Início" },
      { property: "og:description", content: "Reviva a nostalgia do MU Online dos anos 2000. Servidor estável, competitivo e moderno." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* News & Rankings Section */}
        <section className="py-16 bg-black/20 border-y border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* News Grid */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-mu-gold pl-4">
                  <Newspaper className="h-6 w-6 text-mu-gold" />
                  <h2 className="text-2xl font-black text-stone-100 uppercase tracking-tighter">Últimas Notícias</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Evento de Inauguração: Castelo de Sangue", date: "03 Ago, 2026", type: "Evento" },
                    { title: "Patch Notes 1.0.4 - Equilíbrio de Classes", date: "01 Ago, 2026", type: "Update" },
                    { title: "Novo Pacote VIP Kame Disponível", date: "28 Jul, 2026", type: "Shop" },
                    { title: "Guia: Como subir de nível rapidamente", date: "25 Jul, 2026", type: "Dica" },
                  ].map((item, i) => (
                    <div key={i} className="group glass-card overflow-hidden rounded-lg transition-all hover:-translate-y-1 hover:border-mu-gold/20">
                      <div className="h-32 bg-stone-900 flex items-center justify-center border-b border-white/5">
                        <Flame className="h-8 w-8 text-white/10 group-hover:text-mu-gold/20 transition-colors" />
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-mu-gold uppercase tracking-widest">{item.type}</span>
                        <h3 className="text-lg font-bold text-stone-200 mt-1 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-stone-500 mt-2">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mini Rankings */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-mu-ruby pl-4">
                  <Trophy className="h-6 w-6 text-mu-ruby" />
                  <h2 className="text-2xl font-black text-stone-100 uppercase tracking-tighter">Top 5 Resets</h2>
                </div>
                
                <div className="glass-card rounded-lg divide-y divide-white/5 border-mu-ruby/10">
                  {[
                    { name: "LordKame", level: 400, resets: 250, class: "Dark Knight" },
                    { name: "SageMaster", level: 398, resets: 245, class: "Soul Master" },
                    { name: "QueenElf", level: 400, resets: 242, class: "Muse Elf" },
                    { name: "DarkSide", level: 380, resets: 238, class: "Magic Gladiator" },
                    { name: "Z-Virus", level: 400, resets: 230, class: "Dark Lord" },
                  ].map((player, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 border border-white/10 font-black text-sm text-stone-400">
                        {i === 0 ? <Crown className="h-4 w-4 text-mu-gold" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-stone-200">{player.name}</div>
                        <div className="text-[10px] text-stone-500 uppercase">{player.class}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-mu-ruby">{player.resets}</div>
                        <div className="text-[10px] text-stone-500">RESETS</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <a href="/rankings" className="block text-center text-xs font-bold text-mu-gold hover:underline uppercase tracking-widest">
                  Ver Ranking Completo →
                </a>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-mu-stone-dark border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-stone-500">
          <div className="text-mu-gold font-black text-xl mb-4 tracking-tighter uppercase">MU KAME</div>
          <p className="max-w-md mx-auto text-sm leading-relaxed mb-8">
            Desenvolvido para fãs, por fãs. Redescubra a magia do MMORPG que marcou uma geração.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest mb-8">
            <a href="#" className="hover:text-mu-gold transition-colors">Termos</a>
            <a href="#" className="hover:text-mu-gold transition-colors">Privacidade</a>
            <a href="#" className="hover:text-mu-gold transition-colors">Regras</a>
          </div>
          <p className="text-[10px] opacity-30">
            &copy; 2026 MU Kame. Não somos afiliados à Webzen. MU Online é marca registrada.
          </p>
        </div>
      </footer>
    </div>
  );
}
