import { api } from "../../lib/api";
import type { EventStatus } from "../../types";

export type DashboardEvent = {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  status: EventStatus;
  maxParticipants: number;
  activeRegistrations: number;
  availableSeats: number;
};

export type MostFilledDashboardEvent = DashboardEvent & { fillPercentage: number };

export type DashboardStats = {
  totalEvents: number;
  publishedEvents: number;
  totalParticipants: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  confirmedRegistrations: number;
  cancelledRegistrations: number;
  seatUtilization: number;
  registrationsToday: number;
  mostFilledEvents: MostFilledDashboardEvent[];
  upcomingEvents: Omit<DashboardEvent, "status">[];
};

export async function getDashboardStats(signal?: AbortSignal) {
  const response = await api.get<{ data: DashboardStats }>("/dashboard/stats", {
    signal,
  });
  return response.data.data;
}
