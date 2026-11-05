import { useState } from "react";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useCreateRegistration } from "../hooks/useRegistrationMutations";
import type { RegistrationInput } from "../registrations.api";
import { RegistrationForm } from "./RegistrationForm";
import { Button } from "../../../components/ui/Button";

export function RegistrationCreatePanel({
  eventId,
  disabled = false,
}: {
  eventId: string;
  disabled?: boolean;
}) {
  const mutation = useCreateRegistration();
  const [open, setOpen] = useState(false);
  function handleSubmit(values: RegistrationInput) {
    mutation.mutate(values, { onSuccess: () => setOpen(false) });
  }
  return (
    <>
      <Button
        primary
        onClick={() => {
          mutation.reset();
          setOpen(true);
        }}
        disabled={disabled || eventId.length === 0}
      >
        + Register participant
      </Button>
      {open && (
        <RegistrationForm
          eventId={eventId}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          submitting={mutation.isPending}
          error={
            mutation.error
              ? getApiErrorMessage(
                  mutation.error,
                  "Unable to register participant.",
                )
              : undefined
          }
        />
      )}
    </>
  );
}
