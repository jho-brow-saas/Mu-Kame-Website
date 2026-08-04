import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "@/services/mukame-auth-api";
import type { 
  AuthMeResponse, 
  LoginResponse, 
  RegisterResponse, 
  CharactersResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse
} from "@/types/mukame-auth";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
  characters: ["account", "characters"] as const,
};

export function useAuthSession() {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: () => authRequest<AuthMeResponse>("auth/me"),
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
  });
}

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

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) =>
      authRequest<RegisterResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

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

export function useAccountCharacters(enabled: boolean) {
  return useQuery({
    queryKey: authQueryKeys.characters,
    queryFn: () => authRequest<CharactersResponse>("account/characters"),
    enabled,
    select: (data) => (Array.isArray(data?.data?.items) ? data.data.items : []),
    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { loginOrEmail: string }) =>
      authRequest<ForgotPasswordResponse>("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authRequest<ResetPasswordResponse>("auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.removeQueries(); // Limpa queries privadas
    },
  });
}

