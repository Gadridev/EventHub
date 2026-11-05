import type { Participant } from "../../../types";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useDeleteParticipant } from "../hooks/useParticipantMutations";

export function ParticipantDeleteDialog({
  participant,
  onClose,
  onDeleted,
}: {
  participant: Participant;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const mutation = useDeleteParticipant();
  function handleConfirm() {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate(participant.id, { onSuccess: onDeleted });
  }
  return (
    <ConfirmDialog
      title="Delete participant"
      description={`Permanently delete ${participant.fullName}? Participants with any registrations, including cancelled registrations, cannot be deleted.`}
      onClose={onClose}
      onConfirm={handleConfirm}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to delete participant.")
          : undefined
      }
    />
  );
}
