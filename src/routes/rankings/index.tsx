import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../../components/layout/Navbar";
import { Trophy, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    title: "Rankings | MU Kame - Veja os Top Jogadores",
    meta: [
      { name: "description", content: "Confira os melhores jogadores e guildas do MU Kame." },
    ],
  }),
  component: Rankings,
});

function Rankings() {
  const players = [
    { rank: 1, name: "LordKame", guild: "KameHouse", class: "Dark Knight", resets: 250, level: 400 },
    { rank: 2, name: "SageMaster", guild: "Dragons", class: "Soul Master", resets: 245, level: 398 },
    { rank: 3, name: "QueenElf", guild: "KameHouse", class: "Muse Elf", resets: 242, level: 400 },
    { rank: 4, name: "DarkSide", guild: "Shadows", class: "Magic Gladiator", resets: 238, level: 380 },
    { rank: 5, name: "Z-Virus", guild: "Dragons", class: "Dark Lord", resets: 230, level: 400 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16 sm:px-6">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-mu-gold mx-auto mb-4" />
          <h1 className="text-4xl font-black text-stone-100 uppercase tracking-tighter">RANKING DE JOGADORES</h1>
        </div>

        <div className="glass-card overflow-hidden rounded-xl border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-mu-stone-dark/50 text-xs font-bold uppercase tracking-widest text-mu-gold">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Jogador</th>
                  <th className="p-4">Guild</th>
                  <th className="p-4">Classe</th>
                  <th className="p-4 text-right">Resets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {players.map((p) => (
                  <tr key={p.name} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-black">
                      {p.rank === 1 ? <Crown className="h-5 w-5 text-mu-gold" /> : 
                       p.rank === 2 ? <Medal className="h-5 w-5 text-stone-300" /> : 
                       p.rank === 3 ? <Medal className="h-5 w-5 text-mu-ruby" /> : 
                       p.rank}
                    </td>
                    <td className="p-4 font-bold text-stone-200">{p.name}</td>
                    <td className="p-4 text-stone-400">{p.guild}</td>
                    <td className="p-4 text-stone-400">{p.class}</td>
                    <td className="p-4 text-right font-black text-mu-gold">{p.resets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
