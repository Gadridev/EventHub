import { api } from "../../lib/api";
import type { Participant } from "../../types";
import type { PaginationData } from "../../types";

export type ParticipantInput = Pick<
  Participant,
  "fullName" | "email" | "phone"
>;
export type ParticipantsQuery = {
  page: number;
  limit: number;
  search?: string;
};
export type ParticipantsResponse = {
  data: Participant[];
  pagination: PaginationData;
};

export async function getParticipants(
  params: ParticipantsQuery,
  signal?: AbortSignal,
) {
  const response = await api.get<ParticipantsResponse>("/participants", {
    params,
    signal,
  });
  return response.data;
}
export async function getParticipant(id: string, signal?: AbortSignal) {
  const response = await api.get<{ data: Participant }>(`/participants/${id}`, {
    signal,
  });
  return response.data.data;
}
export async function createParticipant(input: ParticipantInput) {
  const response = await api.post<{ data: Participant }>(
    "/participants",
    input,
  );
  return response.data.data;
}
export async function updateParticipant(
  id: string,
  input: Partial<ParticipantInput>,
) {
  const response = await api.patch<{ data: Participant }>(
    `/participants/${id}`,
    input,
  );
  return response.data.data;
}
export async function deleteParticipant(id: string) {
  await api.delete(`/participants/${id}`);
}
