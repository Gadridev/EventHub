export const ACCESS_TOKEN_KEY = "eventhub.accessToken";
export const SESSION_EXPIRED_EVENT = "eventhub:session-expired";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
