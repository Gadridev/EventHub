import type { RequestHandler } from "express";
import type { Role } from "../generated/prisma/client.js";

export function authorize(...roles: [Role, ...Role[]]): RequestHandler {
  return (request, response, next) => {
    if (!request.user) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!roles.includes(request.user.role)) {
      response.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
