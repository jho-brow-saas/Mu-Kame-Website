import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "@/services/mukame-auth-api";
import type { AuthMeResponse, LoginResponse, RegisterResponse, CharactersResponse } from "@/types/mukame-auth";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
  characters: ["account", "characters"] as const,
};

/**
 * Hook para consultar a sessão atual (auth/me).
 * Não exibe toast de erro no 401 inicial.
 */
export function useAuthSession() {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: () => authRequest<AuthMeResponse>("auth/me"),
    retry: (failureCount, error: any) => {
      // Não tenta novamente em caso de 401 (não autenticado)
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para login.
 * Invalida a query auth/me após sucesso.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: any) =>
      authRequest<LoginResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}

/**
 * Hook para cadastro.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: any) =>
      authRequest<RegisterResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Hook para logout.
 * Limpa cache e estado.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      authRequest<{ ok: true }>("auth/logout", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me, null);
      queryClient.removeQueries({ queryKey: authQueryKeys.characters });
    },
  });
}

/**
 * Hook para buscar personagens da conta.
 */
export function useAccountCharacters(enabled: boolean) {
  return useQuery({
    queryKey: authQueryKeys.characters,
    queryFn: () => authRequest<CharactersResponse>("account/characters"),
    enabled,
    select: (data) => (Array.isArray(data?.data?.items) ? data.data.items : []),
  });
}
