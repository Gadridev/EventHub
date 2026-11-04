import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";

const secret = randomBytes(48).toString("hex");
process.env.JWT_SECRET = secret;
process.env.DATABASE_URL = "postgresql://unused:unused@localhost:5432/unused";

const user = {
  id: "b8ad2de6-96a4-4fd0-9de2-780806ac8125",
  email: "staff@example.test",
  role: "staff",
};
const token = jwt.sign({}, secret, { subject: user.id, expiresIn: "1d" });
const url = "/api/dashboard/stats";
const db = {
  user: { findUnique: jest.fn<(...args: unknown[]) => Promise<unknown>>() },
  event: {
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
    aggregate: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findMany: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  },
  participant: { count: jest.fn<(...args: unknown[]) => Promise<number>>() },
  registration: {
    groupBy: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
  },
};

jest.unstable_mockModule("../src/lib/prisma.js", () => ({ prisma: db }));
const { app } = await import("../src/app.js");

beforeEach(() => {
  jest.resetAllMocks();
  db.user.findUnique.mockResolvedValue(user);
  db.event.count.mockResolvedValue(0);
  db.event.aggregate.mockResolvedValue({
    _count: { _all: 0 },
    _sum: { maxParticipants: null },
  });
  db.event.findMany.mockResolvedValue([]);
  db.participant.count.mockResolvedValue(0);
  db.registration.groupBy.mockResolvedValue([]);
  db.registration.count.mockResolvedValue(0);
});

describe("Dashboard authentication", () => {
  it("requires a valid JWT before querying statistics", async () => {
    await request(app).get(url).expect(401);
    await request(app).get(url).auth("invalid", { type: "bearer" }).expect(401);
    expect(db.event.count).not.toHaveBeenCalled();
    expect(db.registration.groupBy).not.toHaveBeenCalled();
  });

  it.each(["admin", "staff"])("allows %s to access global statistics", async (role) => {
    db.user.findUnique.mockResolvedValue({ ...user, role });
    db.event.count.mockResolvedValue(12);
    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.data.totalEvents).toBe(12);
    expect(db.event.count).toHaveBeenCalledWith();
    expect(db.event.aggregate).toHaveBeenCalledWith({
      where: { status: "published" },
      _count: { _all: true },
      _sum: { maxParticipants: true },
    });
  });
});

describe("Dashboard statistics", () => {
  it("returns global counts and utilization rounded to one decimal place", async () => {
    db.event.count.mockResolvedValue(5);
    db.event.aggregate.mockResolvedValue({
      _count: { _all: 3 },
      _sum: { maxParticipants: 30 },
    });
    db.participant.count.mockResolvedValue(10);
    db.registration.groupBy.mockResolvedValue([
      { status: "pending", _count: { _all: 6 } },
      { status: "confirmed", _count: { _all: 11 } },
      { status: "cancelled", _count: { _all: 3 } },
    ]);
    db.registration.count.mockResolvedValue(17);

    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body).toEqual({ data: {
      totalEvents: 5,
      publishedEvents: 3,
      totalParticipants: 10,
      totalRegistrations: 20,
      pendingRegistrations: 6,
      confirmedRegistrations: 11,
      cancelledRegistrations: 3,
      seatUtilization: 56.7,
      upcomingEvents: [],
    } });
    expect(db.participant.count).toHaveBeenCalledWith();
    expect(db.registration.groupBy).toHaveBeenCalledWith({
      by: ["status"], _count: { _all: true },
    });
    // No date or owner filter: utilization includes past published events too.
    expect(db.registration.count).toHaveBeenCalledWith({
      where: {
        status: { in: ["pending", "confirmed"] },
        event: { status: "published" },
      },
    });
  });

  it("counts cancelled registrations without consuming published event capacity", async () => {
    db.event.count.mockResolvedValue(1);
    db.event.aggregate.mockResolvedValue({
      _count: { _all: 1 }, _sum: { maxParticipants: 10 },
    });
    db.registration.groupBy.mockResolvedValue([
      { status: "cancelled", _count: { _all: 4 } },
    ]);
    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.data).toMatchObject({
      totalRegistrations: 4,
      pendingRegistrations: 0,
      confirmedRegistrations: 0,
      cancelledRegistrations: 4,
      seatUtilization: 0,
    });
  });

  it("returns zero counts and utilization for an empty database", async () => {
    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body).toEqual({ data: {
      totalEvents: 0,
      publishedEvents: 0,
      totalParticipants: 0,
      totalRegistrations: 0,
      pendingRegistrations: 0,
      confirmedRegistrations: 0,
      cancelledRegistrations: 0,
      seatUtilization: 0,
      upcomingEvents: [],
    } });
  });

  it("returns zero utilization when published capacity sums to zero", async () => {
    db.event.aggregate.mockResolvedValue({
      _count: { _all: 1 }, _sum: { maxParticipants: 0 },
    });
    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.data.seatUtilization).toBe(0);
  });
});

describe("Upcoming dashboard events", () => {
  it("requests only future published events, nearest first, limited to five", async () => {
    const beforeRequest = Date.now();
    await request(app).get(url).auth(token, { type: "bearer" }).expect(200);
    expect(db.event.findMany).toHaveBeenCalledWith({
      where: { status: "published", eventDate: { gt: expect.any(Date) } },
      orderBy: [{ eventDate: "asc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true, title: true, eventDate: true, location: true, maxParticipants: true,
        _count: { select: { registrations: {
          where: { status: { in: ["pending", "confirmed"] } },
        } } },
      },
    });
    const query = db.event.findMany.mock.calls[0]![0] as {
      where: { eventDate: { gt: Date } };
    };
    expect(query.where.eventDate.gt.getTime()).toBeGreaterThanOrEqual(beforeRequest);
    expect(query.where.eventDate.gt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it.each([0, 3, 10])("calculates available seats with %i active registrations", async (active) => {
    const event = {
      id: "d8ad2de6-96a4-4fd0-9de2-780806ac8125",
      title: "Workshop",
      eventDate: new Date(Date.now() + 86400000),
      location: "Casablanca",
      maxParticipants: 10,
    };
    db.event.findMany.mockResolvedValue([{ ...event, _count: { registrations: active } }]);
    const response = await request(app).get(url)
      .auth(token, { type: "bearer" }).expect(200);
    expect(response.body.data.upcomingEvents).toEqual([{
      ...event,
      eventDate: event.eventDate.toISOString(),
      activeRegistrations: active,
      availableSeats: 10 - active,
    }]);
  });
});
