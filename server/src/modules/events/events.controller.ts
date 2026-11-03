import type { RequestHandler } from "express";
import { HttpError } from "../../middleware/error-handler.js";
import * as service from "./events.service.js";
import {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
  eventStatusSchema,
  eventsQuerySchema,
} from "./events.schema.js";

export const list: RequestHandler = async (req, res) => {
  res.json(await service.listEvents(eventsQuerySchema.parse(req.query)));
};
export const details: RequestHandler = async (req, res) => {
  res.json({
    data: await service.getEvent(eventIdSchema.parse(req.params.id)),
  });
};
export const create: RequestHandler = async (req, res) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  res
    .status(201)
    .json({
      data: await service.createEvent(
        createEventSchema.parse(req.body),
        req.user,
      ),
    });
};
export const update: RequestHandler = async (req, res) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  res.json({
    data: await service.updateEvent(
      eventIdSchema.parse(req.params.id),
      updateEventSchema.parse(req.body),
      req.user,
    ),
  });
};
export const status: RequestHandler = async (req, res) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  res.json({
    data: await service.changeEventStatus(
      eventIdSchema.parse(req.params.id),
      eventStatusSchema.parse(req.body).status,
      req.user,
    ),
  });
};
export const remove: RequestHandler = async (req, res) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  await service.deleteEvent(eventIdSchema.parse(req.params.id), req.user);
  res.status(204).end();
};
