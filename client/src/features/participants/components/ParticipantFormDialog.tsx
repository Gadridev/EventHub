import type { Participant } from "../../../types";
import type { ParticipantInput } from "../participants.api";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import {
  useCreateParticipant,
  useUpdateParticipant,
} from "../hooks/useParticipantMutations";
import { ParticipantForm } from "./ParticipantForm";

export function ParticipantFormDialog({
  participant,
  onClose,
}: {
  participant?: Participant;
  onClose: () => void;
}) {
  const createParticipant = useCreateParticipant();
  const updateParticipant = useUpdateParticipant();
  const mutation = participant ? updateParticipant : createParticipant;

  function handleSubmit(input: ParticipantInput) {
    if (mutation.isPending) {
      return;
    }
    if (participant) {
      updateParticipant.mutate(
        { id: participant.id, input },
        { onSuccess: onClose },
      );
      return;
    }
    createParticipant.mutate(input, { onSuccess: onClose });
  }

  return (
    <ParticipantForm
      initialValues={participant}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to save participant.")
          : undefined
      }
    />
  );
}
