import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Prisma } from "../src/generated/prisma/client.js";
import type { Event, Registration } from "../src/generated/prisma/client.js";

const secret = randomBytes(48).toString("hex");
process.env.JWT_SECRET = secret;
process.env.DATABASE_URL = "postgresql://unused:unused@localhost:5432/unused";
const user = {
  id: "b8ad2de6-96a4-4fd0-9de2-780806ac8125",
  email: "staff@example.test",
  role: "staff",
};
const event: Event = {
  id: "d8ad2de6-96a4-4fd0-9de2-780806ac8125",
  title: "Workshop",
  description: "Learn React",
  location: "Casablanca",
  eventDate: new Date("2027-12-01T10:00:00Z"),
  maxParticipants: 2,
  status: "published",
  createdBy: user.id,
};
const registration: Registration = {
  id: "a8ad2de6-96a4-4fd0-9de2-780806ac8125",
  eventId: event.id,
  participantId: "c8ad2de6-96a4-4fd0-9de2-780806ac8125",
  status: "pending",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};
const input = { eventId: event.id, participantId: registration.participantId };
const token = jwt.sign({}, secret, { subject: user.id, expiresIn: "1d" });
const statusUrl = `/api/registrations/${registration.id}/status`;
const db = {
  user: { findUnique: jest.fn<(...args: unknown[]) => Promise<unknown>>() },
  event: { findUnique: jest.fn<(...args: unknown[]) => Promise<Event | null>>() },
  participant: { findUnique: jest.fn<(...args: unknown[]) => Promise<unknown>>() },
  registration: {
    findUnique: jest.fn<(...args: unknown[]) => Promise<Registration | null>>(),
    findMany: jest.fn<(...args: unknown[]) => Promise<Registration[]>>(),
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
    create: jest.fn<(...args: unknown[]) => Promise<Registration>>(),
    update: jest.fn<(...args: unknown[]) => Promise<Registration>>(),
  },
  $queryRaw: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
};
const transaction = jest.fn(async (
  work: (tx: typeof db) => Promise<unknown>,
  _options?: unknown,
) => work(db));
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: { ...db, $transaction: transaction },
}));
const { app } = await import("../src/app.js");

beforeEach(() => {
  jest.resetAllMocks();
  db.user.findUnique.mockResolvedValue(user);
  db.event.findUnique.mockResolvedValue(event);
  db.participant.findUnique.mockResolvedValue({ id: input.participantId });
  db.registration.findUnique.mockResolvedValue(registration);
  db.registration.findMany.mockResolvedValue([registration]);
  db.registration.count.mockResolvedValue(0);
  db.registration.create.mockResolvedValue(registration);
  db.registration.update.mockResolvedValue(registration);
  transaction.mockImplementation(async work => work(db));
});

describe("Registration reads and validation", () => {
  it("requires JWT authentication", async () => {
    await request(app).get("/api/registrations").expect(401);
    await request(app).post("/api/registrations").send(input).expect(401);
    await request(app).patch(statusUrl).send({ status: "confirmed" }).expect(401);
  });

  it.each(["admin", "staff"])("allows %s to list registrations", async role => {
    db.user.findUnique.mockResolvedValue({ ...user, role });
    await request(app).get("/api/registrations")
      .auth(token, { type: "bearer" }).expect(200);
  });

  it("filters, paginates and includes safe summaries", async () => {
    db.registration.count.mockResolvedValue(6);
    const registrationWithSummary = {
      ...registration,
      event: {
        id: event.id, title: event.title, eventDate: event.eventDate,
        status: event.status, createdBy: event.createdBy,
      },
      participant: { id: registration.participantId, fullName: "Test participant", email: "participant@example.test" },
    };
    db.registration.findMany.mockResolvedValue([registrationWithSummary]);
    const response = await request(app).get("/api/registrations")
      .query({ ...input, status: "pending", page: 2, limit: 5 })
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.pagination).toEqual({ page: 2, limit: 5, total: 6, totalPages: 2 });
    expect(response.body.data[0].event.createdBy).toBe(user.id);
    expect(db.registration.findMany).toHaveBeenCalledWith({
      where: { ...input, status: "pending" },
      skip: 5,
      take: 5,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        event: { select: { id: true, title: true, eventDate: true, status: true, createdBy: true } },
        participant: { select: { id: true, fullName: true, email: true } },
      },
    });
    expect(db.registration.count).toHaveBeenCalledWith({ where: { ...input, status: "pending" } });
  });

  it("returns registration details", async () => {
    const response = await request(app).get(`/api/registrations/${registration.id}`)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.data.id).toBe(registration.id);
    expect(db.registration.findUnique).toHaveBeenCalledWith(expect.objectContaining({ include: expect.any(Object) }));
  });

  it("returns 404 for missing registrations", async () => {
    db.registration.findUnique.mockResolvedValue(null);
    await request(app).get(`/api/registrations/${registration.id}`)
      .auth(token, { type: "bearer" }).expect(404);
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "confirmed" }).expect(404);
  });

  it.each([{ ...input, eventId: "invalid" }, { ...input, participantId: "invalid" }, { ...input, status: "confirmed" }])("rejects invalid creation input %#", async body => {
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(body).expect(400);
  });

  it("rejects invalid route UUIDs, filters and requested statuses", async () => {
    await request(app).get("/api/registrations/invalid")
      .auth(token, { type: "bearer" }).expect(400);
    await request(app).get("/api/registrations?eventId=invalid")
      .auth(token, { type: "bearer" }).expect(400);
    await request(app).get("/api/registrations?limit=101")
      .auth(token, { type: "bearer" }).expect(400);
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "pending" }).expect(400);
  });
});

describe("Create registration", () => {
  it("creates pending after locking the Event and counting only active seats", async () => {
    db.registration.count.mockResolvedValue(1);
    const response = await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(201);
    expect(response.body.data.status).toBe("pending");
    expect(db.registration.create).toHaveBeenCalledWith(expect.objectContaining({
      data: { ...input, status: "pending" },
    }));
    expect(db.registration.count).toHaveBeenCalledWith({
      where: { eventId: event.id, status: { in: ["pending", "confirmed"] } },
    });
    expect(db.$queryRaw).toHaveBeenCalledWith(expect.any(Array), event.id);
    expect(db.$queryRaw.mock.invocationCallOrder[0]!).toBeLessThan(db.event.findUnique.mock.invocationCallOrder[0]!);
    expect(transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: "ReadCommitted" });
  });

  it.each(["draft", "cancelled"] as const)("rejects %s Events", async status => {
    db.event.findUnique.mockResolvedValue({ ...event, status });
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(409);
    expect(db.registration.create).not.toHaveBeenCalled();
  });

  it("returns 404 for a missing Event", async () => {
    db.event.findUnique.mockResolvedValue(null);
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(404, { error: "Event not found" });
  });

  it("returns 404 for a missing Participant", async () => {
    db.participant.findUnique.mockResolvedValue(null);
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(404, { error: "Participant not found" });
  });

  it("rejects a full Event", async () => {
    db.registration.count.mockResolvedValue(event.maxParticipants);
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(409, { error: "Event capacity reached" });
    expect(db.registration.create).not.toHaveBeenCalled();
  });

  it.each(["P2002", "P2003"])("maps %s to a safe conflict response", async code => {
    db.registration.create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      "Internal database details", { code, clientVersion: "test" },
    ));
    const response = await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(409);
    expect(response.body.error).not.toContain("Internal database details");
  });
});

describe("Registration mutation permissions", () => {
  it.each([["admin", "other"], ["staff", user.id], ["staff", "admin-owner"], ["staff", "other-staff-owner"]] as const)("%s can register for Event owner %s", async (role, createdBy) => {
    db.user.findUnique.mockResolvedValue({ ...user, role });
    db.event.findUnique.mockResolvedValue({ ...event, createdBy });
    await request(app).post("/api/registrations")
      .auth(token, { type: "bearer" }).send(input).expect(201);
  });

  it.each([["admin", "other"], ["staff", user.id], ["staff", "admin-owner"], ["staff", "other-staff-owner"]] as const)("%s can change registration status for Event owner %s", async (role, createdBy) => {
    db.user.findUnique.mockResolvedValue({ ...user, role });
    db.event.findUnique.mockResolvedValue({ ...event, createdBy });
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "confirmed" }).expect(200);
  });

  it("allows Staff to cancel another owner's registration", async () => {
    db.user.findUnique.mockResolvedValue({ ...user, role: "staff" });
    db.event.findUnique.mockResolvedValue({ ...event, createdBy: "admin-owner" });
    db.registration.findUnique.mockResolvedValue(registration);
    await request(app).patch(statusUrl).auth(token, { type: "bearer" })
      .send({ status: "cancelled" }).expect(200);
  });
});

describe("Registration status transitions", () => {
  it.each([
    ["pending", "confirmed"],
    ["pending", "cancelled"],
    ["confirmed", "cancelled"],
  ] as const)("changes %s to %s", async (current, status) => {
    db.registration.findUnique.mockResolvedValue({ ...registration, status: current });
    db.registration.update.mockResolvedValue({ ...registration, status });
    const response = await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status }).expect(200);
    expect(response.body.data.status).toBe(status);
    expect(db.registration.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: registration.id }, data: { status },
    }));
    expect(db.registration.count).not.toHaveBeenCalled();
  });

  it.each(["confirmed", "cancelled"] as const)("returns unchanged when already %s", async status => {
    db.registration.findUnique.mockResolvedValue({ ...registration, status });
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status }).expect(200);
    expect(db.registration.update).not.toHaveBeenCalled();
  });

  it("rejects reactivation", async () => {
    db.registration.findUnique.mockResolvedValue({ ...registration, status: "cancelled" });
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "confirmed" }).expect(409);
    expect(db.registration.update).not.toHaveBeenCalled();
  });

  it("rejects confirmation for a cancelled Event", async () => {
    db.event.findUnique.mockResolvedValue({ ...event, status: "cancelled" });
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "confirmed" }).expect(409);
  });

  it("returns 404 when the registration disappears during update", async () => {
    db.registration.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      "Missing record", { code: "P2025", clientVersion: "test" },
    ));
    await request(app).patch(statusUrl)
      .auth(token, { type: "bearer" }).send({ status: "confirmed" }).expect(404);
  });
});
