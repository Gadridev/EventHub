import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { User } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { LoginInput } from "./auth.schema.js";

export type AuthUser = Pick<User, "id" | "email" | "role">;

// Pay the bcrypt cost for unknown emails too, reducing account timing leakage.
const dummyHash = bcrypt.hashSync("unused-auth-timing-password", 12);

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  const matches = await bcrypt.compare(password, user?.passwordHash ?? dummyHash);
  if (!user || !matches) return null;

  const safeUser: AuthUser = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign({}, env.JWT_SECRET, {
    algorithm: "HS256",
    subject: user.id,
    expiresIn: "1d",
  });
  return { accessToken, user: safeUser };
}
