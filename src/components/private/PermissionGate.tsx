import { can, type Permission } from "@/config/access";
import { useSession } from "@/hooks/use-session";
import type { ReactNode } from "react";

/**
 * Oculta ações não autorizadas na interface.
 * AVISO: barreira apenas visual — a API DEVE revalidar toda permissão
 * no servidor antes de executar qualquer operação.
 */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { session, phase } = useSession();
  // Sem sessão válida (API ausente) a UI é exibida em modo inerte,
  // com mutações já desligadas por feature flag.
  if (phase === "ready" && !can(session.role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
