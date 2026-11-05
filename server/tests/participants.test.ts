import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Prisma } from "../src/generated/prisma/client.js";
import type { Participant, User } from "../src/generated/prisma/client.js";

const secret = randomBytes(48).toString("hex");
process.env.JWT_SECRET = secret;
process.env.DATABASE_URL = "postgresql://unused:unused@localhost:5432/unused";

const user = {
  id: "b8ad2de6-96a4-4fd0-9de2-780806ac8125",
  email: "staff@example.test",
  role: "staff" as const,
};
const participant: Participant = {
  id: "d8ad2de6-96a4-4fd0-9de2-780806ac8125",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+212600000000",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};
const input = {
  fullName: participant.fullName,
  email: participant.email,
  phone: participant.phone,
};
const token = jwt.sign({}, secret, { subject: user.id, expiresIn: "1d" });
const participantUrl = `/api/participants/${participant.id}`;

const db = {
  user: {
    findUnique: jest.fn<(...args: unknown[]) => Promise<Pick<User, "id" | "email" | "role">>>(),
  },
  participant: {
    findUnique: jest.fn<(...args: unknown[]) => Promise<Participant | null>>(),
    findMany: jest.fn<(...args: unknown[]) => Promise<Participant[]>>(),
    count: jest.fn<(...args: unknown[]) => Promise<number>>(),
    create: jest.fn<(...args: unknown[]) => Promise<Participant>>(),
    update: jest.fn<(...args: unknown[]) => Promise<Participant>>(),
    delete: jest.fn<(...args: unknown[]) => Promise<Participant>>(),
  },
};

jest.unstable_mockModule("../src/lib/prisma.js", () => ({ prisma: db }));
const { app } = await import("../src/app.js");

beforeEach(() => {
  jest.resetAllMocks();
  db.user.findUnique.mockResolvedValue(user);
  db.participant.findUnique.mockResolvedValue(participant);
  db.participant.findMany.mockResolvedValue([participant]);
  db.participant.count.mockResolvedValue(1);
  db.participant.create.mockResolvedValue(participant);
  db.participant.update.mockResolvedValue(participant);
  db.participant.delete.mockResolvedValue(participant);
});

describe("Participants authentication", () => {
  it("requires a valid JWT", async () => {
    await request(app).get("/api/participants").expect(401);
    await request(app).get("/api/participants")
      .auth("invalid", { type: "bearer" }).expect(401);
    expect(db.participant.findMany).not.toHaveBeenCalled();
  });

  it.each(["admin", "staff"] as const)("allows %s access", async (role) => {
    db.user.findUnique.mockResolvedValue({ ...user, role });
    await request(app).get("/api/participants")
      .auth(token, { type: "bearer" }).expect(200);
  });
});

describe("Create participant", () => {
  it("creates and normalizes participant fields", async () => {
    const response = await request(app).post("/api/participants")
      .auth(token, { type: "bearer" })
      .send({ fullName: " John Doe ", email: " JOHN@EXAMPLE.COM ", phone: " +212600000000 " })
      .expect(201);
    expect(response.body.data.email).toBe(participant.email);
    expect(db.participant.create).toHaveBeenCalledWith({ data: input });
    expect(db.participant.findUnique).not.toHaveBeenCalled();
  });

  it("accepts an omitted phone", async () => {
    await request(app).post("/api/participants")
      .auth(token, { type: "bearer" })
      .send({ fullName: input.fullName, email: input.email }).expect(201);
    expect(db.participant.create).toHaveBeenCalledWith({ data: { ...input, phone: null } });
  });

  it.each([
    { email: "john@example.com" },
    { fullName: "John Doe" },
    { ...input, fullName: " " },
    { ...input, email: "invalid" },
    { ...input, phone: "x".repeat(31) },
    { ...input, id: participant.id },
  ])("rejects invalid input %#", async (body) => {
    await request(app).post("/api/participants")
      .auth(token, { type: "bearer" }).send(body).expect(400);
    expect(db.participant.create).not.toHaveBeenCalled();
  });

  it("returns 409 for a duplicate email", async () => {
    db.participant.create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      "Unique constraint", { code: "P2002", clientVersion: "test" },
    ));
    await request(app).post("/api/participants")
      .auth(token, { type: "bearer" }).send(input)
      .expect(409, { error: "A participant with this email already exists" });
  });
});

describe("Read participants", () => {
  it.each(["John", "john@example.com"])("searches name or email for %s with pagination", async (search) => {
    const response = await request(app).get("/api/participants")
      .query({ search, page: 2, limit: 5 })
      .auth(token, { type: "bearer" }).expect(200);
    const where = {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
    expect(db.participant.findMany).toHaveBeenCalledWith({
      where, skip: 5, take: 5, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    expect(db.participant.count).toHaveBeenCalledWith({ where });
    expect(response.body.pagination).toEqual({ page: 2, limit: 5, total: 1, totalPages: 1 });
  });

  it("returns an empty list with default pagination", async () => {
    db.participant.findMany.mockResolvedValue([]);
    db.participant.count.mockResolvedValue(0);
    await request(app).get("/api/participants")
      .auth(token, { type: "bearer" }).expect(200, {
        data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
  });

  it.each(["page=0", "page=1.5", "limit=101", "limit=abc"])("rejects invalid pagination %s", async (query) => {
    await request(app).get(`/api/participants?${query}`)
      .auth(token, { type: "bearer" }).expect(400);
  });

  it("returns participant details", async () => {
    await request(app).get(participantUrl)
      .auth(token, { type: "bearer" }).expect(200, {
        data: { ...participant, createdAt: participant.createdAt.toISOString() },
      });
  });

  it("rejects invalid UUIDs", async () => {
    await request(app).get("/api/participants/invalid")
      .auth(token, { type: "bearer" }).expect(400);
    expect(db.participant.findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown participant", async () => {
    db.participant.findUnique.mockResolvedValue(null);
    await request(app).get(participantUrl)
      .auth(token, { type: "bearer" }).expect(404, { error: "Participant not found" });
  });
});

describe("Update participant", () => {
  it.each([
    [{ fullName: " Jane Doe " }, { fullName: "Jane Doe" }],
    [{ email: " JANE@EXAMPLE.COM " }, { email: "jane@example.com" }],
    [{ phone: null }, { phone: null }],
  ])("updates only the provided fields %#", async (body, data) => {
    db.participant.update.mockResolvedValue({ ...participant, ...data });
    const response = await request(app).patch(participantUrl)
      .auth(token, { type: "bearer" }).send(body).expect(200);
    expect(response.body.data).toMatchObject(data);
    expect(db.participant.update).toHaveBeenCalledWith({ where: { id: participant.id }, data });
  });

  it.each([{}, { id: participant.id }, { createdAt: "2026-01-01" }, { registrations: [] }])("rejects empty or restricted updates %#", async (body) => {
    await request(app).patch(participantUrl)
      .auth(token, { type: "bearer" }).send(body).expect(400);
    expect(db.participant.update).not.toHaveBeenCalled();
  });

  it.each([["P2002", 409], ["P2025", 404]] as const)("maps %s to %i", async (code, status) => {
    db.participant.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      "Database constraint", { code, clientVersion: "test" },
    ));
    await request(app).patch(participantUrl)
      .auth(token, { type: "bearer" }).send({ email: "other@example.com" }).expect(status);
  });

  it("returns 404 before updating a missing participant", async () => {
    db.participant.findUnique.mockResolvedValue(null);
    await request(app).patch(participantUrl)
      .auth(token, { type: "bearer" }).send({ fullName: "Jane" }).expect(404);
    expect(db.participant.update).not.toHaveBeenCalled();
  });
});

describe("Delete participant", () => {
  it("deletes an eligible participant with no response body", async () => {
    const response = await request(app).delete(participantUrl)
      .auth(token, { type: "bearer" }).expect(204);
    expect(response.text).toBe("");
    expect(db.participant.delete).toHaveBeenCalledWith({ where: { id: participant.id } });
  });

  it("returns 404 for an unknown participant", async () => {
    db.participant.findUnique.mockResolvedValue(null);
    await request(app).delete(participantUrl)
      .auth(token, { type: "bearer" }).expect(404);
    expect(db.participant.delete).not.toHaveBeenCalled();
  });

  it.each([["P2003", 409], ["P2025", 404]] as const)("maps deletion error %s to %i", async (code, status) => {
    db.participant.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
      "Database constraint", { code, clientVersion: "test" },
    ));
    await request(app).delete(participantUrl)
      .auth(token, { type: "bearer" }).expect(status);
  });
});
