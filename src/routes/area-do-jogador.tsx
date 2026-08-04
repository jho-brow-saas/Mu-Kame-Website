import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { LoadingState, EmptyState } from "@/components/ui-kit/States";
import { FeatureCard, TagBadge, PlateHeader } from "@/components/ui-kit/Cards";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { 
  Coins, 
  Download, 
  LifeBuoy, 
  ShieldCheck, 
  Sword, 
  Timer, 
  LogOut, 
  User, 
  Mail, 
  Activity, 
  Calendar, 
  ShieldAlert,
  MapPin,
  Trophy,
  Users
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAccountCharacters } from "@/hooks/use-auth-session";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatVipExpiration } from "@/lib/date-utils";

const title = "Área do jogador — MU Kame";
const description = "Consulte personagens, validade do VIP, status da conta e acessos recentes no MU Kame.";

export const Route = createFileRoute("/area-do-jogador")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/area-do-jogador" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/area-do-jogador" }],
  }),
  component: PlayerAreaPage,
});

function PlayerAreaPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { data: characters, isLoading: loadingChars } = useAccountCharacters(isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ 
        to: "/entrar", 
        search: { redirect: "/area-do-jogador" } 
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingState label="Autenticando sessão..." />
        </div>
      </SiteLayout>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Você saiu da conta.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    return `${user.slice(0, 3)}***@${domain}`;
  };

  const vipLabel = user?.AccountLevel === 0 ? "Grátis" : `VIP Nível ${user?.AccountLevel}`;
  const vipTone = user?.AccountLevel === 0 ? "muted" : "gold";

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Painel de Comando"
        title={`Bem-vindo, ${user?.DisplayName}`}
        description="Gerencie seus personagens, moedas e acompanhe o status da sua conta em tempo real."
      >
        <div className="mt-4 flex flex-wrap gap-4">
          <ActionButton 
            variant="ghost" 
            className="border-gold/30 hover:bg-gold/10"

            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            Encerrar Sessão
          </ActionButton>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Card de Perfil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="plate plate-cut-slot overflow-hidden bg-obsidian/40 backdrop-blur-sm">
              <PlateHeader right="IDENTIDADE">Resumo da Conta</PlateHeader>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center bg-gold/10 border border-gold/20 plate-cut">
                    <User className="size-7 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-bone">{user?.DisplayName}</h3>
                    <p className="font-mono text-[0.7rem] text-ash uppercase tracking-wider">{user?.AccountId}</p>
                  </div>
                </div>

                <div className="rule-draw h-px w-full bg-gold/10" />

                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-parchment/60 font-ui uppercase tracking-wide">
                      <Mail className="size-3.5" /> E-mail
                    </span>
                    <span className="font-mono text-xs text-bone">{maskEmail(user?.Email || "")}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-parchment/60 font-ui uppercase tracking-wide">
                      <ShieldCheck className="size-3.5" /> Assinatura
                    </span>
                    <TagBadge tone={vipTone}>{vipLabel}</TagBadge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-parchment/60 font-ui uppercase tracking-wide">
                      <Calendar className="size-3.5" /> Expira em
                    </span>
                    <span className="font-mono text-[0.7rem] text-gold-soft">
                      {formatVipExpiration(user?.AccountExpireDate, user?.AccountLevel)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-parchment/60 font-ui uppercase tracking-wide">
                      <Activity className="size-3.5" /> Status
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", user?.IsOnline ? "bg-jade animate-pulse" : "bg-ash")} />
                      <span className="font-mono text-[0.65rem] text-bone uppercase">
                        {user?.IsOnline ? "Conectado" : "Desconectado"}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FeatureCard title="Suporte" icon={LifeBuoy} description="Atendimento via WhatsApp." />
               <FeatureCard title="Moedas" icon={Coins} description="Recarregar saldo." />
            </div>
          </div>

          {/* Listagem de Personagens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl text-gold uppercase tracking-widest flex items-center gap-3">
                <Sword className="size-6" /> Personagens 
                <span className="text-sm font-mono text-ash/60 bg-white/5 px-3 py-1 plate-cut-soft">
                  {characters?.length || 0}
                </span>
              </h2>
            </div>

            {loadingChars ? (
              <div className="plate plate-cut-soft p-12 flex justify-center bg-obsidian/20">
                <LoadingState label="Consultando crônicas..." />
              </div>
            ) : characters && characters.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {characters.map((char) => {
                  const ClassLabel = (window as any).CLASS_LABELS?.[char.Class] || `Classe ${char.Class}`;
                  return (
                    <div key={char.Name} className="plate plate-cut-slot overflow-hidden bg-obsidian/60 group hover:border-gold/40 transition-all">
                      <PlateHeader right={`Level ${char.Level}`}>
                        {char.Name}
                      </PlateHeader>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-col">
                            <span className="text-[0.6rem] text-ash uppercase tracking-tighter">Classe</span>
                            <span className="text-sm text-bone font-medium">{ClassLabel}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.6rem] text-ash uppercase tracking-tighter">Resets</span>
                            <span className="text-sm text-gold-soft font-bold">{char.Resets}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col">
                            <span className="text-[0.6rem] text-ash uppercase tracking-tighter">Localização</span>
                            <span className="text-xs text-bone/80 flex items-center gap-1">
                              <MapPin className="size-3 text-bronze" /> Mapa {char.MapNumber}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.6rem] text-ash uppercase tracking-tighter">Master Reset</span>
                            <span className="text-sm text-parchment">{char.MasterResetCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gold/5 bg-gold/5 px-4 py-2 flex justify-between items-center">
                        <span className="text-[0.6rem] text-ash/60 uppercase">Último Acesso</span>
                        <span className="text-[0.65rem] font-mono text-bone/50">
                          {char.LastLoginAt ? new Date(char.LastLoginAt).toLocaleDateString("pt-BR") : "Nunca"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            ) : (
              <EmptyState 
                title="Nenhum herói encontrado" 
                description="Você ainda não criou personagens nesta conta. Entre no jogo para iniciar sua jornada."
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard title="Downloads" icon={Download} description="Baixe o cliente completo." />
              <Link to="/esqueci-minha-senha" title="Redefinir senha por e-mail">
                <FeatureCard title="Segurança" icon={ShieldCheck} description="Redefinir senha por e-mail" />
              </Link>
              <FeatureCard title="Ranking" icon={Trophy} description="Ver classificação global." />
            </div>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
