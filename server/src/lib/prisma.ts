import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

type EventHubPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  eventHubPrisma?: EventHubPrismaClient;
};

export const prisma = globalForPrisma.eventHubPrisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.eventHubPrisma = prisma;
}
