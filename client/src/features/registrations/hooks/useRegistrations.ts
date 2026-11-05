import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "../registrations.api";
import type { RegistrationsQuery } from "../registrations.api";

export function useRegistrations(query: RegistrationsQuery) {
  return useQuery({
    queryKey: ["registrations", "list", query],
    queryFn: ({ signal }) => getRegistrations(query, signal),
  });
}
