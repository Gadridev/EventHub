import type { Event, Participant, Registration, User } from "../types";
export const users: User[] = [
  { id: "u1", email: "admin@eventhub.ma", role: "admin" },
];
export const events: Event[] = [
  {
    id: "e1",
    title: "React Workshop",
    description:
      "A hands-on workshop exploring modern React, component composition, and building thoughtful user interfaces.",
    location: "Casablanca",
    eventDate: "2026-11-14T09:00:00Z",
    maxParticipants: 60,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e2",
    title: "Node.js Conference",
    description:
      "Meet the community and explore the latest ideas in building applications with Node.js.",
    location: "Rabat",
    eventDate: "2026-11-28T09:00:00Z",
    maxParticipants: 120,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e3",
    title: "AI Engineering Meetup",
    description:
      "An intimate community meetup to exchange practical approaches to AI engineering.",
    location: "Marrakech",
    eventDate: "2026-12-06T10:00:00Z",
    maxParticipants: 6,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e4",
    title: "Cloud Computing Day",
    description:
      "A day of conversations about cloud infrastructure and application development.",
    location: "Beni Mellal",
    eventDate: "2026-12-19T09:00:00Z",
    maxParticipants: 80,
    status: "draft",
    createdBy: "u1",
  },
  {
    id: "e5",
    title: "Cybersecurity Workshop",
    description:
      "Explore practical security fundamentals with the local developer community.",
    location: "Casablanca",
    eventDate: "2026-10-18T09:00:00Z",
    maxParticipants: 30,
    status: "cancelled",
    createdBy: "u1",
  },
];
export const participants: Participant[] = [
  {
    id: "p1",
    fullName: "Yasmine El Idrissi",
    email: "yasmine@mail.ma",
    phone: "+212 612 345 678",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "p2",
    fullName: "Omar Bennani",
    email: "omar.b@mail.ma",
    phone: null,
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "p3",
    fullName: "Salma Tazi",
    email: "salma.tazi@mail.ma",
    phone: "+212 623 456 789",
    createdAt: "2026-10-03T10:00:00Z",
  },
  {
    id: "p4",
    fullName: "Karim Alaoui",
    email: "karim@mail.ma",
    phone: null,
    createdAt: "2026-10-04T10:00:00Z",
  },
  {
    id: "p5",
    fullName: "Imane Chraibi",
    email: "imane.c@mail.ma",
    phone: null,
    createdAt: "2026-10-05T10:00:00Z",
  },
  {
    id: "p6",
    fullName: "Hamza Berrada",
    email: "hamza@mail.ma",
    phone: "+212 634 567 890",
    createdAt: "2026-10-06T10:00:00Z",
  },
  {
    id: "p7",
    fullName: "Nadia Lahlou",
    email: "nadia.l@mail.ma",
    phone: null,
    createdAt: "2026-10-07T10:00:00Z",
  },
];
const registrationRows: [string, string, Registration["status"]][] = [
  ["p1", "e1", "confirmed"],
  ["p2", "e1", "confirmed"],
  ["p3", "e1", "pending"],
  ["p4", "e2", "confirmed"],
  ["p5", "e2", "pending"],
  ["p6", "e2", "confirmed"],
  ["p1", "e3", "confirmed"],
  ["p2", "e3", "confirmed"],
  ["p3", "e3", "pending"],
  ["p4", "e3", "confirmed"],
  ["p5", "e3", "confirmed"],
  ["p6", "e3", "pending"],
  ["p7", "e5", "cancelled"],
  ["p1", "e5", "cancelled"],
];
export const registrations: Registration[] = registrationRows.map(
  ([participantId, eventId, status], i) => ({
    id: `r${i}`,
    participantId,
    eventId,
    status,
    createdAt: "2026-10-12T12:00:00Z",
  }),
);
// Presentation summaries supplied independently of domain records, ready for API data.
export const eventSummaries: Record<
  string,
  { occupied: number; available: number }
> = {
  e1: { occupied: 3, available: 57 },
  e2: { occupied: 3, available: 117 },
  e3: { occupied: 6, available: 0 },
  e4: { occupied: 0, available: 80 },
  e5: { occupied: 0, available: 30 },
};
export const dashboardStats = [
  { label: "Total events", value: 5, note: "1 draft" },
  { label: "Published", value: 3, note: "open for registration" },
  { label: "Participants", value: 7, note: "in directory" },
  { label: "Active registrations", value: 12, note: "pending + confirmed" },
];
export const registrationSummary = [
  { status: "confirmed", count: 8 },
  { status: "pending", count: 4 },
  { status: "cancelled", count: 2 },
] as const;
export const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
