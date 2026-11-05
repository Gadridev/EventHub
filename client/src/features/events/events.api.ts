import { api } from "../../lib/api";
import type { Event, EventStatus, User } from "../../types";

export type EventInput = Pick<
  Event,
  "title" | "description" | "location" | "eventDate" | "maxParticipants"
>;
export type EventWithSeats = Event & {
  activeRegistrations: number;
  availableSeats: number;
};
export type EventDetails = EventWithSeats & { creator: User };
export type EventsQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: EventStatus;
};
export type EventsResponse = {
  data: EventWithSeats[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getEvents(params: EventsQuery, signal?: AbortSignal) {
  const response = await api.get<EventsResponse>("/events", { params, signal });
  return response.data;
}

export async function getEvent(id: string, signal?: AbortSignal) {
  const response = await api.get<{ data: EventDetails }>(`/events/${id}`, {
    signal,
  });
  return response.data.data;
}

export async function createEvent(input: EventInput) {
  const response = await api.post<{ data: Event }>("/events", input);
  return response.data.data;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  const response = await api.patch<{ data: Event }>(`/events/${id}`, input);
  return response.data.data;
}

export async function changeEventStatus(
  id: string,
  status: "published" | "cancelled",
) {
  const response = await api.patch<{ data: Event }>(`/events/${id}/status`, {
    status,
  });
  return response.data.data;
}

export async function deleteEvent(id: string) {
  await api.delete(`/events/${id}`);
}
