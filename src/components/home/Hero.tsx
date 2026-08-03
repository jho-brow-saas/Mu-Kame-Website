import { Swords, Download, ShieldCheck, Users, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-mu-gold/5 blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-mu-gold/20 bg-mu-gold/5 px-4 py-1.5 text-xs font-semibold text-mu-gold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Servidor Online: 1,248 Jogadores
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter text-stone-100 sm:text-7xl lg:text-8xl mb-6 leading-[0.9]">
          REDESCUBRA A <br />
          <span className="text-mu-gold text-shadow-gold">ERA DE OURO</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-stone-400 mb-10 leading-relaxed">
          O MU Kame traz de volta a nostalgia épica do MU Online dos anos 2000. 
          Batalhas intensas, itens lendários e uma comunidade apaixonada esperam por você.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/downloads" 
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-md bg-mu-gold px-8 py-4 text-lg font-black text-mu-stone-dark shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <Download className="h-5 w-5" />
            JOGAR AGORA
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
          
          <Link 
            to="/cadastro" 
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-mu-gold/30 bg-white/5 px-8 py-4 text-lg font-black text-mu-gold transition-all hover:bg-white/10 hover:border-mu-gold/50"
          >
            <ShieldCheck className="h-5 w-5" />
            CRIAR CONTA
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Experiência", value: "100x", icon: Swords },
            { label: "Drops", value: "30%", icon: Users },
            { label: "Resets", value: "Pontuativo", icon: Info },
            { label: "Versão", value: "97d+99i", icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-lg border-white/5 hover:border-mu-gold/20 transition-colors">
              <stat.icon className="h-5 w-5 text-mu-gold/50 mx-auto mb-2" />
              <div className="text-xs text-stone-500 uppercase font-bold tracking-widest">{stat.label}</div>
              <div className="text-lg font-black text-stone-200">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
