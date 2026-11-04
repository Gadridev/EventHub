import { useState } from "react";
import type { Event, Participant } from "../../../types";
import { Select } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/Modal";
export interface RegistrationFormValues {
  participantId: string;
  eventId: string;
}
export function RegistrationForm({
  events,
  participants,
  onSubmit,
}: {
  events: Event[];
  participants: Participant[];
  onSubmit?: (values: RegistrationFormValues) => void;
}) {
  const [values, setValues] = useState({
    participantId: participants[0]?.id ?? "",
    eventId: events[0]?.id ?? "",
  });
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <form
        className="flex flex-wrap items-end gap-3 rounded-card border border-border bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirm(true);
        }}
      >
        <div className="flex-[1_1_200px]">
          <Select
            label="Participant"
            value={values.participantId}
            onChange={(e) =>
              setValues({ ...values, participantId: e.target.value })
            }
          >
            {participants.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-[1_1_200px]">
          <Select
            label="Event"
            value={values.eventId}
            onChange={(e) => setValues({ ...values, eventId: e.target.value })}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.status})
              </option>
            ))}
          </Select>
        </div>
        <Button primary type="submit">
          Register participant
        </Button>
      </form>
      {confirm && (
        <ConfirmDialog
          title="Register participant"
          description={`${participants.find((person) => person.id === values.participantId)?.fullName} — ${events.find((event) => event.id === values.eventId)?.title}`}
          onClose={() => setConfirm(false)}
          onConfirm={onSubmit ? () => onSubmit(values) : undefined}
        />
      )}
    </>
  );
}
