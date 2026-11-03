import { z } from "zod";

export const eventIdSchema = z.uuid();
export const createEventSchema = z.strictObject({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  location: z.string().trim().min(1).max(255),
  eventDate: z.iso.datetime({ offset: true }).transform(value => new Date(value))
    .refine(value => value.getTime() > Date.now(), "Event date must be in the future"),
  maxParticipants: z.number().int().positive().max(2_147_483_647),
});
export const updateEventSchema = createEventSchema.partial()
  .refine(value => Object.keys(value).length > 0, "Provide at least one field");
export const eventStatusSchema = z.strictObject({ status: z.enum(["published", "cancelled"]) });
const integerQuery = z.string().regex(/^[0-9]+$/).transform(Number).pipe(z.number().int().positive());
export const eventsQuerySchema = z.object({
  status: z.enum(["draft", "published", "cancelled"]).optional(),
  search: z.string().trim().max(255).optional(),
  page: integerQuery.pipe(z.number().max(2_147_483)).default(1),
  limit: integerQuery.pipe(z.number().max(100)).default(10),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventsQuery = z.infer<typeof eventsQuerySchema>;
