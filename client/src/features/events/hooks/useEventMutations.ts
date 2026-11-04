import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventsApi from "../events.api";
import type { EventInput } from "../events.api";

function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["events"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
}

export function useCreateEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: invalidateEvents,
  });
}

export function useUpdateEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EventInput> }) =>
      eventsApi.updateEvent(id, input),
    onSuccess: invalidateEvents,
  });
}

export function usePublishEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => eventsApi.changeEventStatus(id, "published"),
    onSuccess: invalidateEvents,
  });
}

export function useCancelEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => eventsApi.changeEventStatus(id, "cancelled"),
    onSuccess: invalidateEvents,
  });
}

export function useDeleteEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: invalidateEvents,
  });
}
