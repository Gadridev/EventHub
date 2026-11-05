import { Prisma } from "../../generated/prisma/client.js";
import type { Event } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../middleware/error-handler.js";
import type { AuthUser } from "../auth/auth.service.js";
import { createEventSchema } from "./events.schema.js";
import type {
  CreateEventInput,
  UpdateEventInput,
  EventsQuery,
} from "./events.schema.js";

function checkPermission(
  event: Event | null,
  user: AuthUser,
): asserts event is Event {
  if (!event) {
    throw new HttpError(404, "Event not found");
  }
  if (user.role !== "admin" && event.createdBy !== user.id) {
    throw new HttpError(403, "Forbidden");
  }
}

export async function listEvents(query: EventsQuery) {
  const where: Prisma.EventWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.search)
    where.title = { contains: query.search, mode: "insensitive" };
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ eventDate: "asc" }, { id: "asc" }],
      include: {
        _count: {
          select: {
            registrations: {
              where: { status: { in: ["pending", "confirmed"] } },
            },
          },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);
  return {
    data: data.map(({ _count, ...event }) => ({
      ...event,
      activeRegistrations: _count.registrations,
      availableSeats: event.maxParticipants - _count.registrations,
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, email: true, role: true } },
      _count: {
        select: {
          registrations: {
            where: { status: { in: ["pending", "confirmed"] } },
          },
        },
      },
    },
  });
  if (!event) {
    throw new HttpError(404, "Event not found");
  }
  const { _count, ...data } = event;
  return {
    ...data,
    activeRegistrations: _count.registrations,
    availableSeats: event.maxParticipants - _count.registrations,
  };
}

export function createEvent(input: CreateEventInput, user: AuthUser) {
  return prisma.event.create({
    data: { ...input, status: "draft", createdBy: user.id },
  });
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput,
  user: AuthUser,
) {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  checkPermission(event, user);

  if (event.status === "cancelled") {
    throw new HttpError(409, "Cancelled events cannot be edited");
  }

  if (input.maxParticipants !== undefined) {
    const activeRegistrations = await prisma.registration.count({
      where: {
        eventId: id,
        status: { in: ["pending", "confirmed"] },
      },
    });

    if (input.maxParticipants < activeRegistrations) {
      throw new HttpError(409, "Capacity is below active registrations");
    }
  }

  const data: Prisma.EventUpdateInput = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

  if (input.description !== undefined) {
    data.description = input.description;
  }

  if (input.location !== undefined) {
    data.location = input.location;
  }

  if (input.eventDate !== undefined) {
    data.eventDate = input.eventDate;
  }

  if (input.maxParticipants !== undefined) {
    data.maxParticipants = input.maxParticipants;
  }

  return prisma.event.update({
    where: { id },
    data,
  });
}

export function changeEventStatus(
  id: string,
  status: "published" | "cancelled",
  user: AuthUser,
) {
  if (status === "published") {
    return publishEvent(id, user);
  }

  return cancelEvent(id, user);
}

async function publishEvent(id: string, user: AuthUser) {
  const event = await prisma.event.findUnique({ where: { id } });
  checkPermission(event, user);

  if (event.status === "published") {
    return event;
  }
  if (event.status === "cancelled") {
    throw new HttpError(409, "Cancelled events cannot be reopened");
  }

  const validation = createEventSchema.safeParse({
    title: event.title,
    description: event.description,
    location: event.location,
    eventDate: event.eventDate.toISOString(),
    maxParticipants: event.maxParticipants,
  });
  if (!validation.success) {
    throw new HttpError(409, "Event information is not valid for publishing");
  }

  try {
  
    return await prisma.event.update({
      where: { id, status: "draft" },
      data: { status: "published" },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new HttpError(409, "Event changed before it could be published");
    }
    throw error;
  }
}

async function cancelEvent(id: string, user: AuthUser) {
  const event = await prisma.event.findUnique({ where: { id } });
  checkPermission(event, user);

  if (event.status === "cancelled") {
    return event;
  }
  return prisma.$transaction(async (tx) => {
    const cancelledEvent = await tx.event.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await tx.registration.updateMany({
      where: { eventId: id },
      data: { status: "cancelled" },
    });
    return cancelledEvent;
  });
}

export async function deleteEvent(id: string, user: AuthUser) {
  const event = await prisma.event.findUnique({ where: { id } });
  checkPermission(event, user);

  try {
    await prisma.event.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new HttpError(409, "Events with registrations cannot be deleted");
      }
      if (error.code === "P2025") {
        throw new HttpError(404, "Event not found");
      }
    }
    throw error;
  }
}
