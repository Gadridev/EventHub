import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
    response.status(400).json({ error: "Invalid JSON body" });
    return;
  }
  console.error("Unexpected server error");
  response.status(500).json({ error: "Internal server error" });
};
