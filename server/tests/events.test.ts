import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Prisma } from "../src/generated/prisma/client.js";
import type { Event } from "../src/generated/prisma/client.js";
const secret = randomBytes(48).toString("hex");
process.env.JWT_SECRET = secret;
process.env.DATABASE_URL = "postgresql://unused:unused@localhost:5432/unused";
const owner = "b8ad2de6-96a4-4fd0-9de2-780806ac8125";
const id = "d8ad2de6-96a4-4fd0-9de2-780806ac8125";
const input = {
  title: "Workshop",
  description: "Learn React",
  location: "Casablanca",
  eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  maxParticipants: 20,
};
const original: Event = {
  ...input,
  eventDate: new Date(input.eventDate),
  id,
  createdBy: owner,
  status: "draft",
};
const user = { id: owner, email: "test@example.test", role: "staff" };
const token = jwt.sign({}, secret, { subject: owner, expiresIn: "1d" });
const db = {
  user: { findUnique: jest.fn<(...args: unknown[]) => Promise<unknown>>() },
  event: {
    findUnique: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findMany: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
    create: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    update: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    delete: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  },
  registration: {
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
    updateMany: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  },
};
const transaction = jest.fn(
  async (work: (tx: typeof db) => Promise<unknown>, _options?: unknown) =>
    work(db),
);
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: { ...db, $transaction: transaction },
}));
const { app } = await import("../src/app.js");
beforeEach(() => {
  jest.resetAllMocks();
  db.user.findUnique.mockResolvedValue(user);
  db.event.findUnique.mockResolvedValue(original);
  db.event.findMany.mockResolvedValue([
    { ...original, _count: { registrations: 3 } },
  ]);
  db.event.count.mockResolvedValue(1);
  db.event.create.mockResolvedValue(original);
  db.event.update.mockResolvedValue(original);
  db.registration.count.mockResolvedValue(0);
  transaction.mockImplementation(async (work) => work(db));
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Events CRUD and validation", () => {
  it("lists with filters, pagination and stable ordering", async () => {
    const res = await request(app)
      .get("/api/events?search=work&status=draft&page=2&limit=5")
      .auth(token, { type: "bearer" })
      .expect(200);
    expect(res.body.data[0]).toMatchObject({
      id,
      activeRegistrations: 3,
      availableSeats: 17,
    });
    expect(res.body.data[0]).not.toHaveProperty("_count");
    expect(res.body.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 1,
      totalPages: 1,
    });
    expect(db.event.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: "work", mode: "insensitive" },
        status: "draft",
      },
      skip: 5,
      take: 5,
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
    });
  });
  it("returns details and available seats", async () => {
    db.event.findUnique.mockResolvedValue({
      ...original,
      creator: user,
      _count: { registrations: 3 },
    });
    const res = await request(app)
      .get(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .expect(200);
    expect(res.body.data.availableSeats).toBe(17);
    expect(res.body.data.activeRegistrations).toBe(3);
    expect(db.event.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
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
      }),
    );
  });
  it("creates a draft owned by the authenticated user", async () => {
    await request(app)
      .post("/api/events")
      .auth(token, { type: "bearer" })
      .send(input)
      .expect(201);
    expect(db.event.create).toHaveBeenCalledWith({
      data: {
        ...input,
        eventDate: new Date(input.eventDate),
        status: "draft",
        createdBy: owner,
      },
    });
  });
  it.each([
    {},
    { ...input, status: "published" },
    { ...input, createdBy: owner },
    { ...input, maxParticipants: 0 },
    { ...input, eventDate: "2020-01-01T00:00:00Z" },
  ])("rejects invalid create input %#", async (body) => {
    await request(app)
      .post("/api/events")
      .auth(token, { type: "bearer" })
      .send(body)
      .expect(400);
  });
  it("rejects invalid UUIDs and empty updates", async () => {
    await request(app)
      .get("/api/events/invalid")
      .auth(token, { type: "bearer" })
      .expect(400);
    await request(app)
      .patch(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .send({})
      .expect(400);
  });
  it("requires authentication", async () => {
    await request(app).get("/api/events").expect(401);
  });
  it("returns 404 for missing events", async () => {
    db.event.findUnique.mockResolvedValue(null);
    await request(app)
      .patch(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .send({ title: "New" })
      .expect(404);
  });
  it("deletes an eligible event", async () => {
    await request(app)
      .delete(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .expect(204);
    expect(db.event.delete).toHaveBeenCalledWith({ where: { id } });
  });
});

describe("permissions and capacity", () => {
  it.each([
    ["admin", "other", 200],
    ["staff", owner, 200],
    ["staff", "other", 403],
  ] as const)(
    "%s editing an event owned by %s returns %i",
    async (role, createdBy, status) => {
      db.user.findUnique.mockResolvedValue({ ...user, role });
      db.event.findUnique.mockResolvedValue({ ...original, createdBy });
      await request(app)
        .patch(`/api/events/${id}`)
        .auth(token, { type: "bearer" })
        .send({ title: "New" })
        .expect(status);
    },
  );
  it.each([
    [10, 409],
    [15, 200],
    [20, 200],
  ])(
    "capacity %i with 15 active seats returns %i",
    async (capacity, status) => {
      db.registration.count.mockResolvedValue(15);
      await request(app)
        .patch(`/api/events/${id}`)
        .auth(token, { type: "bearer" })
        .send({ maxParticipants: capacity })
        .expect(status!);
      expect(db.registration.count).toHaveBeenCalledWith({
        where: { eventId: id, status: { in: ["pending", "confirmed"] } },
      });
      if (status === 409) {
        expect(db.event.update).not.toHaveBeenCalled();
      } else {
        expect(db.event.update).toHaveBeenCalledWith({
          where: { id },
          data: { maxParticipants: capacity },
        });
      }
    },
  );
  it("blocks deletion even when registrations are cancelled", async () => {
    db.event.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Foreign key restriction", {
        code: "P2003",
        clientVersion: "test",
      }),
    );
    await request(app)
      .delete(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .expect(409);
    expect(db.event.delete).toHaveBeenCalledWith({ where: { id } });
  });
});

describe("event status transactions", () => {
  it("publishes a valid draft", async () => {
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "published" })
      .expect(200);
    expect(db.event.update).toHaveBeenCalledWith({
      where: { id, status: "draft" },
      data: { status: "published" },
    });
  });
  it("returns 409 when the status changes before publication", async () => {
    db.event.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("No matching draft", {
        code: "P2025",
        clientVersion: "test",
      }),
    );
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "published" })
      .expect(409);
  });
  it("rejects publishing invalid event information", async () => {
    db.event.findUnique.mockResolvedValue({ ...original, title: "" });
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "published" })
      .expect(409);
    expect(db.event.update).not.toHaveBeenCalled();
  });
  it("returns an already cancelled event without further writes", async () => {
    db.event.findUnique.mockResolvedValue({ ...original, status: "cancelled" });
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "cancelled" })
      .expect(200);
    expect(transaction).not.toHaveBeenCalled();
  });
  it("cancels a published event and all registrations in the same transaction", async () => {
    db.event.findUnique.mockResolvedValue({ ...original, status: "published" });
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "cancelled" })
      .expect(200);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(db.event.update).toHaveBeenCalledWith({
      where: { id },
      data: { status: "cancelled" },
    });
    expect(db.registration.updateMany).toHaveBeenCalledWith({
      where: { eventId: id },
      data: { status: "cancelled" },
    });
  });
  it("does not edit or reopen cancelled events", async () => {
    db.event.findUnique.mockResolvedValue({ ...original, status: "cancelled" });
    await request(app)
      .patch(`/api/events/${id}`)
      .auth(token, { type: "bearer" })
      .send({ title: "New" })
      .expect(409);
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "published" })
      .expect(409);
  });
  it("treats repeated status as idempotent", async () => {
    db.event.findUnique.mockResolvedValue({ ...original, status: "published" });
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "published" })
      .expect(200);
    expect(db.event.update).not.toHaveBeenCalled();
  });
  it("propagates cancellation failures through the transaction without committing", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const committed = jest.fn();
    transaction.mockImplementation(async (work) => {
      const result = await work(db);
      committed();
      return result;
    });
    db.registration.updateMany.mockRejectedValue(
      new Error("Simulated failure"),
    );
    await request(app)
      .patch(`/api/events/${id}/status`)
      .auth(token, { type: "bearer" })
      .send({ status: "cancelled" })
      .expect(500, { error: "Internal server error" });
    expect(committed).not.toHaveBeenCalled();
    await expect(transaction.mock.results[0]!.value).rejects.toThrow(
      "Simulated failure",
    );
  });
});
