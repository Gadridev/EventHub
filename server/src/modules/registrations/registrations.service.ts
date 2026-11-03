import { Prisma } from "../../generated/prisma/client.js";
import type { Event } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../middleware/error-handler.js";
import type { AuthUser } from "../auth/auth.service.js";
import type {
  CreateRegistrationInput,
  RegistrationsQuery,
  RegistrationStatusInput,
} from "./registrations.schema.js";

const summaries = {
  event: { select: { id: true, title: true, eventDate: true, status: true } },
  participant: { select: { id: true, fullName: true, email: true } },
} satisfies Prisma.RegistrationInclude;

function checkEventPermission(event: Event | null, user: AuthUser): asserts event is Event {
  if (!event) {
    throw new HttpError(404, "Event not found");
  }
  if (user.role !== "admin" && event.createdBy !== user.id) {
    throw new HttpError(403, "Forbidden");
  }
}

export async function listRegistrations(query: RegistrationsQuery) {
  const where: Prisma.RegistrationWhereInput = {};
  if (query.eventId) {
    where.eventId = query.eventId;
  }
  if (query.participantId) {
    where.participantId = query.participantId;
  }
  if (query.status) {
    where.status = query.status;
  }

  const [data, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: summaries,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getRegistration(id: string) {
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: summaries,
  });
  if (!registration) {
    throw new HttpError(404, "Registration not found");
  }
  return registration;
}

export async function createRegistration(input: CreateRegistrationInput, user: AuthUser) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM events WHERE id = ${input.eventId}::uuid FOR UPDATE
      `;
      const event = await tx.event.findUnique({ where: { id: input.eventId } });
      checkEventPermission(event, user);
      if (event.status !== "published") {
        throw new HttpError(409, "Event is not published");
      }

      const participant = await tx.participant.findUnique({
        where: { id: input.participantId },
        select: { id: true },
      });
      if (!participant) {
        throw new HttpError(404, "Participant not found");
      }

      const activeRegistrations = await tx.registration.count({
        where: { eventId: input.eventId, status: { in: ["pending", "confirmed"] } },
      });
      if (activeRegistrations >= event.maxParticipants) {
        throw new HttpError(409, "Event capacity reached");
      }

      return tx.registration.create({
        data: { eventId: input.eventId, participantId: input.participantId, status: "pending" },
        include: summaries,
      });
    }, { isolationLevel: "ReadCommitted" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new HttpError(409, "Participant is already registered for this event");
      }
      if (error.code === "P2003") {
        throw new HttpError(409, "Event or participant is no longer available");
      }
    }
    throw error;
  }
}

export async function changeRegistrationStatus(
  id: string,
  status: RegistrationStatusInput["status"],
  user: AuthUser,
) {
  const existing = await prisma.registration.findUnique({
    where: { id },
    select: { eventId: true },
  });
  if (!existing) {
    throw new HttpError(404, "Registration not found");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM events WHERE id = ${existing.eventId}::uuid FOR UPDATE
      `;
      const event = await tx.event.findUnique({ where: { id: existing.eventId } });
      checkEventPermission(event, user);
      const registration = await tx.registration.findUnique({
        where: { id },
        include: summaries,
      });
      if (!registration) {
        throw new HttpError(404, "Registration not found");
      }
      if (registration.status === status) {
        return registration;
      }
      if (registration.status === "cancelled") {
        throw new HttpError(409, "Cancelled registrations cannot be reactivated");
      }
      if (status === "confirmed" && event.status !== "published") {
        throw new HttpError(409, "Event is not published");
      }
      return tx.registration.update({
        where: { id },
        data: { status },
        include: summaries,
      });
    }, { isolationLevel: "ReadCommitted" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new HttpError(404, "Registration not found");
    }
    throw error;
  }
}
