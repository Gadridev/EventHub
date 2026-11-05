import { useQuery } from "@tanstack/react-query";
import { getParticipants } from "../participants.api";
import type { ParticipantsQuery } from "../participants.api";

export function useParticipants(query: ParticipantsQuery) {
  return useQuery({
    queryKey: ["participants", "list", query],
    queryFn: ({ signal }) => getParticipants(query, signal),
  });
}
