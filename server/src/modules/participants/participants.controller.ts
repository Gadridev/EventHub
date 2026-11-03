import type { RequestHandler } from "express";
import * as service from "./participants.service.js";
import {
  participantIdSchema,
  createParticipantSchema,
  updateParticipantSchema,
  participantsQuerySchema,
} from "./participants.schema.js";

export const list: RequestHandler = async (req, res) => {
  const query = participantsQuerySchema.parse(req.query);
  res.json(await service.listParticipants(query));
};

export const details: RequestHandler = async (req, res) => {
  const id = participantIdSchema.parse(req.params.id);
  res.json({ data: await service.getParticipant(id) });
};

export const create: RequestHandler = async (req, res) => {
  const input = createParticipantSchema.parse(req.body);
  res.status(201).json({ data: await service.createParticipant(input) });
};

export const update: RequestHandler = async (req, res) => {
  const id = participantIdSchema.parse(req.params.id);
  const input = updateParticipantSchema.parse(req.body);
  res.json({ data: await service.updateParticipant(id, input) });
};

export const remove: RequestHandler = async (req, res) => {
  const id = participantIdSchema.parse(req.params.id);
  await service.deleteParticipant(id);
  res.status(204).end();
};
