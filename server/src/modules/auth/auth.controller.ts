import type { RequestHandler } from "express";
import { loginSchema } from "./auth.schema.js";
import { login } from "./auth.service.js";

export const loginController: RequestHandler = async (request, response) => {
  const input = loginSchema.safeParse(request.body);
  if (!input.success) {
    response.status(400).json({ error: "Invalid login request" });
    return;
  }
  const result = await login(input.data);
  if (!result) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }
  response.status(200).json({result});
};

export const meController: RequestHandler = (request, response) => {
  if (!request.user) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  response.status(200).json({ user: request.user });
};
