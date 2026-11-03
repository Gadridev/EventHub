import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

import { authRouter } from "./modules/auth/auth.routes.js";

import { eventsRouter } from "./modules/events/events.routes.js";

import { participantsRouter } from "./modules/participants/participants.routes.js";

import { registrationsRouter } from "./modules/registrations/registrations.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "eventhub-api",
  });
});

app.use("/api/auth", authRouter);

app.use("/api/events", eventsRouter);

app.use("/api/participants", participantsRouter);

app.use("/api/registrations", registrationsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
