import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../middleware/error-handler.js";
import type {
  CreateParticipantInput,
  UpdateParticipantInput,
  ParticipantsQuery,
} from "./participants.schema.js";

export async function listParticipants(query: ParticipantsQuery) {
  const where: Prisma.ParticipantWhereInput = {};

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.participant.count({ where }),
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

export async function getParticipant(id: string) {
  const participant = await prisma.participant.findUnique({ where: { id } });

  if (!participant) {
    throw new HttpError(404, "Participant not found");
  }

  return participant;
}

export async function createParticipant(input: CreateParticipantInput) {
  try {
    return await prisma.participant.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "A participant with this email already exists");
    }
    throw error;
  }
}

export async function updateParticipant(id: string, input: UpdateParticipantInput) {
  await getParticipant(id);

  const data: Prisma.ParticipantUpdateInput = {};

  if (input.fullName !== undefined) {
    data.fullName = input.fullName;
  }
  if (input.email !== undefined) {
    data.email = input.email;
  }
  if (input.phone !== undefined) {
    data.phone = input.phone;
  }

  try {
    return await prisma.participant.update({ where: { id }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new HttpError(409, "A participant with this email already exists");
      }
      if (error.code === "P2025") {
        throw new HttpError(404, "Participant not found");
      }
    }
    throw error;
  }
}

export async function deleteParticipant(id: string) {
  await getParticipant(id);

  try {
    await prisma.participant.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new HttpError(409, "Participants with registrations cannot be deleted");
      }
      if (error.code === "P2025") {
        throw new HttpError(404, "Participant not found");
      }
    }
    throw error;
  }
}
