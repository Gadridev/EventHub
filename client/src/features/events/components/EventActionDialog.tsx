import type { Event } from "../../../types";
import { ConfirmDialog } from "../../../components/ui/Modal";

import {
  usePublishEvent,
  useCancelEvent,
  useDeleteEvent,
} from "../hooks/useEventMutations";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";

export type EventAction = "publish" | "cancel" | "delete";

export function EventActionDialog({
  action,
  event,
  onSuccess,
  onClose,
}: {
  action: EventAction;
  event: Event;
  onSuccess: (action: EventAction) => void;
  onClose: () => void;
}) {
  const publishEvent = usePublishEvent();
  const cancelEvent = useCancelEvent();
  const deleteEvent = useDeleteEvent();

  let mutation: typeof publishEvent | typeof cancelEvent | typeof deleteEvent;
  switch (action) {
    case "publish":
      mutation = publishEvent;
      break;
    case "cancel":
      mutation = cancelEvent;
      break;
    case "delete":
      mutation = deleteEvent;
      break;
  }

  async function handleConfirm() {
    if (mutation.isPending) {
      return;
    }
    try {
      await mutation.mutateAsync(event.id);
    } catch {
      // The mutation error is displayed below; keep the dialog open for retry.
      return;
    }
    // Deleting can unmount this dialog when detail invalidation returns 404.
    // Awaiting the mutation still lets the page finish its navigation.
    onSuccess(action);
  }

  const titles = {
    publish: "Publish event",
    cancel: "Cancel event",
    delete: "Delete event",
  };
  const descriptions = {
    publish: `Publish “${event.title}” and open it for registrations?`,
    cancel: `Cancel “${event.title}”? All its registrations will also be cancelled. The event cannot be reopened.`,
    delete: `Permanently delete “${event.title}”? Events with registrations cannot be deleted.`,
  };
  return (
    <ConfirmDialog
      title={titles[action]}
      description={descriptions[action]}
      onConfirm={handleConfirm}
      onClose={onClose}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to update event.")
          : undefined
      }
    />
  );
}
