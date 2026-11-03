import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import type { User } from "../src/generated/prisma/client.js";

const secret = randomBytes(48).toString("hex");
process.env.JWT_SECRET = secret;
process.env.DATABASE_URL = "postgresql://unused:unused@localhost:5432/unused";

const findUnique =
  jest.fn<(...args: unknown[]) => Promise<Partial<User> | null>>();
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: { user: { findUnique } },
}));
const { app } = await import("../src/app.js");
const { authenticate } = await import("../src/middleware/authenticate.js");
const { authorize } = await import("../src/middleware/authorize.js");

const password = randomBytes(24).toString("hex");
const user = {
  id: "b8ad2de6-96a4-4fd0-9de2-780806ac8125",
  email: "admin@example.test",
  role: "admin" as const,
};
const passwordHash = await bcrypt.hash(password, 4);
const token = jwt.sign({}, secret, { subject: user.id, expiresIn: "1d" });

beforeEach(() => {
  findUnique.mockReset();
  findUnique.mockResolvedValue(user);
});

describe("POST /api/auth/login", () => {
  it.each(["admin", "staff"] as const)(
    "logs in a valid %s user",
    async (role) => {
      const account = { ...user, email: `${role}@example.test`, role };
      findUnique.mockResolvedValue({ ...account, passwordHash });
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: account.email, password })
        .expect(200);
      expect(response.body.result.user).toEqual(account);
      const claims = jwt.verify(response.body.result.accessToken, secret, {
        algorithms: ["HS256"],
      });
      if (typeof claims === "string") throw new Error("Expected JWT claims");
      expect(claims.sub).toBe(user.id);
      expect(claims.exp! - claims.iat!).toBe(86400);
      expect(findUnique).toHaveBeenCalledWith({
        where: { email: account.email },
      });
    },
  );

  it("returns the same 401 for unknown email and incorrect password", async () => {
    findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ ...user, passwordHash });
    for (const email of ["unknown@example.test", user.email]) {
      await request(app)
        .post("/api/auth/login")
        .send({ email, password: "wrong" })
        .expect(401, { error: "Invalid email or password" });
    }
  });

  it("rejects an invalid email before querying the database", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid", password })
      .expect(400);
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current database user without a password hash", async () => {
    await request(app)
      .get("/api/auth/me")
      .auth(token, { type: "bearer" })
      .expect(200, { user });
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
      select: { id: true, email: true, role: true },
    });
  });

  it("rejects missing credentials", async () => {
    await request(app).get("/api/auth/me").expect(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid", "invalid"],
    ["expired", jwt.sign({}, secret, { subject: user.id, expiresIn: -1 })],
    ["invalid UUID", jwt.sign({}, secret, { subject: "not-a-uuid" })],
    [
      "wrong algorithm",
      jwt.sign({}, secret, { subject: user.id, algorithm: "HS384" }),
    ],
  ])("rejects a %s token", async (_label, invalidToken) => {
    await request(app)
      .get("/api/auth/me")
      .auth(invalidToken!, { type: "bearer" })
      .expect(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("rejects a deleted user", async () => {
    findUnique.mockResolvedValue(null);
    await request(app)
      .get("/api/auth/me")
      .auth(token, { type: "bearer" })
      .expect(401);
  });
});

describe("role authorization", () => {
  // Test-only routes exercise middleware without adding routes to the real app.
  const permissionsApp = express();
  permissionsApp.get("/admin", authenticate, authorize("admin"), (_req, res) =>
    res.sendStatus(200),
  );
  permissionsApp.get(
    "/shared",
    authenticate,
    authorize("admin", "staff"),
    (_req, res) => res.sendStatus(200),
  );
  permissionsApp.get("/missing", authorize("admin"), (_req, res) =>
    res.sendStatus(200),
  );

  it.each([
    ["admin", 200],
    ["staff", 403],
  ] as const)("checks the current %s database role", async (role, status) => {
    findUnique.mockResolvedValue({ ...user, role });
    await request(permissionsApp)
      .get("/admin")
      .auth(token, { type: "bearer" })
      .expect(status);
  });

  it("allows staff when both roles are permitted", async () => {
    findUnique.mockResolvedValue({ ...user, role: "staff" });
    await request(permissionsApp)
      .get("/shared")
      .auth(token, { type: "bearer" })
      .expect(200);
  });

  it("rejects a missing authentication context", async () => {
    await request(permissionsApp).get("/missing").expect(401);
  });
});

describe("server behavior", () => {
  it.each(["login", "me"])(
    "returns 500 for database failure during %s",
    async (endpoint) => {
      findUnique.mockRejectedValue(new Error("Test database failure"));
      const log = jest.spyOn(console, "error").mockImplementation(() => {});
      try {
        const operation =
          endpoint === "login"
            ? request(app)
                .post("/api/auth/login")
                .send({ email: user.email, password })
            : request(app).get("/api/auth/me").auth(token, { type: "bearer" });
        await operation.expect(500, { error: "Internal server error" });
      } finally {
        log.mockRestore();
      }
    },
  );

  it("keeps the health endpoint available", async () => {
    await request(app)
      .get("/api/health")
      .expect(200, { status: "ok", service: "eventhub-api" });
  });
});
