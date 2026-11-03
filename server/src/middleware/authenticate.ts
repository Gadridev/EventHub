import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

const subjectSchema = z.uuid();

export const authenticate: RequestHandler = async (request, response, next) => {
  const parts = request.get("authorization")?.split(" ") ?? [];
  const [scheme, token] = parts;
  if (parts.length !== 2 || scheme?.toLowerCase() !== "bearer" || !token) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  let userId: string;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    const subject = subjectSchema.safeParse(typeof payload === "object" ? payload.sub : undefined);
    if (!subject.success) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }
    userId = subject.data;
  } catch {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  request.user = user;
  next();
};
