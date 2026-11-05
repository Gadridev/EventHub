import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRegistration,
  changeRegistrationStatus,
} from "../registrations.api";
import type { RegistrationUpdateStatus } from "../registrations.api";

function useInvalidateRegistrations() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["registrations"] }),
      queryClient.invalidateQueries({ queryKey: ["events"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
}
export function useCreateRegistration() {
  const invalidateRegistrations = useInvalidateRegistrations();
  return useMutation({
    mutationFn: createRegistration,
    onSuccess: invalidateRegistrations,
  });
}
export function useChangeRegistrationStatus() {
  const invalidateRegistrations = useInvalidateRegistrations();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: RegistrationUpdateStatus;
    }) => changeRegistrationStatus(id, status),
    onSuccess: invalidateRegistrations,
  });
}
