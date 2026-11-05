import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as participantsApi from "../participants.api";
import type { ParticipantInput } from "../participants.api";

function useInvalidateParticipants() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["participants"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
}
export function useCreateParticipant() {
  const invalidateParticipants = useInvalidateParticipants();
  return useMutation({
    mutationFn: participantsApi.createParticipant,
    onSuccess: invalidateParticipants,
  });
}
export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  const invalidateParticipants = useInvalidateParticipants();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<ParticipantInput>;
    }) => participantsApi.updateParticipant(id, input),
    onSuccess: () =>
      Promise.all([
        invalidateParticipants(),
        queryClient.invalidateQueries({ queryKey: ["registrations"] }),
      ]),
  });
}
export function useDeleteParticipant() {
  const invalidateParticipants = useInvalidateParticipants();
  return useMutation({
    mutationFn: participantsApi.deleteParticipant,
    onSuccess: invalidateParticipants,
  });
}
