import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../events.api";

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", "detail", id],
    queryFn: ({ signal }) => getEvent(id, signal),
  });
}
