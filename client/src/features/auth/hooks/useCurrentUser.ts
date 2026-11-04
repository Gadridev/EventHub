import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../auth.api";

export const currentUserKey = ["auth", "me"] as const;

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: ({ signal }) => getCurrentUser(signal),
    enabled,
  });
}
