import type { Event } from "../../../types";
import type { EventInput } from "../events.api";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useCreateEvent, useUpdateEvent } from "../hooks/useEventMutations";
import { EventForm } from "./EventForm";

export function EventFormDialog({
  event,
  onClose,
}: {
  event?: Event;
  onClose: () => void;
}) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const mutation = event ? updateEvent : createEvent;

  function handleSubmit(input: EventInput) {
    if (mutation.isPending) {
      return;
    }
    if (!event) {
      createEvent.mutate(input, { onSuccess: onClose });
      return;
    }

    updateEvent.mutate(
      {
        id: event.id,
        input: {
          ...input,
          eventDate:
            input.eventDate === event.eventDate ? undefined : input.eventDate,
        },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <EventForm
      initialValues={event}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to save event.")
          : undefined
      }
    />
  );
}
