import type { Event, User } from "../../types";

export function canManageEvent(
  user: User | null,
  event: Pick<Event, "createdBy">,
) {
  if (!user) {
    return false;
  }
  return user.role === "admin" || event.createdBy === user.id;
}
