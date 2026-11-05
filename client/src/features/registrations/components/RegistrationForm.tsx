import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import type { Selection } from "../../../components/ui/PagedSelect";
import type { RegistrationInput } from "../registrations.api";
import { ParticipantPicker } from "./ParticipantPicker";

export function RegistrationForm({
  onSubmit,
  onClose,
  eventId,
  submitting = false,
  error,
}: {
  onSubmit: (values: RegistrationInput) => void;
  onClose: () => void;
  eventId: string;
  submitting?: boolean;
  error?: string;
}) {
  const [participant, setParticipant] = useState<Selection | null>(null);

  function handleSubmit(submission: FormEvent<HTMLFormElement>) {
    submission.preventDefault();
    if (!participant) {
      return;
    }
    onSubmit({ participantId: participant.id, eventId });
  }
  return (
    <Modal title="New registration" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <ParticipantPicker selected={participant} onChange={setParticipant} />
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button primary type="submit" disabled={!participant || submitting}>
            {submitting ? "Registering…" : "Register participant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
