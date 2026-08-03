import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { Lock, User, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login/")({
  head: () => ({
    title: "Login | MU Kame - Acesse sua conta",
    meta: [
      { name: "description", content: "Acesse sua conta no MU Kame para gerenciar seus personagens e compras." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-8 rounded-xl border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-mu-gold mx-auto mb-4" />
            <h1 className="text-3xl font-black text-stone-100 uppercase tracking-tighter">Login</h1>
            <p className="text-stone-400 text-sm mt-2">Acesse o painel do guerreiro</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-mu-gold uppercase tracking-widest mb-1">Login</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-md py-3 pl-10 pr-4 text-stone-200 focus:border-mu-gold focus:ring-1 focus:ring-mu-gold outline-none transition-all" placeholder="Seu login" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-mu-gold uppercase tracking-widest mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input type="password" className="w-full bg-black/40 border border-white/10 rounded-md py-3 pl-10 pr-4 text-stone-200 focus:border-mu-gold focus:ring-1 focus:ring-mu-gold outline-none transition-all" placeholder="••••••••" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-mu-gold py-4 rounded-md font-black text-mu-stone-dark shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
              ENTRAR
            </button>
          </form>
          
          <p className="text-center text-xs text-stone-500 mt-6">
            Não tem uma conta? <a href="/cadastro" className="text-mu-gold hover:underline">Cadastre-se</a>
          </p>
        </div>
      </main>
    </div>
  );
}
