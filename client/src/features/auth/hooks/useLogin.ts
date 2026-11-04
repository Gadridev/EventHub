import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../auth.api";
import { storeAccessToken } from "../../../lib/auth-token";
import { currentUserKey } from "./useCurrentUser";

type LoginCredentials = {
  email: string;
  password: string;
};

export function useLogin(onAuthenticated: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      login(email, password),
    onSuccess: (session) => {
      queryClient.clear();
      storeAccessToken(session.accessToken);
      queryClient.setQueryData(currentUserKey, session.user);
      onAuthenticated();
    },
  });
}
