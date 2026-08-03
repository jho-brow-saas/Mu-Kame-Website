import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { Download, Monitor, HardDrive, Cpu } from "lucide-react";

export const Route = createFileRoute("/downloads/")({
  head: () => ({
    title: "Downloads | MU Kame - Baixe o Jogo",
    meta: [
      { name: "description", content: "Baixe o cliente oficial do MU Kame e comece sua aventura agora." },
    ],
  }),
  component: Downloads,
});

function Downloads() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Download className="h-16 w-16 text-mu-gold mx-auto mb-4" />
          <h1 className="text-4xl font-black text-stone-100 uppercase tracking-tighter sm:text-5xl lg:text-6xl">
            CENTRAL DE <span className="text-mu-gold">DOWNLOADS</span>
          </h1>
          <p className="text-stone-400 mt-4 max-w-2xl mx-auto">
            Escolha o link de sua preferência. Recomendamos a versão completa com som para uma experiência imersiva.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { 
              title: "Instalador Completo", 
              desc: "Contém todos os sons e músicas originais do jogo.", 
              size: "450 MB", 
              version: "v1.0.4",
              primary: true
            },
            { 
              title: "Instalador Lite", 
              desc: "Versão reduzida sem sons e músicas para download rápido.", 
              size: "180 MB", 
              version: "v1.0.4",
              primary: false
            }
          ].map((item, i) => (
            <div key={i} className={`glass-card p-8 rounded-xl border-white/10 ${item.primary ? 'border-mu-gold/30 bg-mu-gold/5' : ''}`}>
              <h2 className="text-2xl font-black text-stone-100 mb-2 uppercase tracking-tight">{item.title}</h2>
              <p className="text-stone-400 text-sm mb-6">{item.desc}</p>
              
              <div className="flex items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest">
                <div className="text-stone-500">Tamanho: <span className="text-stone-200">{item.size}</span></div>
                <div className="text-stone-500">Versão: <span className="text-stone-200">{item.version}</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-mu-gold py-3 rounded-md font-black text-mu-stone-dark text-sm hover:scale-105 transition-all">MEGA</button>
                <button className="bg-stone-800 py-3 rounded-md font-black text-stone-200 text-sm hover:bg-stone-700 transition-all">MEDIAFIRE</button>
                <button className="bg-stone-800 py-3 rounded-md font-black text-stone-200 text-sm hover:bg-stone-700 transition-all">DRIVE</button>
                <button className="bg-stone-800 py-3 rounded-md font-black text-stone-200 text-sm hover:bg-stone-700 transition-all">TORRENT</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass-card p-8 rounded-xl border-white/10 bg-black/40">
          <h2 className="text-xl font-black text-stone-100 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Monitor className="h-5 w-5 text-mu-gold" /> Requisitos do Sistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-mu-gold uppercase tracking-tighter">
                <Cpu className="h-4 w-4" /> Processador
              </div>
              <p className="text-sm text-stone-400">Mínimo: Pentium 4 2.0GHz<br />Recomendado: Core i3 ou superior</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-mu-gold uppercase tracking-tighter">
                <HardDrive className="h-4 w-4" /> Memória RAM
              </div>
              <p className="text-sm text-stone-400">Mínimo: 1GB RAM<br />Recomendado: 4GB RAM ou superior</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-mu-gold uppercase tracking-tighter">
                <Monitor className="h-4 w-4" /> Placa de Vídeo
              </div>
              <p className="text-sm text-stone-400">Mínimo: 128MB com suporte 3D<br />Recomendado: 1GB Dedicada</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
