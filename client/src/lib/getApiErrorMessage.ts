import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<unknown>(error)) {
    return fallback;
  }
  if (!error.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const data = error.response.data;
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string" &&
    data.error.trim()
  ) {
    return data.error;
  }
  return fallback;
}
