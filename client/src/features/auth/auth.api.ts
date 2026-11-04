import { api } from "../../lib/api";
import type { User } from "../../types";

export type AuthUser = User;

type LoginResponse = {
  result: { accessToken: string; user: AuthUser };
};

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data.result;
}

export async function getCurrentUser(signal?: AbortSignal) {
  const response = await api.get<{ user: AuthUser }>("/auth/me", { signal });
  return response.data.user;
}
