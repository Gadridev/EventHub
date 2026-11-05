export type Role = "admin" | "staff";
export type EventStatus = "draft" | "published" | "cancelled";
export type RegistrationStatus = "pending" | "confirmed" | "cancelled";
export interface User {
  id: string;
  email: string;
  role: Role;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  maxParticipants: number;
  status: EventStatus;
  createdBy: string;
}
export interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}
export interface Registration {
  id: string;
  eventId: string;
  participantId: string;
  status: RegistrationStatus;
  createdAt: string;
}

export type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
