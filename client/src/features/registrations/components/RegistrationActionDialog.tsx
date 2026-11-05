import { ConfirmDialog } from "../../../components/ui/Modal";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useChangeRegistrationStatus } from "../hooks/useRegistrationMutations";
import type {
  RegistrationDetails,
  RegistrationUpdateStatus,
} from "../registrations.api";

export function RegistrationActionDialog({
  registration,
  status,
  onClose,
}: {
  registration: RegistrationDetails;
  status: RegistrationUpdateStatus;
  onClose: () => void;
}) {
  const mutation = useChangeRegistrationStatus();
  function handleConfirm() {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ id: registration.id, status }, { onSuccess: onClose });
  }
  const title =
    status === "confirmed" ? "Confirm registration" : "Cancel registration";
  const description = `${registration.participant.fullName} — ${registration.event.title}${status === "cancelled" ? ". Cancelled registrations cannot be reactivated." : ""}`;
  return (
    <ConfirmDialog
      title={title}
      description={description}
      onClose={onClose}
      onConfirm={handleConfirm}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to update registration.")
          : undefined
      }
    />
  );
}
