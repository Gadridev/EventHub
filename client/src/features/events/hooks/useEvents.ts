import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../events.api";
import type { EventsQuery } from "../events.api";

export function useEvents(query: EventsQuery) {
  return useQuery({
    queryKey: ["events", "list", query],
    queryFn: ({ signal }) => getEvents(query, signal),
  });
}
