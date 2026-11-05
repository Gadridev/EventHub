import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useLogin } from "./hooks/useLogin";
import type { AuthUser } from "./auth.api";
import {
  getAccessToken,
  removeAccessToken,
  SESSION_EXPIRED_EVENT,
} from "../../lib/auth-token";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationError: Error | null;
  retryVerification: () => Promise<void>;
  isLoggingIn: boolean;
  loginError: Error | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(getAccessToken()));
  const currentUser = useCurrentUser(hasToken);
  const loginMutation = useLogin(() => setHasToken(true));
  const resetLogin = loginMutation.reset;

  const logout = useCallback(() => {
    removeAccessToken();
    setHasToken(false);
    queryClient.clear();
    resetLogin();
  }, [queryClient, resetLogin]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

   function login(email: string, password: string) {
     loginMutation.mutate({ email, password });
  }

  async function retryVerification() {
    await currentUser.refetch();
  }

  const user = hasToken ? (currentUser.data ?? null) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading: hasToken && !user && currentUser.isFetching,
        verificationError: hasToken ? currentUser.error : null,
        retryVerification,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
