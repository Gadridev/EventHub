import { useState } from "react";
import type { Event } from "../../../types";
import { Modal, PreviewNotice } from "../../../components/ui/Modal";
import { Input, Textarea } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
export type EventFormValues = Pick<
  Event,
  "title" | "description" | "location" | "eventDate" | "maxParticipants"
>;
interface EventFormProps {
  onClose: () => void;
  onSubmit?: (values: EventFormValues) => void;
  initialValues?: EventFormValues;
  loading?: boolean;
  error?: string;
}
export function EventForm({
  onClose,
  onSubmit,
  initialValues,
  loading = false,
  error,
}: EventFormProps) {
  const [values, setValues] = useState(
    initialValues ?? {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      maxParticipants: 50,
    },
  );
  return (
    <Modal title={initialValues ? "Edit event" : "New event"} onClose={onClose}>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(values);
        }}
      >
        <Input
          label="Title"
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="Location"
          required
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <Textarea
          label="Description"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Event date (UTC)"
            type="datetime-local"
            required
            value={values.eventDate.slice(0, 16)}
            onChange={(e) =>
              setValues({
                ...values,
                eventDate: e.target.value ? `${e.target.value}:00Z` : "",
              })
            }
          />
          <Input
            label="Capacity"
            type="number"
            min={1}
            required
            value={values.maxParticipants}
            onChange={(e) =>
              setValues({
                ...values,
                maxParticipants: e.target.valueAsNumber || 0,
              })
            }
          />
        </div>
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        {!onSubmit && <PreviewNotice />}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary type="submit" disabled={!onSubmit || loading}>
            {loading
              ? "Saving…"
              : initialValues
                ? "Save changes"
                : "Create draft"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
