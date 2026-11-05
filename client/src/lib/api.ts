import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  SESSION_EXPIRED_EVENT,
} from "./auth-token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const token = getAccessToken();
      const isLogin = error.config?.url === "/auth/login";
      if (
        !isLogin &&
        token &&
        error.config?.headers.get("Authorization") === `Bearer ${token}`
      ) {
        removeAccessToken();
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  },
);
