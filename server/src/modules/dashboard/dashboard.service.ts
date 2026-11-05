import { prisma } from "../../lib/prisma.js";

export async function getDashboardStats() {
  const now = new Date();
  const todayStartUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrowStartUtc = new Date(todayStartUtc.getTime() + 24 * 60 * 60 * 1000);
  const [
    totalEvents,
    publishedEventTotals,
    totalParticipants,
    registrationCounts,
    activePublishedRegistrations,
    upcomingEvents,
    registrationsToday,
    fillCandidates,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.aggregate({
      where: { status: "published" },
      _count: { _all: true },
      _sum: { maxParticipants: true },
    }),
    prisma.participant.count(),
    prisma.registration.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.registration.count({
      where: {
        status: { in: ["pending", "confirmed"] },
        event: { status: "published" },
      },
    }),
    prisma.event.findMany({
      where: { status: "published", eventDate: { gt: new Date() } },
      orderBy: [{ eventDate: "asc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        eventDate: true,
        location: true,
        maxParticipants: true,
        _count: {
          select: {
            registrations: {
              where: { status: { in: ["pending", "confirmed"] } },
            },
          },
        },
      },
    }),
    prisma.registration.count({
      where: {
        createdAt: {
          gte: todayStartUtc,
          lt: tomorrowStartUtc,
        },
      },
    }),
    prisma.event.findMany({
      where: { status: "published" },
      select: {
        id: true,
        title: true,
        eventDate: true,
        status: true,
        maxParticipants: true,
        _count: { select: { registrations: { where: { status: { in: ["pending", "confirmed"] } } } } },
      },
    }),
  ]);

  const registrationsByStatus = { pending: 0, confirmed: 0, cancelled: 0 };
  for (const group of registrationCounts) {
    registrationsByStatus[group.status] = group._count._all;
  }

  const totalCapacity = publishedEventTotals._sum.maxParticipants ?? 0;
  const seatUtilization =
    totalCapacity === 0
      ? 0
      : Math.round((activePublishedRegistrations / totalCapacity) * 1000) / 10;
  const mostFilledEvents = fillCandidates
    .map(({ _count, ...event }) => {
      const activeRegistrations = _count.registrations;
      return {
        ...event,
        activeRegistrations,
        availableSeats: event.maxParticipants - activeRegistrations,
        fillPercentage: event.maxParticipants === 0 ? 0 : Math.round((activeRegistrations / event.maxParticipants) * 1000) / 10,
      };
    })
    .sort((first, second) => second.fillPercentage - first.fillPercentage || first.id.localeCompare(second.id))
    .slice(0, 5);

  return {
    totalEvents,
    publishedEvents: publishedEventTotals._count._all,
    totalParticipants,
    totalRegistrations:
      registrationsByStatus.pending +
      registrationsByStatus.confirmed +
      registrationsByStatus.cancelled,
    pendingRegistrations: registrationsByStatus.pending,
    confirmedRegistrations: registrationsByStatus.confirmed,
    cancelledRegistrations: registrationsByStatus.cancelled,
    seatUtilization,
    registrationsToday,
    mostFilledEvents,
    upcomingEvents: upcomingEvents.map(({ _count, ...event }) => ({
      ...event,
      activeRegistrations: _count.registrations,
      availableSeats: event.maxParticipants - _count.registrations,
    })),
  };
}
