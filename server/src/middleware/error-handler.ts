import { ZodError } from "zod";
import type { ErrorRequestHandler } from "express";

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({ error: "Invalid request" });
    return;
  }
  if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
    response.status(400).json({ error: "Invalid JSON body" });
    return;
  }
  console.error("Unexpected server error");
  response.status(500).json({ error: "Internal server error" });
};
