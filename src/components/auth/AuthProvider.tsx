import React, { createContext, useContext, ReactNode } from "react";
import { 
  useAuthSession, 
  useLogin, 
  useRegister, 
  useLogout, 
  useForgotPassword, 
  useResetPassword 
} from "@/hooks/use-auth-session";
import type { AuthSession } from "@/types/mukame-auth";

interface AuthContextType {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: ReturnType<typeof useLogin>["mutateAsync"];
  register: ReturnType<typeof useRegister>["mutateAsync"];
  logout: ReturnType<typeof useLogout>["mutateAsync"];
  forgotPassword: ReturnType<typeof useForgotPassword>["mutateAsync"];
  resetPassword: ReturnType<typeof useResetPassword>["mutateAsync"];
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isLoading, refetch } = useAuthSession();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const user = sessionData?.data?.session ?? null;
  const isAuthenticated = !!user;

  const refreshSession = () => {
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        resetPassword: resetPasswordMutation.mutateAsync,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
