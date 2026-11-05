import { api } from "../../lib/api";
import type {
  Event,
  Participant,
  Registration,
  RegistrationStatus,
} from "../../types";
import type { PaginationData } from "../../types";

export type RegistrationDetails = Registration & {
  event: Pick<Event, "id" | "title" | "eventDate" | "status" | "createdBy">;
  participant: Pick<Participant, "id" | "fullName" | "email">;
};
export type RegistrationInput = { eventId: string; participantId: string };
export type RegistrationUpdateStatus = "confirmed" | "cancelled";
export type RegistrationsQuery = {
  page: number;
  limit: number;
  eventId?: string;
  participantId?: string;
  status?: RegistrationStatus;
};
export type RegistrationsResponse = {
  data: RegistrationDetails[];
  pagination: PaginationData;
};

export async function getRegistrations(
  params: RegistrationsQuery,
  signal?: AbortSignal,
) {
  const response = await api.get<RegistrationsResponse>("/registrations", {
    params,
    signal,
  });
  return response.data;
}
export async function getRegistration(id: string, signal?: AbortSignal) {
  const response = await api.get<{ data: RegistrationDetails }>(
    `/registrations/${id}`,
    { signal },
  );
  return response.data.data;
}
export async function createRegistration(input: RegistrationInput) {
  const response = await api.post<{ data: RegistrationDetails }>(
    "/registrations",
    input,
  );
  return response.data.data;
}
export async function changeRegistrationStatus(
  id: string,
  status: RegistrationUpdateStatus,
) {
  const response = await api.patch<{ data: RegistrationDetails }>(
    `/registrations/${id}/status`,
    { status },
  );
  return response.data.data;
}
